/* Lectura continua: índice de libro/capítulo (como el canto de la Biblia), navegación con
   efecto de pasar página, gesto de swipe en celular, recordar dónde te quedaste, y un
   modo de lectura paginada (sin scroll) que mide el texto y lo corta en páginas exactas. */

let readerState = { book: null, chapter: null, isFirstOverall: false, isLastOverall: false };
let currentReaderFilter = 'all';
let readerPickerBook = null;

let paginatedPages = [];
let paginatedIndex = 0;
let paginationMeasureEl = null;
const paginationCache = {};

function isLeerVisible(){
  const el = document.getElementById('page-leer');
  return !!el && !el.hidden;
}

/* ---------- Índice de libro/capítulo ---------- */

function bindReaderThumbIndex(){
  renderThumbIndex(currentReaderFilter, (cat) => {
    currentReaderFilter = cat;
    renderReaderBookGrid(cat);
    bindReaderThumbIndex();
  });
}

function renderReaderBookGrid(filter){
  const box = document.getElementById('reader-book-grid');
  const cats = filter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === filter);
  box.innerHTML = cats.map(cat => {
    const books = BOOKS.filter(b => b.cat === cat.id);
    return `<div class="picker-cat-block">
      <div class="picker-cat-title" style="--cat-color:${cat.color}">${cat.name}</div>
      <div class="book-chip-row">${books.map(b => `<button class="book-chip ${readerPickerBook && readerPickerBook.o === b.o ? 'active' : ''}" data-order="${b.o}" style="--cat-color:${cat.color}">${b.n}</button>`).join('')}</div>
    </div>`;
  }).join('');
  box.querySelectorAll('.book-chip').forEach(btn => {
    btn.addEventListener('click', () => pickReaderBook(BOOKS.find(b => b.o === parseInt(btn.dataset.order, 10))));
  });
}

async function pickReaderBook(book){
  readerPickerBook = book;
  document.querySelectorAll('#reader-book-grid .book-chip').forEach(c => {
    c.classList.toggle('active', parseInt(c.dataset.order, 10) === book.o);
  });
  const chaptersBox = document.getElementById('reader-chapters');
  chaptersBox.hidden = false;
  chaptersBox.innerHTML = '<p class="search-loading">Cargando capítulos…</p>';
  const data = await fetchBookData(book);
  const chapters = Object.keys(data).map(Number).sort((a, b) => a - b);
  chaptersBox.innerHTML = chapters.map(c => `<button class="chapter-chip ${readerState.book && readerState.book.o === book.o && readerState.chapter === c ? 'active' : ''}" data-chapter="${c}">${c}</button>`).join('');
  chaptersBox.querySelectorAll('.chapter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const chapter = parseInt(btn.dataset.chapter, 10);
      closePicker();
      openReader(book, chapter, null);
    });
  });
  chaptersBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openPicker(){
  document.getElementById('reader-picker').hidden = false;
  document.getElementById('reader-stage').hidden = true;
  document.getElementById('thumb-index').hidden = false;
  readerPickerBook = readerState.book;
  bindReaderThumbIndex();
  renderReaderBookGrid(currentReaderFilter);
  if(readerPickerBook) pickReaderBook(readerPickerBook);
}

function closePicker(){
  document.getElementById('reader-picker').hidden = true;
  document.getElementById('reader-stage').hidden = false;
  document.getElementById('thumb-index').hidden = true;
}

function syncReaderThumbVisibility(){
  const pickerOpen = !document.getElementById('reader-picker').hidden;
  document.getElementById('thumb-index').hidden = !pickerOpen;
  if(pickerOpen) bindReaderThumbIndex();
}

/* ---------- Render: modo continuo (con scroll normal) ---------- */

function renderReaderContent(book, chapter, verses){
  const versesHtml = verses.map((v, i) => `<p class="verse${i === 0 ? ' drop-cap' : ''}"><sup>${v.verse}</sup>${v.text}</p>`).join('');
  document.getElementById('reader-content').innerHTML = `
    <article class="verse-card reader-card">
      <div class="verse-card-head"><h2>${book.n} ${chapter}</h2></div>
      <div class="verse-body">${versesHtml}</div>
      <p class="verse-source">Biblia en Español Sencillo</p>
    </article>
  `;
}

/* ---------- Render: modo paginado (sin scroll) ---------- */

function ensureMeasureEl(){
  if(paginationMeasureEl) return paginationMeasureEl;
  const el = document.createElement('div');
  el.className = 'pagination-measure';
  document.body.appendChild(el);
  paginationMeasureEl = el;
  return el;
}

