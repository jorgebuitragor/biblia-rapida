/* Estado persistente en localStorage: progreso de estudio, mejores rachas de quiz, favoritos y recientes. */

const STORAGE_KEY = 'biblia-rapida-state-v1';

let state = {
  studied: {},      // {bookOrder: true}
  ordenBest: null,  // {correct, total}
  catBest: null,
  favorites: [],    // ["Juan 3:16", ...]
  recents: [],
  lastRead: null,   // {bookOrder, chapter}
  settings: { pageTurnEffect: true, paginatedReading: false }
};

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      state = Object.assign({}, state, parsed);
    }
  }catch(e){ /* almacenamiento no disponible, seguimos con el estado por defecto */ }
}

function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e){ /* almacenamiento lleno o bloqueado, se ignora */ }
}
