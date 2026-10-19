(function () {
  const CONFIG = window.CONFIG;
  const Motor = window.Motor;
  const UI = window.RankingUI;
  const F = window.Formulario;

  let jugador = null;
  let partida = null;
  let recurso = null;

  function leerSesion(clave) {
    try {
      return JSON.parse(sessionStorage.getItem(clave) || "null");
    } catch (e) {
      return null;
    }
  }

  function totalEscenarios() {
    return recurso.escenarios.length;
  }

  function metricaDe(id) {
    return partida.metricas.find((m) => m.id === id);
  }

  function pintarProgreso() {
    const hechos = partida.turno;
    const total = totalEscenarios();
    document.getElementById("etiqueta-turno").textContent =
      "Turno " + Math.min(hechos + 1, total) + " de " + total;
    document.getElementById("barra-progreso").style.width =
      Math.min(100, (hechos / total) * 100) + "%";
    document.getElementById("etiqueta-jugador").textContent = jugador
      ? jugador.nombre
      : "Partida rápida";
    document.getElementById("etiqueta-rol").textContent = recurso.icono + " " + recurso.nombre;
    document.getElementById("titulo-metricas").textContent = recurso.nombre;
  }

  function pintarMetricas() {
    document.getElementById("metricas").innerHTML = partida.metricas
      .map(function (m) {
        const valor = partida.estados[m.id];
        return (
          '<div class="metrica">' +
          '<div class="fila"><span>' + UI.escapar(m.corto) + '</span><span class="valor">' +
          valor + " / 100</span></div>" +
          '<div class="medidor"><span style="width:' + valor + '%"></span></div>' +
          "</div>"
        );
      })
      .join("");
  }

  function chipsDeEfectos(opcion) {
    if (!opcion.efectos) return "";
    return Object.keys(opcion.efectos)
      .map(function (id) {
        const delta = opcion.efectos[id];
        const metrica = metricaDe(id);
        return (
          '<span class="' + (delta > 0 ? "chip sube" : "chip baja") + '">' +
          UI.escapar(metrica ? metrica.corto : id) +
          " " + (delta > 0 ? "+" : "") + delta + "</span>"
        );
      })
      .join("");
  }

  function pintarEscenario(escenario) {
    document.getElementById("escenario-icono").textContent = escenario.icono || "✦";
    document.getElementById("escenario-etapa").textContent = escenario.etapa;
    document.getElementById("escenario-titulo").textContent = escenario.titulo;
    document.getElementById("escenario-texto").textContent = escenario.texto;

    const opciones = Motor.opcionesDisponibles(partida, escenario);
    const lista = document.getElementById("lista-opciones");

    lista.innerHTML = opciones
      .map(function (item) {
        const opcion = item.opcion;
        const bloqueos = item.habilitada
          ? ""
          : '<div class="chips">' +
            item.faltantes
              .map(function (f) {
                return (
                  '<span class="chip bloquea">Necesitás ' +
                  UI.escapar(f.etiqueta.toLowerCase()) + " " + f.pedido +
                  " (tenés " + f.actual + ")</span>"
                );
              })
              .join("") +
            "</div>";
        return (
          '<button class="opcion" type="button" data-opcion="' + UI.escapar(opcion.id) + '"' +
          (item.habilitada ? "" : " disabled") + ">" +
          '<span class="titulo">' + UI.escapar(opcion.etiqueta) + "</span>" +
          '<span class="detalle">' + UI.escapar(opcion.detalle || "") + "</span>" +
          '<div class="chips">' + chipsDeEfectos(opcion) + "</div>" + bloqueos + "</button>"
        );
      })
      .join("");

    lista.querySelectorAll("button.opcion").forEach(function (boton) {
      boton.addEventListener("click", function () {
        const id = boton.getAttribute("data-opcion");
        const elegida = opciones.find((item) => item.opcion.id === id);
        if (elegida && elegida.habilitada) jugar(elegida.opcion);
      });
    });

    pintarProgreso();
    pintarMetricas();
  }

  function jugar(opcion) {
    const salida = Motor.elegirOpcion(partida, opcion);
    if (!salida) return;

    document.querySelectorAll("#lista-opciones button").forEach(function (b) {
      b.disabled = true;
    });

    document.getElementById("resultado-titulo").textContent =
      salida.resultado.titulo || opcion.etiqueta;
    document.getElementById("resultado-texto").textContent = salida.resultado.texto;

    const puntos = document.getElementById("resultado-puntos");
    const delta = salida.resultado.bonificacion;
    if (delta > 0) {
      puntos.textContent = "+" + salida.resultado.puntos + " puntos (incluye " + delta + " extra)";
      puntos.classList.remove("negativo");
    } else if (delta < 0) {
      puntos.textContent =
        salida.resultado.puntos + " puntos (" + Math.abs(delta) + " menos por el contexto)";
      puntos.classList.add("negativo");
    } else {
      puntos.textContent =
        (salida.resultado.puntos >= 0 ? "+" : "") + salida.resultado.puntos + " puntos";
      puntos.classList.toggle("negativo", salida.resultado.puntos < 0);
    }

    document.getElementById("resultado-chips").innerHTML = salida.decision.cambios
      .map(function (cambio) {
        const metrica = metricaDe(cambio.id);
        const clase = cambio.delta > 0 ? "chip sube" : cambio.delta < 0 ? "chip baja" : "chip";
        return (
          '<span class="' + clase + '">' + UI.escapar(metrica ? metrica.corto : cambio.id) +
          " " + (cambio.delta > 0 ? "+" : "") + cambio.delta + " → " + cambio.valor + "</span>"
        );
      })
      .join("");

    if (salida.resultado.termina && salida.resultado.despedida) {
      document.getElementById("resultado-texto").textContent += "\n\n" + salida.resultado.despedida;
    }

    document.getElementById("capa-resultado").classList.remove("oculto");
    document.getElementById("btn-continuar").focus();
  }

  function cerrarResultado() {
    document.getElementById("capa-resultado").classList.add("oculto");
    if (partida.terminado) mostrarFinal();
    else pintarEscenario(partida.escenarioActual);
  }

  function bloqueInicial(resultado, hayFormulario) {
    const botones = hayFormulario
      ? '<button class="boton" type="button" id="btn-guardar">Guardar mi resultado</button>' +
        '<button class="boton secundario" type="button" id="btn-jugar-otra">Jugar otra vez</button>'
      : '<button class="boton" type="button" id="btn-ver-ranking">Ver el ranking</button>' +
        '<button class="boton secundario" type="button" id="btn-jugar-otra">Jugar otra vez</button>';

    const info = Motor.rangoInfo(resultado.porcentaje);

    return (
      '<section class="tarjeta resumen-final">' +
      '<div class="etiqueta">' + UI.escapar(recurso.nombre) + "</div>" +
      '<div class="marcador">' + resultado.total + "<small> / " + resultado.maximo + "</small></div>" +
      '<div class="tu-rango">' +
      '<div class="rango">' + UI.escapar(info.nombre) + "</div>" +
      '<div class="rango-fraccion">Rango ' + info.desde + "–" + info.hasta +
      "% · lograste " + resultado.porcentaje + "%</div>" +
      '<p class="explicacion-rango">' + UI.escapar(info.detalle) + "</p>" +
      "</div>" +
      '<p class="vacio">' + UI.escapar(resultado.epilogo) + "</p>" +
      '<div class="fila-botones">' + botones + "</div>" +
      (hayFormulario
        ? '<p class="ayuda" style="text-align:center;">Podés jugar todas las veces que quieras. Solo te pedimos los datos si querés entrar al ranking.</p>'
        : '<div class="aviso info" id="final-guardado">Guardando tu resultado…</div>') +
      "</section>"
    );
  }

  function bloqueFormulario(resultado) {
    return (
      '<section class="tarjeta" id="tarjeta-datos">' +
      "<h2>Guardá tu resultado</h2>" +
      '<p class="vacio">Con estos datos entrás al ranking de <strong>' +
      UI.escapar(recurso.nombre) + "</strong> y podemos saber cuántos grupos están jugando. " +
      "El nombre es lo único que se muestra en el ranking; el resto queda guardado y no se publica.</p>" +
      '<form id="form-final" novalidate>' +
      F.html() +
      '<div id="error-final" class="aviso error oculto" role="alert"></div>' +
      '<button class="boton bloque" type="submit">Guardar y ver el ranking</button>' +
      "</form>" +
      '<div id="aviso-guardado" class="aviso info oculto"></div>' +
      "</section>"
    );
  }

  function bloqueResumen(resultado, respuesta) {
    const yaExiste = respuesta.guardado === false;
    return (
      '<section class="tarjeta resumen-final">' +
      '<div class="etiqueta">' +
      (yaExiste ? "Ya tenías una partida" : "Resultado guardado") +
      "</div>" +
      '<div class="marcador">' + (yaExiste ? respuesta.puesto + "º" : respuesta.total) +
      "<small>" + (yaExiste ? " de " + respuesta.total : "") + "</small></div>" +
      "<p>" +
      (yaExiste
        ? "Para que el ranking sea justo, de cada persona solo cuenta su <strong>primera partida</strong> en esta aventura. Esta no se guardó."
        : "Tu puntaje de <strong>" + resultado.total + " (" + resultado.porcentaje +
          "%)</strong> quedó en el ranking de <strong>" + UI.escapar(recurso.nombre) + "</strong>.") +
      "</p>" +
      (respuesta.local
        ? '<p class="ayuda">Quedó guardado solo en este navegador. Configurá Supabase para que el ranking sea global.</p>'
        : "") +
      '<div class="fila-botones">' +
      '<button class="boton" type="button" id="btn-ver-ranking">Ver el ranking</button>' +
      '<button class="boton secundario" type="button" id="btn-jugar-otra">Jugar otra vez</button>' +
      "</div>" +
      "</section>"
    );
  }

  function seccionResumen(resultado) {
    return (
      '<section class="tarjeta"><h2>Cómo terminaste</h2><ul class="lista-decisiones">' +
      resultado.historial
        .map(function (d) {
          return (
            "<li>" +
            '<span class="puntos">' + (d.puntos >= 0 ? "+" : "") + d.puntos + "</span>" +
            '<div class="turno">Turno ' + d.turno + " · " + UI.escapar(d.etapa) + "</div>" +
            '<div class="elegida">' + UI.escapar(d.tituloResultado) + "</div>" +
            '<div class="vacio">' + UI.escapar(d.textoResultado) + "</div>" +
            "</li>"
          );
        })
        .join("") +
      "</ul></section>" +
      '<section class="tarjeta"><h2>Variables finales</h2><ul class="lista-decisiones">' +
      resultado.metricas
        .map(function (m) {
          return (
            "<li>" +
            '<span class="puntos">' + m.valor + " / 100</span>" +
            '<div class="elegida">' + UI.escapar(m.etiqueta) + "</div>" +
            '<div class="vacio">Aporte al puntaje: ' + m.aporte + " puntos (peso " + m.peso + ")</div>" +
            "</li>"
          );
        })
        .join("") +
      "</ul></section>"
    );
  }

  function mostrarFinal() {
    const resultado = Motor.resultadoFinal(partida);
    document.getElementById("zona-juego").classList.add("oculto");
    const zona = document.getElementById("zona-final");
    zona.classList.remove("oculto");

    const hayFormulario = !jugador;
    zona.innerHTML = bloqueInicial(resultado, hayFormulario);
    if (hayFormulario) zona.innerHTML += bloqueFormulario(resultado);
    zona.innerHTML += seccionResumen(resultado);

    document.getElementById("btn-jugar-otra").addEventListener("click", function () {
      sessionStorage.removeItem(CONFIG.claves.resultadoLocal);
      window.location.reload();
    });

    const guardar = document.getElementById("btn-guardar");
    if (guardar) {
      guardar.addEventListener("click", function () {
        const tarjeta = document.getElementById("tarjeta-datos");
        if (tarjeta) tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
        const primero = document.getElementById("dato-nombre");
        if (primero) primero.focus();
      });
    }

    const form = document.getElementById("form-final");
    if (form) {
      form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        enviarResultado(evento, resultado);
      });
    }

    if (jugador) {
      guardarYMostrar(jugador, resultado);
    }
  }

  async function guardarYMostrar(datos, resultado) {
    const caja = document.getElementById("final-guardado");
    if (!caja) return;
    try {
      const respuesta = await window.Datos.registrar(datos, resultado);
      sessionStorage.setItem(
        CONFIG.claves.resultadoLocal,
        JSON.stringify({
          recurso: recurso.id,
          puesto: respuesta.puesto,
          total: respuesta.total,
          puntaje: resultado.total
        })
      );
      caja.className = respuesta.guardado === false ? "aviso ambar" : "aviso info";
      caja.innerHTML =
        respuesta.guardado === false
          ? "Tu puntaje de <strong>" + resultado.total + "</strong> no se guardó: de cada persona solo cuenta su primera partida en " +
            UI.escapar(recurso.nombre) + ". Podés seguir jugando todas las veces que quieras."
          : "Guardado. Quedás <strong>" + respuesta.puesto + "º</strong> de " + respuesta.total +
            " partidas de " + UI.escapar(recurso.nombre) +
            (respuesta.local ? " (solo en este navegador)." : ".");
      const botonRanking = document.getElementById("btn-ver-ranking");
      if (botonRanking) {
        botonRanking.classList.remove("oculto");
        botonRanking.addEventListener("click", irAlRanking);
      }
    } catch (e) {
      caja.className = "aviso error";
      caja.textContent =
        "No se pudo guardar el resultado: " + e.message +
        " Podés volver a intentarlo desde el ranking de la home.";
    }
  }

  function irAlRanking() {
    sessionStorage.setItem(CONFIG.claves.recursoRanking, recurso.id);
    window.location.href = "index.html#ranking";
  }

  async function enviarResultado(evento, resultado) {
    const error = document.getElementById("error-final");
    const aviso = document.getElementById("aviso-guardado");
    const form = document.getElementById("form-final");
    F.limpiarError(error);

    const datos = F.leer();
    const problemas = F.validar(datos);
    if (problemas.length > 0) {
      F.mostrarError(error, problemas);
      return;
    }

    const boton = form.querySelector('button[type=submit]');
    boton.disabled = true;
    boton.textContent = "Guardando…";
    aviso.classList.remove("oculto");
    aviso.textContent = "Guardando tu resultado…";

    try {
      sessionStorage.setItem(CONFIG.claves.jugador, JSON.stringify(datos));
      const respuesta = await window.Datos.registrar(datos, resultado);
      sessionStorage.setItem(
        CONFIG.claves.resultadoLocal,
        JSON.stringify({
          recurso: recurso.id,
          puesto: respuesta.puesto,
          total: respuesta.total,
          puntaje: resultado.total
        })
      );

      form.classList.add("oculto");
      const contenedor = document.getElementById("tarjeta-datos");
      contenedor.innerHTML = bloqueResumen(resultado, respuesta) +
        '<div class="fila-botones"><button class="boton secundario" type="button" id="btn-ver-ranking-2">Ver el ranking</button></div>';
      document.getElementById("btn-ver-ranking-2").addEventListener("click", function () {
        sessionStorage.setItem(CONFIG.claves.recursoRanking, recurso.id);
        window.location.href = "index.html#ranking";
      });
      contenedor.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {
      aviso.className = "aviso error";
      aviso.textContent = "No se pudo guardar: " + e.message + ". Probá de nuevo.";
    } finally {
      boton.disabled = false;
      boton.textContent = "Guardar y ver el ranking";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("titulo-evento").textContent = CONFIG.evento;
    document.getElementById("pie-organizacion").textContent = CONFIG.organizacion;
    document.getElementById("pie-dependencia").textContent = CONFIG.dependencia;
    document.getElementById("btn-continuar").addEventListener("click", cerrarResultado);

    jugador = leerSesion(CONFIG.claves.jugador);

    let idAventura = null;
    try {
      idAventura = sessionStorage.getItem(CONFIG.claves.recursoElegido);
    } catch (e) {
      idAventura = null;
    }

    if (!idAventura) {
      document.getElementById("aviso-sin-aventura").classList.remove("oculto");
      document.getElementById("rejilla-partida").classList.add("oculto");
      return;
    }

    recurso = window.CONTENIDOPorId(idAventura);
    partida = Motor.crearPartida(recurso);

    const escenario = Motor.siguienteEscenario(partida);
    if (!escenario) {
      mostrarFinal();
      return;
    }
    pintarEscenario(escenario);
  });
})();
