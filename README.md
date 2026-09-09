# Biblia Rápida

App local para consultar cualquier cita bíblica al instante, aprender los 66 libros (orden, categoría, autor y tema) y practicar con quizzes.

## Cómo usarla

No necesita instalación ni build, ni conexión a internet para el texto bíblico (va incluido en el proyecto):

```bash
cd biblia-rapida
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`. También puedes abrir `index.html` directamente con doble clic, aunque un servidor local evita restricciones de algunos navegadores con `file://`.

## Estructura

```
index.html         Estructura de las 4 pestañas: Buscar, Estudiar, Quiz, Progreso
css/styles.css      Diseño (cubierta de cuero, pestañas de canto, tarjetas)
js/data.js          Los 66 libros, categorías, alias de búsqueda ("Sal", "1 Co"...)
js/store.js         Progreso guardado en localStorage del navegador
js/search.js        Parser de citas + lectura de versículos locales
js/study.js         Tarjetas de estudio con flip
js/quiz.js          Quiz de orden y de categoría
js/progress.js      Panel de progreso
js/app.js           Navegación entre pestañas
data/bible/es-bes/  Texto completo de la Biblia, un JSON por libro (~4.7 MB)
scripts/fetch-bible.js  Script para regenerar data/bible/es-bes/ (uso único)
```

## Fuente de datos

Texto de la **Biblia en Español Sencillo**, descargado una sola vez de [wldeh/bible-api](https://github.com/wldeh/bible-api) y guardado localmente en `data/bible/es-bes/` (66 archivos JSON, uno por libro, ~4.7 MB en total). La app lee esos archivos directamente — no depende de ninguna API externa para buscar o estudiar.

Si en el futuro quieres cambiar de traducción o refrescar el texto, corre:

```bash
node scripts/fetch-bible.js
```

(el script vuelve a leer `js/data.js` para saber qué libros y slugs usar, así que no hay que tocarlo).

El progreso, favoritos y mejores puntajes se guardan solo en tu navegador (localStorage), nunca salen de tu equipo.