function computePageHeight(){
  const wrap = document.getElementById('reader-page-wrap');
  // Posición respecto al documento (no al viewport actual): así el cálculo no depende
  // de en qué punto del scroll estuviéramos parados justo antes de repaginar.
  const top = wrap.getBoundingClientRect().top + window.scrollY;
  const viewportH = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  const bottomMargin = 30;
  return Math.max(220, Math.floor(viewportH - top - bottomMargin));
}

function setupPaginatedLayout(enable){
  const wrap = document.getElementById('reader-page-wrap');
  if(enable){
    wrap.classList.add('paginated');
    wrap.style.height = computePageHeight() + 'px';
  }else{
    wrap.classList.remove('paginated');
    wrap.style.height = '';
  }
}

/* Mide el texto verso a verso en un elemento oculto y corta páginas que caben exactas
   en la altura disponible, sin partir un versículo a la mitad. Se guarda en caché por
   libro+capítulo+tamaño para no volver a medir si no cambió nada. */
function paginateVerses(book, chapter, verses){
  const width = document.getElementById('reader-content').clientWidth;
  const height = computePageHeight();
  const cacheKey = `${book.o}|${chapter}|${width}x${height}`;
  if(paginationCache[cacheKey]) return paginationCache[cacheKey];

  const measure = ensureMeasureEl();
  measure.style.width = width + 'px';
  measure.innerHTML = `<article class="verse-card reader-card"><div class="verse-card-head"><h2>${book.n} ${chapter}</h2></div><div class="verse-body"></div></article>`;
  const headEl = measure.querySelector('.verse-card-head');
  const bodyEl = measure.querySelector('.verse-body');
  const cardEl = measure.querySelector('.reader-card');

  const pages = [];
  let current = [];

  for(let i = 0; i < verses.length; i++){
    const v = verses[i];
    const isVeryFirstVerse = pages.length === 0 && current.length === 0;
    const p = document.createElement('p');
    p.className = 'verse' + (isVeryFirstVerse ? ' drop-cap' : '');
    p.innerHTML = `<sup>${v.verse}</sup>${v.text}`;
    bodyEl.appendChild(p);

    if(cardEl.scrollHeight > height && current.length > 0){
      bodyEl.removeChild(p);
      pages.push(current);
      current = [v];
      headEl.style.display = 'none';
      bodyEl.innerHTML = `<p class="verse"><sup>${v.verse}</sup>${v.text}</p>`;
    }else{
      current.push(v);
    }
  }
  if(current.length) pages.push(current);
  if(!pages.length) pages.push([]);

  paginationCache[cacheKey] = pages;
  return pages;
}

function renderPaginatedPage(book, chapter, pages, index){
  const page = pages[index] || [];
  const isFirstPage = index === 0;
  const versesHtml = page.map((v, i) => {
    const dropCap = (isFirstPage && i === 0) ? ' drop-cap' : '';
    return `<p class="verse${dropCap}"><sup>${v.verse}</sup>${v.text}</p>`;
  }).join('');
  const headingHtml = isFirstPage ? `<div class="verse-card-head"><h2>${book.n} ${chapter}</h2></div>` : '';
  document.getElementById('reader-content').innerHTML = `
    <article class="verse-card reader-card">
      ${headingHtml}
      <div class="verse-body">${versesHtml}</div>
    </article>
  `;
}

/* Recalcula la paginación del capítulo actual (por ejemplo tras un resize o al volver
   a la pestaña Leer) intentando mantener el mismo punto de lectura en vez de reiniciar. */
function ensurePaginatedVisible(){
  if(!readerState.book || !state.settings.paginatedReading || !isLeerVisible()) return;
  const anchorVerse = (paginatedPages[paginatedIndex] && paginatedPages[paginatedIndex][0]) ? paginatedPages[paginatedIndex][0].verse : 1;
  setupPaginatedLayout(true);
  fetchBookData(readerState.book).then(data => {
    const verses = data[readerState.chapter];
    const pages = paginateVerses(readerState.book, readerState.chapter, verses);
    paginatedPages = pages;
    let newIndex = pages.findIndex(p => p.length && p[0].verse >= anchorVerse);
    if(newIndex === -1) newIndex = pages.length - 1;
    paginatedIndex = Math.max(0, newIndex);
    renderPaginatedPage(readerState.book, readerState.chapter, pages, paginatedIndex);
    updateReaderNav(readerState.book, readerState.chapter);
    updatePageIndicator();
  });
}

