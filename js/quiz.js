/* Quiz de práctica: orden, categoría, autor, testamento y adivinar el libro de una cita real. */

const QUIZ_MODES = ['orden', 'categoria', 'autor', 'testamento', 'versiculo'];

let quizMode = 'orden';
let ordenCurrent = null, ordenScore = { correct: 0, total: 0 };
let catCurrent = null, catScore = { correct: 0, total: 0 };
let autorCurrent = null, autorScore = { correct: 0, total: 0 };
let testamentoCurrent = null, testamentoScore = { correct: 0, total: 0 };
let versiculoCurrent = null, versiculoScore = { correct: 0, total: 0 };
let versiculoBusy = false;

function setQuizMode(mode){
  quizMode = mode;
  document.querySelectorAll('.quiz-toggle button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  QUIZ_MODES.forEach(m => { document.getElementById('quiz-' + m).hidden = m !== mode; });
  if(mode === 'orden') newOrdenQuestion();
  else if(mode === 'categoria') newCatQuestion();
  else if(mode === 'autor') newAutorQuestion();
  else if(mode === 'testamento') newTestamentoQuestion();
  else if(mode === 'versiculo') newVersiculoQuestion();
}

/* ---------- Orden ---------- */
function newOrdenQuestion(){
  ordenCurrent = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  document.getElementById('orden-book').textContent = ordenCurrent.n;
  const input = document.getElementById('orden-input');
  input.value = '';
  const fb = document.getElementById('orden-feedback');
  fb.textContent = '';
  fb.className = 'feedback';
  input.focus();
}

function checkOrden(){
  const val = parseInt(document.getElementById('orden-input').value, 10);
  const fb = document.getElementById('orden-feedback');
  ordenScore.total++;
  if(val === ordenCurrent.o){
    ordenScore.correct++;
    fb.textContent = `¡Correcto! ${ordenCurrent.n} es el libro #${ordenCurrent.o}.`;
    fb.className = 'feedback ok';
  }else{
    fb.textContent = `No — ${ordenCurrent.n} es el libro #${ordenCurrent.o}.`;
    fb.className = 'feedback bad';
  }
  document.getElementById('orden-score').textContent = `Aciertos: ${ordenScore.correct} / ${ordenScore.total}`;
  updateBest('ordenBest', ordenScore);
  setTimeout(newOrdenQuestion, 1300);
}

/* ---------- Categoría ---------- */
function newCatQuestion(){
  catCurrent = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  document.getElementById('cat-book').textContent = catCurrent.n;
  const fb = document.getElementById('cat-feedback');
  fb.textContent = '';
  fb.className = 'feedback';

  const correctCat = catCurrent.cat;
  const options = new Set([correctCat]);
  while(options.size < 4) options.add(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].id);
  const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

  const optBox = document.getElementById('cat-options');
  optBox.innerHTML = shuffled.map(id => `<button data-cat="${id}">${CAT_MAP[id].name}</button>`).join('');
  optBox.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      catScore.total++;
      const fb2 = document.getElementById('cat-feedback');
      if(btn.dataset.cat === correctCat){
        btn.classList.add('correct');
        catScore.correct++;
        fb2.textContent = '¡Correcto!';
        fb2.className = 'feedback ok';
      }else{
        btn.classList.add('wrong');
        optBox.querySelectorAll('button').forEach(b => { if(b.dataset.cat === correctCat) b.classList.add('correct'); });
        fb2.textContent = `${catCurrent.n} pertenece a ${CAT_MAP[correctCat].name}.`;
        fb2.className = 'feedback bad';
      }
      document.getElementById('cat-score').textContent = `Aciertos: ${catScore.correct} / ${catScore.total}`;
      updateBest('catBest', catScore);
      optBox.querySelectorAll('button').forEach(b => b.disabled = true);
      setTimeout(newCatQuestion, 1300);
    });
  });
}

/* ---------- Autor ---------- */
function newAutorQuestion(){
  autorCurrent = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  document.getElementById('autor-book').textContent = autorCurrent.n;
  const fb = document.getElementById('autor-feedback');
  fb.textContent = '';
  fb.className = 'feedback';

  const correctAuthor = autorCurrent.a;
  const pool = new Set([correctAuthor]);
  const shuffledBooks = [...BOOKS].sort(() => Math.random() - 0.5);
  for(const b of shuffledBooks){
    if(pool.size >= 4) break;
    pool.add(b.a);
  }
  const shuffled = Array.from(pool).sort(() => Math.random() - 0.5);

  const optBox = document.getElementById('autor-options');
  optBox.innerHTML = shuffled.map(a => `<button data-a="${a.replace(/"/g, '&quot;')}">${a}</button>`).join('');
  optBox.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      autorScore.total++;
      const fb2 = document.getElementById('autor-feedback');
      if(btn.dataset.a === correctAuthor){
        btn.classList.add('correct');
        autorScore.correct++;
        fb2.textContent = '¡Correcto!';
        fb2.className = 'feedback ok';
      }else{
        btn.classList.add('wrong');
        optBox.querySelectorAll('button').forEach(b => { if(b.dataset.a === correctAuthor) b.classList.add('correct'); });
        fb2.textContent = `${autorCurrent.n} fue escrito por ${correctAuthor}.`;
        fb2.className = 'feedback bad';
      }
      document.getElementById('autor-score').textContent = `Aciertos: ${autorScore.correct} / ${autorScore.total}`;
      optBox.querySelectorAll('button').forEach(b => b.disabled = true);
      setTimeout(newAutorQuestion, 1300);
    });
  });
}

