// analytics.js - Аналитика (Google Analytics + Яндекс.Метрика)

// ЗАМЕНИТЕ ЭТИ ЗНАЧЕНИЯ НА ВАШИ РЕАЛЬНЫЕ ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 
const YM_COUNTER_ID = 12345678;

// Google Analytics 4
(function() {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_title: 'Философский тест',
    page_location: window.location.href
  });
  window.gtag = gtag;
})();

// Яндекс.Метрика
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) { return; }
  }
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(YM_COUNTER_ID, "init", {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true
});

// Функции отслеживания событий
window.philosophyTestAnalytics = {
  trackTestStart: function() {
    if (window.gtag) {
      gtag('event', 'test_start', {
        event_category: 'engagement',
        event_label: 'Начало прохождения теста'
      });
    }
    if (window.ym) {
      ym(YM_COUNTER_ID, 'reachGoal', 'test_start');
    }
    console.log('📊 Событие: начало теста');
  },

  trackProgress: function(questionNumber) {
    if (questionNumber % 10 === 0) {
      if (window.gtag) {
        gtag('event', 'test_progress', {
          event_category: 'engagement',
          event_label: `Вопрос ${questionNumber}`,
          value: questionNumber
        });
      }
      if (window.ym) {
        ym(YM_COUNTER_ID, 'reachGoal', `progress_${questionNumber}`);
      }
      console.log(`📊 Прогресс: вопрос ${questionNumber}`);
    }
  },

  trackTestComplete: function(result) {
    if (window.gtag) {
      gtag('event', 'test_complete', {
        event_category: 'conversion',
        event_label: result.philosophy || 'unknown',
        value: result.meaningIndex || 0
      });
    }
    if (window.ym) {
      ym(YM_COUNTER_ID, 'reachGoal', 'test_complete', {
        philosophy: result.philosophy,
        meaningIndex: result.meaningIndex
      });
    }
    console.log('📊 Событие: тест завершен', result);
  },

  trackExport: function(exportType) {
    if (window.gtag) {
      gtag('event', 'export_result', {
        event_category: 'engagement',
        event_label: exportType
      });
    }
    if (window.ym) {
      ym(YM_COUNTER_ID, 'reachGoal', `export_${exportType}`);
    }
    console.log(`📊 Экспорт: ${exportType}`);
  },

  trackReset: function() {
    if (window.gtag) {
      gtag('event', 'test_reset', {
        event_category: 'engagement'
      });
    }
    if (window.ym) {
      ym(YM_COUNTER_ID, 'reachGoal', 'test_reset');
    }
    console.log('📊 Событие: сброс теста');
  },

  trackThemeToggle: function(theme) {
    if (window.gtag) {
      gtag('event', 'theme_toggle', {
        event_category: 'engagement',
        event_label: theme
      });
    }
    if (window.ym) {
      ym(YM_COUNTER_ID, 'reachGoal', `theme_${theme}`);
    }
    console.log(`📊 Тема изменена: ${theme}`);
  },

  trackDemographics: function(demographics) {
    if (window.gtag) {
      gtag('event', 'demographics_filled', {
        event_category: 'engagement',
        age_range: getAgeRange(demographics.age),
        education: demographics.education,
        gender: demographics.gender
      });
    }
    if (window.ym) {
      ym(YM_COUNTER_ID, 'reachGoal', 'demographics_filled');
    }
    console.log('📊 Демография заполнена');
  }
};

// Вспомогательная функция для группировки возраста
function getAgeRange(age) {
  if (!age) return 'not_specified';
  age = parseInt(age);
  if (age < 18) return 'under_18';
  if (age < 25) return '18-24';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  if (age < 65) return '55-64';
  return '65+';
}

// Отслеживание времени на сайте
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
  const timeSpent = Math.round((Date.now() - startTime) / 1000);
  if (window.gtag) {
    gtag('event', 'time_on_site', {
      event_category: 'engagement',
      value: timeSpent,
      event_label: `${timeSpent} секунд`
    });
  }
});

console.log('📊 Аналитика инициализирована (Google Analytics + Яндекс.Метрика)');
