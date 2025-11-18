// main.js - Основная логика теста с поддержкой i18n

// Вспомогательные функции
function random(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}

function escapeHtml(str) { 
  return String(str || '').replace(/[&<>"']/g, function(m) { 
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; 
  }); 
}

// Получение функции перевода
// Получение функции перевода
function getTranslate() {
  return window.philosophyTestI18n?.t || ((key) => key);
}

// Глобальные переменные
const questionsArea = document.getElementById('questionsArea');
const demographicsArea = document.getElementById('demographicsArea');
let totalQ = 40;
let currentIndex = 0;
let firstAnswerGiven = false;

// Функция перестроения всего интерфейса при смене языка
function rebuildInterface() {
  const translate = getTranslate();
  
  // Обновляем title
  document.getElementById('siteTitle').textContent = translate('siteTitle');
  
  // Обновляем дисклеймер
  document.getElementById('disclaimerTitle').textContent = translate('disclaimer.title');
  document.getElementById('disclaimerText').textContent = translate('disclaimer.text');
  
  // Обновляем кнопки
  document.getElementById('openSummary').textContent = translate('buttons.viewAnswers');
  document.getElementById('prevBtn').textContent = translate('buttons.prev');
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = currentIndex === totalQ - 1 ? translate('buttons.last') : translate('buttons.next');
  document.getElementById('showAllBtn').textContent = translate('buttons.showAll');
  document.getElementById('calcBtn').textContent = translate('buttons.calculate');
  document.getElementById('resetBtn').textContent = translate('buttons.reset');
  document.getElementById('closeModal').textContent = translate('buttons.close');
  document.getElementById('modalTitle').textContent = translate('modals.allAnswers');
  
  // Обновляем данные
  if (typeof updateDataForLanguage === 'function') {
    updateDataForLanguage();
  }
  
  // Полностью перестраиваем демографию и вопросы
  totalQ = window.questionsData?.length || 40;
  buildDemographics();
  buildQuestions();
  observeAll();
  updateProgress();
  showQuestion(currentIndex);
  
  console.log(`✅ Интерфейс обновлён для языка: ${window.philosophyTestI18n?.getCurrentLanguage()}`);
}

// Глобально экспортируем функцию
window.rebuildInterface = rebuildInterface;

// Построение демографических карточек
function buildDemographics() {
  const translate = getTranslate();
  demographicsArea.innerHTML = '';
  
  const demographics = getDemographics();
  
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
      inp.placeholder = translate('demographics.agePlaceholder');
      inp.style.padding = '8px'; 
      inp.style.borderRadius = '8px'; 
      inp.style.border = '1px solid rgba(0,0,0,0.06)';
      inp.style.width = '200px';
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
          
          if (d.allowCustom && i === 0) {
            showCustomInputForReligion(lbl, input, d.name);
          } else {
            hideCustomInputForReligion(d.name);
          }
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
      
      if (d.allowCustom) {
        const customInputWrap = document.createElement('div');
        customInputWrap.id = `custom-${d.name}`;
        customInputWrap.style.display = 'none';
        customInputWrap.style.marginTop = '10px';
        
        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.id = `custom-input-${d.name}`;
        customInput.placeholder = translate('demographics.religionPlaceholder');
        customInput.style.padding = '10px';
        customInput.style.borderRadius = '8px';
        customInput.style.border = '2px solid var(--accent)';
        customInput.style.width = '100%';
        customInput.style.maxWidth = '400px';
        customInput.style.fontSize = '14px';
        
        customInputWrap.appendChild(customInput);
        body.appendChild(customInputWrap);
      }
    }

    div.appendChild(body);
    demographicsArea.appendChild(div);
  });
}

