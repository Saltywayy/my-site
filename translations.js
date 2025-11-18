// translations.js - Система интернационализации (i18n)

const translations = {
  ru: {
    // Заголовки и общее
    siteTitle: "Философский тест — 40 вопросов",
    disclaimer: {
      title: "Дисклеймер:",
      text: "Автор этого теста не претендует на научную объективность или профессиональную психологическую точность. Проект создан в рамках школьной работы Клаудом при поддержке школьника. Результаты носят исключительно ознакомительный характер и не должны рассматриваться как экспертное заключение :)"
    },
    
    // Кнопки и элементы управления
    buttons: {
      viewAnswers: "Просмотр ответов",
      showAll: "Показать все",
      prev: "Назад",
      next: "Далее",
      last: "Последний",
      calculate: "Посчитать результат",
      reset: "Сбросить",
      close: "Закрыть",
      continue: "Продолжить",
      startFresh: "Начать заново",
      understand: "Понятно",
      cancel: "Отмена",
      confirm: "Подтвердить",
      agree: "✓ Согласен, отправить",
      decline: "Не отправлять"
    },
    
    // Прогресс
    progress: {
      question: "Вопрос",
      of: "/"
    },
    
    // Темы
    themes: {
      light: "Светлая тема",
      dark: "Тёмная тема",
      beige: "Бежевая тема"
    },
    
    // Демография
    demographics: {
      population: "Население вашего населённого пункта",
      education: "Наивысший уровень образования",
      field: "В какой области вы работаете или учитесь",
      religion: "Религиозная принадлежность",
      gender: "Пол",
      age: "Возраст (введите число)",
      
      populationOpts: ['до 5 тыс', 'до 30 тыс', 'до 50 тыс', 'до 100 тыс', 'до 500 тыс', 'до 1 млн', 'больше 1 млн'],
      educationOpts: ['Среднее или ниже', 'Среднее специальное/профессиональное', 'Высшее (бакалавр/специалист)', 'Магистратура/аспирантура', 'Докторская степень'],
      fieldOpts: ['Гуманитарные науки/искусство', 'Естественные науки/технологии', 'Бизнес/экономика', 'Медицина/здравоохранение', 'Образование', 'Государственная служба', 'Другое', 'Не работаю/не учусь'],
      religionOpts: ['Верующий (укажите религию)', 'Агностик', 'Атеист', 'Духовный, но не религиозный', 'Другое', 'Предпочитаю не отвечать'],
      genderOpts: ['Мужчина','Женщина','Не указывать'],
      
      agePlaceholder: "Введите возраст",
      religionPlaceholder: "Введите вашу религию",
      religionPrefix: "Верующий:"
    },
    
    // Философии
    philosophies: {
      a: 'Экзистенциализм',
      b: 'Стоицизм',
      c: 'Эвдемонизм',
      d: 'Прагматизм',
      e: 'Утилитаризм',
      f: 'Нигилизм',
      g: 'Гедонизм',
      h: 'Теологический подход',
      i: 'Субъективизм',
      j: 'Абсурдизм',
      k: 'Аристотелизм'
    },
    
    // Подтипы
    subtypes: {
      a: ["Мыслитель", "Созидатель"],
      b: ["Созерцательный стоик", "Активный стоик"],
      c: ["Гармонизатор", "Этический практик"],
      d: ["Прагматик", "Технократ"],
      e: ["Рационалист", "Социальный аналитик"],
      f: ["Скептик", "Меланхоличный"],
      g: ["Эстет", "Любитель жизни"],
      h: ["Верующий", "Духовный искатель"],
      i: ["Индивидуалист", "Релятивист"],
      j: ["Ироник", "Абсурдный наблюдатель"],
      k: ["Классический мудрец", "Добродетельный аналитик"]
    },
    
    // Описания философий
    descriptions: {
      a: "Экзистенциализм — это мировоззрение, согласно которому человек сталкивается с фундаментальной свободой и ответственностью за создание смысла собственной жизни. Экзистенциалисты считают, что смысл не дан заранее — его нельзя найти в религиозных убеждениях, традициях или обществе. Он возникает только через личные выборы, действия и переживания. Ключевыми темами являются тревога, свобода, аутентичность и преодоление абсурда. Такое мировоззрение предполагает глубокую внутреннюю работу и смелость формировать собственный путь.",
      b: "Стоицизм — философия устойчивости, самодисциплины и внутреннего спокойствия. Стоики считают, что человек должен сосредотачиваться на том, что зависит от него, и спокойно принимать то, что изменить невозможно. Добродетель, разум и самообладание — главные ценности стоицизма. Эта философия учит жить в согласии с природой, не поддаваться разрушительным эмоциям и сохранять ясность мышления в любой ситуации.",
      c: "Эвдемонизм — философия гармонии, развития и стремления к реализации своей природы. Центральная идея — счастье (эвдемония) достигается через добродетельную и осознанную жизнь, в которой человек раскрывает свои лучшие качества. Эвдемонизм поощряет самосовершенствование, мудрость, умеренность и баланс между личными стремлениями и моральными принципами. Он не сводит счастье к удовольствию, а понимает его как глубокое состояние внутренней полноты.",
      d: "Прагматизм — философия практического подхода, в которой ценность идеи или действия определяется его полезностью и эффективностью. Прагматисты избегают абстрактных размышлений, не имеющих практического применения. Их интересует то, что работает в реальной жизни. Мировоззрение прагматизма гибкое, реалистичное и направленное на поиск наилучших решений в конкретных обстоятельствах.",
      e: "Утилитаризм — философия максимальной пользы. Она утверждает, что правильным считается то действие, которое создаёт наибольшее количество счастья или уменьшает страдания для наибольшего числа людей. Утилитаристы рассматривают мораль как рациональный расчёт последствий. Это этика ответственности, ориентированная на общий результат и коллективное благо.",
      f: "Нигилизм — мировоззрение отрицания объективных ценностей, смысла и истин. Нигилист видит мир как лишённый высшей цели, мораль как социальную конструкцию, а существование как лишённое фундаментального значения. Это может приводить как к свободе от иллюзий, так и к переживанию пустоты. Нигилизм — не обязательно отрицание всего, но радикальный скепсизм по отношению к любым абсолютам.",
      g: "Гедонизм — философия наслаждения и чувственных ценностей. Гедонист считает, что удовольствие является естественной целью человека и основой благополучия. Это не обязательно праздность: удовольствие может означать богатую эмоциональную жизнь, искусство, эстетические переживания или глубокие межличностные связи. Главная идея — стремление к радости и избеганию боли, при этом сохраняя осознанность.",
      h: "Теологический подход — мировоззрение, строящееся на вере в высшую силу, божественный замысел или духовные истины. Смысл жизни в этом подходе задаётся свыше, а моральные нормы основаны на религиозных текстах или духовных традициях. Это философия порядка, предназначения и связи с трансцендентным. Она помогает человеку ощущать причастность к чему-то большему, чем индивидуальное существование.",
      i: "Субъективизм — философия индивидуального восприятия и личной истины. Она утверждает, что ценности, смыслы и моральные ориентиры определяются самим человеком. В отличие от нигилизма, субъективизм не отрицает смысл — он просто считает его личным и неповторимым. Такое мировоззрение поддерживает свободу, самовыражение и уникальность человеческого опыта.",
      j: "Абсурдизм — философия столкновения человеческого стремления к смыслу с безразличным, хаотичным миром. Абсурдисты утверждают, что мир не имеет заранее заданной логики, но человек может сохранять достоинство, иронию и внутреннюю свободу, признавая абсурд. Это взгляд зрелой трезвости, способный сочетать принятие бессмысленности с жизнеутверждающим отношением.",
      k: "Аристотелизм — философия цели, формы и добродетели, восходящая к учению Аристотеля. Она рассматривает человека как существо, обладающее природным предназначением, которое реализуется через добродетель, разум и гармоничную жизнь. Это мировоззрение подчеркивает важность рациональности, умеренности и стремления к совершенству. Смысл жизни понимается как достижение полной реализации потенциала человека."
    },
    
    // Результаты
    results: {
      title: "Результат",
      mainPhilosophy: "Основная философия:",
      subtype: "Подтип:",
      mixedProfile: "Смешанный профиль:",
      meaningIndex: "Индекс смыслоориентации:",
      detailedDescription: "📖 Подробное описание мировоззрения",
      demographicAnswers: "📋 Демографические ответы",
      notAnswered: "Не отвечено."
    },
    
    // Модальное окно согласия
    consent: {
      title: "🔒 Согласие на обработку данных",
      intro: "Мы собираем анонимную статистику результатов теста для улучшения качества и проведения исследований.",
      willSend: "Что будет отправлено:",
      willSendItems: [
        "Результат теста (философия, подтип, индекс)",
        "Демографические данные (возраст, пол, образование)",
        "Дата и время прохождения"
      ],
      wontSend: "Что НЕ будет отправлено:",
      wontSendItems: [
        "Ваше имя, email или контакты",
        "IP-адрес или местоположение",
        "Любые персональные данные"
      ],
      footer: "Все данные полностью анонимны и используются только для статистики."
    },
    
    // Уведомления
    notifications: {
      progressRestored: "✅ Прогресс восстановлен!",
      startingFresh: "Начинаем с чистого листа!",
      progressSaved: "💾 Прогресс сохранен",
      testReset: "🔄 Тест полностью сброшен",
      fillAllFields: "⚠️ Заполните все демографические поля",
      answerAllQuestions: "⚠️ Ответьте на все {count} вопросов",
      thanksSent: "✅ Спасибо! Данные отправлены анонимно",
      notSent: "Результаты не отправлены",
      answerAtLeastOne: "Ответьте хотя бы на один вопрос с тегами."
    },
    
    // Модальные окна
    modals: {
      allAnswers: "Все ответы",
      resetConfirm: "Сбросить все ответы?",
      resetWarning: "Все ваши ответы будут удалены. Это действие нельзя отменить.",
      unfilledQuestions: "Есть незаполненные вопросы",
      mustAnswerAll: "Не отвечено на {count} вопрос(ов).\n\nНеобходимо ответить на ВСЕ вопросы для получения результатов.",
      resumeProgress: "📌 У вас есть несохраненный прогресс. Хотите продолжить?"
    },
    
    // Таблица ответов
    table: {
      number: "#",
      question: "Вопрос",
      answer: "Ответ",
      selected: "Выбран вариант"
    },
    
    // Дополнительно
    noSuitableOption: "Нет подходящего варианта"
  },
  
  en: {
    // Headers and general
    siteTitle: "Philosophy Test — 40 Questions",
    disclaimer: {
      title: "Disclaimer:",
      text: "The author of this test does not claim scientific objectivity or professional psychological accuracy. This project was created as part of school work by Claude with student support. Results are for informational purposes only and should not be considered expert opinion :)"
    },
    
    // Buttons and controls
    buttons: {
      viewAnswers: "View Answers",
      showAll: "Show All",
      prev: "Back",
      next: "Next",
      last: "Last",
      calculate: "Calculate Result",
      reset: "Reset",
      close: "Close",
      continue: "Continue",
      startFresh: "Start Fresh",
      understand: "Got it",
      cancel: "Cancel",
      confirm: "Confirm",
      agree: "✓ I Agree, Send",
      decline: "Don't Send"
    },
    
    // Progress
    progress: {
      question: "Question",
      of: "of"
    },
    
    // Themes
    themes: {
      light: "Light theme",
      dark: "Dark theme",
      beige: "Beige theme"
    },
    
    // Demographics
    demographics: {
      population: "Population of your city/town",
      education: "Highest level of education",
      field: "What field do you work or study in",
      religion: "Religious affiliation",
      gender: "Gender",
      age: "Age (enter number)",
      
      populationOpts: ['up to 5k', 'up to 30k', 'up to 50k', 'up to 100k', 'up to 500k', 'up to 1M', 'over 1M'],
      educationOpts: ['High school or below', 'Vocational/technical', 'Bachelor\'s/Undergraduate', 'Master\'s/Graduate', 'Doctoral degree'],
      fieldOpts: ['Humanities/Arts', 'Natural sciences/Technology', 'Business/Economics', 'Medicine/Healthcare', 'Education', 'Public service', 'Other', 'Not working/studying'],
      religionOpts: ['Religious (specify religion)', 'Agnostic', 'Atheist', 'Spiritual but not religious', 'Other', 'Prefer not to answer'],
      genderOpts: ['Male','Female','Prefer not to say'],
      
      agePlaceholder: "Enter age",
      religionPlaceholder: "Enter your religion",
      religionPrefix: "Religious:"
    },
    
    // Philosophies
    philosophies: {
      a: 'Existentialism',
      b: 'Stoicism',
      c: 'Eudaimonism',
      d: 'Pragmatism',
      e: 'Utilitarianism',
      f: 'Nihilism',
      g: 'Hedonism',
      h: 'Theological Approach',
      i: 'Subjectivism',
      j: 'Absurdism',
      k: 'Aristotelianism'
    },
    
    // Subtypes
    subtypes: {
      a: ["Thinker", "Creator"],
      b: ["Contemplative Stoic", "Active Stoic"],
      c: ["Harmonizer", "Ethical Practitioner"],
      d: ["Pragmatist", "Technocrat"],
      e: ["Rationalist", "Social Analyst"],
      f: ["Skeptic", "Melancholic"],
      g: ["Aesthete", "Life Lover"],
      h: ["Believer", "Spiritual Seeker"],
      i: ["Individualist", "Relativist"],
      j: ["Ironist", "Absurd Observer"],
      k: ["Classical Sage", "Virtuous Analyst"]
    },
    
    // Philosophy descriptions
    descriptions: {
      a: "Existentialism is a worldview according to which a person faces fundamental freedom and responsibility for creating the meaning of their own life. Existentialists believe that meaning is not given in advance—it cannot be found in religious beliefs, traditions, or society. It arises only through personal choices, actions, and experiences. Key themes are anxiety, freedom, authenticity, and overcoming absurdity. This worldview requires deep inner work and courage to forge one's own path.",
      b: "Stoicism is a philosophy of resilience, self-discipline, and inner peace. Stoics believe that a person should focus on what depends on them and calmly accept what cannot be changed. Virtue, reason, and self-control are the main values of Stoicism. This philosophy teaches living in harmony with nature, not yielding to destructive emotions, and maintaining clarity of thought in any situation.",
      c: "Eudaimonism is a philosophy of harmony, development, and striving to realize one's nature. The central idea is that happiness (eudaimonia) is achieved through a virtuous and conscious life in which a person reveals their best qualities. Eudaimonism encourages self-improvement, wisdom, moderation, and balance between personal aspirations and moral principles. It does not reduce happiness to pleasure but understands it as a deep state of inner fullness.",
      d: "Pragmatism is a philosophy of practical approach in which the value of an idea or action is determined by its usefulness and effectiveness. Pragmatists avoid abstract reflections that have no practical application. They are interested in what works in real life. The worldview of pragmatism is flexible, realistic, and aimed at finding the best solutions in specific circumstances.",
      e: "Utilitarianism is a philosophy of maximum benefit. It states that the right action is one that creates the greatest amount of happiness or reduces suffering for the greatest number of people. Utilitarians view morality as a rational calculation of consequences. This is an ethics of responsibility, focused on overall results and collective well-being.",
      f: "Nihilism is a worldview of denial of objective values, meaning, and truths. A nihilist sees the world as devoid of higher purpose, morality as a social construct, and existence as lacking fundamental significance. This can lead both to freedom from illusions and to experiencing emptiness. Nihilism is not necessarily a denial of everything, but radical skepticism toward any absolutes.",
      g: "Hedonism is a philosophy of pleasure and sensual values. A hedonist believes that pleasure is the natural goal of a person and the basis of well-being. This is not necessarily idleness: pleasure can mean a rich emotional life, art, aesthetic experiences, or deep interpersonal connections. The main idea is the pursuit of joy and avoidance of pain while maintaining awareness.",
      h: "The theological approach is a worldview built on faith in a higher power, divine design, or spiritual truths. The meaning of life in this approach is given from above, and moral norms are based on religious texts or spiritual traditions. This is a philosophy of order, purpose, and connection with the transcendent. It helps a person feel belonging to something greater than individual existence.",
      i: "Subjectivism is a philosophy of individual perception and personal truth. It asserts that values, meanings, and moral guidelines are determined by the person themselves. Unlike nihilism, subjectivism does not deny meaning—it simply considers it personal and unique. Such a worldview supports freedom, self-expression, and the uniqueness of human experience.",
      j: "Absurdism is a philosophy of the collision between human striving for meaning and an indifferent, chaotic world. Absurdists claim that the world has no predetermined logic, but a person can maintain dignity, irony, and inner freedom by recognizing the absurd. This is a view of mature sobriety, capable of combining acceptance of meaninglessness with a life-affirming attitude.",
      k: "Aristotelianism is a philosophy of purpose, form, and virtue, tracing back to Aristotle's teachings. It views a person as a being with a natural purpose, realized through virtue, reason, and harmonious life. This worldview emphasizes the importance of rationality, moderation, and striving for excellence. The meaning of life is understood as achieving full realization of human potential."
    },
    
    // Results
    results: {
      title: "Result",
      mainPhilosophy: "Main Philosophy:",
      subtype: "Subtype:",
      mixedProfile: "Mixed Profile:",
      meaningIndex: "Meaning Orientation Index:",
      detailedDescription: "📖 Detailed Worldview Description",
      demographicAnswers: "📋 Demographic Responses",
      notAnswered: "Not answered."
    },
    
    // Consent modal
    consent: {
      title: "🔒 Data Processing Consent",
      intro: "We collect anonymous test result statistics to improve quality and conduct research.",
      willSend: "What will be sent:",
      willSendItems: [
        "Test result (philosophy, subtype, index)",
        "Demographic data (age, gender, education)",
        "Date and time of completion"
      ],
      wontSend: "What will NOT be sent:",
      wontSendItems: [
        "Your name, email, or contacts",
        "IP address or location",
        "Any personal data"
      ],
      footer: "All data is completely anonymous and used only for statistics."
    },
    
    // Notifications
    notifications: {
      progressRestored: "✅ Progress restored!",
      startingFresh: "Starting with a clean slate!",
      progressSaved: "💾 Progress saved",
      testReset: "🔄 Test completely reset",
      fillAllFields: "⚠️ Fill in all demographic fields",
      answerAllQuestions: "⚠️ Answer all {count} questions",
      thanksSent: "✅ Thank you! Data sent anonymously",
      notSent: "Results not sent",
      answerAtLeastOne: "Answer at least one question with tags."
    },
    
    // Modals
    modals: {
      allAnswers: "All Answers",
      resetConfirm: "Reset all answers?",
      resetWarning: "All your answers will be deleted. This action cannot be undone.",
      unfilledQuestions: "There are unanswered questions",
      mustAnswerAll: "{count} question(s) not answered.\n\nYou must answer ALL questions to get results.",
      resumeProgress: "📌 You have unsaved progress. Would you like to continue?"
    },
    
    // Answer table
    table: {
      number: "#",
      question: "Question",
      answer: "Answer",
      selected: "Option selected"
    },
    
    // Additional
    noSuitableOption: "No suitable option"
  }
};

