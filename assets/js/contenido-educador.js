window.RECURSOS = window.RECURSOS || {};

window.RECURSOS.educador = {
  id: "educador",
  nombre: "Educador",
  rol: "Mapeás quién es quién en el territorio",
  icono: "🧭",
  resumen:
    "Una alianza empieza por saber quién es quién. Diez decisiones para ordenar el territorio, detectar los actores que mueven las cosas y dejar un mapa que sirva después de vos.",
  maximoReal: 1630,
  objetivo:
    "Llegar al final con un mapa de actores completo, ordenado y actualizado, y con claridad sobre a quién conviene acercarse primero. El puntaje final suma los puntos de cada decisión y el estado final de las seis variables.",

  metricas: [
    { id: "cobertura", etiqueta: "Actores identificados", corto: "Cobertura", peso: 3, valorInicial: 35 },
    { id: "relevancia", etiqueta: "Relevancia detectada", corto: "Relevancia", peso: 3, valorInicial: 40 },
    { id: "relaciones", etiqueta: "Relaciones entre actores", corto: "Relaciones", peso: 3, valorInicial: 35 },
    { id: "acceso", etiqueta: "Acceso a los actores", corto: "Acceso", peso: 2, valorInicial: 40 },
    { id: "informacion", etiqueta: "Información de calidad", corto: "Información", peso: 2, valorInicial: 40 },
    { id: "actualizacion", etiqueta: "Mapa actualizado y vigente", corto: "Actualización", peso: 2, valorInicial: 40 }
  ],

  escenarios: [
    {
      id: "mapa-vacio",
      etapa: "Punto de partida",
      icono: "🗺️",
      titulo: "El mapa en blanco",
      texto:
        "Nadie tiene un mapa del territorio. Hay direcciones sueltas, una planilla del 2010 con cuatro locales de la plaza que ya cerraron, y el contacto del centro vecinal. Hay que empezar por algún lado.",
      opciones: [
        {
          id: "archivos",
          etiqueta: "Empezar por los datos que ya existen",
          detalle: "Listas, padrones y planos viejos que están en un cajón.",
          efectos: { cobertura: 10, informacion: 10, acceso: -8, relaciones: -6 },
          resultado: {
            texto:
              "Armás una lista razonable de instituciones y personas. Es un comienzo que muestra que hiciste la tarea, y que deja afuera a los que no están en ningún registro.",
            puntos: 30
          }
        },
        {
          id: "recorrido",
          etiqueta: "Recorrer el barrio y preguntar",
          detalle: "Calles, plazas, escuelas, hospitales. Preguntas a qué se dedican y presentas el grupo.",
          requiere: { cobertura: 25 },
          efectos: { cobertura: 18, relaciones: 10, acceso: 10, informacion: 4, actualizacion: -6 },
          resultado: {
            texto:
              "Dos tardes de caminata y anotaciones a mano. Aparecen nombres que no están en ninguna lista y una idea clara de qué temas atraviesan el barrio.",
            puntos: 20,
            variantes: [
              {
                si: { cobertura: 65 },
                titulo: "Un mapa que se puede usar",
                texto:
                  "El mapa que armaste no es una lista: muestra quién se relaciona con quién y dónde están los vacíos. Eso es lo que después hace posible elegir bien a quién acercarse.",
                puntos: 37
              }
            ]
          }
        },
        {
          id: "preguntar-otros",
          etiqueta: "Preguntarle a otros grupos del distrito",
          detalle: Otro territorio, otros ojos.",
          efectos: { cobertura: 12, informacion: 6, relaciones: 8, acceso: 4, actualizacion: -8 },
          resultado: {
            texto:
              "Los otros grupos te cuentan a quién conocen y qué les funciona. Es información rápida y muy válida. Sirve para pensar el propio territorio.",
            puntos: 25
          }
        }
      ]
    },
    {
      id: "quien-mueve",
      etapa: "Análisis",
      icono: "🔎",
      titulo: "Quién mueve las cosas",
      texto:
        "El mapa tiene treinta nombres. No podés acercarte a treinta. Hay que descubrir cuáles tienen vocación de alianza y comparten objetivos comunes.",
      opciones: [
        {
          id: "cargo",
          etiqueta: "Buscar a quien tiene el cargo",
          detalle: "El que puede firmar y también el que puede decir que no.",
          efectos: { relevancia: 12, cobertura: 6, acceso: 8, relaciones: -4 },
          resultado: {
            texto:
              "Llegan bien, te reciben y te derivan a alguien del área. La firma va a ser fácil cuando llegue; el acceso al resto de la red, mucho más lento.",
            puntos: 23
          }
        },
        {
          id: "referentes",
          etiqueta: "Buscar a quien mueve las cosas de verdad",
          detalle: "Coordinadora, presidente del centro, médico del hospital o persona de la Iglesia que todos conocen.",
          efectos: { relevancia: 16, relaciones: 14, acceso: 12, cobertura: 4 },
          resultado: {
            texto:
              "Encontrás a alguien que contesta los mensajes y conoce a todo el barrio. Te dice a quién hay que llamar primero y a quién ni conviene acercarte.",
            puntos: 31
          }
        },
        {
          id: "relevancia-rol",
          etiqueta: "Medir la relevancia según quien lo dice",
          detalle: "Preguntas a los contacto que relación tienen con los otros.",
          efectos: { relevancia: 10, informacion: 8, relaciones: 6, acceso: -6, cobertura: 2 },
          resultado: {
            texto:
              "Cruzas lo que te cuenta cada uno y armás una tabla de peso. La tabla tiene lógica, aunque todos opinan sobre lo que no conocen y nadie piensa acercarse.",
            puntos: 22
          }
        }
      ]
    },
    {
      id: "primer-acercamiento",
      etapa: "Contacto",
      icono: "📬",
      titulo: "El primer acercamiento",
      texto:
        "Ya sabés a quién querés conocer. Tenés que escribir o llamar, y tenés dos minutos de atención para no gastar toda la confianza del primer contacto.",
      opciones: [
        {
          id: "preguntar",
          etiqueta: "Preguntar qué necesita la institución",
          detalle: "Escuchar primero, proponer después.",
          requiere: { acceso: 40 },
          efectos: { acceso: 16, informacion: 12, relevancia: 6, relaciones: 4, actualizacion: 4 },
          resultado: {
            texto:
              "La conversación dura cuarenta minutos y termina con una lista de problemas reales. Esos problemas son los que te van a decir qué actor falta en tu mapa.",
            puntos: 20
          }
        },
        {
          id: "presentacion",
          etiqueta: "Ir con una presentación del proyecto",
          detalle: "Todo preparado para mostrar en quince minutos.",
          efectos: { acceso: -6, informacion: 2, relevancia: -4, relaciones: -4, actualizacion: -4 },
          resultado: {
            texto:
              "La presentación es linda y la escuchan entera. Al final te dicen que está muy bien y que ellos lo van a pensar. Nunca se vuelven a hablar sin que los escribas vos.",
            puntos: 30
          }
        },
        {
          id: "intermediario",
          etiqueta: "Entrar por alguien que ya conocés",
          detalle: "Más lento de arrancar, más fácil de continuar.",
          requiere: { acceso: 45 },
          efectos: { acceso: 12, relaciones: 10, cobertura: 8, informacion: 4, actualizacion: -4 },
          resultado: {
            texto:
              "No hablás con esa persona: hablás con quien la conoce. El mensaje llega mejor y con menos fricción, y a cambio aprendés menos sobre el actor.",
            puntos: 25
          }
        }
      ]
    },
    {
      id: "datos-territorio",
      etapa: "Cuidado",
      icono: "🔒",
      titulo: "Los datos de la gente",
      texto:
        "Para mapear bien te piden información de la comunidad: quién asiste, cuántos son, qué necesidades tiene. La institución te pasa la planilla del año pasado y te dice que la actualices vos.",
      opciones: [
        {
          id: "planilla",
          etiqueta: "Actualizar la planilla que te pasaron",
          detalle: "Rápido, con datos de personas que no te pidieron nada.",
          efectos: { informacion: 12, cobertura: 6, acceso: 6, actualizacion: -14 },
          resultado: {
            texto:
              "La planilla se llena en veinte minutos y la institución queda contenta. Semanas después llega una queja formal y ya no hay forma de saber quién autorizó qué.",
            puntos: 25
          }
        },
        {
          id: "propio",
          etiqueta: "Armar tu relevamiento con consentimiento",
          detalle: "Más trabajo de campo y ningún problema después.",
          requiere: { acceso: 40 },
          efectos: { informacion: 16, cobertura: 12, acceso: 10, actualizacion: 6, relaciones: 4 },
          resultado: {
            texto:
              "Armás un formulario simple, con consentimiento informado y un plazo acotado. La institución mira con sorpresa y sigue los resultados con atención.",
            puntos: 20
          }
        },
        {
          id: "publico",
          etiqueta: "Trabajar solo con información pública",
          detalle: "Nada de datos personales, nada de profundidad.",
          efectos: { informacion: 8, actualizacion: 6, acceso: -2, cobertura: -10, relaciones: -4 },
          resultado: {
            texto:
              "No pedís ningún dato personal y todo queda seguro. El problema es que el mapa queda por arriba: contás cuántos son, no quiénes son ni qué les pasa.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "conflicto",
      etapa: "Fricción",
      icono: "⚡",
      titulo: "Dos versiones del mismo actor",
      activaSiMax: { acceso: 60 },
      texto:
        "Preguntaste en cinco lugares quién manda en el barrio de la escuela y te dieron cinco respuestas distintas. Dos personas te dijeron claramente que no son esas, y una te cerró la puerta.",
      opciones: [
        {
          id: "reunion",
          etiqueta: "Reunir a los que respondieron y aclarar",
          detalle: "Con reglas, con fecha y con todos en la misma mesa.",
          requiere: { acceso: 45 },
          efectos: { relaciones: 18, relevancia: 12, informacion: 10, acceso: 6, cobertura: -4 },
          resultado: {
            texto:
              "La reunión dura dos horas y ordena el mapa más que cualquier planilla. También deja en claro que hay zonas del territorio que todavía no tenés cubiertas.",
            puntos: 20
          }
        },
        {
          id: "revisar",
          etiqueta: "Anotar el desacuerdo y seguir",
          detalle: "Registrar las versiones sin resolverlas.",
          efectos: { informacion: 10, actualizacion: 8, relaciones: 2, relevancia: -6 },
          resultado: {
            texto:
              "Anotás que hay tres versiones y seguís. El mapa queda honesto, pero después de un tiempo nadie sabe cuál de las tres es la buena.",
            puntos: 25
          }
        },
        {
          id: "elegir",
          etiqueta: "Quedarte con la versión que más se repite",
          detalle: "La que dijo más gente, sin más.",
          efectos: { relevancia: -8, relaciones: -8, acceso: -6, informacion: 4, actualizacion: -4 },
          resultado: {
            texto:
              "Anotás la respuesta más repetida y seguís con el mapa. Semanas después descubrís que esa respuesta era la que menos le convenía a quien te la dio.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "relevamiento",
      etapa: "Profundidad",
      icono: "👣",
      titulo: "Bajar al barrio",
      texto:
        "El mapa está bien desde el escritorio, pero falta lo que solo se ve caminando: quién está siempre en la plaza, qué institución abre de noche, qué familia está en dos lados a la vez.",
      opciones: [
        {
          id: "salir",
          etiqueta: "Salir a relevar con el equipo",
          detalle: "Tres tardes, cuaderno y preguntas incómodas.",
          requiere: { cobertura: 45 },
          efectos: { cobertura: 16, relaciones: 14, acceso: 12, informacion: 8, actualizacion: -6 },
          resultado: {
            texto:
              "Volvés con datos que no estaban en ninguna planilla y con tres actores que nadie había nombrado. El mapa deja de ser un documento y pasa a ser un conocimiento.",
            puntos: 20
          }
        },
        {
          id: "buscar-faltantes",
          etiqueta: "Ir solo a los actores que faltan",
          detalle: "Completar huecos concretos del mapa.",
          efectos: { cobertura: 12, acceso: 10, informacion: 6, relaciones: -4, actualizacion: 2 },
          resultado: {
            texto:
              "Vas directo a los que faltaban y los encontrás. El mapa queda más completo, pero seguís sin saber cómo se relacionan entre sí.",
            puntos: 25
          }
        },
        {
          id: "esperar",
          etiqueta: "Cerrar el mapa con lo que hay",
          detalle: "Alcanza para empezar y no se mueve más.",
          efectos: { cobertura: -10, actualizacion: -12, acceso: -6, relaciones: -6 },
          resultado: {
            texto:
              "Cerrás el mapa y lo das por bueno. A los tres meses el territorio cambió y el documento sigue igual, y por eso ya no sirve para nada.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "cruce",
      etapa: "Análisis",
      icono: "🕸️",
      titulo: "Cruzar los mapas",
      texto:
        "El grupo tiene su propio mapa de actores y otra institución tiene el suyo. Son dos fotos distintas del mismo barrio, hechos por gente que nunca se cruzó.",
      opciones: [
        {
          id: "comparar",
          etiqueta: "Poner los dos mapas uno al lado del otro",
          detalle: "Cruzar la información de los dos proyectos.",
          requiere: { informacion: 45 },
          efectos: { relaciones: 18, informacion: 16, cobertura: 12, acceso: 8, actualizacion: 4 },
          resultado: {
            texto:
              "En una tarde de planillas encontrás veinte actores que los dos proyectos tenían por separado y nunca cruzaron.",
            puntos: 20,
            variantes: [
              {
                si: { relaciones: 60 },
                titulo: "Un mapa que ya no es solo tuyo",
                texto:
                  "Cuando el mapa lo arman dos proyectos, deja de depender de una sola persona y se vuelve un documento compartido que se actualiza entre los dos.",
                puntos: 40
              }
            ]
          }
        },
        {
          id: "pedir",
          etiqueta: "Pedirle al otro proyecto que te pase su mapa",
          detalle: "Pedir en vez de construir.",
          efectos: { informacion: 10, cobertura: 6, acceso: 4, relaciones: -6, actualizacion: -4 },
          resultado: {
            texto:
              "Te lo pasan tal cual, con los nombres de ellos y con criterios que no son los tuyos. Es información, pero no es un mapa que puedas usar sin revisarlo entero.",
            puntos: 25
          }
        },
        {
          id: "ignorar",
          etiqueta: "Seguir con tu propio mapa",
          detalle: "Cada proyecto con su información.",
          efectos: { relaciones: -10, informacion: -6, actualizacion: -6, acceso: -4 },
          resultado: {
            texto:
              "Cada proyecto sigue con lo suyo. Nadie pierde nada hoy y dentro de un año dos grupos van a estar haciendo lo mismo en la misma cuadra.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "corte",
      etapa: "Fricción",
      icono: "🗑️",
      titulo: "Los que dejan el territorio",
      activaSiMax: { actualizacion: 55 },
      texto:
        "Tres actores que estaban en tu mapa se fueron: uno cambió de función, otro cerró el negocio y otro se mudó de zona. Tu mapa quedó desactualizado sin que nadie te avise.",
      opciones: [
        {
          id: "revisar",
          etiqueta: "Revisar el mapa completo y sacar lo que cambió",
          detalle: "Costo alto, mapa correcto.",
          requiere: { cobertura: 45 },
          efectos: { actualizacion: 18, informacion: 12, cobertura: 10, acceso: 6 },
          resultado: {
            texto:
              "Tardás una semana y encontrás cinco cambios más que ni sabías que habían pasado. El mapa que queda sirve de verdad.",
            puntos: 20
          }
        },
        {
          id: "parcial",
          etiqueta: "Revisar solo los que más usás",
          detalle: "Lo que no tocás, se queda como está.",
          efectos: { actualizacion: 8, acceso: 4, cobertura: -4, informacion: -4 },
          resultado: {
            texto:
              "Actualizás los actores con los que ya tenés contacto. El resto del mapa se envejece sin que te enteres.",
            puntos: 25
          }
        },
        {
          id: "nada",
          etiqueta: "Dejarlo como está",
          detalle: "El mapa se corrige solo, si se corrige.",
          efectos: { actualizacion: -12, informacion: -8, acceso: -6, relaciones: -4 },
          resultado: {
            texto:
              "Seguí usando el mapa viejo. Los datos que usás para decidir van quedando cada vez más lejos de la realidad del barrio.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "primer-dia",
      etapa: "Verificación",
      icono: "🔍",
      titulo: "El primer día en el mapa",
      texto:
        "Armaste el mapa y querés probarlo antes de mostrarlo. Le preguntás a tres personas sobre el mismo actor y las tres te dicen algo distinto. Es la primera prueba de verdad.",
      opciones: [
        {
          id: "contrastar",
          etiqueta: "Contrastar el mapa con tres personas",
          detalle: "Preguntar lo mismo a tres fuentes distintas.",
          requiere: { acceso: 40 },
          efectos: { informacion: 18, cobertura: 10, relevancia: 8, relaciones: 6 },
          resultado: {
            texto:
              "Las tres versiones se parecen en lo importante y difieren en los detalles. El mapa que sale de ahí es bastante más confiable que el que tenías ayer.",
            puntos: 20
          }
        },
        {
          id: "mostrar",
          etiqueta: "Mostrar el mapa tal cual está",
          detalle: "Sin corregir nada y escuchar todo.",
          efectos: { relaciones: 8, acceso: 6, cobertura: 4, informacion: -6, actualizacion: -6 },
          resultado: {
            texto:
              "Lo mostrás como está y escuchás lo que dicen. Aparecen errores y también cosas que sabías y no habías escrito.",
            puntos: 25
          }
        },
        {
          id: "filtrar",
          etiqueta: "Sacar del mapa lo que no pudiste confirmar",
          detalle: "Quedarse solo con lo comprobado.",
          efectos: { informacion: 12, actualizacion: 8, cobertura: -14, acceso: -4 },
          resultado: {
            texto:
              "Quedás con un mapa chico y seguro. Sirve para lo que sabés y no sirve para lo que todavía falta aprender.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "cierre",
      etapa: "Entrega",
      icono: "🏁",
      titulo: "A quién le pertenece el mapa",
      texto:
        "El mapa está terminado y hay que decidir qué pasa con él: dejarlo en tus manos, publicarlo para que lo use cualquiera o ponerlo en manos de una sola institución. Cada opción tiene un precio distinto.",
      opciones: [
        {
          id: "publicar",
          etiqueta: "Documentarlo y compartirlo con los grupos",
          detalle: "Incluye lo que no funcionó y a quién no conviene llamar.",
          requiere: { informacion: 45 },
          efectos: { actualizacion: 18, relaciones: 16, cobertura: 14, acceso: 10, informacion: 4 },
          resultado: {
            texto:
              "El mapa circula con nombres, roles y una nota de a quién no le funcionó el contacto. Se vuelve referencia y deja de depender de que vos lo tengas en la cabeza.",
            puntos: 20
          }
        },
        {
          id: "institucionalizar",
          etiqueta: "Ponerlo en manos de una sola institución",
          detalle: "Mandar más, asumir más.",
          efectos: { acceso: 10, cobertura: 8, actualizacion: -4, relaciones: -8 },
          resultado: {
            texto:
              "La institución guarda el mapa y lo usa para sus propios fines. Tenés menos trabajo, pero el mapa deja de ser tuyo y cambia de dueño sin que te lo digan.",
            puntos: 25
          }
        },
        {
          id: "guardar",
          etiqueta: "Guardarlo para el próximo proyecto",
          detalle: "Sirve mientras vos estés.",
          efectos: { actualizacion: -10, relaciones: -6, informacion: -6, acceso: -4 },
          resultado: {
            texto:
              "Cerrás la planilla y no la compartís. La próxima vez que alguien pregunte quién es quién en el barrio, la respuesta vuelve a ser cero.",
            puntos: 30
          }
        }
      ]
    }
  ],

  epilogos: [
    {
      activaSi: { cobertura: 65 },
      texto:
        "Dejaste un mapa que sirve para algo más que para lo que hacías: cualquiera que llegue al territorio puede usarlo, y no depende de que vos te acuerdes."
    },
    {
      activaSi: { cobertura: 30 },
      texto:
        "El mapa se armó sobre personas concretas, no sobre un relevamiento. Funciona mientras esas personas sigan donde están; si cambian, hay que empezar de nuevo."
    },
    {
      texto:
        "Llegaste al final del mapeo. Lo que hiciste con la información que juntaste es lo que viene después."
    }
  ]
};
