window.Formulario = (function () {
  const CAMPOS = [
    {
      id: "nombre",
      label: "Nombre y apellido",
      tipo: "text",
      autocomplete: "name",
      maxlength: "60",
      ayuda: "Es el nombre que va a verse en el ranking."
    },
    {
      id: "email",
      label: "Mail",
      tipo: "email",
      autocomplete: "email",
      maxlength: "120",
      ayuda: "Sirve para identificarte en el ranking."
    },
    {
      id: "celular",
      label: "Celular",
      tipo: "tel",
      autocomplete: "tel",
      maxlength: "32",
      ayuda: "",
      opcional: true
    },
    {
      id: "nroGrupo",
      label: "N.º de grupo",
      tipo: "text",
      inputmode: "numeric",
      maxlength: "4",
      ayuda: "Solo números."
    },
    {
      id: "distrito",
      label: "Distrito",
      tipo: "text",
      inputmode: "numeric",
      maxlength: "3",
      ayuda: ""
    },
    {
      id: "zona",
      label: "Zona",
      tipo: "text",
      inputmode: "numeric",
      maxlength: "3",
      ayuda: ""
    },
    {
      id: "nroAfiliado",
      label: "N.º de afiliado (DNI)",
      tipo: "text",
      inputmode: "numeric",
      maxlength: "9",
      ayuda: ""
    }
  ];
  function escapar(texto) {
    return String(texto == null ? "" : texto).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function opcionesDe(lista) {
    const valores = (window.CONFIG.listas && window.CONFIG.listas[lista]) || [];
    if (valores.length === 0) return "";
    return (
      '<datalist id="lista-' + lista + '">' +
      valores.map((v) => '<option value="' + escapar(v) + '"></option>').join("") +
      "</datalist>"
    );
  }

  function html() {
    const cuerpo = CAMPOS.map((campo) => {
      const lista = campo.lista ? opcionesDe(campo.lista) : "";
      const autocomplete = campo.autocomplete ? ' autocomplete="' + campo.autocomplete + '"' : "";
      const inputmode = campo.inputmode ? ' inputmode="' + campo.inputmode + '"' : "";
      return (
        '<div class="campo' + (campo.opcional ? " campo-opcional" : "") + '">' +
        '<label for="dato-' + campo.id + '">' + escapar(campo.label) +
        (campo.opcional ? ' <span class="opcional">(opcional)</span>' : "") + "</label>" +
        '<input type="' + campo.tipo + '" id="dato-' + campo.id + '" name="' + campo.id + '"' +
        autocomplete + inputmode + ' maxlength="' + campo.maxlength + '"' +
        (campo.lista ? ' list="lista-' + campo.lista + '"' : "") +
        ">" +
        (lista || "") +
        (campo.ayuda ? '<div class="ayuda">' + escapar(campo.ayuda) + "</div>" : "") +
        "</div>"
      );
    }).join("");

    return (
      cuerpo +
      '<label class="consentimiento" for="dato-consentimiento">' +
      '<input type="checkbox" id="dato-consentimiento" name="consentimiento">' +
      "<span>" + escapar(window.CONFIG.privacidad.textoConsentimiento) +
      (window.CONFIG.privacidad.urlPolitica
        ? ' <a href="' + escapar(window.CONFIG.privacidad.urlPolitica) + '">Ver política de privacidad.</a>'
        : "") +
      "</span></label>"
    );
  }

  function leer() {
    const datos = {};
    CAMPOS.forEach((campo) => {
      const input = document.getElementById("dato-" + campo.id);
      datos[campo.id] = input ? input.value.trim() : "";
    });
    const check = document.getElementById("dato-consentimiento");
    datos.consentimiento = check ? check.checked : false;
    return datos;
  }

  function esNumeroEnRango(valor, min, max) {
    if (!/^\d+$/.test(valor)) return false;
    const n = Number(valor);
    return n >= min && n <= max;
  }

  function validar(datos) {
    const p = [];
    if (datos.nombre.length < 2) p.push("Escribí tu nombre y apellido.");
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(datos.email)) p.push("Revisá el mail.");
    if (datos.celular !== "" && datos.celular.replace(/\D/g, "").length < 8) {
      p.push("Revisá el celular: faltan dígitos.");
    }
    if (!/^\d{1,4}$/.test(datos.nroGrupo)) p.push("El número de grupo debe tener hasta 4 dígitos.");
    if (!esNumeroEnRango(datos.distrito, 1, 100)) {
      p.push("El distrito tiene que ser un número entre 1 y 100.");
    }
    if (!esNumeroEnRango(datos.zona, 1, 100)) {
      p.push("La zona tiene que ser un número entre 1 y 100.");
    }
    if (!/^\d{6,9}$/.test(datos.nroAfiliado)) {
      p.push("El número de afiliado debe tener entre 6 y 9 dígitos.");
    }
    if (window.CONFIG.privacidad.requiredConsentimiento && !datos.consentimiento) {
      p.push("Necesitamos tu consentimiento para guardar los datos.");
    }
    return p;
  }

  function mostrarError(contenedor, problemas) {
    if (!contenedor) return;
    contenedor.textContent = problemas.join(" ");
    contenedor.classList.remove("oculto");
  }

  function limpiarError(contenedor) {
    if (!contenedor) return;
    contenedor.textContent = "";
    contenedor.classList.add("oculto");
  }

  function completar(datos) {
    CAMPOS.forEach((campo) => {
      const input = document.getElementById("dato-" + campo.id);
      if (input && datos && datos[campo.id] != null) input.value = datos[campo.id];
    });
    const check = document.getElementById("dato-consentimiento");
    if (check && datos) check.checked = Boolean(datos.consentimiento);
  }

  return {
    CAMPOS: CAMPOS,
    html: html,
    leer: leer,
    validar: validar,
    mostrarError: mostrarError,
    limpiarError: limpiarError,
    completar: completar
  };
})();
