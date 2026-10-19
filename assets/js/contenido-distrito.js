window.RECURSOS = window.RECURSOS || {};

window.RECURSOS.distrito = {
  id: "distrito",
  nombre: "Director de distrito",
  rol: "Armás una alianza estratégica con una organización",
  icono: "⚜️",
  resumen:
    "Una alianza estratégica no se firma: se construye. Diez decisiones para llevar a tu distrito desde el primer contacto hasta un acuerdo que exista dentro de dos años.",
  maximoReal: 1643,
  objetivo:
      "Llegar al final con una alianza en pie, con condiciones que se puedan sostener sin vos y con los dos lados sabiendo qué poner en juego. El puntaje final suma los puntos de cada decisión y el estado final de las seis variables.",
  metricas: [
    { id: "confianza", etiqueta: "Confianza entre las partes", corto: "Confianza", peso: 4, valorInicial: 30 },
    { id: "alineacion", etiqueta: "Alineación de intereses", corto: "Alineación", peso: 3, valorInicial: 35 },
    { id: "compromiso", etiqueta: "Compromiso de los dos lados", corto: "Compromiso", peso: 3, valorInicial: 35 },
    { id: "viabilidad", etiqueta: "Viabilidad del acuerdo", corto: "Viabilidad", peso: 2, valorInicial: 40 },
    { id: "legitimidad", etiqueta: "Legitimidad interna", corto: "Legitimidad", peso: 2, valorInicial: 45 },
    { id: "sostenibilidad", etiqueta: "Sostenibilidad en el tiempo", corto: "Sostenibilidad", peso: 2, valorInicial: 35 }
  ],

  escenarios: [
    {
      id: "objetivo",
      etapa: "Punto de partida",
      icono: "🎯",
      titulo: "Qué querés que sea esta alianza",
      texto:
        "Antes de hablar con nadie hay que tener una idea de qué se negocia. Distintas organizaciones quieren cosas distintas con la misma palabra alianza, y empezar sin saberlo es la forma más rápida de fracasar.",
      opciones: [
        {
          id: "vago",
          etiqueta: "Plantearlo como una alianza general",
          detalle: "Palabras amplias y sin condiciones.",
          efectos: { alineacion: -10, viabilidad: -8, confianza: -4, legitimidad: 4 },
          resultado: {
            texto:
              "La idea suena bien y no obliga a nadie. Cuando haya que sentarse a negociar, cada parte va a entender una cosa distinta y nadie va a ceder.",
            puntos: 25
          }
        },
        {
          id: "concreto",
          etiqueta: "Definir qué se busca y qué se pone",
          detalle: "Una frase con un objetivo y un compromiso de cada lado.",
          efectos: { alineacion: 16, viabilidad: 12, confianza: 6, legitimidad: 4 },
          resultado: {
            texto:
              "Escribís qué querés conseguir y qué estás dispuesto a aportar. Es lo más difícil de toda la negociación y lo único que hace que valga la pena hacerla.",
            puntos: 20,
            variantes: [
              {
                si: { alineacion: 65 },
                titulo: "Un acuerdo que se puede explicar en dos minutos",
                texto:
                  "Cuando lo contás, los dos lados usan las mismas palabras. Eso evita la mitad de los malentendidos antes de que ocurran.",
                puntos: 37
              }
            ]
          }
        },
        {
          id: "imponer",
          detalle: "Llegar con la decisión tomada y sin espacio a réplica.",
          detalle: "Llegar con la decisión tomada.",
          efectos: { alineacion: -6, legitimidad: -12, confianza: -10, viabilidad: 4 },
          resultado: {
            texto:
              "Presentás un acuerdo cerrado y pedís una firma. La respuesta inmediata es que no, y además queda claro que no hay nada que negociar.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "diagnostico",
      etapa: "Diagnóstico",
      icono: "🔎",
      titulo: "Con quién hablar",
      texto:
        "La organización tiene tres áreas y nadie sabe cuál maneja el tema. Hablar con la que no decide consume meses y da la impresión de que no entendiste cómo funcionan.",
      opciones: [
        {
          id: "area-temica",
          etiqueta: "Ir directo al área que maneja el tema",
          detalle: "La que entiende el contenido pero no decide.",
          efectos: { alineacion: 10, confianza: 8, viabilidad: -4, legitimidad: 2 },
          resultado: {
            texto:
              "Te reconstruyen el problema mejor que nadie y te pasan el caso con dos páginas de adjuntos. Cuando por fin llegás a la decisión, el área ya te defiende.",
            puntos: 25
          }
        },
        {
          id: "direccion",
          etiqueta: "Pedir cita con la dirección",
          detalle: "La que decide, y también la que hace esperar.",
          efectos: { viabilidad: 12, legitimidad: 10, confianza: -4, compromiso: -6 },
          resultado: {
            texto:
              "La dirección te recibe, escucha y toma nota. También te pide que mandes un resumen por escrito, y ese resumen pesa más que toda la reunión.",
            puntos: 25
          }
        },
        {
          id: "preguntar",
          etiqueta: "Preguntar antes de pedir la cita",
          detalle: "Una llamada previa que evita meses perdidos.",
          requiere: { alineacion: 40 },
          efectos: { alineacion: 14, viabilidad: 10, confianza: 6, legitimidad: 4 },
          resultado: {
            texto:
              "Una llamada de cinco minutos te dice a quién hablar y con qué argumento. Es la hora más rentable de toda la gestión.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "propuesta",
      etapa: "Propuesta",
      icono: "📄",
      titulo: "La propuesta",
      texto:
        "Tenés la primera reunión y hay que decir qué proponés. Un documento de ocho páginas y una hoja leída en voz alta terminan en resultados muy distintos.",
      opciones: [
        {
          id: "documento",
          etiqueta: "Llevar un documento formal y completo",
          detalle: "Ocho páginas, anexos y un marco de trabajo.",
          efectos: { viabilidad: 10, legitimidad: 10, confianza: -4, compromiso: -6 },
          resultado: {
            texto:
              "El documento se ve profesional y demuestra que lo tomó en serio. También les da para pedir cambios en todo y no volver a leerlo.",
            puntos: 25
          }
        },
        {
          id: "mesa-chica",
          etiqueta: "Llevar una hoja con una pregunta sola",
          detalle: "Qué necesitamos de ustedes, y nada más.",
          efectos: { alineacion: 14, confianza: 12, compromiso: 8, viabilidad: -4 },
          resultado: {
            texto:
              "Una sola pregunta bien puesta hace que la otra parte empiece a decir qué necesita. La reunión termina con más información de la que esperabas.",
            puntos: 20
          }
        },
        {
          id: "sorpresa",
          etiqueta: "Plantear una idea que no estaba en el guion",
          detalle: "Improvisar para ver cómo reaccionan.",
          efectos: { confianza: -10, alineacion: -8, compromiso: -4, legitimidad: 4 },
          resultado: {
            texto:
              "Sorprendés con algo que no habías preparado. La reacción es interesante, y también queda claro que no tenés un plan.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "interes",
      etapa: "Negociación",
      icono: "⚖️",
      titulo: "Qué quieren ellos",
      texto:
        "En la segunda reunión te piden explícitamente qué trae la organización a cambio. La respuesta honesta es que no sabés todavía, y el silencio dura más de lo que parece.",
      opciones: [
        {
          id: "honesto",
          etiqueta: "Decir que no sabés y buscar juntos",
          detalle: "Admite la debilidad pero abre el trabajo.",
          requiere: { confianza: 45 },
          efectos: { confianza: 16, alineacion: 12, compromiso: 10, viabilidad: -4 },
          resultado: {
            texto:
              "Decís que todavía no lo definiste y proponés buscarlo juntos. Cuesta un momento de debilidad y a cambio empieza la negociación real.",
            puntos: 20
          }
        },
        {
          id: "sobreoferta",
          etiqueta: "Ofrecer más de lo que tenés",
          detalle: "Prometer para que quede bien ahora.",
          efectos: { confianza: -6, viabilidad: -10, compromiso: 8, legitimidad: -8 },
          resultado: {
            texto:
              "Ofrecés cosas que no podes cumplir. Te atrasas una vez, y a la segunda eligen a otro porque la palabra ya no sirve.",
            puntos: 30
          }
        },
        {
          id: "defensa",
          etiqueta: "Defender lo que ya estás ofreciendo",
          detalle: "Lo que ya hiciste alcanza.",
          efectos: { alineacion: 8, viabilidad: 6, confianza: -4, legitimidad: 4 },
          resultado: {
            texto:
              "Insistís en que lo que ya ofreciste es suficiente. Pasa con algunos proyectos y con otros no, y con otros no te lo dicen nunca.",
            puntos: 25
          }
        }
      ]
    },
    {
      id: "piloto",
      etapa: "Prueba",
      icono: "🧪",
      titulo: "La prueba de los tres meses",
      texto:
        "Ninguna organización firma un acuerdo grande sin una prueba previa. Los tres meses son la oportunidad de demostrar que la alianza funciona, y también de descubrir que no funciona.",
      opciones: [
        {
          id: "minimo",
          etiqueta: "Probar con lo mínimo",
          detalle: "Una actividad chica, sin exposición.",
          efectos: { viabilidad: 10, sostenibilidad: 8, compromiso: -8, legitimidad: -4 },
          resultado: {
            texto:
              "La prueba pasa desapercibida y nadie la ve. No pasa nada, y eso también es un problema: no hay evidencia para pedir más.",
            puntos: 25
          }
        },
        {
          id: "visibles",
          etiqueta: "Hacerla visible y bien hecha",
          detalle: "Una actividad que se vea, con fecha y con nombres.",
          requiere: { compromiso: 45 },
          efectos: { compromiso: 16, legitimidad: 14, sostenibilidad: 10, viabilidad: 6 },
          resultado: {
            texto:
              "La prueba sale bien, se ve y queda documentada. Al final de los tres meses hay dos cosas que la otra parte puede decir sobre vos: que cumplís.",
            puntos: 20,
            variantes: [
              {
                si: { confianza: 60 },
                titulo: "La prueba que abre la puerta",
                texto:
                  "Después de los tres meses la conversación dejó de ser sobre el proyecto y pasó a ser sobre la alianza. Ese cambio de tema es todo.",
                puntos: 38
              }
            ]
          }
        },
        {
          id: "aplazar",
          etiqueta: "Pedir que la prueba empiece más adelante",
          detalle: "Esperar a tener todo listo.",
          efectos: { viabilidad: -6, sostenibilidad: -8, compromiso: -6, confianza: -6 },
          resultado: {
            texto:
              "Pedís que la prueba empiece cuando el proyecto esté listo. Casi nunca llega ese momento, y mientras tanto no hay nada que mostrar.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "dificultad",
      etapa: "Fricción",
      icono: "🧨",
      titulo: "La primera dificultad de verdad",
      activaSiMax: { confianza: 65 },
      texto:
        "En la prueba pasa algo que no estaba previsto: un costo que no estaba calculado, una fecha que se corrió, un reclamo de una familia. Nadie lo hizo a propósito, pero la prueba es ahora un problema.",
      opciones: [
        {
          id: "asumir",
          etiqueta: "Asumirlo y corregirlo con el otro",
          detalle: "Decir qué pasó, qué se cambió y por qué.",
          requiere: { confianza: 50 },
          efectos: { confianza: 16, sostenibilidad: 14, viabilidad: 8, legitimidad: -4 },
          resultado: {
            texto:
              "Contás el problema con sus nombres y proponés el cambio. La otra parte ve que no escondés nada, y eso vale más que un resultado sin errores.",
            puntos: 20
          }
        },
        {
          id: "esconder",
          etiqueta: "Resolverlo por debajo y no decir nada",
          detalle: "Que no se note hasta que se pase.",
          efectos: { confianza: -12, sostenibilidad: -8, viabilidad: 4, compromiso: -6 },
          resultado: {
            texto:
              "Lo arreglás por tu cuenta y no lo mencionás. Funciona esta vez. La próxima, cuando se entere, va a recordar todas las veces que le dijiste que estaba todo bien.",
            puntos: 25
          }
        },
        {
          id: "culpa",
          etiqueta: "Buscar de quién fue la culpa",
          detalle: "Que quede claro que no fue tu decisión.",
          efectos: { confianza: -10, alineacion: -8, legitimidad: -6, viabilidad: -4 },
          resultado: {
            texto:
              "La conversación deja de ser sobre el problema y pasa a ser sobre quién lo causó. El problema sigue igual y ahora los dos están ofendidos.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "alcance",
      etapa: "Definición",
      icono: "⚙️",
      titulo: "Hasta dónde llega la alianza",
      texto:
        "Si la alianza funciona, aparecen cinco propuestas nuevas. Cada una amplía el alcance y también aumenta el compromiso que estás asumiendo sin que nadie te lo pida en voz alta.",
      opciones: [
        {
          id: "ampliar",
          etiqueta: "Ampliar el alcance a todo lo que funciona",
          detalle: "Crecer rápido mientras hay impulso.",
          efectos: { viabilidad: -8, sostenibilidad: -10, compromiso: 10, alineacion: 6 },
          resultado: {
            texto:
              "La alianza crece y con ella tus obligaciones. En seis meses las dos partes están haciendo trabajo que no está escrito en ningún documento.",
            puntos: 18
          }
        },
        {
          id: "acotar",
          etiqueta: "Acotar a lo que funciona y seguir",
          detalle: "Preferir poco y previsible.",
          efectos: { viabilidad: 12, sostenibilidad: 12, compromiso: 6, alineacion: -4 },
          resultado: {
            texto:
              "Firman solo el alcance que funciona y dejan por escrito lo que no incluye. Es la decisión menos vistosa y la que evita que la alianza se desborde.",
            puntos: 30
          }
        },
        {
          id: "intermedio",
          etiqueta: "Ampliar una sola cosa y revisar a los seis meses",
          detalle: "Crecer un poco y poner un límite de tiempo.",
          efectos: { alineacion: 8, viabilidad: 6, sostenibilidad: 6, compromiso: 6 },
          resultado: {
            texto:
              "Sumás un proyecto más y dejás agendada una revisión. Funciona mientras los dos la mantienen en la agenda.",
            puntos: 27
          }
        }
      ]
    },
    {
      id: "publico",
      etapa: "Legitimidad",
      icono: "🔉",
      titulo: "Contarlo o no contarlo",
      texto:
        "La alianza funciona y tenés que decidir cuándo y cómo se anuncia. También tenés que decidir si la comunidad lo sabe antes o después.",
      opciones: [
        {
          id: "a-tiempo",
          etiqueta: "Anunciarlo recién cuando esté firmado",
          detalle: "Primero los hechos, después la consola.",
          requiere: { viabilidad: 45 },
          efectos: { legitimidad: 14, sostenibilidad: 12, compromiso: 8, confianza: -4 },
          resultado: {
            texto:
              "El anuncio sale junto con el acuerdo firmado y con números detrás. Nadie puede decir que se avisó antes y la legitimidad queda respaldada.",
            puntos: 20
          }
        },
        {
          id: "comunidad-primero",
          etiqueta: "Contárselo primero a la comunidad",
          detalle: "La gente se entera antes que los canales.",
          efectos: { legitimidad: 10, confianza: 10, compromiso: -6, viabilidad: -4 },
          resultado: {
            texto:
              "Lo contás en la reunión del distrito antes de que exista el comunicado. La comunidad se siente parte, y también empieza a pedir cosas concretas.",
            puntos: 25
          }
        },
        {
          id: "sin-anuncio",
          etiqueta: "Trabajar en silencio hasta que dé fruto",
          detalle: "Sin comunicado, sin foto, sin nada.",
          efectos: { legitimidad: -10, sostenibilidad: -6, confianza: -4, compromiso: -4 },
          resultado: {
            texto:
              "No se anuncia nada hasta que funcione. Cuando por fin se habla, nadie recuerda que existió y parece que salió de la nada.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "interlocutor",
      etapa: "Gestión",
      icono: "📋",
      titulo: "Cuando cambia la persona",
      texto:
        "La persona con la que venías armando la alianza deja el lugar y entra otra con otra forma de trabajar. El acuerdo sigue en pie, pero hay que volver a empezar la conversación con alguien nuevo.",
      opciones: [
        {
          id: "trasladar",
          etiqueta: "Trasladar todo lo acordado a la persona nueva",
          detalle: "Una reunión sola para ponerla al día.",
          requiere: { legitimidad: 45 },
          efectos: { sostenibilidad: 16, alineacion: 12, confianza: 8, compromiso: -6 },
          resultado: {
            texto:
              "Le llevás el documento de lo acordado y en una reunión le queda claro en qué punto están. Es la forma más rápida de no perder lo construido.",
            puntos: 20
          }
        },
        {
          id: "cero",
          etiqueta: "Empezar de cero con quien llega",
          detalle: "Nuevo interlocutor, arranque limpio.",
          efectos: { alineacion: 8, legitimidad: -8, sostenibilidad: -8, confianza: -6 },
          resultado: {
            texto:
              "Trato de renegociar todo desde el principio. La nueva persona conoce el programa mejor que vos y lo deja más claro.",
            puntos: 25
          }
        },
        {
          id: "esperar",
          etiqueta: "Esperar a que se acomode sola",
          detalle: "No forzar una reunión que nadie pidió.",
          efectos: { confianza: -6, sostenibilidad: -10, alineacion: -6, compromiso: -4 },
          resultado: {
            texto:
              "Esperás a que la nueva persona se acomode. Pasan dos meses en los que la alianza queda en pausa y nadie sabe si sigue en pie.",
            puntos: 30
          }
        }
      ]
    },
    {
      id: "cierre",
      etapa: "Cierre",
      icono: "🤝",
      titulo: "El acuerdo que queda",
      texto:
        "Se cumple el primer año y toca decidir la forma final. Hay tres maneras de terminar: un documento marco, un acuerdo anual o nada firmado y un trabajo que se sostiene igual.",
      opciones: [
        {
          id: "marco",
          etiqueta: "Un acuerdo marco con revisión anual",
          detalle: "General, con una fecha de revisión encima.",
          efectos: { sostenibilidad: 18, legitimidad: 14, viabilidad: 10, alineacion: 8 },
          resultado: {
            texto:
              "Un documento marco, con una revisión anual escrita. Es la forma más paciente de construir una alianza y la que mejor sobrevive a los cambios de gente.",
            puntos: 34
          }
        },
        {
          id: "anual",
          etiqueta: "Un acuerdo anual con metas concretas",
          detalle: "Corto, con dos objetivos verificables.",
          requiere: { confianza: 55 },
          efectos: { sostenibilidad: 14, compromiso: 14, viabilidad: 10, alineacion: 10 },
          resultado: {
            texto:
              "Un documento corto con dos metas y una fecha. Se renueva por períodos y obliga a las dos partes a hablar todos los años, que es justo lo que mantiene viva una alianza.",
            puntos: 33,
            variantes: [
              {
                si: { compromiso: 60 },
                titulo: "Una alianza que se renueva sola",
                texto:
                  "Con el equipo sólido y las metas cumplidas, el segundo período arranca sin ninguna de las dudas del primero.",
                puntos: 39
              }
            ]
          }
        },
        {
          id: "nada",
          etiqueta: "No firmar nada y seguir trabajando juntos",
          detalle: "La alianza existe igual, sin papeles.",
          efectos: { sostenibilidad: -8, legitimidad: -12, viabilidad: 6, compromiso: 4 },
          resultado: {
            texto:
              "Seguí trabajando con la organización sin firmar nada. Funciona hasta que alguien se va y nadie sabe qué estaba acordado.",
            puntos: 20
          }
        }
      ]
    }
  ],

  epilogos: [
    {
      activaSi: { confianza: 65 },
      texto:
        "Dejaste una alianza donde los dos lados pueden explicar qué hacen juntos sin tener que consultarte. Eso es lo único que la hace duradera."
    },
    {
      activaSi: { confianza: 30 },
      texto:
        "Hubo buenas intenciones y mucho trabajo, pero la alianza quedó en manos de personas concretas. Si esas personas se van, hay que empezar otra vez."
    },
    {
      texto:
        "Llegaste al final. Más allá del documento firmado, lo que queda es si la otra parte sigue trabajando con vos cuando ya no estás."
    }
  ]
};
