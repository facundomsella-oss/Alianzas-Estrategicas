window.Logo = (function () {
  function aplicar() {
    const config = window.CONFIG.logo;
    if (!config || !config.archivo) return;

    document.querySelectorAll("[data-logo]").forEach(function (contenedor) {
      const imagen = new Image();
      imagen.alt = config.alt || "";
      imagen.className = "logo-imagen";
      if (config.alto) imagen.style.height = config.alto;
      imagen.addEventListener("error", function () {
        contenedor.classList.remove("con-imagen");
        contenedor.textContent = config.respuesto || "✦";
      });
      imagen.src = config.archivo;
      contenedor.textContent = "";
      contenedor.classList.add("con-imagen");
      contenedor.appendChild(imagen);
    });
  }

  document.addEventListener("DOMContentLoaded", aplicar);

  return { aplicar: aplicar };
})();
