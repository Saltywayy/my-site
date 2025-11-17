// storage.js - Сохранение прогресса и UX улучшения

// Константы для localStorage
const STORAGE_KEY = 'philosophyTest_answers';
const STORAGE_PROGRESS_KEY = 'philosophyTest_progress';
const STORAGE_TIMESTAMP_KEY = 'philosophyTest_timestamp';
const AUTO_SAVE_INTERVAL = 5000; // 5 секунд
const EXPIRY_DAYS = 7;

let autoSaveTimer;

// Проверка истечения срока хранения
function isDataExpired(timestamp) {
  if (!timestamp) return true;
  const now = Date.now();
  const expiryTime = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return (now - timestamp) > expiryTime;
}

// Сохранить ответы
function saveAnswers() {
  try {
    const form = document.getElementById('quizForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const answers = {};
    
    for (let [key, value] of formData.entries()) {
      answers[key] = value;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    
    // Сохраняем текущий индекс вопроса (если доступен)
    if (typeof currentIndex !== 'undefined') {
      localStorage.setItem(STORAGE_PROGRESS_KEY, currentIndex.toString());
    }
    
    console.log('💾 Прогресс сохранен');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  }
}

// Загрузить ответы
function loadAnswers() {
  try {
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    if (isDataExpired(parseInt(timestamp))) {
      clearSavedData();
      return null;
    }
    
    const savedAnswers = localStorage.getItem(STORAGE_KEY);
    const savedProgress = localStorage.getItem(STORAGE_PROGRESS_KEY);
    
    if (savedAnswers) {
      return {
        answers: JSON.parse(savedAnswers),
        progress: parseInt(savedProgress) || 0
      };
    }
  } catch (error) {
    console.error('Ошибка при загрузке:', error);
  }
  return null;
}

// Очистить сохраненные данные
function clearSavedData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_PROGRESS_KEY);
  localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  console.log('🗑️ Сохраненные данные удалены');
}

// Восстановить ответы из сохраненных данных
function restoreAnswers(data) {
  const form = document.getElementById('quizForm');
  if (!form) return;
  
  for (let [key, value] of Object.entries(data.answers)) {
    const input = form.elements[key];
    if (input) {
      if (input.type === 'radio') {
        const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
        if (radio) {
          radio.checked = true;
          const label = radio.closest('.opt-card');
          if (label) label.classList.add('selected');
        }
      } else {
        input.value = value;
      }
    }
  }
  
  // Восстанавливаем прогресс
  if (typeof showQuestion === 'function') {
    showQuestion(data.progress);
  }
  
  // Обновляем визуальный прогресс
  if (typeof updateProgress === 'function') {
    updateProgress();
  }
  
  showNotification('✅ Прогресс восстановлен!', 'success');
}

// Показать баннер восстановления
function showResumeBanner() {
  const savedData = loadAnswers();
  if (!savedData) return;
  
  const banner = document.createElement('div');
  banner.className = 'resume-banner';
  banner.innerHTML = `
    <div class="message">
      📌 У вас есть несохраненный прогресс. Хотите продолжить?
    </div>
    <div class="actions">
      <button class="btn" id="resumeTest">Продолжить</button>
      <button class="btn secondary" id="startFresh">Начать заново</button>
    </div>
  `;
  
  const mainCard = document.querySelector('main.card');
  if (mainCard) {
    mainCard.insertBefore(banner, mainCard.firstChild);
    
    document.getElementById('resumeTest').addEventListener('click', () => {
      restoreAnswers(savedData);
      banner.remove();
    });
    
    document.getElementById('startFresh').addEventListener('click', () => {
      clearSavedData();
      banner.remove();
      showNotification('Начинаем с чистого листа!', 'success');
    });
  }
}

// Автосохранение
function startAutoSave() {
  stopAutoSave();
  autoSaveTimer = setInterval(() => {
    saveAnswers();
  }, AUTO_SAVE_INTERVAL);
  console.log('🔄 Автосохранение запущено');
}

function stopAutoSave() {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }
}

// Сохранение при выходе со страницы
window.addEventListener('beforeunload', () => {
  saveAnswers();
});

