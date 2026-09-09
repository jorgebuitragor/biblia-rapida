/* Vista de progreso: barras por categoría, mejores rachas y reinicio. */

function renderProgress(){
  const box = document.getElementById('progress-cats');
  box.innerHTML = CATEGORIES.map(cat => {
    const books = BOOKS.filter(b => b.cat === cat.id);
    const done = books.filter(b => state.studied[b.o]).length;
    const pct = Math.round((done / books.length) * 100);
    return `<div class="cat-row">
      <div class="cat-name">${cat.name}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${cat.color}"></div></div>
      <div class="cat-count">${done}/${books.length}</div>
    </div>`;
  }).join('');

  const studiedCount = Object.keys(state.studied).length;
  document.getElementById('best-scores-box').innerHTML = `
    <div class="score-card"><div class="big">${studiedCount}/66</div><div class="small">Libros repasados</div></div>
    <div class="score-card"><div class="big">${state.ordenBest ? state.ordenBest.correct + '/' + state.ordenBest.total : '—'}</div><div class="small">Mejor racha · Orden</div></div>
    <div class="score-card"><div class="big">${state.catBest ? state.catBest.correct + '/' + state.catBest.total : '—'}</div><div class="small">Mejor racha · Categoría</div></div>
  `;

  const favBox = document.getElementById('progress-favorites');
  favBox.innerHTML = state.favorites.length
    ? state.favorites.map(f => `<span class="chip chip-fav">${ICONS.starFilled} ${f}</span>`).join('')
    : `<p class="empty-note">Aún no guardas citas favoritas. Márcalas con ${ICONS.starOutline} desde la pestaña Buscar.</p>`;
}

function initProgress(){
  const pageTurnToggle = document.getElementById('opt-page-turn');
  pageTurnToggle.checked = state.settings.pageTurnEffect;
  pageTurnToggle.addEventListener('change', () => {
    state.settings.pageTurnEffect = pageTurnToggle.checked;
    saveState();
  });

  const paginatedToggle = document.getElementById('opt-paginated');
  paginatedToggle.checked = state.settings.paginatedReading;
  paginatedToggle.addEventListener('change', () => {
    state.settings.paginatedReading = paginatedToggle.checked;
    saveState();
    refreshReaderMode();
  });

  document.getElementById('reset-progress').addEventListener('click', () => {
    if(confirm('¿Seguro que quieres borrar todo tu progreso guardado (estudio, quizzes y favoritos)? Tus opciones no se verán afectadas.')){
      state = { ...state, studied: {}, ordenBest: null, catBest: null, favorites: [], recents: [], lastRead: null };
      saveState();
      renderStudy(currentStudyFilter);
      renderProgress();
      renderFavoriteChips();
      openReader(BOOKS[0], 1, null);
    }
  });
}
