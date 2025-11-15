// main.js - Основная логика теста

// Вспомогательные функции
function random(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}

function escapeHtml(str) { 
  return String(str || '').replace(/[&<>"']/g, function(m) { 
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; 
  }); 
}

// Глобальные переменные
const questionsArea = document.getElementById('questionsArea');
const demographicsArea = document.getElementById('demographicsArea');
const totalQ = questionsData.length;
let currentIndex = 0;
let firstAnswerGiven = false;

// Построение демографических карточек
function buildDemographics() {
  demographicsArea.innerHTML = '';
  demographics.forEach(d => {
    const div = document.createElement('div');
    div.className = 'demo-card reveal';
    const header = document.createElement('div'); 
    header.className = 'question-header';
    header.innerHTML = `<div style="display:flex;align-items:center;"><div class="qtext">${escapeHtml(d.label)}</div></div>`;
    div.appendChild(header);
    const body = document.createElement('div');
    body.style.marginTop = '8px';

    if (d.name === 'age') {
      const inp = document.createElement('input');
      inp.type = 'number'; 
      inp.name = d.name; 
      inp.min = 10; 
      inp.max = 120; 
      inp.placeholder = 'Введите возраст';
      inp.style.padding = '8px'; 
      inp.style.borderRadius = '8px'; 
      inp.style.border = '1px solid rgba(0,0,0,0.06)';
      body.appendChild(inp);
    } else {
      const optsWrap = document.createElement('div'); 
      optsWrap.className = 'options';
      d.opts.forEach((o, i) => {
        const lbl = document.createElement('label'); 
        lbl.className = 'opt-card'; 
        lbl.tabIndex = 0; 
        lbl.style.padding = '8px';
        const input = document.createElement('input'); 
        input.type = 'radio'; 
        input.name = d.name; 
        input.value = o;
        const span = document.createElement('span'); 
        span.className = 'otext'; 
        span.textContent = o;
        lbl.appendChild(input); 
        lbl.appendChild(span);
        lbl.addEventListener('click', () => {
          const radios = lbl.parentElement.querySelectorAll('input[type=radio][name="' + input.name + '"]');
          radios.forEach(r => r.checked = false);
          input.checked = true;
          lbl.parentElement.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
          lbl.classList.add('selected');
        });
        lbl.addEventListener('keydown', (ev) => { 
          if (ev.key === 'Enter' || ev.key === ' ') { 
            ev.preventDefault(); 
            lbl.click(); 
          } 
        });
        optsWrap.appendChild(lbl);
      });
      body.appendChild(optsWrap);
    }

    div.appendChild(body);
    demographicsArea.appendChild(div);
  });
}