/* Se llama cuando se entra a la pestaña Leer: si el contenido se había cargado oculto
   (sin poder medir), lo procesa recién ahora; si no, solo reajusta por si cambió el tamaño. */
function onLeerShown(){
  if(!readerState.book || !state.settings.paginatedReading) return;
  requestAnimationFrame(() => {
    const wrap = document.getElementById('reader-page-wrap');
    if(!wrap.classList.contains('paginated')){
      applyReaderContent(readerState.book, readerState.chapter, false);
    }else{
      ensurePaginatedVisible();
    }
  });
}

let resizeTimer = null;
function initReaderResize(){
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(ensurePaginatedVisible, 200);
  });
}

/* ---------- Navegación e indicadores ---------- */

function updatePageIndicator(){
  const el = document.getElementById('reader-page-indicator');
  const paginated = state.settings.paginatedReading && document.getElementById('reader-page-wrap').classList.contains('paginated');
  if(paginated && paginatedPages.length > 1){
    el.hidden = false;
    el.textContent = `Página ${paginatedIndex + 1} de ${paginatedPages.length}`;
  }else{
    el.hidden = true;
  }
}

function updateReaderNav(book, chapter){
  document.getElementById('reader-current-label').textContent = `${book.n} ${chapter}`;
  const paginated = state.settings.paginatedReading && document.getElementById('reader-page-wrap').classList.contains('paginated');
  const isFirst = paginated ? (readerState.isFirstOverall && paginatedIndex === 0) : readerState.isFirstOverall;
  const isLast = paginated ? (readerState.isLastOverall && paginatedIndex === paginatedPages.length - 1) : readerState.isLastOverall;
  document.getElementById('reader-prev').disabled = isFirst;
  document.getElementById('reader-next').disabled = isLast;
}

