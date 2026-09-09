/* Búsqueda de citas: "Juan 3:16", "1 Jn 4:8", "Sal 23", "Salmos 23:1-6"... */

const REF_PATTERN = /^(\d{1,3})(?:[:.](\d{1,3})(?:-(\d{1,3}))?)?$/;
const bookDataCache = {};

function parseReference(raw){
  const trimmed = raw.trim();
  if(!trimmed) return { error: 'Escribe una cita, por ejemplo: Juan 3:16' };

  const tokens = trimmed.split(/\s+/);
  let bookPart = trimmed, refPart = null;
  if(tokens.length > 1 && REF_PATTERN.test(tokens[tokens.length - 1])){
    refPart = tokens[tokens.length - 1];
    bookPart = tokens.slice(0, -1).join(' ');
  }

  const norm = normalize(bookPart);
  const book = BOOK_LOOKUP[norm] || BOOK_LOOKUP[norm.replace(/\s+/g, '')];
  if(!book){
    return { error: `No reconocemos "${bookPart}". Prueba con el nombre completo o una abreviatura, ej: Génesis, 1 Jn, Ap.` };
  }
  if(!refPart){
    return { error: `¿Qué capítulo de ${book.n} buscas? Ej: "${book.n} 1" o "${book.n} 1:1"`, book };
  }

  const m = refPart.match(REF_PATTERN);
  return {
    book,
    chapter: parseInt(m[1], 10),
    verseStart: m[2] ? parseInt(m[2], 10) : null,
    verseEnd: m[3] ? parseInt(m[3], 10) : null
  };
}

async function fetchBookData(book){
  if(bookDataCache[book.n]) return bookDataCache[book.n];
  const url = `${BIBLE_DATA_DIR}/${fileSlug(book)}.json`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('book-not-found');
  const json = await res.json();
  bookDataCache[book.n] = json;
  return json;
}

async function fetchChapter(book, chapter){
  const data = await fetchBookData(book);
  const verses = data[chapter];
  if(!verses) throw new Error('chapter-not-found');
  return verses;
}

function escapeRegExp(s){
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function escapeHtml(s){
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightText(text, term){
  const normText = normalizeKeepLength(text);
  const re = new RegExp(escapeRegExp(term), 'g');
  let out = '', lastIndex = 0, m;
  while((m = re.exec(normText))){
    out += escapeHtml(text.slice(lastIndex, m.index));
    out += '<mark>' + escapeHtml(text.slice(m.index, m.index + m[0].length)) + '</mark>';
    lastIndex = m.index + m[0].length;
  }
  out += escapeHtml(text.slice(lastIndex));
  return out;
}

const KEYWORD_RESULT_LIMIT = 60;

async function runKeywordSearch(rawQuery){
  const term = normalize(rawQuery);
  if(term.length < 2){
    renderSearchResult('<p class="search-hint">Escribe al menos 2 letras para buscar una palabra en toda la Biblia.</p>');
    return;
  }
  renderSearchResult(`<p class="search-loading">Buscando "${escapeHtml(rawQuery.trim())}" en toda la Biblia…</p>`);

  await Promise.all(BOOKS.map(b => fetchBookData(b).catch(() => null)));

  const matches = [];
  for(const book of BOOKS){
    const data = bookDataCache[book.n];
    if(!data) continue;
    const chapters = Object.keys(data).map(Number).sort((a, b) => a - b);
    for(const chapter of chapters){
      for(const v of data[chapter]){
        if(normalizeKeepLength(v.text).includes(term)){
          matches.push({ book, chapter, verse: v.verse, text: v.text });
        }
      }
    }
  }
  renderKeywordResults(rawQuery.trim(), term, matches);
}

function renderKeywordResults(query, term, matches){
  if(!matches.length){
    renderSearchResult(`<p class="search-hint">No encontramos "${escapeHtml(query)}" en el texto. Prueba con otra palabra.</p>`);
    return;
  }
  const shown = matches.slice(0, KEYWORD_RESULT_LIMIT);
  const rowsHtml = shown.map(m => {
    const ref = refLabel(m.book, m.chapter, m.verse, null);
    return `<button class="kw-row" data-ref="${ref}">
      <span class="kw-ref">${ref}</span>
      <span class="kw-snippet">${highlightText(m.text, term)}</span>
    </button>`;
  }).join('');
  const moreNote = matches.length > KEYWORD_RESULT_LIMIT
    ? `<p class="kw-more">Mostrando ${KEYWORD_RESULT_LIMIT} de ${matches.length} resultados. Prueba una palabra más específica para ver menos.</p>`
    : '';

  renderSearchResult(`
    <div class="kw-results">
      <p class="kw-count">${matches.length} resultado${matches.length === 1 ? '' : 's'} para "${escapeHtml(query)}"</p>
      <div class="kw-list">${rowsHtml}</div>
      ${moreNote}
    </div>
  `);

  document.querySelectorAll('.kw-row').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('search-input').value = btn.dataset.ref;
      runSearch(btn.dataset.ref);
    });
  });
}

function refLabel(book, chapter, verseStart, verseEnd){
  let label = `${book.n} ${chapter}`;
  if(verseStart){
    label += ':' + verseStart;
    if(verseEnd && verseEnd !== verseStart) label += '-' + verseEnd;
  }
  return label;
}

function renderSearchResult(html){
  document.getElementById('search-result').innerHTML = html;
}

