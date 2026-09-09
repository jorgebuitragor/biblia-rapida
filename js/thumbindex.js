/* Índice de pestañas lateral compartido (canto de la Biblia), usado por Estudiar y Leer. */

function renderThumbIndex(activeFilter, onSelect){
  const rail = document.getElementById('thumb-index');
  rail.innerHTML = CATEGORIES.map((c, i) => `
    <button class="thumb ${activeFilter === c.id ? 'active' : ''} ${c.id === 'evangelios' ? 'nt-start' : ''}"
            data-cat="${c.id}"
            style="--cat-color:${c.color}; --i:${i}">${c.code}</button>
  `).join('') + `<button class="thumb thumb-all ${activeFilter === 'all' ? 'active' : ''}" data-cat="all" style="--i:${CATEGORIES.length}">TODO</button>`;

  rail.querySelectorAll('.thumb').forEach(btn => {
    btn.addEventListener('click', () => onSelect(btn.dataset.cat));
  });
}