/* ---------- Testamento ---------- */
function newTestamentoQuestion(){
  testamentoCurrent = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  document.getElementById('testamento-book').textContent = testamentoCurrent.n;
  const fb = document.getElementById('testamento-feedback');
  fb.textContent = '';
  fb.className = 'feedback';
  document.querySelectorAll('#testamento-options button').forEach(b => {
    b.disabled = false;
    b.classList.remove('correct', 'wrong');
  });
}

function initTestamentoOptions(){
  document.querySelectorAll('#testamento-options button').forEach(btn => {
    btn.addEventListener('click', () => {
      testamentoScore.total++;
      const correctT = testament(testamentoCurrent);
      const fb = document.getElementById('testamento-feedback');
      if(btn.dataset.t === correctT){
        btn.classList.add('correct');
        testamentoScore.correct++;
        fb.textContent = '¡Correcto!';
        fb.className = 'feedback ok';
      }else{
        btn.classList.add('wrong');
        document.querySelectorAll('#testamento-options button').forEach(b => { if(b.dataset.t === correctT) b.classList.add('correct'); });
        fb.textContent = `${testamentoCurrent.n} es del ${correctT === 'AT' ? 'Antiguo' : 'Nuevo'} Testamento.`;
        fb.className = 'feedback bad';
      }
      document.getElementById('testamento-score').textContent = `Aciertos: ${testamentoScore.correct} / ${testamentoScore.total}`;
      document.querySelectorAll('#testamento-options button').forEach(b => b.disabled = true);
      setTimeout(newTestamentoQuestion, 1300);
    });
  });
}

/* ---------- Versículo → Libro (usa el texto real de la Biblia local) ---------- */
async function newVersiculoQuestion(){
  if(versiculoBusy) return;
  versiculoBusy = true;
  document.getElementById('versiculo-text').textContent = 'Cargando…';
  document.getElementById('versiculo-options').innerHTML = '';
  const fb = document.getElementById('versiculo-feedback');
  fb.textContent = '';
  fb.className = 'feedback';

  const book = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  try{
    const data = await fetchBookData(book);
    const chapterNums = Object.keys(data).map(Number);
    const chapter = chapterNums[Math.floor(Math.random() * chapterNums.length)];
    const verses = data[chapter];
    const candidates = verses.filter(v => v.text.length > 40 && v.text.length < 220);
    const pool = candidates.length ? candidates : verses;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    versiculoCurrent = { book, chapter, verse: pick.verse, text: pick.text };

    document.getElementById('versiculo-text').textContent = `"${pick.text}"`;

    const optionBooks = new Set([book.n]);
    const shuffledBooks = [...BOOKS].sort(() => Math.random() - 0.5);
    for(const b of shuffledBooks){
      if(optionBooks.size >= 4) break;
      optionBooks.add(b.n);
    }
    const shuffled = Array.from(optionBooks).sort(() => Math.random() - 0.5);

    const optBox = document.getElementById('versiculo-options');
    optBox.innerHTML = shuffled.map(n => `<button data-book="${n}">${n}</button>`).join('');
    optBox.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        versiculoScore.total++;
        const fb2 = document.getElementById('versiculo-feedback');
        if(btn.dataset.book === book.n){
          btn.classList.add('correct');
          versiculoScore.correct++;
          fb2.textContent = '¡Correcto!';
          fb2.className = 'feedback ok';
        }else{
          btn.classList.add('wrong');
          optBox.querySelectorAll('button').forEach(b => { if(b.dataset.book === book.n) b.classList.add('correct'); });
          fb2.textContent = `Es de ${book.n} ${chapter}:${pick.verse}.`;
          fb2.className = 'feedback bad';
        }
        document.getElementById('versiculo-score').textContent = `Aciertos: ${versiculoScore.correct} / ${versiculoScore.total}`;
        optBox.querySelectorAll('button').forEach(b => b.disabled = true);
        setTimeout(newVersiculoQuestion, 1700);
      });
    });
  }catch(e){
    document.getElementById('versiculo-text').textContent = 'No pudimos cargar una cita. Intenta de nuevo.';
  }
  versiculoBusy = false;
}

function updateBest(key, score){
  const best = state[key];
  const better = !best || score.correct > best.correct || (score.correct === best.correct && score.total < best.total);
  if(better){
    state[key] = { correct: score.correct, total: score.total };
    saveState();
  }
}

function initQuiz(){
  document.querySelectorAll('.quiz-toggle button').forEach(b => b.addEventListener('click', () => setQuizMode(b.dataset.mode)));
  document.getElementById('orden-check').addEventListener('click', checkOrden);
  document.getElementById('orden-skip').addEventListener('click', newOrdenQuestion);
  document.getElementById('orden-input').addEventListener('keydown', e => { if(e.key === 'Enter') checkOrden(); });
  document.getElementById('cat-skip').addEventListener('click', newCatQuestion);
  document.getElementById('autor-skip').addEventListener('click', newAutorQuestion);
  document.getElementById('testamento-skip').addEventListener('click', newTestamentoQuestion);
  document.getElementById('versiculo-skip').addEventListener('click', newVersiculoQuestion);
  initTestamentoOptions();
  newOrdenQuestion();
  newCatQuestion();
}
