/* Tarjetas de estudio por libro + índice de pestañas lateral (como el canto de una Biblia real). */

let currentStudyFilter = 'all';

function bindStudyThumbIndex(){
  renderThumbIndex(currentStudyFilter, (cat) => {
    currentStudyFilter = cat;
    renderStudy(cat);
    bindStudyThumbIndex();
  });
}

function bookCardHtml(b, cat){
  const studiedClass = state.studied[b.o] ? 'studied' : '';
  return `<div class="flip-card ${studiedClass}" data-order="${b.o}" style="--cat-color:${cat.color}">
    <div class="flip-inner">
      <div class="flip-front">
        <span class="order-num">${b.o}</span>
        <span class="book-name">${b.n}</span>
        <span class="studied-badge">${ICONS.check} repasado</span>
      </div>
      <div class="flip-back">
        <div class="author">${b.a}</div>
        <div class="theme">${b.t}</div>
        <div class="verse-slot" data-book="${b.n}">Cargando versículo…</div>
      </div>
    </div>
  </div>`;
}

async function fetchSampleVerse(bookName){
  const [chap, verse] = SAMPLE_REF[bookName];
  const book = BOOKS.find(b => b.n === bookName);
  try{
    const verses = await fetchChapter(book, chap);
    const found = verses.find(v => v.verse === verse);
    return { ref: `${bookName} ${chap}:${verse}`, text: found ? found.text : null };
  }catch(e){
    return { ref: `${bookName} ${chap}:${verse}`, text: null };
  }
}

function renderStudy(filterCat){
  currentStudyFilter = filterCat;
  const container = document.getElementById('study-content');
  const cats = filterCat === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === filterCat);

  container.innerHTML = cats.map(cat => {
    const books = BOOKS.filter(b => b.cat === cat.id);
    const showDivider = filterCat === 'all' && (cat.id === 'pentateuco' || cat.id === 'evangelios');
    const dividerHtml = showDivider
      ? `<div class="testament-divider"><span>${cat.id === 'pentateuco' ? 'Antiguo Testamento' : 'Nuevo Testamento'}</span></div>`
      : '';
    return `${dividerHtml}<div class="category-block">
      <h3 class="category-title" style="--cat-color:${cat.color}">${cat.name} <span class="cat-count">${books.length}</span></h3>
      <div class="card-grid">${books.map(b => bookCardHtml(b, cat)).join('')}</div>
    </div>`;
  }).join('');

  container.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', async () => {
      const wasFlipped = card.classList.contains('flipped');
      card.classList.toggle('flipped');
      const order = card.dataset.order;
      if(!state.studied[order]){
        state.studied[order] = true;
        card.classList.add('studied');
        saveState();
      }
      if(!wasFlipped){
        const slot = card.querySelector('.verse-slot');
        const v = await fetchSampleVerse(slot.dataset.book);
        slot.textContent = v.text ? `"${v.text}" — ${v.ref}` : `(No se pudo cargar ${v.ref})`;
      }
    });
  });
}
