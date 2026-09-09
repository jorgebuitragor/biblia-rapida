/* Navegación entre pestañas e inicialización general. */

function setTab(tab){
  document.querySelectorAll('.ribbon').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  ['buscar', 'leer', 'estudiar', 'quiz', 'progreso'].forEach(id => {
    document.getElementById('page-' + id).hidden = id !== tab;
  });
  document.body.classList.toggle('reading-mode', tab === 'leer');
  if(tab === 'estudiar'){
    document.getElementById('thumb-index').hidden = false;
    bindStudyThumbIndex();
  }else if(tab === 'leer'){
    syncReaderThumbVisibility();
    onLeerShown();
  }else{
    document.getElementById('thumb-index').hidden = true;
  }
  if(tab === 'progreso') renderProgress();
  if(tab === 'buscar') document.getElementById('search-input').focus();
}

document.querySelectorAll('.ribbon').forEach(btn => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

(function init(){
  loadState();
  initSearch();
  initReader();
  renderStudy('all');
  initQuiz();
  initProgress();
})();
