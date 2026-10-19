# ALIANZAS

**Generá alianzas y posicioná tu grupo como un actor de referencia.**

Juego web de decisiones por turnos para scouts. Son **tres aventuras distintas**, una por rol.
En cada una tomás entre 9 y 10 decisiones que mueven seis variables y terminás con un
puntaje que se guarda en un ranking propio.

| Aventura | Rol | De qué trata |
|---|---|---|
| 🛶 Rover | Sos quien propone y sostiene el proyecto | Armar un proyecto rover de punta a punta: propósito, equipo, recursos, permisos y seguridad |
| 🗺️ Educador scout | Mapeás el territorio y construís el vínculo | Mapear actores, elegir a quién acercarse y sostener la alianza después del primer proyecto |
| 🧭 Director de distrito | Articulás grupos e instituciones | Conectar los grupos del distrito entre sí y con las instituciones del territorio |

## Cómo se juega

1. En la home elegís la aventura y tocás **Comenzar**. No hace falta registrarse.
2. Jugás los 9 o 10 turnos.
3. Al final te aparece el puntaje y el rango.
4. Si querés entrar al ranking, completás tus datos (nombre, mail, celular, n.º de grupo,
   distrito, zona y n.º de afiliado) y se guarda la partida. El celular es el único campo
   opcional. Distrito y zona son números entre 1 y 100.
5. El ranking de la home está bloqueado hasta que cargas tus datos. También podés cargarlos
   ahí mismo sin haber jugado, si solo querés mirar el ranking.

Si ya cargaste tus datos, las siguientes partidas se guardan solas: no se te vuelve a pedir nada.

- Front-end estático (HTML + CSS + JS, sin dependencias ni build).
- Backend: Supabase (Postgres) con datos de contacto y ranking.
- Publicación: GitHub Pages.

## Estructura

```
index.html                     Inicio: elegir aventura y ranking
juego.html                     Partida: 9 o 10 turnos + resultado final
assets/css/estilos.css         Estilos (responsive)
assets/js/config.js            Textos, logo, Supabase, privacidad
assets/js/logo.js              Reemplaza el escudo del encabezado por la imagen
assets/img/                    Imágenes (logo, fotos de aventuras, escenarios)
assets/js/formulario.js        Los campos de datos (los mismos en la home y al final del juego)
assets/js/contenido-rover.js   >>> ESCENARIOS DE LA AVENTURA ROVER (se edita acá) <<<
assets/js/contenido-educador.js >>> ESCENARIOS DE LA AVENTURA EDUCADOR <<<
assets/js/contenido-distrito.js >>> ESCENARIOS DE LA AVENTURA DISTRITO <<<
assets/js/contenido.js         Junta los tres y expone los helpers
assets/js/motor.js             Motor de juego: variables, puntaje, rangos
assets/js/datos.js             Cliente de Supabase por REST + modo local sin backend
assets/js/ranking.js           Pintado de la tabla de ranking
assets/js/inicio.js            Lógica de index.html
assets/js/juego.js             Lógica de juego.html
supabase/schema.sql            Tablas, RLS y funciones RPC
```

El orden de los `<script>` importa: los tres archivos de contenido tienen que cargarse antes
de `contenido.js`, que es el que los junta.

## Puesta en marcha

### 1. Probar sin backend

Abrí `index.html` en el navegador. Como `supabase.url` está vacío en `config.js`, el juego
funciona en **modo local**: las partidas se guardan en el `localStorage` del navegador y cada
ranking muestra solo las partidas de esa máquina. Sirve para probar y para escribir contenido.

Para probarlo con un servidor local (más parecido al ambiente final):

```bash
python -m http.server 8000
```

y abrir `http://localhost:8000`. También funciona abrir el archivo directamente, salvo que
quieras probar el guardado en Supabase (necesita `http://` o `https://`, no `file://`).

### 2. Crear el proyecto en Supabase

1. Creá una cuenta en <https://supabase.com> y un proyecto nuevo (el plan gratuito alcanza).
2. Abrí **SQL Editor > New query**, pegá el contenido de `supabase/schema.sql` y ejecutalo.
3. En **Project Settings > API** copiá:
   - `Project URL` → `supabase.url`
   - `anon` `public` key → `supabase.anonKey`

### 3. Conectar el front

Editá `assets/js/config.js`:

```js
supabase: {
  url: "https://TU-PROYECTO.supabase.co",
  anonKey: "eyJhbGciOi..."
}
```

