window.CONFIG = {
  evento: "ALIANZAS",
  subtitulo: "Generá alianzas y posicioná tu grupo como un actor de referencia",
  seccionAventura: "Elegí la aventura",
  organizacion: "Scouts de Argentina Asociación Civil",
  dependencia: "Secretaría de Fortalecimiento y Desarrollo",
  version: "3.0.0",

  supabase: {
    url: "",
    anonKey: ""
  },

  privacidad: {
    requiredConsentimiento: true,
    textoConsentimiento: "Acepto que mis datos sean almacenados.",
    urlPolitica: ""
  },

  ranking: {
    mostrarNombres: true,
    limiteFilas: 50,
    mensajeModoLocal:
      "Estás jugando en modo local: las partidas se guardan solamente en este navegador. Configurá Supabase en assets/js/config.js para habilitar el ranking global.",
    mensajeSinPartidas:
      "Todavía no hay partidas guardadas en esta aventura. Configurá Supabase o jugá para ver aparecer el ranking.",
    mensajeBloqueado:
      "Para ver el ranking necesitamos algunos datos tuyos. También nos sirve para saber cuántos grupos están jugando y para avisarte de novedades."
  },

  logo: {
    archivo: "assets/img/logo.png",
    alt: "Scouts de Argentina Asociación Civil",
    respaldo: "✦",
    alto: "44px"
  },

  listas: {
    distrito: [],
    zona: []
  },

  claves: {
    recursoElegido: "alianza.recursoElegido",
    jugador: "alianza.jugador",
    recursoRanking: "alianza.recursoRanking",
    partidasLocales: "alianza.partidas",
    contactosLocales: "alianza.contactos",
    resultadoLocal: "alianza.resultado"
  }
};
