window.Datos = (function () {
  const CLAVES = () => window.CONFIG.claves;
  const SUPABASE = () => window.CONFIG.supabase;

  function habilitado() {
    const s = SUPABASE();
    return Boolean(s && s.url && s.anonKey);
  }

  function ahora() {
    return new Date().toISOString();
  }

  function limpiar(v) {
    return v == null ? "" : String(v).trim();
  }

  function datosDeContacto(jugador) {
    return {
      nombre: limpiar(jugador.nombre),
      email: limpiar(jugador.email).toLowerCase(),
      celular: limpiar(jugador.celular),
      nroGrupo: limpiar(jugador.nroGrupo),
      distrito: limpiar(jugador.distrito),
      zona: limpiar(jugador.zona),
      nroAfiliado: limpiar(jugador.nroAfiliado),
      consentimiento: Boolean(jugador.consentimiento)
    };
  }

  async function rpc(nombre, parametros) {
    const s = SUPABASE();
    const url = s.url.replace(/\/+$/, "") + "/rest/v1/rpc/" + nombre;
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        apikey: s.anonKey,
        Authorization: "Bearer " + s.anonKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parametros || {})
    });

    const texto = await respuesta.text();
    let cuerpo = null;
    if (texto) {
      try {
        cuerpo = JSON.parse(texto);
      } catch (e) {
        cuerpo = texto;
      }
    }

    if (!respuesta.ok) {
      const mensaje =
        (cuerpo && cuerpo.message) ||
        (cuerpo && cuerpo.error) ||
        "No se pudo completar la operación (" + respuesta.status + ")";
      const error = new Error(mensaje);
      error.status = respuesta.status;
      throw error;
    }

    return cuerpo;
  }

  function leerLocales(clave) {
    try {
      return JSON.parse(localStorage.getItem(clave) || "[]");
    } catch (e) {
      return [];
    }
  }

  function guardarLocal(clave, registro) {
    const lista = leerLocales(clave);
    lista.push(registro);
    localStorage.setItem(clave, JSON.stringify(lista));
    return lista;
  }

  function guardarContactoLocal(contacto) {
    const lista = leerLocales(CLAVES().contactosLocales).filter(
      (c) => c.email !== contacto.email
    );
    lista.push(contacto);
    localStorage.setItem(CLAVES().contactosLocales, JSON.stringify(lista));
  }

  function paramsDeContacto(contacto) {
    return {
      p_nombre: contacto.nombre,
      p_email: contacto.email,
      p_celular: contacto.celular,
      p_nro_grupo: contacto.nroGrupo,
      p_distrito: contacto.distrito,
      p_zona: contacto.zona,
      p_nro_afiliado: contacto.nroAfiliado,
      p_consentimiento: contacto.consentimiento
    };
  }

  async function registrarContacto(jugador) {
    const contacto = datosDeContacto(jugador);
    if (!habilitado()) {
      guardarContactoLocal(contacto);
      return { local: true };
    }
    await rpc("registrar_contacto", paramsDeContacto(contacto));
    return { local: false };
  }

  async function registrar(jugador, resultado) {
    const contacto = datosDeContacto(jugador);
    const registro = {
      recurso: resultado.recursoId,
      nombre: contacto.nombre,
      email: contacto.email,
      puntaje: resultado.total,
      porcentaje: resultado.porcentaje,
      rango: resultado.rango,
      creadoEn: ahora()
    };

    if (!habilitado()) {
      guardarContactoLocal(contacto);
      const todas = leerLocales(CLAVES().partidasLocales);
      const delRecurso = todas.filter((p) => p.recurso === registro.recurso);
      const delMail = delRecurso.filter(
        (p) => p.email.toLowerCase() === registro.email
      );
      if (delMail.length > 0) {
        const ordenadas = delRecurso.slice().sort((a, b) => b.puntaje - a.puntaje);
        return {
          puesto: ordenadas.findIndex((p) => p.email === delMail[0].email) + 1,
          total: ordenadas.length,
          guardado: false,
          local: true
        };
      }
      guardarLocal(CLAVES().partidasLocales, registro);
      return {
        puesto: delRecurso.filter((p) => p.puntaje > resultado.total).length + 1,
        total: delRecurso.length + 1,
        guardado: true,
        local: true
      };
    }

    const respuesta = await rpc(
      "registrar_partida",
      Object.assign(paramsDeContacto(contacto), {
        p_recurso: resultado.recursoId,
        p_puntaje: resultado.total,
        p_puntos_decision: resultado.puntosDecision,
        p_puntaje_maximo: resultado.maximo,
        p_porcentaje: resultado.porcentaje,
        p_rango: resultado.rango,
        p_decisiones: resultado.historial,
        p_estadisticas: resultado.metricas
      })
    );

    return {
      puesto: respuesta.puesto,
      total: respuesta.total,
      guardado: respuesta.guardado !== false,
      local: false
    };
  }

  async function obtenerRanking(recursoId) {
    const maximo = window.CONFIG.ranking.limiteFilas;

    if (!habilitado()) {
      const partidas = leerLocales(CLAVES().partidasLocales)
        .filter((p) => p.recurso === recursoId)
        .sort((a, b) => b.puntaje - a.puntaje || a.creadoEn.localeCompare(b.creadoEn));
      return partidas.slice(0, maximo).map((p, i) => ({
        puesto: i + 1,
        nombre: p.nombre,
        puntaje: p.puntaje,
        porcentaje: p.porcentaje,
        rango: p.rango,
        creado_en: p.creadoEn
      }));
    }

    const respuesta = await rpc("obtener_ranking", { p_limite: maximo, p_recurso: recursoId });
    return Array.isArray(respuesta) ? respuesta : [];
  }

  async function obtenerMiPuesto(email, recursoId) {
    if (!habilitado()) {
      const mias = leerLocales(CLAVES().partidasLocales)
        .filter(
          (p) =>
            p.recurso === recursoId &&
            p.email.toLowerCase() === String(email).trim().toLowerCase()
        )
        .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
      if (mias.length === 0) return null;
      const mejor = mias[0];
      const todas = leerLocales(CLAVES().partidasLocales)
        .filter((p) => p.recurso === recursoId)
        .sort((a, b) => b.puntaje - a.puntaje);
      return {
        puesto: todas.filter((p) => p.puntaje > mejor.puntaje).length + 1,
        total: todas.length,
        puntaje: mejor.puntaje,
        rango: mejor.rango,
        porcentaje: mejor.porcentaje
      };
    }

    const respuesta = await rpc("obtener_mi_puesto", {
      p_email: email,
      p_recurso: recursoId
    });
    return respuesta || null;
  }

  return {
    habilitado: habilitado,
    registrar: registrar,
    registrarContacto: registrarContacto,
    obtenerRanking: obtenerRanking,
    obtenerMiPuesto: obtenerMiPuesto,
    ahora: ahora
  };
})();
