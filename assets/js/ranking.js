window.RankingUI = (function () {
  function escapar(texto) {
    return String(texto == null ? "" : texto).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function enmascarar(nombre) {
    const partes = String(nombre || "").trim().split(/\s+/);
    if (partes.length === 0) return "Participante";
    const primero = partes[0];
    if (partes.length === 1) return primero;
    return primero + " " + partes[1].charAt(0).toUpperCase() + ".";
  }

  function medalla(puesto) {
    const clase = puesto === 1 ? "medalla oro" : "medalla";
    return '<span class="' + clase + '">' + puesto + "</span>";
  }

  function render(filas, destacarPuesto) {
    const cuerpo = document.getElementById("ranking-cuerpo");
    if (!cuerpo) return;

    if (!filas || filas.length === 0) {
      cuerpo.innerHTML =
        '<tr><td colspan="5" class="vacio">' +
        escapar(window.CONFIG.ranking.mensajeSinPartidas) +
        "</td></tr>";
      return;
    }

    cuerpo.innerHTML = filas
      .map(function (fila) {
        const nombre = window.CONFIG.ranking.mostrarNombres ? fila.nombre : enmascarar(fila.nombre);
        const destacado = destacarPuesto && Number(fila.puesto) === Number(destacarPuesto);
        return (
          "<tr" +
          (destacado ? ' class="destacado"' : "") +
          ">" +
          '<td class="num">' + medalla(fila.puesto) + "</td>" +
          "<td>" + escapar(nombre) + "</td>" +
          '<td class="num">' + escapar(fila.puntaje) + "</td>" +
          '<td class="num">' + escapar(fila.porcentaje) + "%</td>" +
          "<td>" + escapar(fila.rango) + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  async function cargar(recursoId, destacarPuesto) {
    const cuerpo = document.getElementById("ranking-cuerpo");
    const aviso = document.getElementById("ranking-aviso");
    if (cuerpo) {
      cuerpo.innerHTML = '<tr><td colspan="5" class="vacio">Cargando…</td></tr>';
    }

    try {
      const filas = await window.Datos.obtenerRanking(recursoId);
      render(filas, destacarPuesto);
      if (aviso) aviso.classList.add("oculto");
    } catch (error) {
      render([], null);
      if (aviso) {
        aviso.textContent =
          "No se pudo cargar el ranking: " + error.message + " Revisá la configuración de Supabase.";
        aviso.classList.remove("oculto");
      }
    }
  }

  function mostrarMiPuesto(datos) {
    const caja = document.getElementById("caja-mi-puesto");
    if (!caja) return;
    if (!datos) {
      caja.classList.add("oculto");
      return;
    }
    caja.classList.remove("oculto");
    caja.innerHTML =
      "<div>" +
      "<div>Tu mejor posición</div>" +
      "<strong>" + escapar(datos.puesto) + "º</strong>" +
      " de " + escapar(datos.total) +
      " · " +
      escapar(datos.rango) +
      " · " +
      escapar(datos.puntaje) +
      " puntos" +
      "</div>" +
      '<button class="boton secundario" type="button" id="cerrar-puesto">Ocultar</button>';
    const boton = document.getElementById("cerrar-puesto");
    if (boton) {
      boton.addEventListener("click", function () {
        caja.classList.add("oculto");
      });
    }
  }

  return {
    cargar: cargar,
    render: render,
    mostrarMiPuesto: mostrarMiPuesto,
    escapar: escapar
  };
})();