// Построение вопросов
function buildQuestions() {
  questionsArea.innerHTML = '';
  questionsData.forEach((item, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question-card reveal';
    qDiv.dataset.index = idx;
    if (idx !== 0) qDiv.classList.add('hidden');
    
    const qHeader = document.createElement('div');
    qHeader.className = 'question-header';
    qHeader.innerHTML = `<div style="display:flex;align-items:center;"><div class="qnum">#${idx+1}</div><div class="qtext">${escapeHtml(item.q)}</div></div>`;
    qDiv.appendChild(qHeader);

    const optsWrap = document.createElement('div');
    optsWrap.className = 'options';
    item.opts.forEach((opt, oi) => {
      const lbl = document.createElement('label');
      lbl.className = 'opt-card';
      lbl.tabIndex = 0;
      
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${idx+1}`;
      input.value = (opt.tags || []).join(',');
      input.dataset.optText = opt.txt;
      input.id = `q${idx+1}_o${oi}`;
      
      const span = document.createElement('span');
      span.className = 'otext';
      span.textContent = opt.txt;
      lbl.appendChild(input);
      lbl.appendChild(span);

      lbl.addEventListener('click', (e) => {
        // Отслеживаем первый ответ
        if (!firstAnswerGiven) {
          firstAnswerGiven = true;
          if (window.philosophyTestAnalytics) {
            window.philosophyTestAnalytics.trackTestStart();
          }
        }
        
        const radios = lbl.parentElement.querySelectorAll('input[type=radio][name="' + input.name + '"]');
        radios.forEach(r => r.checked = false);
        input.checked = true;
        updateSelectedVisual(lbl.parentElement, input.name);
        updateProgress();
      });
      
      lbl.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          lbl.click();
        }
      });

      optsWrap.appendChild(lbl);
    });

    qDiv.appendChild(optsWrap);
    questionsArea.appendChild(qDiv);
  });
}

// Обновление визуального выделения выбранного ответа
function updateSelectedVisual(container, name) {
  const cards = container.querySelectorAll('.opt-card');
  cards.forEach(c => {
    const inp = c.querySelector('input[type=radio]');
    if (inp && inp.name === name && inp.checked) {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });
}

// IntersectionObserver для анимаций
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) en.target.classList.add('visible');
  });
}, {threshold: 0.12});

function observeAll() {
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// Навигация по вопросам
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const qCounter = document.getElementById('qCounter');
const progressBar = document.getElementById('globalProgressBar');
const progressText = document.getElementById('progressText');

function showQuestion(idx) {
  if (idx < 0) idx = 0;
  if (idx >= totalQ) idx = totalQ - 1;
  
  const prev = document.querySelector('.question-card:not(.hidden)');
  if (prev) prev.classList.add('hidden');
  
  const cur = document.querySelector(`.question-card[data-index="${idx}"]`);
  if (cur) cur.classList.remove('hidden');
  
  currentIndex = idx;
  qCounter.textContent = `Вопрос ${idx+1} / ${totalQ}`;
  prevBtn.disabled = idx === 0;
  nextBtn.textContent = idx === totalQ - 1 ? 'Последний' : 'Далее';
  
  if (cur) io.observe(cur);
  updateProgress();
  
  // Отслеживаем прогресс
  if (window.philosophyTestAnalytics) {
    window.philosophyTestAnalytics.trackProgress(idx + 1);
  }
}

prevBtn.addEventListener('click', () => showQuestion(currentIndex - 1));
nextBtn.addEventListener('click', () => showQuestion(currentIndex + 1));

// Обновление глобального прогресса
function updateProgress() {
  const fd = new FormData(document.getElementById('quizForm'));
  let answered = 0;
  for (let [k, v] of fd.entries()) {
    if (k.startsWith('q') && v) answered++;
  }
  const percent = Math.round((answered / totalQ) * 100);
  progressBar.style.width = percent + '%';
  progressText.textContent = `${answered} / ${totalQ}`;
}

// Модальное окно с ответами
const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');

document.getElementById('openSummary').addEventListener('click', openSummary);
document.getElementById('showAllBtn').addEventListener('click', openSummary);
document.getElementById('closeModal').addEventListener('click', closeSummary);
modalBackdrop.addEventListener('click', (e) => { 
  if (e.target === modalBackdrop) closeSummary(); 
});

function openSummary() {
  const fd = new FormData(document.getElementById('quizForm'));
  let rows = '<table class="summary-table"><thead><tr><th>#</th><th>Вопрос</th><th>Ответ</th></tr></thead><tbody>';

  const demoOrder = ['population', 'education', 'field', 'religion_ident', 'gender', 'age'];
  let rnum = 0;
  demoOrder.forEach(name => {
    rnum++;
    const val = fd.get(name);
    const label = demographics.find(d => d.name === name)?.label || name;
    const text = val ? escapeHtml(val) : 'Не отвечено.';
    rows += `<tr><td>Д${rnum}</td><td>${escapeHtml(label)}</td><td>${text}</td></tr>`;
  });

  for (let i = 0; i < totalQ; i++) {
    const qName = `q${i+1}`;
    const val = fd.get(qName);
    let text = '';
    if (val) {
      const inp = document.querySelector(`input[name="${qName}"][value="${val}"]`);
      text = inp ? escapeHtml(inp.dataset.optText) : 'Выбран вариант';
    } else {
      text = 'Не отвечено.';
    }
    rows += `<tr><td>${i+1}</td><td>${escapeHtml(questionsData[i].q)}</td><td>${text}</td></tr>`;
  }
  
  rows += '</tbody></table>';
  modalContent.innerHTML = rows;
  modalBackdrop.classList.add('show');
  modalBackdrop.style.display = 'flex';
}

function closeSummary() {
  modalBackdrop.classList.remove('show');
  modalBackdrop.style.display = 'none';
}

// Переключение темы
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const root = document.body;
  const cur = root.getAttribute('data-theme') || 'light';
  const newTheme = cur === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', newTheme);
  
  if (window.philosophyTestAnalytics) {
    window.philosophyTestAnalytics.trackThemeToggle(newTheme);
  }
});

// Функция расчета результатов
function calculate() {
  const fd = new FormData(document.getElementById('quizForm'));
  const counts = {};
  Object.keys(philosophyNames).forEach(t => counts[t] = 0);
  let answered = 0;

  for (let [key, val] of fd.entries()) {
    if (!key.startsWith('q')) continue;
    if (!val) continue;
    let tags = val.split(',').map(s => s.trim()).filter(Boolean);
    if (tags.length === 0) continue;
    answered++;
    let share = 1 / tags.length;
    tags.forEach(t => { 
      if (counts.hasOwnProperty(t)) counts[t] += share; 
    });
  }

  if (!answered) {
    document.getElementById('result').textContent = 'Ответьте хотя бы на один вопрос с тегами.';
    return;
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted[0], sec = sorted[1] || ['-', 0];

  let main = '', sub = '', desc = '';
  let isMixed = (top[1] > 0 && sec[1] > 0 && ((top[1] - sec[1]) / top[1]) < 0.20);

  if (isMixed) {
    let s1 = Math.round((top[1] / (top[1] + sec[1])) * 100);
    let s2 = 100 - s1;
    main = `${escapeHtml(philosophyNames[top[0]])} — ${escapeHtml(philosophyNames[sec[0]])} (${s1}/${s2})`;
    sub = `${escapeHtml(random(subtypes[top[0]]))} / ${escapeHtml(random(subtypes[sec[0]]))}`;
    desc = `Смешанный профиль: ${s1}% / ${s2}%.`;
  } else {
    main = escapeHtml(philosophyNames[top[0]]);
    sub = escapeHtml(random(subtypes[top[0]]));
    desc = '';
  }

  let totalW = Object.values(counts).reduce((a, b) => a + b, 0);
  let wSum = 0;
  for (let t in counts) wSum += counts[t] * meaningWeights[t];
  let mi = 0;
  if (totalW > 0) {
    mi = Math.round(wSum / totalW);
    mi = Math.max(0, Math.min(100, mi));
  }

  const resultEl = document.getElementById('result');
  resultEl.innerHTML = `
    <h3>Результат</h3>
    <p><b>Основная философия:</b> ${main}</p>
    <p><b>Подтип:</b> ${sub}</p>
    ${desc ? `<p>${escapeHtml(desc)}</p>` : ''}
    <div class="longdesc"><h4>📖 Подробное описание мировоззрения</h4><div id="longdesc-content"></div></div>
    <hr>
    <p><b>Индекс смыслоориентации:</b> ${mi}/100</p>
    <div style="background:#e9eef8;height:10px;border-radius:999px;overflow:hidden;margin:8px 0;">
      <div style="height:100%;width:${mi}%;background:var(--accent);transition:width .5s;"></div>
    </div>
    <div id="demo-results" style="margin-top:12px;"><h4>📋 Демографические ответы</h4><div id="demo-content"></div></div>
  `;

  const longDescContainer = document.getElementById('longdesc-content');
  longDescContainer.innerHTML = '';
  if (isMixed) {
    const p1 = document.createElement('p'); 
    p1.textContent = philosophyNames[top[0]] + ': ' + (longDesc[top[0]] || '');
    const p2 = document.createElement('p'); 
    p2.textContent = philosophyNames[sec[0]] + ': ' + (longDesc[sec[0]] || '');
    longDescContainer.appendChild(p1); 
    longDescContainer.appendChild(p2);
  } else {
    const p = document.createElement('p'); 
    p.textContent = longDesc[top[0]] || '';
    longDescContainer.appendChild(p);
  }

  const demoContent = document.getElementById('demo-content');
  demoContent.innerHTML = '';
  demographics.forEach(d => {
    const val = fd.get(d.name) || 'Не отвечено.';
    const el = document.createElement('p'); 
    el.innerHTML = `<b>${escapeHtml(d.label)}:</b> ${escapeHtml(val)}`;
    demoContent.appendChild(el);
  });

  // Создаем объект результата для экспорта
  const result = {
    philosophy: main,
    subtype: sub,
    meaningIndex: mi,
    description: isMixed 
      ? `${philosophyNames[top[0]]}: ${longDesc[top[0]]}\n\n${philosophyNames[sec[0]]}: ${longDesc[sec[0]]}`
      : longDesc[top[0]] || '',
    demographics: {}
  };

  demographics.forEach(d => {
    const val = fd.get(d.name);
    if (val) result.demographics[d.label] = val;
  });

  // Добавляем кнопки экспорта
  if (window.philosophyTestExport) {
    window.philosophyTestExport.addExportButtons(resultEl, result);
  }

  // Отслеживаем завершение
  if (window.philosophyTestAnalytics) {
    window.philosophyTestAnalytics.trackTestComplete(result);
  }
  
  // НОВОЕ: Отправляем результаты вам
  if (window.sendTestResults) {
    window.sendTestResults(result);
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  buildDemographics();
  buildQuestions();
  observeAll();
  updateProgress();
  showQuestion(0);

  // Инициализация системы сохранения прогресса
  if (window.philosophyTestStorage) {
    window.philosophyTestStorage.initProgressSystem();
  }

  // Кнопка расчета с валидацией
  const calcBtn = document.getElementById('calcBtn');
  calcBtn.addEventListener('click', () => {
    if (window.philosophyTestStorage) {
      window.philosophyTestStorage.enhancedCalculate(calculate);
    } else {
      calculate();
    }
document.addEventListener('DOMContentLoaded', () => {
  const consentBackdrop = document.getElementById('consentBackdrop');
  const consentBtn = document.getElementById('consentAgree');

  consentBtn.addEventListener('click', () => {
    consentBackdrop.remove(); // скрываем окно
    document.body.style.overflow = ''; // снимаем блокировку прокрутки
    console.log('Согласие принято'); // для проверки
  });

  document.body.style.overflow = 'hidden'; // блокируем прокрутку пока модалка видна

  // …остальной код инициализации теста
});
  // Кнопка сброса с подтверждением
  const resetBtn = document.getElementById('resetBtn');
  resetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.philosophyTestStorage) {
      window.philosophyTestStorage.enhancedReset();
    } else {
      if (confirm('Вы уверены, что хотите сбросить все ответы?')) {
        document.getElementById('quizForm').reset();
        document.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
        showQuestion(0);
        updateProgress();
      }
    }
  });

  console.log('✅ Философский тест полностью загружен');
});