function renderVerses(book, chapter, verses, verseStart, verseEnd){
  const label = refLabel(book, chapter, verseStart, verseEnd);
  const isFullChapter = !verseStart;
  const versesHtml = verses.map((v, i) => {
    const dropCap = (i === 0) ? ' drop-cap' : '';
    return `<p class="verse${dropCap}"><sup>${v.verse}</sup>${v.text}</p>`;
  }).join('');

  const alreadySaved = state.favorites.includes(label);
  renderSearchResult(`
    <article class="verse-card">
      <div class="verse-card-head">
        <h2>${label}</h2>
        <button class="bookmark-btn ${alreadySaved ? 'active' : ''}" id="bookmark-btn" title="Guardar cita" aria-label="Guardar cita">${alreadySaved ? ICONS.starFilled : ICONS.starOutline}</button>
      </div>
      ${isFullChapter ? '<p class="chapter-note">Capítulo completo</p>' : ''}
      <div class="verse-body">${versesHtml}</div>
      <p class="verse-source">Biblia en Español Sencillo</p>
    </article>
  `);

  document.getElementById('bookmark-btn').addEventListener('click', () => toggleFavorite(label));
  pushRecent(label);
}

function toggleFavorite(label){
  const idx = state.favorites.indexOf(label);
  if(idx === -1) state.favorites.unshift(label);
  else state.favorites.splice(idx, 1);
  state.favorites = state.favorites.slice(0, 24);
  saveState();
  renderFavoriteChips();
  const btn = document.getElementById('bookmark-btn');
  if(btn){
    const active = state.favorites.includes(label);
    btn.classList.toggle('active', active);
    btn.innerHTML = active ? ICONS.starFilled : ICONS.starOutline;
  }
}

function pushRecent(label){
  state.recents = [label, ...state.recents.filter(r => r !== label)].slice(0, 8);
  saveState();
  renderFavoriteChips();
}

function renderFavoriteChips(){
  const box = document.getElementById('search-chips');
  const chips = [];
  if(state.favorites.length){
    chips.push(`<div class="chip-group-label">Favoritos</div>`);
    chips.push(state.favorites.map(f => `<button class="chip chip-fav" data-ref="${f}">${ICONS.starFilled} ${f}</button>`).join(''));
  }
  const otherRecents = state.recents.filter(r => !state.favorites.includes(r));
  if(otherRecents.length){
    chips.push(`<div class="chip-group-label">Recientes</div>`);
    chips.push(otherRecents.map(r => `<button class="chip" data-ref="${r}">${r}</button>`).join(''));
  }
  box.innerHTML = chips.join('');
  box.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('search-input').value = btn.dataset.ref;
      runSearch(btn.dataset.ref);
    });
  });
}

async function runSearch(raw){
  const trimmed = raw.trim();
  if(!trimmed){
    renderSearchResult('<p class="search-hint">Escribe una cita, por ejemplo: Juan 3:16</p>');
    return;
  }

  const parsed = parseReference(trimmed);
  if(parsed.error){
    if(!parsed.book && !/\d/.test(trimmed)){
      await runKeywordSearch(trimmed);
      return;
    }
    renderSearchResult(`<p class="search-hint">${parsed.error}</p>`);
    return;
  }
  renderSearchResult('<p class="search-loading">Buscando…</p>');
  try{
    const verses = await fetchChapter(parsed.book, parsed.chapter);
    let filtered = verses;
    if(parsed.verseStart){
      const end = parsed.verseEnd || parsed.verseStart;
      filtered = verses.filter(v => v.verse >= parsed.verseStart && v.verse <= end);
    }
    if(!filtered.length){
      renderSearchResult(`<p class="search-hint">No encontramos ese versículo en ${parsed.book.n} ${parsed.chapter}. Revisa el número.</p>`);
      return;
    }
    renderVerses(parsed.book, parsed.chapter, filtered, parsed.verseStart, parsed.verseEnd);
  }catch(e){
    renderSearchResult(`<p class="search-hint">No pudimos cargar ${parsed.book.n} ${parsed.chapter}. Revisa el capítulo o tu conexión.</p>`);
  }
}

function renderAutocomplete(query){
  const box = document.getElementById('search-suggest');
  const norm = normalize(query);
  if(!norm){ box.innerHTML = ''; box.hidden = true; return; }
  const matches = BOOKS.filter(b => normalize(b.n).startsWith(norm)).slice(0, 6);
  if(!matches.length){ box.innerHTML = ''; box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = matches.map(b => `<button data-book="${b.n}"><span class="sug-cat" style="background:${CAT_MAP[b.cat].color}"></span>${b.n}</button>`).join('');
  box.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('search-input');
      input.value = btn.dataset.book + ' ';
      input.focus();
      box.hidden = true;
    });
  });
}

function renderTopicChips(){
  const box = document.getElementById('search-topics');
  box.innerHTML = `<span class="chip-group-label">Temas</span>` +
    SEARCH_TOPICS.map(t => `<button class="chip chip-topic" data-kw="${t}">${t}</button>`).join('');
  box.querySelectorAll('.chip-topic').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('search-input').value = btn.dataset.kw;
      runSearch(btn.dataset.kw);
    });
  });
}

function initSearch(){
  const input = document.getElementById('search-input');
  const form = document.getElementById('search-form');
  const box = document.getElementById('search-suggest');

  form.addEventListener('submit', e => {
    e.preventDefault();
    box.hidden = true;
    runSearch(input.value);
  });
  input.addEventListener('input', () => renderAutocomplete(input.value));
  document.addEventListener('click', e => {
    if(!box.contains(e.target) && e.target !== input) box.hidden = true;
  });

  renderTopicChips();
  renderFavoriteChips();
  renderSearchResult('<p class="search-hint">Escribe una cita, como <strong>Juan 3:16</strong> o <strong>Sal 23</strong>, o una palabra como <strong>amor</strong> o <strong>esperanza</strong> para buscarla en toda la Biblia.</p>');
}
