#!/usr/bin/env node
/*
 * Descarga una sola vez el texto completo de la Biblia en Español Sencillo (es-bes)
 * desde wldeh/bible-api (vía jsDelivr) y lo guarda como JSON local por libro en
 * data/bible/es-bes/, para que la app funcione sin depender de la CDN.
 *
 * Uso: node scripts/fetch-bible.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'bible', 'es-bes');

// Carga BOOKS, API_SLUG, normalize() y fileSlug() desde js/data.js sin duplicar datos.
const dataSrc = fs.readFileSync(path.join(ROOT, 'js', 'data.js'), 'utf8');
const sandbox = {};
new Function('exports', dataSrc + '\nexports.BOOKS=BOOKS; exports.API_SLUG=API_SLUG; exports.fileSlug=fileSlug;')(sandbox);
const { BOOKS, API_SLUG, fileSlug } = sandbox;

const MAX_CHAPTERS = 180; // por encima del libro más largo (Salmos, 150)
const BOOK_CONCURRENCY = 6;

async function fetchChapter(slug, chapter, attempt = 1){
  const url = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/es-bes/books/${encodeURIComponent(slug)}/chapters/${chapter}.json`;
  try{
    const res = await fetch(url);
    if(res.status === 404) return null;
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return (json.data || []).map(v => ({ verse: parseInt(v.verse, 10), text: v.text }));
  }catch(e){
    if(attempt < 3){
      await new Promise(r => setTimeout(r, 400 * attempt));
      return fetchChapter(slug, chapter, attempt + 1);
    }
    throw e;
  }
}

async function fetchBook(book){
  const slug = API_SLUG[book.n];
  const chapters = {};
  let chapter = 1;
  let misses = 0;
  while(chapter <= MAX_CHAPTERS && misses < 2){
    const verses = await fetchChapter(slug, chapter);
    if(verses === null || verses.length === 0){
      misses++;
    }else{
      misses = 0;
      chapters[chapter] = verses;
    }
    chapter++;
  }
  const chapterCount = Object.keys(chapters).length;
  const outPath = path.join(OUT_DIR, `${fileSlug(book)}.json`);
  fs.writeFileSync(outPath, JSON.stringify(chapters));
  console.log(`✔ ${String(book.o).padStart(2,'0')} ${book.n.padEnd(20)} ${chapterCount} capítulos`);
  return chapterCount;
}

async function runPool(items, concurrency, worker){
  const queue = [...items];
  let active = 0;
  return new Promise((resolve, reject) => {
    let finished = 0;
    function next(){
      if(queue.length === 0 && active === 0){ resolve(); return; }
      while(active < concurrency && queue.length){
        const item = queue.shift();
        active++;
        worker(item)
          .then(() => { active--; finished++; next(); })
          .catch(reject);
      }
    }
    next();
  });
}

(async function main(){
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Descargando ${BOOKS.length} libros (Biblia en Español Sencillo)...\n`);
  const start = Date.now();
  await runPool(BOOKS, BOOK_CONCURRENCY, fetchBook);
  const secs = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nListo en ${secs}s. Archivos en ${path.relative(ROOT, OUT_DIR)}/`);
})().catch(err => {
  console.error('Error descargando la Biblia:', err);
  process.exit(1);
});