// Текущий язык (по умолчанию русский)
let currentLanguage = localStorage.getItem('philosophyTestLanguage') || 'ru';

// Функция получения перевода
function t(path) {
  const keys = path.split('.');
  let value = translations[currentLanguage];
  
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key];
    } else {
      console.warn(`Translation not found: ${path} (${currentLanguage})`);
      return path;
    }
  }
  
  return value || path;
}

// Функция смены языка
function setLanguage(lang) {
  if (!translations[lang]) {
    console.error(`Language ${lang} not supported`);
    return;
  }
  
  currentLanguage = lang;
  localStorage.setItem('philosophyTestLanguage', lang);
  
  // Перестроить интерфейс
  if (typeof rebuildInterface === 'function') {
    rebuildInterface();
  }
  
  // Обновить кнопки языка
  updateLanguageButtons();
  
  console.log(`✅ Language changed to: ${lang}`);
}

// Обновление активной кнопки языка
function updateLanguageButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === currentLanguage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Функция инициализации переключателя языка
function initLanguageToggle() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.dataset.lang;
      if (newLang !== currentLanguage) {
        setLanguage(newLang);
        
        if (window.philosophyTestAnalytics) {
          window.philosophyTestAnalytics.trackLanguageChange(newLang);
        }
      }
    });
  });
  
  updateLanguageButtons();
}

// Экспорт
window.philosophyTestI18n = {
  t,
  setLanguage,
  getCurrentLanguage: () => currentLanguage,
  initLanguageToggle,
  translations
};

console.log('🌍 Система переводов инициализирована');
