(function () {
  const CONFIG = window.CONFIG;
  const UI = window.RankingUI;
  const F = window.Formulario;
  let recursoActual = null;
  let registrado = null;

  function pintarEncabezado() {
    document.getElementById("titulo-evento").textContent = CONFIG.evento;
    document.getElementById("hero-titulo").textContent = CONFIG.evento;
    document.getElementById("hero-bajada").textContent = CONFIG.subtitulo;
    document.getElementById("titulo-aventura").textContent = CONFIG.seccionAventura;
    document.getElementById("pie-organizacion").textContent = CONFIG.organizacion;
    document.getElementById("pie-dependencia").textContent = CONFIG.dependencia;
  }

  function pintarRoles() {
    const lista = document.getElementById("lista-roles");
    lista.innerHTML = window.CONTENIDO.recursos
      .map(function (recurso) {
        return (
          '<label class="rol" data-recurso="' + UI.escapar(recurso.id) + '">' +
          '<input type="radio" name="recurso" value="' + UI.escapar(recurso.id) + '">' +
          '<span class="rol-icono">' + recurso.icono + "</span>" +
          '<span class="rol-nombre">' + UI.escapar(recurso.nombre) + "</span>" +
          '<span class="rol-texto">' + UI.escapar(recurso.resumen) + "</span>" +
          "</label>"
        );
      })
      .join("");

    lista.querySelectorAll("input[name=recurso]").forEach(function (input) {
      input.addEventListener("change", function () {
        seleccionar(input.value);
      });
    });
  }

  function seleccionar(id) {
    const recurso = window.CONTENIDOPorId(id);
    recursoActual = recurso;

    const input = document.querySelector('input[name=recurso][value="' + recurso.id + '"]');
    if (input) input.checked = true;

    document.querySelectorAll(".rol").forEach(function (tarjeta) {
      tarjeta.classList.toggle("activa", tarjeta.getAttribute("data-recurso") === recurso.id);
    });

    const resumen = document.getElementById("resumen-rol");
    resumen.classList.remove("oculto");
    resumen.innerHTML =
      "<strong>" + UI.escapar(recurso.nombre) + ":</strong> " + UI.escapar(recurso.rol);

    document.getElementById("texto-objetivo").textContent = recurso.objetivo;
    document.getElementById("lista-metricas").innerHTML = recurso.metricas
      .map(function (m) {
        return (
          "<li>" +
          '<span class="turno">' + UI.escapar(m.corto) + "</span>" +
          ' <span class="elegida">vale ' + m.peso + "×</span>" +
          "</li>"
        );
      })
      .join("");

    document.getElementById("btn-comenzar").disabled = false;
    pintarPestanas();
    if (registrado) UI.cargar(recurso.id);
  }

  function pintarRangos() {
    const ordenados = window.Motor.RANGOS.slice().sort((a, b) => b.minimo - a.minimo);
    document.getElementById("lista-rangos").innerHTML = ordenados
      .map(function (r, i) {
        const desde = r.minimo;
        const hasta = i === 0 ? 100 : ordenados[i - 1].minimo - 1;
        return (
          "<tr>" +
          "<td>" + UI.escapar(r.nombre) + "</td>" +
          '<td class="num">' + desde + "–" + hasta + "%</td>" +
          '<td class="vacio">' + UI.escapar(r.detalle) + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function pintarPestanas() {
    const contenedor = document.getElementById("pestanas-ranking");
    contenedor.innerHTML = window.CONTENIDO.recursos
      .map(function (recurso) {
        const activa = recurso.id === recursoActual.id;
        return (
          '<button type="button" class="pestana' + (activa ? " activa" : "") +
          '" data-recurso="' + UI.escapar(recurso.id) + '">' +
          recurso.icono + " " + UI.escapar(recurso.nombre) + "</button>"
        );
      })
      .join("");

    contenedor.querySelectorAll(".pestana").forEach(function (boton) {
      boton.addEventListener("click", function () {
        const id = boton.getAttribute("data-recurso");
        const input = document.querySelector('input[name=recurso][value="' + id + '"]');
        if (input) input.checked = true;
        seleccionar(id);
      });
    });
  }

  function avisarModoLocal() {
    if (window.Datos.habilitado()) return;
    const aviso = document.getElementById("aviso-modo");
    aviso.textContent = CONFIG.ranking.mensajeModoLocal;
    aviso.classList.remove("oculto");
  }

  function leerSesion(clave) {
    try {
      return JSON.parse(sessionStorage.getItem(clave) || "null");
    } catch (e) {
      return null;
    }
  }

  function comenzar() {
    if (!recursoActual) return;
    sessionStorage.setItem(CONFIG.claves.recursoElegido, recursoActual.id);
    window.location.href = "juego.html";
  }

  function mostrarEstadoRegistro() {
    const bloqueado = document.getElementById("ranking-bloqueado");
    const visible = document.getElementById("ranking-visible");
    const boton = document.getElementById("btn-actualizar");

    if (registrado) {
      bloqueado.classList.add("oculto");
      visible.classList.remove("oculto");
      boton.classList.remove("oculto");
      const aviso = document.getElementById("aviso-sesion");
      aviso.classList.remove("oculto");
      aviso.innerHTML =
        "Ya tenés tus datos guardados (" + UI.escapar(registrado.distrito) +
        ", grupo " + UI.escapar(registrado.nroGrupo) + "). " +
        '<button class="boton secundario" type="button" id="btn-editar">Editar mis datos</button>';
      document.getElementById("btn-editar").addEventListener("click", function () {
        bloqueado.classList.remove("oculto");
        visible.classList.add("oculto");
        boton.classList.add("oculto");
        aviso.classList.add("oculto");
      });
      UI.cargar(recursoActual.id);
    } else {
      bloqueado.classList.remove("oculto");
      visible.classList.add("oculto");
      boton.classList.add("oculto");
      document.getElementById("mensaje-bloqueo").textContent = CONFIG.ranking.mensajeBloqueado;
    }
  }

  async function guardarDatos(evento) {
    evento.preventDefault();
    const error = document.getElementById("error-datos");
    F.limpiarError(error);

    const datos = F.leer();
    const problemas = F.validar(datos);
    if (problemas.length > 0) {
      F.mostrarError(error, problemas);
      return;
    }

    const boton = document.getElementById("form-datos").querySelector('button[type=submit]');
    boton.disabled = true;
    boton.textContent = "Guardando…";

    try {
      await window.Datos.registrarContacto(datos);
      sessionStorage.setItem(CONFIG.claves.jugador, JSON.stringify(datos));
      registrado = datos;
      F.completar(datos);
      mostrarEstadoRegistro();
    } catch (e) {
      F.mostrarError(error, ["No se pudieron guardar tus datos: " + e.message]);
    } finally {
      boton.disabled = false;
      boton.textContent = "Guardar mis datos y ver el ranking";
    }
  }

  async function buscarPuesto(evento) {
    evento.preventDefault();
    const aviso = document.getElementById("ranking-aviso");
    const email = document.getElementById("email-buscar").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return;

    try {
      const datos = await window.Datos.obtenerMiPuesto(email, recursoActual.id);
      if (!datos) {
        UI.mostrarMiPuesto(null);
        aviso.textContent =
          "No hay partidas registradas con ese mail en la aventura " + recursoActual.nombre + ".";
        aviso.classList.remove("oculto");
        return;
      }
      UI.mostrarMiPuesto(datos);
      UI.cargar(recursoActual.id, datos.puesto);
    } catch (e) {
      aviso.textContent = "No se pudo consultar: " + e.message;
      aviso.classList.remove("oculto");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    pintarEncabezado();
    pintarRoles();
    pintarRangos();
    avisarModoLocal();
    document.getElementById("campos-datos").innerHTML = F.html();
    document.getElementById("btn-comenzar").addEventListener("click", comenzar);
    document.getElementById("form-datos").addEventListener("submit", guardarDatos);
    document.getElementById("form-mi-puesto").addEventListener("submit", buscarPuesto);
    document.getElementById("btn-actualizar").addEventListener("click", function () {
      UI.cargar(recursoActual.id);
    });

    registrado = leerSesion(CONFIG.claves.jugador);
    if (registrado) F.completar(registrado);

    let inicial = null;
    try {
      inicial = sessionStorage.getItem(CONFIG.claves.recursoRanking);
    } catch (e) {
      inicial = null;
    }
    if (!inicial) inicial = recursoElegidoGuardado();
    seleccionar(inicial || window.CONTENIDO.recursos[0].id);
    mostrarEstadoRegistro();
  });

  function recursoElegidoGuardado() {
    try {
      return sessionStorage.getItem(CONFIG.claves.recursoElegido);
    } catch (e) {
      return null;
    }
  }
})();