function showCustomInputForReligion(labelElement, radioInput, fieldName) {
  const translate = getTranslate();
  const customWrap = document.getElementById(`custom-${fieldName}`);
  const customInput = document.getElementById(`custom-input-${fieldName}`);
  
  if (customWrap && customInput) {
    customWrap.style.display = 'block';
    customInput.focus();
    
    customInput.addEventListener('input', function() {
      if (this.value.trim()) {
        radioInput.value = `${translate('demographics.religionPrefix')} ${this.value}`;
      } else {
        radioInput.value = translate('demographics.religionOpts')[0];
      }
    });
  }
}

function hideCustomInputForReligion(fieldName) {
  const customWrap = document.getElementById(`custom-${fieldName}`);
  const customInput = document.getElementById(`custom-input-${fieldName}`);
  
  if (customWrap && customInput) {
    customWrap.style.display = 'none';
    customInput.value = '';
  }
}

function buildQuestions() {
  const translate = getTranslate();
  questionsArea.innerHTML = '';
  const questions = window.questionsData || [];
  
  questions.forEach((item, idx) => {
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

const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) en.target.classList.add('visible');
  });
}, {threshold: 0.12});

function observeAll() {
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const qCounter = document.getElementById('qCounter');
const progressBar = document.getElementById('globalProgressBar');
const progressText = document.getElementById('progressText');

function showQuestion(idx) {
  const translate = getTranslate();
  if (idx < 0) idx = 0;
  if (idx >= totalQ) idx = totalQ - 1;
  
  const prev = document.querySelector('.question-card:not(.hidden)');
  if (prev) prev.classList.add('hidden');
  
  const cur = document.querySelector(`.question-card[data-index="${idx}"]`);
  if (cur) cur.classList.remove('hidden');
  
  currentIndex = idx;
  qCounter.textContent = `${translate('progress.question')} ${idx+1} ${translate('progress.of')} ${totalQ}`;
  prevBtn.disabled = idx === 0;
  nextBtn.textContent = idx === totalQ - 1 ? translate('buttons.last') : translate('buttons.next');
  
  if (cur) io.observe(cur);
  updateProgress();
  
  if (window.philosophyTestAnalytics) {
    window.philosophyTestAnalytics.trackProgress(idx + 1);
  }
}

prevBtn.addEventListener('click', () => showQuestion(currentIndex - 1));
nextBtn.addEventListener('click', () => showQuestion(currentIndex + 1));

function updateProgress() {
  const fd = new FormData(document.getElementById('quizForm'));
  let answered = 0;
  for (let [k, v] of fd.entries()) {
    if (k.startsWith('q')) answered++;
  }
  const percent = Math.round((answered / totalQ) * 100);
  progressBar.style.width = percent + '%';
  progressText.textContent = `${answered} / ${totalQ}`;
}

const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');

document.getElementById('openSummary').addEventListener('click', openSummary);
document.getElementById('showAllBtn').addEventListener('click', openSummary);
document.getElementById('closeModal').addEventListener('click', closeSummary);
modalBackdrop.addEventListener('click', (e) => { 
  if (e.target === modalBackdrop) closeSummary(); 
});

function openSummary() {
  const translate = getTranslate();
  const fd = new FormData(document.getElementById('quizForm'));
  let rows = `<table class="summary-table"><thead><tr><th>${translate('table.number')}</th><th>${translate('table.question')}</th><th>${translate('table.answer')}</th></tr></thead><tbody>`;

  const demographics = getDemographics();
  const demoOrder = ['population', 'education', 'field', 'religion_ident', 'gender', 'age'];
  let rnum = 0;
  
  demoOrder.forEach(name => {
    rnum++;
    const val = fd.get(name);
    const demoItem = demographics.find(d => d.name === name);
    const label = demoItem?.label || name;
    const text = val ? escapeHtml(val) : translate('results.notAnswered');
    rows += `<tr><td>D${rnum}</td><td>${escapeHtml(label)}</td><td>${text}</td></tr>`;
  });

  const questions = window.questionsData || [];
  for (let i = 0; i < totalQ; i++) {
    const qName = `q${i+1}`;
    const val = fd.get(qName);
    let text = '';
    if (val) {
      const inp = document.querySelector(`input[name="${qName}"][value="${val}"]`);
      text = inp ? escapeHtml(inp.dataset.optText) : translate('table.selected');
    } else {
      text = translate('results.notAnswered');
    }
    rows += `<tr><td>${i+1}</td><td>${escapeHtml(questions[i]?.q || '')}</td><td>${text}</td></tr>`;
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

function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  const root = document.body;
  
  const savedTheme = localStorage.getItem('philosophyTestTheme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  
  themeButtons.forEach(btn => {
    if (btn.dataset.theme === savedTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newTheme = btn.dataset.theme;
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('philosophyTestTheme', newTheme);
      
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (window.philosophyTestAnalytics) {
        window.philosophyTestAnalytics.trackThemeToggle(newTheme);
      }
    });
  });
}

function calculate() {
  const translate = getTranslate();
  const fd = new FormData(document.getElementById('quizForm'));
  const counts = {};
  const philosophyNames = getPhilosophyNames();
  const subtypes = getSubtypes();
  const longDesc = getLongDesc();
  
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
    document.getElementById('result').textContent = translate('notifications.answerAtLeastOne');
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
    desc = `${translate('results.mixedProfile')} ${s1}% / ${s2}%.`;
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
    <h3>${translate('results.title')}</h3>
    <p><b>${translate('results.mainPhilosophy')}</b> ${main}</p>
    <p><b>${translate('results.subtype')}</b> ${sub}</p>
    ${desc ? `<p>${escapeHtml(desc)}</p>` : ''}
    <div class="longdesc"><h4>${translate('results.detailedDescription')}</h4><div id="longdesc-content"></div></div>
    <hr>
    <p><b>${translate('results.meaningIndex')}</b> ${mi}/100</p>
    <div style="background:#e9eef8;height:10px;border-radius:999px;overflow:hidden;margin:8px 0;">
      <div style="height:100%;width:${mi}%;background:var(--accent);transition:width .5s;"></div>
    </div>
    <div id="demo-results" style="margin-top:12px;"><h4>${translate('results.demographicAnswers')}</h4><div id="demo-content"></div></div>
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

  const demographics = getDemographics();
  const demoContent = document.getElementById('demo-content');
  demoContent.innerHTML = '';
  demographics.forEach(d => {
    const val = fd.get(d.name) || translate('results.notAnswered');
    const el = document.createElement('p'); 
    el.innerHTML = `<b>${escapeHtml(d.label)}:</b> ${escapeHtml(val)}`;
    demoContent.appendChild(el);
  });

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

  if (window.philosophyTestAnalytics) {
    window.philosophyTestAnalytics.trackTestComplete(result);
  }
  
  if (window.philosophyTestExport) {
    window.philosophyTestExport.addExportButtons(resultEl, result);
  }
  
  if (typeof showDataConsentModal === 'function') {
    showDataConsentModal(result);
  }
}

function showDataConsentModal(result) {
  const translate = t();
  const existingModal = document.querySelector('.data-consent-modal');
  if (existingModal) existingModal.remove();
  
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(2, 6, 23, 0.7);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s;
  `;
  backdrop.className = 'data-consent-modal';
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: var(--card);
    padding: 24px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    position: relative;
    z-index: 1000000;
  `;
  
  const willSendItems = translate('consent.willSendItems').map(item => `<li>${item}</li>`).join('');
  const wontSendItems = translate('consent.wontSendItems').map(item => `<li>${item}</li>`).join('');
  
  content.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: var(--text);">${translate('consent.title')}</h3>
    <p style="line-height: 1.6; margin: 15px 0; color: var(--text);">
      ${translate('consent.intro')}
    </p>
    <div style="background: rgba(43, 123, 228, 0.1); padding: 12px; border-radius: 8px; margin: 15px 0;">
      <p style="margin: 5px 0; font-size: 13px; color: var(--text);"><strong>${translate('consent.willSend')}</strong></p>
      <ul style="margin: 5px 0; padding-left: 20px; font-size: 13px; color: var(--text);">
        ${willSendItems}
      </ul>
    </div>
    <div style="background: rgba(76, 175, 80, 0.1); padding: 12px; border-radius: 8px; margin: 15px 0;">
      <p style="margin: 5px 0; font-size: 13px; color: var(--text);"><strong>${translate('consent.wontSend')}</strong></p>
      <ul style="margin: 5px 0; padding-left: 20px; font-size: 13px; color: var(--text);">
        ${wontSendItems}
      </ul>
    </div>
    <p style="font-size: 12px; color: var(--muted); margin: 15px 0;">
      ${translate('consent.footer')}
    </p>
  `;
  
  const buttonsDiv = document.createElement('div');
  buttonsDiv.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
    position: relative;
    z-index: 1000001;
  `;
  
  const declineBtn = document.createElement('button');
  declineBtn.textContent = translate('buttons.decline');
  declineBtn.className = 'btn';
  declineBtn.style.cssText = `
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    background: #e0e0e0;
    color: var(--text);
    transition: transform 0.2s;
    position: relative;
    z-index: 1000002;
    pointer-events: auto;
  `;
  
  const acceptBtn = document.createElement('button');
  acceptBtn.textContent = translate('buttons.agree');
  acceptBtn.className = 'btn primary';
  acceptBtn.style.cssText = `
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    background: var(--success);
    color: white;
    transition: transform 0.2s;
    position: relative;
    z-index: 1000002;
    pointer-events: auto;
  `;
  
  acceptBtn.onmouseover = () => {
    acceptBtn.style.transform = 'translateY(-2px)';
    acceptBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  };
  acceptBtn.onmouseout = () => {
    acceptBtn.style.transform = 'translateY(0)';
    acceptBtn.style.boxShadow = 'none';
  };
  
  declineBtn.onmouseover = () => {
    declineBtn.style.transform = 'translateY(-2px)';
  };
  declineBtn.onmouseout = () => {
    declineBtn.style.transform = 'translateY(0)';
  };
  
  acceptBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    backdrop.remove();
    
    if (window.sendTestResults) {
      window.sendTestResults(result);
    }
    if (window.showNotification) {
      showNotification(translate('notifications.thanksSent'), 'success');
    }
  };
  
  declineBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    backdrop.remove();
    if (window.showNotification) {
      showNotification(translate('notifications.notSent'), 'info');
    }
  };
  
  backdrop.onclick = function(e) {
    if (e.target === backdrop) {
      backdrop.remove();
      if (window.showNotification) {
        showNotification(translate('notifications.notSent'), 'info');
      }
    }
  };
  
  content.onclick = function(e) {
    e.stopPropagation();
  };
  
  buttonsDiv.appendChild(declineBtn);
  buttonsDiv.appendChild(acceptBtn);
  content.appendChild(buttonsDiv);
  backdrop.appendChild(content);
  document.body.appendChild(backdrop);
}

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация i18n
  if (window.philosophyTestI18n) {
    window.philosophyTestI18n.initLanguageToggle();
  }
  
  buildDemographics();
  buildQuestions();
  observeAll();
  updateProgress();
  showQuestion(0);
  initThemeToggle();

  if (window.philosophyTestStorage) {
    window.philosophyTestStorage.initProgressSystem();
  }

  const calcBtn = document.getElementById('calcBtn');
  calcBtn.addEventListener('click', () => {
    if (window.philosophyTestStorage) {
      window.philosophyTestStorage.enhancedCalculate(calculate);
    } else {
      calculate();
    }
  });

  const resetBtn = document.getElementById('resetBtn');
  resetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.philosophyTestStorage) {
      window.philosophyTestStorage.enhancedReset();
    } else {
      if (confirm(t()('modals.resetConfirm'))) {
        document.getElementById('quizForm').reset();
        document.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
        showQuestion(0);
        updateProgress();
      }
    }
  });

  console.log('✅ Философский тест полностью загружен с поддержкой i18n');
});
