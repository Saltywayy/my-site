// session-tracker.js - Отслеживание Device ID и времени сессии

(function() {
  'use strict';

  const DEVICE_ID_KEY = 'philosophyTest_deviceId';
  const SESSION_START_KEY = 'philosophyTest_sessionStart';
  const COMPLETION_COUNT_KEY = 'philosophyTest_completionCount';

  // Генерация уникального Device ID
  function generateDeviceId() {
    return 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Получение или создание Device ID
  function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = generateDeviceId();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
      console.log('🆔 Создан новый Device ID:', deviceId);
    }
    return deviceId;
  }

  // Получение времени начала сессии
  function getSessionStartTime() {
    let startTime = sessionStorage.getItem(SESSION_START_KEY);
    if (!startTime) {
      startTime = Date.now().toString();
      sessionStorage.setItem(SESSION_START_KEY, startTime);
      console.log('⏱️ Начало сессии зафиксировано');
    }
    return parseInt(startTime);
  }

  // Вычисление времени сессии
  function getSessionDuration() {
    const startTime = getSessionStartTime();
    const now = Date.now();
    const durationMs = now - startTime;
    
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}ч ${minutes % 60}м`;
    } else if (minutes > 0) {
      return `${minutes}м ${seconds % 60}с`;
    } else {
      return `${seconds}с`;
    }
  }

  // Получение счетчика прохождений
  function getCompletionCount() {
    const count = localStorage.getItem(COMPLETION_COUNT_KEY);
    return count ? parseInt(count) : 0;
  }

  // Увеличение счетчика прохождений
  function incrementCompletionCount() {
    const count = getCompletionCount() + 1;
    localStorage.setItem(COMPLETION_COUNT_KEY, count.toString());
    console.log('📊 Счетчик прохождений обновлен:', count);
    return count;
  }

  // Сбор всех данных сессии
  function getSessionData() {
    return {
      deviceId: getDeviceId(),
      sessionStartTime: getSessionStartTime(),
      sessionTimeFormatted: getSessionDuration(),
      completionCount: getCompletionCount(),
      startTime: new Date(getSessionStartTime()).toLocaleString('ru-RU'),
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // Отображение таймера сессии (опционально)
  function showSessionTimer() {
    // Проверяем, не существует ли уже таймер
    if (document.getElementById('sessionTimer')) {
      return;
    }

    const timerEl = document.createElement('div');
    timerEl.id = 'sessionTimer';
    timerEl.innerHTML = '⏱️ <span id="timerValue">0:00</span>';
    document.body.appendChild(timerEl);

    // Обновляем каждую секунду
    setInterval(() => {
      const duration = getSessionDuration();
      const valueEl = document.getElementById('timerValue');
      if (valueEl) {
        valueEl.textContent = duration;
      }
    }, 1000);
    
    console.log('⏱️ Таймер сессии запущен');
  }

  // Экспорт функций
  window.philosophyTestSession = {
    getDeviceId,
    getSessionStartTime,
    getSessionDuration,
    getCompletionCount,
    incrementCompletionCount: incrementCompletionCount,
    getSessionData,
    showSessionTimer
  };

  // Инициализация при загрузке
  console.log('📊 Session Tracker инициализирован');
  console.log('🆔 Device ID:', getDeviceId());
  console.log('⏱️ Время сессии:', getSessionDuration());
  console.log('🔄 Прохождений с устройства:', getCompletionCount());

  // ✅ ВКЛЮЧАЕМ таймер автоматически
  showSessionTimer();

})();