function prefersReducedMotion(){
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

async function withPageTurnAnimation(direction, renderFn){
  const content = document.getElementById('reader-content');
  const animate = direction && state.settings.pageTurnEffect && !prefersReducedMotion();
  if(animate){
    const outClass = direction === 'next' ? 'page-anim-out-next' : 'page-anim-out-prev';
    const inClass = direction === 'next' ? 'page-anim-in-next' : 'page-anim-in-prev';
    content.classList.add(outClass);
    await new Promise(resolve => content.addEventListener('animationend', resolve, { once: true }));
    content.classList.remove(outClass);
    await renderFn();
    content.classList.add(inClass);
    content.addEventListener('animationend', () => content.classList.remove(inClass), { once: true });
  }else{
    await renderFn();
  }
}

async function applyReaderContent(book, chapter, startAtEnd){
  const content = document.getElementById('reader-content');
  try{
    const data = await fetchBookData(book);
    const chapters = Object.keys(data).map(Number).sort((a, b) => a - b);
    const verses = data[chapter];
    readerState.isFirstOverall = book.o === BOOKS[0].o && chapter === chapters[0];
    readerState.isLastOverall = book.o === BOOKS[BOOKS.length - 1].o && chapter === chapters[chapters.length - 1];

    if(state.settings.paginatedReading && isLeerVisible()){
      setupPaginatedLayout(true);
      if(verses.length > 40){
        content.innerHTML = '<p class="search-loading">Paginando…</p>';
        await new Promise(r => requestAnimationFrame(r));
      }
      const pages = paginateVerses(book, chapter, verses);
      paginatedPages = pages;
      paginatedIndex = startAtEnd ? pages.length - 1 : 0;
      renderPaginatedPage(book, chapter, pages, paginatedIndex);
    }else{
      setupPaginatedLayout(false);
      paginatedPages = [];
      paginatedIndex = 0;
      renderReaderContent(book, chapter, verses);
    }
    updateReaderNav(book, chapter);
    updatePageIndicator();
  }catch(e){
    content.innerHTML = `<p class="search-hint">No pudimos cargar ${book.n} ${chapter}.</p>`;
    readerState.isFirstOverall = true;
    readerState.isLastOverall = true;
    paginatedPages = [];
    updateReaderNav(book, chapter);
    updatePageIndicator();
  }
}

async function openReader(book, chapter, direction, startAtEnd){
  readerState.book = book;
  readerState.chapter = chapter;
  state.lastRead = { bookOrder: book.o, chapter };
  saveState();

  await withPageTurnAnimation(direction, () => applyReaderContent(book, chapter, startAtEnd));
  repositionReaderIfNeeded();
}

/* Vuelve a aplicar el contenido actual en el modo de lectura vigente (se usa al
   cambiar la opción de paginado en Opciones). */
async function refreshReaderMode(){
  if(!readerState.book) return;
  await applyReaderContent(readerState.book, readerState.chapter, false);
}

/* Solo reubica el scroll si el lector quedó muy lejos del inicio del capítulo
   (por ejemplo, tras llegar al final de uno largo). Si ya está a la vista, no toca
   nada. En modo paginado no hay scroll que reubicar. */
function repositionReaderIfNeeded(){
  const wrap = document.getElementById('reader-page-wrap');
  const top = wrap.getBoundingClientRect().top;
  if(top < -20 || top > 140){
    wrap.scrollIntoView({ block: 'start' });
  }
}

/* ---------- Cambiar de capítulo ---------- */

async function gotoNextChapter(){
  if(document.getElementById('reader-next').disabled) return;
  const { book, chapter } = readerState;
  const data = await fetchBookData(book);
  const chapters = Object.keys(data).map(Number).sort((a, b) => a - b);
  const maxChapter = chapters[chapters.length - 1];
  if(chapter < maxChapter){
    openReader(book, chapter + 1, 'next');
  }else{
    const nextBook = BOOKS.find(b => b.o === book.o + 1);
    if(nextBook) openReader(nextBook, 1, 'next');
  }
}

async function gotoPrevChapter(){
  if(document.getElementById('reader-prev').disabled) return;
  const { book, chapter } = readerState;
  const startAtEnd = state.settings.paginatedReading;
  if(chapter > 1){
    openReader(book, chapter - 1, 'prev', startAtEnd);
  }else{
    const prevBook = BOOKS.find(b => b.o === book.o - 1);
    if(prevBook){
      const data = await fetchBookData(prevBook);
      const chapters = Object.keys(data).map(Number).sort((a, b) => a - b);
      openReader(prevBook, chapters[chapters.length - 1], 'prev', startAtEnd);
    }
  }
}

/* ---------- Cambiar de página (modo paginado) ---------- */

async function paginatedNext(){
  if(document.getElementById('reader-next').disabled) return;
  if(paginatedIndex < paginatedPages.length - 1){
    await withPageTurnAnimation('next', async () => {
      paginatedIndex++;
      renderPaginatedPage(readerState.book, readerState.chapter, paginatedPages, paginatedIndex);
    });
    updateReaderNav(readerState.book, readerState.chapter);
    updatePageIndicator();
  }else{
    await gotoNextChapter();
  }
}

async function paginatedPrev(){
  if(document.getElementById('reader-prev').disabled) return;
  if(paginatedIndex > 0){
    await withPageTurnAnimation('prev', async () => {
      paginatedIndex--;
      renderPaginatedPage(readerState.book, readerState.chapter, paginatedPages, paginatedIndex);
    });
    updateReaderNav(readerState.book, readerState.chapter);
    updatePageIndicator();
  }else{
    await gotoPrevChapter();
  }
}

/* ---------- Entradas del usuario: flechas, swipe, teclado ---------- */

async function goNext(){
  if(state.settings.paginatedReading) await paginatedNext();
  else await gotoNextChapter();
}
async function goPrev(){
  if(state.settings.paginatedReading) await paginatedPrev();
  else await gotoPrevChapter();
}

function initSwipe(el){
  let startX = 0, startY = 0, tracking = false;
  el.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY; tracking = true;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if(!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if(Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4){
      if(dx < 0) goNext(); else goPrev();
    }
  }, { passive: true });
}

function initReader(){
  document.getElementById('reader-toc-toggle').addEventListener('click', openPicker);
  document.getElementById('reader-current-btn').addEventListener('click', openPicker);
  document.getElementById('reader-picker-close').addEventListener('click', closePicker);
  document.getElementById('reader-prev').addEventListener('click', goPrev);
  document.getElementById('reader-next').addEventListener('click', goNext);
  initSwipe(document.getElementById('reader-page-wrap'));
  initReaderResize();

  document.addEventListener('keydown', e => {
    if(!isLeerVisible() || !document.getElementById('reader-picker').hidden) return;
    if(e.key === 'ArrowRight') goNext();
    else if(e.key === 'ArrowLeft') goPrev();
  });

  const last = state.lastRead;
  const startBook = (last && BOOKS.find(b => b.o === last.bookOrder)) || BOOKS[0];
  const startChapter = last ? last.chapter : 1;
  openReader(startBook, startChapter, null);
}