La `anon` key es pública y está pensada para ir en el navegador: la seguridad no depende de
ocultarla, sino de que el esquema no permita leer datos desde el cliente (ver más abajo).

### 4. Publicar en GitHub Pages

En la carpeta del proyecto, con git instalado:

```bash
git init
git add .
git commit -m "Primera versión del juego"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/alianza-estrategica.git
git push -u origin main
```

Después, en el repo: **Settings > Pages > Source: Deploy from a branch > main / (root)**.

La web queda en `https://TU-USUARIO.github.io/alianza-estrategica/`.

## Cómo escribir los escenarios

Cada partida se edita en su propio archivo. Un escenario tiene esta forma:

```js
{
  id: "primer-contacto",          // único, se usa en el historial
  etapa: "Contacto",               // etiqueta que se muestra arriba
  icono: "📞",
  titulo: "El primer llamado",
  texto: "Narrativa de la situación...",
  activaSi: { confianza: 60 },     // opcional: mínimo para que el turno aparezca
  activaSiMax: { confianza: 45 },  // opcional: máximo para que el turno aparezca
  opciones: [
    {
      id: "municipalidad",         // único dentro del escenario
      etiqueta: "Ir a la municipalidad",
      detalle: "Frase corta que aclara la decisión.",
      requiere: { confianza: 40 }, // opcional: si no se cumple, la opción aparece bloqueada
      efectos: { reputacion: 14, tiempo: -7 }, // cambios en las variables (se recortan entre 0 y 100)
      resultado: {
        texto: "Qué pasa si elegís esto...",
        puntos: 24,                // puntos de esta decisión
        variantes: [               // opcional: resultado distinto según el contexto
          { si: { reputacion: 60 }, titulo: "…", texto: "…", puntos: 31 }
        ]
      }
    }
  ]
}
```

Reglas del motor:

- Las variables de cada partida están en `metricas`, arriba del todo de su archivo. El `id` es
  el que se usa en `efectos`, `requiere` y `activaSi`; un `efecto` con un id inexistente se
  ignora silenciosamente.
- `peso` define cuánto vale cada variable en el puntaje final (de 1 a 4).
- `requiere` bloquea la opción y muestra qué falta. `activaSi` (mínimo) y `activaSiMax`
  (máximo) dejan un escenario fuera de la partida si no se cumple. Con 10 escenarios y dos
  condicionales, las partidas dan entre 8 y 10 turnos.
- `variantes` se evalúan en orden y gana la primera que cumple. Se evalúan **después** de
  aplicar los efectos de la opción, así que un `puntos: 31` sobre una base de 24 se muestra
  como "24 + 7 de contexto".
- Para cortar la partida antes de tiempo: `resultado.termina = true` y `resultado.despedida`.
- `epilogos` elige el cierre final según `activaSi` (la primera que se cumple).

El puntaje final es:

```
total = Σ puntos de cada decisión + Σ (valor de la variable × su peso)
porcentaje = total / puntaje máximo posible × 100
```

El máximo posible se calcula con el archivo de contenido, así que todos los jugadores de una
misma partida comparten el mismo denominador y el ranking es justo.

## Puntaje y balance

El puntaje es `Σ puntos de cada decisión + Σ (valor de la variable × su peso)`.

Los **puntos de una decisión** son lo que se gana en el momento; las **variables** son lo que
queda después. Por diseño, la opción que más puntos da casi nunca es la que más mejora las
variables: ganar hoy y sostener en el tiempo son decisiones distintas.

- `maximoReal` (en cada archivo de contenido) es el puntaje más alto que se puede lograr con
  esa partida. Es el 100%. La suma teórica de "todos los 30 puntos y todas las variables al
  100" no se puede alcanzar justamente porque son metas opuestas, así que el denominador es
  el máximo real: Rover 1350, Educador 1630, Distrito 1643.
- **Para recalibrar** después de cambiar los escenarios: poné un número cualquiera en
  `maximoReal`, probá, y ajustalo mirando cuánto marca el mejor jugador. Un método rápido es
  jugar las 3 combinations posibles por turno (unas 60.000 por partida) y quedarse con el mejor
  total; se hace en un segundo con un `for` recursivo sobre `Motor.elegirOpcion`.

Distribución aproximada con estos números:

