 // --- Helper utilities ---
  function random(a) { return a[Math.floor(Math.random()*a.length)]; }
  function escapeHtml(str) { return String(str||'').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }

  // --- Build UI: inject questions as cards, but keep them single-view for Next/Back ---
  const questionsArea = document.getElementById('questionsArea');
  const demographicsArea = document.getElementById('demographicsArea');
  const totalQ = questionsData.length;
  let currentIndex = 0;

  // Demographic definitions (names should NOT start with 'q' so progress doesn't count them)
  const demographics = [
    {name: 'population', label: 'Население вашего населённого пункта', opts: ['до 5 тыс', 'до 30 тыс', 'до 50 тыс', 'до 100 тыс', 'до 500 тыс', 'до 1 млн', 'больше 1 млн']},
    {name: 'education', label: 'Наивысший уровень образования', opts: ['Среднее или ниже', 'Среднее специальное/профессиональное', 'Высшее (бакалавр/специалист)', 'Магистратура/аспирантура', 'Докторская степень']},
    {name: 'field', label: 'В какой области вы работаете или учитесь', opts: ['Гуманитарные науки/искусство', 'Естественные науки/технологии', 'Бизнес/экономика', 'Медицина/здравоохранение', 'Образование', 'Государственная служба', 'Другое', 'Не работаю/не учусь']},
    {name: 'religion_ident', label: 'Религиозная принадлежность', opts: ['Верующий (укажите религию)', 'Агностик', 'Атеист', 'Духовный, но не религиозный', 'Другое', 'Предпочитаю не отвечать']},
    {name: 'gender', label: 'Пол', opts: ['Мужчина','Женщина','Не указывать']},
    {name: 'age', label: 'Возраст (введите число)', opts: null} // age will be an input
  ];

  function buildDemographics() {
    demographicsArea.innerHTML = '';
    demographics.forEach(d => {
      const div = document.createElement('div');
      div.className = 'demo-card reveal';
      const header = document.createElement('div'); header.className = 'question-header';
      header.innerHTML = `<div style="display:flex;align-items:center;"><div class="qtext">${escapeHtml(d.label)}</div></div>`;
      div.appendChild(header);
      const body = document.createElement('div');
      body.style.marginTop = '8px';

      if (d.name === 'age') {
        const inp = document.createElement('input');
        inp.type = 'number'; inp.name = d.name; inp.min = 10; inp.max = 120; inp.placeholder = 'Введите возраст';
        inp.style.padding = '8px'; inp.style.borderRadius = '8px'; inp.style.border = '1px solid rgba(0,0,0,0.06)';
        body.appendChild(inp);
      } else {
        const optsWrap = document.createElement('div'); optsWrap.className = 'options';
        d.opts.forEach((o, i) => {
          const lbl = document.createElement('label'); lbl.className = 'opt-card'; lbl.tabIndex = 0; lbl.style.padding = '8px';
          const input = document.createElement('input'); input.type = 'radio'; input.name = d.name; input.value = o;
          const span = document.createElement('span'); span.className = 'otext'; span.textContent = o;
          lbl.appendChild(input); lbl.appendChild(span);
          lbl.addEventListener('click', () => {
            const radios = lbl.parentElement.querySelectorAll('input[type=radio][name="' + input.name + '"]');
            radios.forEach(r => r.checked = false);
            input.checked = true;
            // visual
            lbl.parentElement.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
            lbl.classList.add('selected');
          });
          lbl.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); lbl.click(); } });
          optsWrap.appendChild(lbl);
        });
        body.appendChild(optsWrap);
      }

      div.appendChild(body);
      demographicsArea.appendChild(div);
    });
  }

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
        // create radio hidden
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

        // click selects and toggles visual
        lbl.addEventListener('click', (e) => {
          const radios = lbl.parentElement.querySelectorAll('input[type=radio][name="' + input.name + '"]');
          radios.forEach(r => r.checked = false);
          input.checked = true;
          updateSelectedVisual(lbl.parentElement, input.name);
          updateProgress();
        });
        // keyboard select
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
      if (inp && inp.name === name && inp.checked) c.classList.add('selected'); else c.classList.remove('selected');
    });
  }

  // IntersectionObserver for reveal animations
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add('visible');
    });
  }, {threshold:0.12});

  function observeAll() {
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // Navigation handlers
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const qCounter = document.getElementById('qCounter');
  const progressBar = document.getElementById('globalProgressBar');
  const progressText = document.getElementById('progressText');

  function showQuestion(idx) {
    if (idx < 0) idx = 0;
    if (idx >= totalQ) idx = totalQ-1;
    const prev = document.querySelector('.question-card:not(.hidden)');
    if (prev) prev.classList.add('hidden');
    const cur = document.querySelector(`.question-card[data-index="${idx}"]`);
    if (cur) cur.classList.remove('hidden');
    currentIndex = idx;
    qCounter.textContent = `Вопрос ${idx+1} / ${totalQ}`;
    prevBtn.disabled = idx === 0;
    nextBtn.textContent = idx === totalQ-1 ? 'Последний' : 'Далее';
    // ensure reveal observes
    io.observe(cur);
    updateProgress();
  }

  prevBtn.addEventListener('click', () => showQuestion(currentIndex-1));
  nextBtn.addEventListener('click', () => showQuestion(currentIndex+1));

  // update global progress: percentage of answered questions (only q... fields)
  function updateProgress() {
    const fd = new FormData(document.getElementById('quizForm'));
    let answered = 0;
    for (let [k,v] of fd.entries()) {
      if (k.startsWith('q') && v) answered++;
    }
    const percent = Math.round((answered/totalQ)*100);
    progressBar.style.width = percent + '%';
    progressText.textContent = `${answered} / ${totalQ}`;
  }

  // modal summary
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  document.getElementById('openSummary').addEventListener('click', openSummary);
  document.getElementById('showAllBtn').addEventListener('click', openSummary);
  document.getElementById('closeModal').addEventListener('click', closeSummary);
  modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeSummary(); });

  function openSummary() {
    // build table of demographics + Q / selected answer
    const fd = new FormData(document.getElementById('quizForm'));
    let rows = '<table class="summary-table"><thead><tr><th>#</th><th>Вопрос</th><th>Ответ</th></tr></thead><tbody>';

    // first: demographics (explicit list)
    const demoOrder = ['population','education','field','religion_ident','gender','age'];
    let rnum = 0;
    demoOrder.forEach(name => {
      rnum++;
      const val = fd.get(name);
      const label = demographics.find(d=>d.name===name)?.label || name;
      const text = val ? escapeHtml(val) : 'Не отвечено.'; // <-- changed to exact wording
      rows += `<tr><td>Д${rnum}</td><td>${escapeHtml(label)}</td><td>${text}</td></tr>`;
    });

    // then: questions
    for (let i=0;i<totalQ;i++) {
      const qName = `q${i+1}`;
      const val = fd.get(qName);
      let text = '';
      if (val) {
        // find opt text by scanning inputs
        const inp = document.querySelector(`input[name="${qName}"][value="${val}"]`);
        text = inp ? escapeHtml(inp.dataset.optText) : 'Выбран вариант';
      } else text = 'Не отвечено.'; // <-- changed to exact wording
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

  // theme toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const root = document.body;
    const cur = root.getAttribute('data-theme') || 'light';
    root.setAttribute('data-theme', cur === 'light' ? 'dark' : 'light');
  });

  // Reset: clear selected visuals
  document.getElementById('resetBtn').addEventListener('click', () => {
    setTimeout(() => {
      document.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
      // also clear demographic selections visuals
      document.querySelectorAll('.demo-card .opt-card').forEach(c => c.classList.remove('selected'));
      // reset age input
      const age = document.querySelector('input[name="age"]'); if (age) age.value = '';
      showQuestion(0);
      updateProgress();
    },20);
  });

  // --- Improved calculate() (robust, from earlier patch) ---
  function calculate() {
    const fd = new FormData(document.getElementById('quizForm'));
    const counts = {}; Object.keys(philosophyNames).forEach(t => counts[t]=0);
    let answered = 0;

    for (let [key,val] of fd.entries()) {
      if (!key.startsWith('q')) continue;
      if (!val) continue;
      let tags = val.split(',').map(s => s.trim()).filter(Boolean);
      if (tags.length === 0) continue;
      answered++;
      let share = 1 / tags.length;
      tags.forEach(t => { if (counts.hasOwnProperty(t)) counts[t]+=share; });
    }

    if (!answered) {
      document.getElementById('result').textContent = 'Ответьте хотя бы на один вопрос с тегами.';
      return;
    }

    const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    const top = sorted[0], sec = sorted[1] || ['-',0];

    let main='', sub='', desc='';

    let isMixed = (top[1] > 0 && sec[1] > 0 && ((top[1]-sec[1]) / top[1]) < 0.20);

    if (isMixed) {
      let s1 = Math.round((top[1] / (top[1] + sec[1])) * 100);
      let s2 = 100 - s1;
      main = `${escapeHtml(philosophyNames[top[0]])} — ${escapeHtml(philosophyNames[sec[0]])} (${s1}/${s2})`;
      sub = `${escapeHtml(random(subtypes[top[0]]))} / ${escapeHtml(random(subtypes[sec[0]]))}`;
      desc = `Смешанный профиль: ${s1}% / ${s2}%.`;
    } else {
      main = escapeHtml(philosophyNames[top[0]]);
      sub = escapeHtml(random(subtypes[top[0]]));
      // do not duplicate the same definition twice: keep desc short and show full description once below
      desc = '';
    }

    let totalW = Object.values(counts).reduce((a,b)=>a+b,0);
    let wSum = 0;
    for (let t in counts) wSum += counts[t]*meaningWeights[t];
    let mi = 0;
    if (totalW > 0) {
      mi = Math.round(wSum/totalW);
      mi = Math.max(0,Math.min(100,mi));
    } else mi = 0;

    const resultEl = document.getElementById('result');
    resultEl.innerHTML = `
      <h3>Результат</h3>
      <p><b>Основная философия:</b> ${main}</p>
      <p><b>Подтип:</b> ${sub}</p>
      ${desc ? `<p>${escapeHtml(desc)}</p>` : ''}
      <div class="longdesc"><h4>📖 Подробное описание мировоззрения</h4><div id="longdesc-content"></div></div>
      <hr>
      <p><b>Индекс смыслоориентации:</b> ${mi}/100</p>
      <div class="bar-container"><div class="bar" style="width:${mi}%"></div></div>
      <div id="demo-results" style="margin-top:12px;"><h4>📋 Демографические ответы</h4><div id="demo-content"></div></div>
    `;

    const longDescContainer = document.getElementById('longdesc-content');
    longDescContainer.innerHTML = '';
    if (isMixed) {
      const p1 = document.createElement('p'); p1.textContent = philosophyNames[top[0]] + ': ' + (longDesc[top[0]]||'');
      const p2 = document.createElement('p'); p2.textContent = philosophyNames[sec[0]] + ': ' + (longDesc[sec[0]]||'');
      longDescContainer.appendChild(p1); longDescContainer.appendChild(p2);
    } else {
      const p = document.createElement('p'); p.textContent = longDesc[top[0]] || '';
      longDescContainer.appendChild(p);
    }

    // show demographic answers
    const demoContent = document.getElementById('demo-content');
    demoContent.innerHTML = '';
    const fd2 = new FormData(document.getElementById('quizForm'));
    demographics.forEach(d => {
      const val = fd2.get(d.name) || 'Не отвечено.';
      const el = document.createElement('p'); el.innerHTML = `<b>${escapeHtml(d.label)}:</b> ${escapeHtml(val)}`;
      demoContent.appendChild(el);
    });
  }

  // attach calc button
  document.getElementById('calcBtn').addEventListener('click', calculate);

  // Build everything
  buildDemographics();
  buildQuestions();
  observeAll();
  updateProgress();
  showQuestion(0);

  </script>
</body>
</html>
