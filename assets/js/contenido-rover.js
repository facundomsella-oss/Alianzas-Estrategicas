window.RECURSOS = window.RECURSOS || {};

window.RECURSOS.rover = {
  id: "rover",
  nombre: "Rover",
  rol: "Sostenés un proyecto rover de punta a punta",
  icono: "🛶",
  resumen:
    "No hay organización que te espere: sos vos quien propone, busca recursos, convenios y respuestas. Diez decisiones para que el proyecto exista, se haga y no se caiga al primer mes.",
  maximoReal: 1350,
  objetivo:
    "Llegar al final con el proyecto definido, con recursos reales, con el equipo encima y con algo tangible para mostrar. El puntaje final suma los puntos de cada decisión y el estado final de las seis variables.",

  metricas: [
    { id: "proposito", etiqueta: "Claridad del objetivo", corto: "Propósito", peso: 3, valorInicial: 45 },
    { id: "equipo", etiqueta: "Equipo del proyecto", corto: "Equipo", peso: 3, valorInicial: 45 },
    { id: "recursos", etiqueta: "Recursos y materiales", corto: "Recursos", peso: 2, valorInicial: 40 },
    { id: "logistica", etiqueta: "Logística y permisos", corto: "Logística", peso: 2, valorInicial: 40 },
    { id: "entorno", etiqueta: "Vínculo con el entorno", corto: "Entorno", peso: 2, valorInicial: 45 },
    { id: "seguridad", etiqueta: "Seguridad y cuidado", corto: "Seguridad", peso: 1, valorInicial: 50 }
  ],

  escenarios: [
    {
      id: "idea",
      etapa: "Punto de partida",
      icono: "💡",
      titulo: "La idea que tenés en la cabeza",
      texto:
        "Hace semanas que le das vueltas a lo mismo: querés hacer un proyecto rover de verdad. Pero escrito así, un proyecto no es nada. Hay que bajarlo a algo que se pueda sostener seis meses.",
      opciones: [
        {
          id: "amplio",
          etiqueta: "Plantearlo grande, para todo el distrito",
          detalle: "Ambicioso, pero nadie sabe por dónde empezar.",
          efectos: { proposito: -8, entorno: 10, recursos: -6, equipo: 4 },
          resultado: {
            texto:
              "La idea suena bien y nadie la frena. Pero es tan grande que necesita cosas que hoy no existen y la comunidad se abruma.",
            puntos: 30
          }
        },
        {
          id: "concreto",
          etiqueta: "Bajarlo a algo concreto y realizable",
          detalle: "Menos brillo, muchas más chances de que ocurra.",
          efectos: { proposito: 16, equipo: 8, recursos: 4, entorno: 2 },
          resultado: {
            texto:
              "Escribís una frase que se entiende sin contexto: qué se hace, dónde, con quién y en cuánto tiempo. Todo lo que viene después se decide mucho más rápido.",
            puntos: 20,
            variantes: [
              {
                si: { proposito: 70 },
                titulo: "Una idea que se defiende sola",
                texto:
                  "Cuando la contás, los demás la repiten con sus propias palabras sin que tengas que explicarla otra vez.",
                puntos: 36
              }
            ]
          }
        },
        {
          id: "esperar",
          etiqueta: "Esperar a que la comunidad proponga algo",
          detalle: "La vía segura, pero el proyecto no es tuyo.",
          efectos: { proposito: -4, equipo: 10, recursos: 6, entorno: 4, logistica: 4 },
          resultado: {
            texto:
              "Te sumás a lo que se está armando y avanza con otros tiempos. Cuando haya que decidir, va a faltar alguien que lo defienda con convicción.",
            puntos: 25
          }
        }
      ]
    },
    {
      id: "equipo",
      etapa: "Equipo",
      icono: "🤝",
      titulo: "Quiénes te acompañan",
      texto:
        "Un proyecto rover se hace entre varios. Tenés cuatro rovers de la comunidad dispuestos a hablar del proyecto y ninguna que haya hecho esto antes. También hay un educador que los puede acompañar.",
      opciones: [
        {
          id: "nucleo",
          etiqueta: "Armar un núcleo chico y decidido",
          detalle: "Pocos, pero presentes cuando hay que decidir.",
          efectos: { equipo: 14, proposito: 6, entorno: -6 },
          resultado: {
            texto:
              "Quedan cuatro personas que se juntan todos los martes y se dicen las cosas de frente. La comunidad se siente apartada, pero un proyecto siempre tiene un núcleo.",
            puntos: 25
          }
        },
        {
          id: "abierto",
          etiqueta: "Abrirlo a toda la comunidad",
          detalle: "Muchas manos y ninguno a cargo.",
          efectos: { equipo: -4, entorno: 12, proposito: -2, recursos: 4 },
          resultado: {
            texto:
              "Entra todo el que quiere. Hay más ideas y hay más problemas: las decisiones hay que tomarlas con treinta personas presentes.",
            puntos: 30
          }
        },
        {
          id: "acompañamiento",
          etiqueta: "Pedir acompañamiento a alguien con más experiencia",
          detalle: "Menos decidir solo, mucho más criterio.",
          requiere: { proposito: 45 },
          efectos: { equipo: 12, proposito: 8, logistica: 8, recursos: 6, entorno: -2 },
          resultado: {
            texto:
              "Viene dos veces y te dice las tres cosas que hay que hacer sí o sí, sin darte la respuesta. Es lo que hacía falta para que el proyecto no arranque en tres semanas.",
            puntos: 20
          }
        }
      ]
    },
    {
      id: "recursos",
      etapa: "Recursos",
      icono: "💰",
      titulo: "De dónde sale la plata",
      texto:
        "El proyecto tiene un costo estimado y no tenés un peso para arrancar. El fondo de la comunidad puede cubrir una sola actividad al año.",
      opciones: [
        {
          id: "fondo-comunidad",
          etiqueta: "Pedir el fondo de la comunidad",
          detalle: "Cero riesgo y una fecha de entrega ajustada.",
          efectos: { recursos: 20, logistica: -6, equipo: 6, entorno: 4 },
          resultado: {
            texto:
              "Te aprueban una parte y una fecha bastante ajustada. Es plata que no tenés que explicar, pero después te van a pedir resultados.",
            puntos: 25
          }
        },
        {
          id: "patrocinio",
          etiqueta: "Buscar un patrocinador del barrio",
          detalle: "Plata y visibilidad, a cambio de exponer el proyecto.",
          efectos: { recursos: 22, entorno: 8, equipo: -4, proposito: 6 },
          resultado: {
            texto:
              "Un comercio aporta una parte importante a cambio de que su nombre esté en todo el material. Es dinero real, y también un logo que tenés que cuidar cada semana.",
            puntos: 20
          }
        },
        {
          id: "autogestion",
          etiqueta: "Financiarlo con trabajo y ventas",
          detalle: "Cero dependencias, cero descanso.",
          efectos: { recursos: 12, equipo: -10, proposito: 4, entorno: 8 },
          resultado: {
            texto:
              "Cada persona trae algo: diseño, reparación, venta. El proyecto no le debe nada a nadie y a la vez tiene menos plata y menos tiempos libres de los que pensaste.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "permisos",
      etapa: "Trámites",
      icono: "📝",
      titulo: "Los permisos y las autorizaciones",
      texto:
        "Para usar un espacio, mover gente o trabajar con menores hacen falta autorizaciones. Nadie te dijo que esto tomaba seis semanas.",
      opciones: [
        {
          id: "temprano",
          etiqueta: "Sacar los permisos apenas se los piden",
          detalle: "Molesto ahora, salva el proyecto después.",
          requiere: { proposito: 50 },
          efectos: { logistica: 18, seguridad: 10, equipo: -4, recursos: -2 },
          resultado: {
            texto:
              "Arrancás los trámites con el proyecto en borrador y avanzás en paralelo. Dos meses después tenés todo en regla y un lugar confirmado.",
            puntos: 20
          }
        },
        {
          id: "improvisar",
          etiqueta: "Improvisar y resolver sobre la marcha",
          detalle: "La vía rápida, con un riesgo grande.",
          efectos: { logistica: -14, seguridad: -12, equipo: 6, recursos: 4 },
          resultado: {
            texto:
              "Resolvés rápido y barato, y queda un pendiente con forma de problema. Si algo sale mal, la explicación va a ser tuya.",
            puntos: 30
          }
        },
        {
          id: "aliados",
          etiqueta: "Pedirle a una institución que gestione los trámites",
          detalle: "Menos gestión propia, más dependencia.",
          requiere: { entorno: 50 },
          efectos: { logistica: 14, entorno: 10, equipo: -4, recursos: -4 },
          resultado: {
            texto:
              "Una institución tiene los formularios, los contactos y el archivo. Te ahorra semanas y también te ata a los tiempos de alguien más.",
            puntos: 25
          }
        }
      ]
    },
    {
      id: "seguridad",
      etapa: "Cuidado",
      icono: "🧯",
      titulo: "La charla incómoda",
      texto:
        "Alguien del equipo propone la parte más divertida del proyecto: salir de noche, lejos del barrio, a un lugar sin cobertura. Son seis personas y algunas tienen menos de dieciocho años.",
      opciones: [
        {
          id: "adaptar",
          etiqueta: "Adaptarla: mismo lugar, de día y con acompañamiento",
          detalle: "Conservar la idea sin poner a nadie en riesgo.",
          requiere: { equipo: 45 },
          efectos: { seguridad: 12, equipo: 8, proposito: 6, entorno: 2 },
          resultado: {
            texto:
              "Termina siendo la mejor parte del proyecto y la que más aprendieron. Una hora de conversación incómoda evitó un problema durante meses.",
            puntos: 20
          }
        },
        {
          id: "rechazar",
          etiqueta: "Sacarla del proyecto y explicar por qué",
          detalle: "Menos emocionante, más responsable.",
          efectos: { seguridad: 16, equipo: -6, proposito: -4, entorno: 2 },
          resultado: {
            texto:
              "Lo decís con el argumento de la responsabilidad y no del miedo. La otra persona se enoja una semana y después propone otra versión.",
            puntos: 30
          }
        },
        {
          id: "dejar",
          etiqueta: "Dejarla como está",
          detalle: "Nadie discute ahora; alguien va a sufrir después.",
          efectos: { seguridad: -18, equipo: 8, proposito: 4 },
          resultado: {
            texto:
              "El proyecto avanza rápido y nadie discute. La factura llega más tarde y para entonces ya no queda mucho por hacer.",
            puntos: 25
          }
        }
      ]
    },
    {
      id: "proposito-pausa",
      etapa: "Fricción",
      icono: "⏳",
      titulo: "El proyecto se frena",
      activaSiMax: { equipo: 65 },
      texto:
        "Llevás seis semanas y el proyecto no arrancó. Nadie renunció: cada persona tiene un motivo distinto por el que no aparece. Uno tiene exámenes, otro una mudanza, otro dejó de creer.",
      opciones: [
        {
          id: "reuniones",
          etiqueta: "Hacer una reunión honesta y achicar el proyecto",
          detalle: "Duele, pero ordena y cambia el tamaño del proyecto.",
          efectos: { equipo: 14, proposito: 12, entorno: -2, recursos: -4 },
          resultado: {
            texto:
              "La reunión es incómoda y termina con un proyecto más chico y con menos personas, pero con gente que sí está.",
            puntos: 20,
            variantes: [
              {
                si: { equipo: 55 },
                titulo: "El proyecto que sí se puede hacer",
                texto:
                  "La versión reducida tiene fecha, responsables y recursos. Muere el proyecto que no arrancaba y nace uno que sí.",
                puntos: 38
              }
            ]
          }
        },
        {
          id: "empujar",
          etiqueta: "Insistir y bajar el nivel de exigencia",
          detalle: "El proyecto sigue, la motivación baja.",
          efectos: { equipo: -6, proposito: 4, logistica: -4 },
          resultado: {
            texto:
              "Nadie dice que no y el proyecto sigue a muy poca cosa. La fecha se corre y el equipo aprende que las cosas pueden quedar a medio hacer.",
            puntos: 25
          }
        },
        {
          id: "guardar",
          etiqueta: "Guardar el proyecto y esperar al próximo período",
          detalle: "Cerrar la puerta sin romperla.",
          efectos: { equipo: 6, proposito: -10, entorno: -4 },
          resultado: {
            texto:
              "Guardás todo en una carpeta y lo retomás más adelante. Nadie te lo reprocha y nadie se acuerda de que existía.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "difusion",
      etapa: "Entorno",
      icono: "📣",
      titulo: "Que se enteren",
      texto:
        "El proyecto funciona y casi nadie fuera del equipo lo sabe. Una organización del barrio te ofrece visibilidad a cambio de quedar asociado a ellos. Es una oferta que en otro momento habrías aceptado sin ver.",
      opciones: [
        {
          id: "propio",
          etiqueta: "Difundirlo con los canales de la agrupación",
          detalle: "Lento y seguro, sin dependencias.",
          efectos: { entorno: 8, equipo: 4, recursos: 2, proposito: 2 },
          resultado: {
            texto:
              "El proyecto se conoce en el patio del grupo y un poco por fuera. No llega a nadie nuevo, pero llega a los que importan.",
            puntos: 23
          }
        },
        {
          id: "asociacion",
          etiqueta: "Aceptar la oferta a cambio de asociación",
          detalle: "Alcance real a cambio de una parte del proyecto.",
          requiere: { entorno: 45 },
          efectos: { entorno: 16, recursos: 8, equipo: -6, proposito: -4 },
          resultado: {
            texto:
              "El proyecto aparece donde entra gente que nunca habría entrado. También aparece el nombre de ellos al lado del tuyo.",
            puntos: 27
          }
        },
        {
          id: "accion-visible",
          etiqueta: "Hacer algo chico en el barrio, sin pedir permiso",
          detalle: "Con lo que hay y resolviendo rápido.",
          efectos: { entorno: 12, equipo: 6, logistica: -8, seguridad: -4 },
          resultado: {
            texto:
              "Armás algo visible en la plaza. El barrio lo ve, el municipio lo ve y también lo ve el comité. Nadie pidió permiso y hace falta resolverlo rápido.",
            puntos: 25
          }
        }
      ]
    },
    {
      id: "entrada-jovenes",
      etapa: "Equipo",
      icono: "🧭",
      titulo: "Alguien que quiere entrar ahora",
      activaSiMax: { equipo: 70 },
      texto:
        "Se acerca alguien del grupo que nunca participó y pide entrar al proyecto: quiere estar desde el principio, no en la última etapa. Es la persona que más necesita estar y la que menos tiempo tiene, porque está en exámenes.",
      opciones: [
        {
          id: "integrar",
          etiqueta: "Integrarlo ahora, con tareas reales",
          detalle: "Más energía y más carga de coordinación.",
          efectos: { equipo: 14, proposito: 4, entorno: 4, recursos: -2 },
          resultado: {
            texto:
              "Entra con una tarea que importa de verdad y se la toma en serio. Coordinar su ritmo con el resto te va a llevar unas cuantas reuniones.",
            puntos: 20
          }
        },
        {
          id: "mas-adelante",
          etiqueta: "Darle un rol puntual más adelante",
          detalle: "Sin conflicto ahora y sin aprendizaje tampoco.",
          efectos: { equipo: 4, proposito: 2, recursos: 2 },
          resultado: {
            texto:
              "Dice que sí y aparece cuando lo llamás. Cumple y no queda enganchado. Nadie se pelea, pero tampoco queda enganchado.",
            puntos: 25
          }
        },
        {
          id: "aplazar",
          etiqueta: "Aplazar su entrada hasta que tenga tiempo",
          detalle: "La decisión que casi siempre se toma.",
          efectos: { equipo: -8, proposito: -2, recursos: 2 },
          resultado: {
            texto:
              "Le decís que más adelante. Entiende perfecto y deja de preguntar. Para cuando vuelve a tener tiempo, el proyecto ya terminó.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "falla",
      etapa: "Fricción",
      icono: "🚨",
      titulo: "El día que casi sale mal",
      activaSiMax: { seguridad: 55 },
      texto:
        "Durante la actividad algo sale mal: un equipo se pierde, un material se rompe, alguien se lastima leve y vos enteraste tarde. No hay una tragedia, pero hay un rumor dando vueltas y la comunidad pregunta qué pasó.",
      opciones: [
        {
          id: "contar",
          etiqueta: "Contarlo completo a la comunidad y al equipo",
          detalle: "Incómodo ahora, evita que crezca después.",
          efectos: { seguridad: 12, equipo: 10, entorno: -2, proposito: -2 },
          resultado: {
            texto:
              "Contás todo, incluida la parte que fue decisión tuya. Salen dos cambios concretos de procedimiento y el rumor se desvanece.",
            puntos: 31
          }
        },
        {
          id: "reparar",
          etiqueta: "Reparar con el equipo antes de hablar con nadie",
          detalle: "Primero el equipo, después los demás.",
          requiere: { equipo: 50 },
          efectos: { seguridad: 8, equipo: 14, entorno: 4, proposito: 2 },
          resultado: {
            texto:
              "Juntás al equipo y escuchás. Salís con dos acuerdos de procedimiento que la comunidad acepta sin discutir porque ya venían bien hechos.",
            puntos: 27
          }
        },
        {
          id: "minimizar",
          etiqueta: "Bajar la importancia hasta que se olvide",
          detalle: "Nadie discute hoy; el equipo pierde la lección.",
          efectos: { seguridad: -6, equipo: -8, proposito: 2, entorno: 2 },
          resultado: {
            texto:
              "Decís que no fue nada y todos asienten. El mensaje para el equipo es claro: si algo sale mal, mejor no contarlo.",
            puntos: 16
          }
        }
      ]
    },
    {
      id: "cierre",
      etapa: "Evaluación",
      icono: "🏁",
      titulo: "El informe y lo que queda",
      texto:
        "El proyecto terminó. Toca el informe y la decisión de qué hacer con lo aprendido: el archivo, los contactos, los materiales, el método que funciona. Hay tres caminos y cada uno dice algo distinto sobre quién sos como responsable de un proyecto.",
      opciones: [
        {
          id: "manual",
          etiqueta: "Escribir un manual y dejarlo disponible",
          detalle: "Todo lo aprendido, ordenado y entregable.",
          efectos: { proposito: 18, equipo: 10, entorno: 8, recursos: 2 },
          resultado: {
            texto:
              "Dejás el manual en la biblioteca del grupo. Es la decisión más barata y la única que hace que el proyecto sirva para alguien que no seas vos.",
            puntos: 34
          }
        },
        {
          id: "continuar",
          etiqueta: "Convertir el proyecto en el comienzo de otro",
          detalle: "No cerrar, dejar abierto.",
          requiere: { proposito: 65 },
          efectos: { proposito: 12, equipo: 8, entorno: 12, recursos: -8, logistica: -4 },
          resultado: {
            texto:
              "En vez de cerrar abrís la etapa siguiente y arrancás a buscar recursos otra vez. El proyecto original terminó y lo que sigue es más grande.",
            puntos: 30,
            variantes: [
              {
                si: { equipo: 60 },
                titulo: "Un equipo que ya sabe hacer esto",
                texto:
                  "Como el equipo quedó sólido, la etapa siguiente arrancó sin pelear con las dos cosas que más cuestan: definir y sostener.",
                puntos: 38
              }
            ]
          }
        },
        {
          id: "presentacion",
          etiqueta: "Hacer una gran presentación y festejar el cierre",
          detalle: "Motivación alta ahora, aprendizaje en el aire.",
          efectos: { equipo: 12, entorno: 10, proposito: 2, recursos: -2 },
          resultado: {
            texto:
              "La presentación es un gusto y el equipo se va feliz. Lo que aprendieron queda en la cabeza de seis personas y dentro de un año nadie lo recuerda.",
            puntos: 25
          }
        }
      ]
    }
  ],

  epilogos: [
    {
      activaSi: { entorno: 65 },
      texto:
        "Terminaste un proyecto y además dejaste un equipo que sabe hacer proyectos. Eso vale mucho más que el resultado concreto de esta vez."
    },
    {
      activaSi: { entorno: 35 },
      texto:
        "El proyecto se hizo, pero quedó más parecido a una actividad grande que a un proyecto. La próxima va a empezar mejor, si hay próxima."
    },
    {
      texto:
        "Llegaste al final de tu proyecto rover. No queda solo el resultado: quedan personas que aprendieron a hacer algo que antes no sabían hacer."
    }
  ]
};