| Cómo juega | Rover | Educador | Distrito |
|---|---|---|---|
| Al azar | 67–97% | 40–95% | 33–95% |
| Buscando siempre la de más puntos | 73% | 38% | 42% |
| Jugando pensando en el resultado final | 93% | 97% | 97% |

Los cortes de rango (97 / 88 / 74 / 56 / 38) salen de esa distribución: llegar a *Fogón
Compartido* requiere jugar casi perfecto.

## Rankings

Cada aventura tiene su propio ranking, con pestañas en la home. No hay ranking único a propósito:
las tres aventuras miden cosas distintas, así que un 80% de rover no se puede comparar con un 80%
de distrito.

**De cada persona solo cuenta su primera partida** en cada aventura. Las siguientes se juegan y
se ven igual, pero no se guardan, así que nadie puede subir al podio rejugando. Está implementado
en la función `registrar_partida` (y en el modo local de `datos.js`), y la pantalla final lo
avisa con claridad.

El ranking está detrás de los datos: hasta que la persona no los carga, la tabla no se muestra.

## Datos y privacidad

Se piden nombre, mail, celular, n.º de grupo, distrito, zona y n.º de afiliado (DNI), en un solo
formulario que se reutiliza en la home y al final de la partida (`assets/js/formulario.js`).
El celular es el único campo opcional; distrito y zona son números del 1 al 100.

- `contactos` guarda los siete campos. **Nunca se exponen al cliente**: la tabla tiene RLS
  activado y al rol `anon` se le revocó todo permiso directo. Solo se escriben a través de las
  funciones `registrar_contacto` y `registrar_partida`.
- `partidas` guarda aventura, nombre, puntaje y decisiones. El ranking lee nombre, puntaje,
  porcentaje, rango y fecha: nunca el mail ni el celular, ni el grupo, ni el DNI.
- El nombre es el único dato personal visible en el ranking. Si preferís anonimizarlo, poné
  `mostrarNombres: false` en `config.js`: se muestra "Juan P." en lugar del nombre completo.
- El consentimiento es obligatorio: si no se marca, el formulario no deja enviar y las funciones
  SQL rechazan el registro.
- Los datos del registro se guardan en `sessionStorage` (se pierden al cerrar la pestaña), no en
  el dispositivo de forma permanente.
- Completá el texto del consentimiento y la URL de la política de privacidad en `config.js`
  antes de publicar, y no cambies `textoConsentimiento` sin avisar a los participantes: el valor
  `version_consentimiento` guarda con qué versión aceptaron.
- Si querés que distrito y zona se completen con sugerencias en vez de texto libre, llená las
  listas en `config.js`:

```js
listas: {
  distrito: ["Distrito 1", "Distrito 2"],
  zona: ["San Telmo", "Villa Crespo"]
}
```

Limitaciones conocidas:

- `obtener_mi_puesto` permite consultar si un mail tiene partidas registradas en esa aventura.
  Para un juego interno no es problema; si se publica a internet, conviene agregarle un token de
  un solo uso por partida.
- No hay límite de intentos: alguien con un script podría cargar partidas falsas. Si hace
  falta, se agrega un rate limit en Supabase (o un CAPTCHA en el formulario).
- La base guarda el DNI en texto plano dentro de la fila. Si más adelante necesitás consultar
  o modificar esos datos, conviene cifrarlos o usar una tabla aparte con acceso restringido.

## Agregar una cuarta partida

1. Copiá `contenido-rover.js` como `contenido-<nuevo>.js` y cambiá `window.RECURSOS.<id>`.
2. Sumalo al array de `contenido.js` y a los `<script>` de `index.html` y `juego.html`.
3. Agregá el id a la lista permitida de la función `registrar_partida` en `supabase/schema.sql`
   (si ya ejecutaste el SQL, corré de nuevo el archivo: usa `create or replace`).

## Cambiar textos, imagen y colores

- Nombre del juego, organizacion, textos legales, logo y claves de Supabase: ssets/js/config.js.
- Logo: pone el archivo en ssets/img/ y apunta logo.archivo a el. Si el archivo no esta o
  falla la carga, vuelve el icono de reserva, asi el encabezado nunca queda vacio.
  logo.alto controla el alto en pixeles (por defecto 34).
- Colores: variables CSS al principio de ssets/css/estilos.css
  (--celeste, --celeste-claro, --fondo, --tinta, --ambar).
- Escala de puntaje y nombres de rango: RANGOS en ssets/js/motor.js.
