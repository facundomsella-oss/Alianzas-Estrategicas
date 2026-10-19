window.Motor = (function () {
  const RANGOS = [
    { minimo: 97, nombre: "Fogón Compartido", detalle: "Alianza modelo: las dos partes se sentaron al mismo fogón y el vínculo se sostiene sin vos." },
    { minimo: 88, nombre: "Pacto de Patrulla", detalle: "Muy buenas decisiones: el pacto es firme y tiene continuidad." },
    { minimo: 74, nombre: "Brújula Ajustada", detalle: "Buen resultado: ambas partes están en sintonía y apuntan al mismo norte, aunque quedaron detalles por afinar." },
    { minimo: 56, nombre: "Cuerda Tendida", detalle: "Resultado tibio: tendiste el primer puente, pero todavía no soporta peso." },
    { minimo: 38, nombre: "Señal de Humo", detalle: "Hubo intentos de acercamiento, pero la otra parte no llegó a ver tu mensaje." },
    { minimo: 0, nombre: "Cada uno en su carpa", detalle: "La alianza no se concretó. Todavía hay tiempo de volver al fogón y probar de nuevo." }
  ];

  function cumple(requisitos, estados) {
    if (!requisitos) return true;
    return Object.keys(requisitos).every((id) => (estados[id] || 0) >= requisitos[id]);
  }

  function cumpleMax(requisitos, estados) {
    if (!requisitos) return true;
    return Object.keys(requisitos).every((id) => (estados[id] || 0) <= requisitos[id]);
  }

  function faltantes(requisitos, estados, metricas) {
    if (!requisitos) return [];
    return Object.keys(requisitos)
      .filter((id) => (estados[id] || 0) < requisitos[id])
      .map((id) => {
        const metrica = metricas.find((m) => m.id === id);
        return {
          id: id,
          etiqueta: metrica ? metrica.corto : id,
          actual: estados[id] || 0,
          pedido: requisitos[id]
        };
      });
  }

  function aplicarEfectos(partida, efectos) {
    const cambios = [];
    if (!efectos) return cambios;
    Object.keys(efectos).forEach((id) => {
      const definicion = partida.metricas.find((m) => m.id === id);
      if (!definicion) return;
      const antes = partida.estados[id] || 0;
      const tope = definicion.tope || 100;
      const piso = definicion.piso != null ? definicion.piso : 0;
      const despues = Math.max(piso, Math.min(tope, antes + efectos[id]));
      partida.estados[id] = despues;
      cambios.push({ id: id, delta: despues - antes, valor: despues });
    });
    return cambios;
  }

  function crearPartida(recurso) {
    const estados = {};
    recurso.metricas.forEach((m) => {
      estados[m.id] = m.valorInicial;
    });
    return {
      recurso: recurso,
      metricas: recurso.metricas,
      turno: 0,
      estados: estados,
      historial: [],
      puntosDecision: 0,
      terminado: false,
      motivo: null,
      escenarioActual: null
    };
  }

  function escenariosAplicables(partida) {
    const jugados = partida.historial.map((h) => h.idEscenario);
    return partida.recurso.escenarios.filter(
      (e) =>
        !jugados.includes(e.id) &&
        cumple(e.activaSi, partida.estados) &&
        cumpleMax(e.activaSiMax, partida.estados)
    );
  }

  function siguienteEscenario(partida) {
    if (partida.terminado) return null;
    const candidatos = escenariosAplicables(partida);
    if (candidatos.length === 0) {
      partida.terminado = true;
      partida.motivo = "fin";
      partida.escenarioActual = null;
      return null;
    }
    partida.escenarioActual = candidatos[0];
    return partida.escenarioActual;
  }

  function opcionesDisponibles(partida, escenario) {
    return escenario.opciones.map((opcion) => {
      const requisitos = opcion.requiere;
      const habilitada = cumple(requisitos, partida.estados);
      return {
        opcion: opcion,
        habilitada: habilitada,
        faltantes: habilitada ? [] : faltantes(requisitos, partida.estados, partida.metricas)
      };
    });
  }

  function resolverResultado(opcion, partida) {
    const base = opcion.resultado || {};
    const variantes = base.variantes || [];
    const aplicada = variantes.find((v) => cumple(v.si, partida.estados));
    return {
      titulo: (aplicada && aplicada.titulo) || base.titulo || opcion.etiqueta,
      texto: (aplicada && aplicada.texto) || base.texto || "",
      puntos: aplicada && aplicada.puntos != null ? aplicada.puntos : base.puntos || 0,
      puntosBase: base.puntos || 0,
      bonificacion:
        aplicada && aplicada.puntos != null ? aplicada.puntos - (base.puntos || 0) : 0,
      termina: (aplicada && aplicada.termina != null ? aplicada.termina : base.termina) || false,
      despedida: (aplicada && aplicada.despedida) || base.despedida || ""
    };
  }

  function elegirOpcion(partida, opcion) {
    if (partida.terminado) return null;
    const escenario = partida.escenarioActual;
    if (!escenario) return null;
    const valida = opcionesDisponibles(partida, escenario).some(
      (o) => o.opcion.id === opcion.id && o.habilitada
    );
    if (!valida) return null;

    const cambios = aplicarEfectos(partida, opcion.efectos);
    const resultado = resolverResultado(opcion, partida);
    partida.puntosDecision += resultado.puntos;
    partida.turno += 1;

    const decision = {
      turno: partida.turno,
      idEscenario: escenario.id,
      etapa: escenario.etapa,
      tituloEscenario: escenario.titulo,
      iconoEscenario: escenario.icono,
      idOpcion: opcion.id,
      etiquetaOpcion: opcion.etiqueta,
      tituloResultado: resultado.titulo,
      textoResultado: resultado.texto,
      puntos: resultado.puntos,
      bonificacion: resultado.bonificacion,
      cambios: cambios,
      valoresDespues: Object.assign({}, partida.estados)
    };

    partida.historial.push(decision);

    if (resultado.termina) {
      partida.terminado = true;
      partida.motivo = "despedida";
      partida.escenarioActual = null;
    } else {
      siguienteEscenario(partida);
    }

    return { decision: decision, resultado: resultado };
  }

  function aporteMetricas(partida) {
    let total = 0;
    partida.metricas.forEach((m) => {
      total += (partida.estados[m.id] || 0) * m.peso;
    });
    return total;
  }

  function puntajeMaximo(recurso) {
    if (recurso.maximoReal) return recurso.maximoReal;
    let maximoDecision = 0;
    recurso.escenarios.forEach((e) => {
      const mejor = Math.max.apply(
        null,
        e.opciones.map((o) => (o.resultado && o.resultado.puntos ? o.resultado.puntos : 0))
      );
      maximoDecision += mejor;
    });
    const maximoMetricas = recurso.metricas.reduce(
      (acc, m) => acc + (m.tope || 100) * m.peso,
      0
    );
    return maximoDecision + maximoMetricas;
  }

  function rango(porcentaje) {
    const encontrado = RANGOS.find((r) => porcentaje >= r.minimo);
    return encontrado || RANGOS[RANGOS.length - 1];
  }

  function rangoInfo(porcentaje) {
    const ordenados = RANGOS.slice().sort((a, b) => b.minimo - a.minimo);
    let i = ordenados.findIndex((r) => porcentaje >= r.minimo);
    if (i < 0) i = ordenados.length - 1;
    const actual = ordenados[i];
    return {
      nombre: actual.nombre,
      detalle: actual.detalle,
      desde: actual.minimo,
      hasta: i === 0 ? 100 : ordenados[i - 1].minimo - 1
    };
  }

  function resultadoFinal(partida) {
    const maximo = puntajeMaximo(partida.recurso);
    const aporte = aporteMetricas(partida);
    const total = partida.puntosDecision + aporte;
    const porcentaje = Math.max(0, Math.min(100, Math.round((total / maximo) * 1000) / 10));
    const rangoActual = rango(porcentaje);
    const epilogos = partida.recurso.epilogos || [];
    const epilogo =
      epilogos.find((e) => cumple(e.activaSi, partida.estados)) ||
      epilogos[epilogos.length - 1];

    return {
      recursoId: partida.recurso.id,
      recursoNombre: partida.recurso.nombre,
      puntosDecision: partida.puntosDecision,
      aporteMetricas: aporte,
      total: total,
      maximo: maximo,
      porcentaje: porcentaje,
      rango: rangoActual.nombre,
      detalleRango: rangoActual.detalle,
      estados: Object.assign({}, partida.estados),
      metricas: partida.metricas.map((m) => ({
        id: m.id,
        etiqueta: m.etiqueta,
        corto: m.corto,
        peso: m.peso,
        valor: partida.estados[m.id] || 0,
        aporte: (partida.estados[m.id] || 0) * m.peso
      })),
      historial: partida.historial,
      epilogo: epilogo ? epilogo.texto : "",
      motivo: partida.motivo
    };
  }

  return {
    RANGOS: RANGOS,
    crearPartida: crearPartida,
    siguienteEscenario: siguienteEscenario,
    opcionesDisponibles: opcionesDisponibles,
    elegirOpcion: elegirOpcion,
    resultadoFinal: resultadoFinal,
    puntajeMaximo: puntajeMaximo,
    rangoInfo: rangoInfo,
    cumple: cumple,
    cumpleMax: cumpleMax
  };
})();