// ОБНОВЛЕНО: Валидация формы (вариант "Нет подходящего варианта" считается за ответ)
function validateForm() {
  const form = document.getElementById('quizForm');
  if (!form) return { isValid: false, errors: [], unfilledQuestions: [] };
  
  const formData = new FormData(form);
  const errors = [];
  const unfilledQuestions = [];
  
  // Проверяем демографические поля
  const demoFields = ['population', 'education', 'field', 'religion_ident', 'gender', 'age'];
  demoFields.forEach(field => {
    if (!formData.get(field)) {
      errors.push(`Не заполнено поле: ${getDemographicLabel(field)}`);
    }
  });
  
  // ИЗМЕНЕНО: Проверяем вопросы - любой выбор (включая "Нет подходящего варианта") считается ответом
  if (typeof questionsData !== 'undefined') {
    for (let i = 1; i <= questionsData.length; i++) {
      const questionName = `q${i}`;
      // Проверяем, выбрана ли хотя бы одна радиокнопка для этого вопроса
      const hasAnswer = form.querySelector(`input[name="${questionName}"]:checked`);
      
      if (!hasAnswer) {
        unfilledQuestions.push(i);
      }
    }
    
    // ВАЖНО: Даже если выбран вариант с пустыми тегами (tags: []), это считается ответом
    if (unfilledQuestions.length > 0) {
      errors.push(`Не отвечено на ${unfilledQuestions.length} вопрос(ов): ${unfilledQuestions.slice(0, 5).join(', ')}${unfilledQuestions.length > 5 ? '...' : ''}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    unfilledQuestions
  };
}

function getDemographicLabel(fieldName) {
  const labels = {
    population: 'Население',
    education: 'Образование',
    field: 'Область работы/учебы',
    religion_ident: 'Религиозная принадлежность',
    gender: 'Пол',
    age: 'Возраст'
  };
  return labels[fieldName] || fieldName;
}

// Подсветить незаполненные вопросы
function highlightUnfilledQuestions(questionNumbers) {
  // Убираем предыдущую подсветку
  document.querySelectorAll('.unfilled-question').forEach(el => {
    el.classList.remove('unfilled-question');
  });
  
  // Добавляем подсветку
  questionNumbers.forEach(num => {
    const questionCard = document.querySelector(`.question-card[data-index="${num-1}"]`);
    if (questionCard) {
      questionCard.classList.add('unfilled-question');
      setTimeout(() => questionCard.classList.remove('unfilled-question'), 2000);
    }
  });
}

// Модальное окно подтверждения
function showConfirmModal(title, message, onConfirm, onCancel) {
  const modal = document.createElement('div');
  modal.className = 'confirm-modal show';
  modal.innerHTML = `
    <div class="confirm-content">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="confirm-buttons">
        <button class="btn" id="confirmCancel">Отмена</button>
        <button class="btn primary" id="confirmOk">Подтвердить</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('confirmOk').addEventListener('click', () => {
    modal.remove();
    if (onConfirm) onConfirm();
  });
  
  document.getElementById('confirmCancel').addEventListener('click', () => {
    modal.remove();
    if (onCancel) onCancel();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onCancel) onCancel();
    }
  });
}

// Уведомления
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ОБНОВЛЕНО: Улучшенная функция расчета с валидацией
function enhancedCalculate(originalCalculateFunc) {
  const validation = validateForm();
  
  // ИЗМЕНЕНО: Теперь вариант "Нет подходящего варианта" не вызывает предупреждение
  if (!validation.isValid) {
    showNotification('⚠️ Пожалуйста, ответьте на все вопросы', 'warning');
    
    setTimeout(() => {
      const errorList = validation.errors.slice(0, 3).join('\n');
      showConfirmModal(
        'Есть незаполненные поля',
        `${errorList}\n\nВы можете продолжить без заполнения всех полей, но результаты будут менее точными.`,
        () => {
          originalCalculateFunc();
          clearSavedData();
        }
      );
    }, 500);
    
    if (validation.unfilledQuestions.length > 0) {
      highlightUnfilledQuestions(validation.unfilledQuestions.slice(0, 5));
    }
    
    return false;
  }
  
  // Все вопросы отвечены (включая "Нет подходящего варианта")
  originalCalculateFunc();
  clearSavedData();
  return true;
}

// Улучшенная функция сброса с подтверждением
function enhancedReset(originalResetFunc) {
  showConfirmModal(
    'Сбросить все ответы?',
    'Все ваши ответы будут удалены. Это действие нельзя отменить.',
    () => {
      if (originalResetFunc) originalResetFunc();
      
      clearSavedData();
      
      // Очищаем визуальные выделения
      document.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
      document.querySelectorAll('.demo-card .opt-card').forEach(c => c.classList.remove('selected'));
      
      // Сбрасываем возраст
      const ageInput = document.querySelector('input[name="age"]');
      if (ageInput) ageInput.value = '';
      
      // Возвращаемся к первому вопросу
      if (typeof showQuestion === 'function') {
        showQuestion(0);
      }
      
      if (typeof updateProgress === 'function') {
        updateProgress();
      }
      
      showNotification('🔄 Тест сброшен', 'success');
      
      if (window.philosophyTestAnalytics) {
        window.philosophyTestAnalytics.trackReset();
      }
    }
  );
}

// Инициализация системы хранения
function initProgressSystem() {
  console.log('💾 Инициализация системы сохранения прогресса...');
  
  // Показываем баннер восстановления
  showResumeBanner();
  
  // Запускаем автосохранение
  startAutoSave();
  
  // Сохраняем при каждом изменении
  const form = document.getElementById('quizForm');
  if (form) {
    form.addEventListener('change', () => {
      saveAnswers();
    });
  }
  
  console.log('✅ Система сохранения прогресса инициализирована');
}

// Экспорт функций
window.philosophyTestStorage = {
  saveAnswers,
  loadAnswers,
  clearSavedData,
  restoreAnswers,
  showResumeBanner,
  startAutoSave,
  stopAutoSave,
  validateForm,
  highlightUnfilledQuestions,
  showConfirmModal,
  showNotification,
  enhancedCalculate,
  enhancedReset,
  initProgressSystem
};

console.log('💾 Модуль сохранения прогресса инициализирован');
