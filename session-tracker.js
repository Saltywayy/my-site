// session-tracker.js - Отслеживание времени на сайте и уникального ID устройства

(function() {
  'use strict';

  // Генерация уникального ID устройства
  function generateDeviceId() {
    // Собираем fingerprint браузера
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
    const canvasData = canvas.toDataURL();
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      canvasData.substring(0, 50) // Часть canvas fingerprint
    ].join('|||');
    
    // Создаем hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Преобразуем в hex и добавляем timestamp для уникальности
    const deviceId = 'DEV_' + Math.abs(hash).toString(16).toUpperCase() + '_' + Date.now().toString(36);
    return deviceId;
  }

  // Получить или создать Device ID
  function getDeviceId() {
    let deviceId = localStorage.getItem('philosophyTest_deviceId');
    
    if (!deviceId) {
      deviceId = generateDeviceId();
      localStorage.setItem('philosophyTest_deviceId', deviceId);
      console.log('🆔 Новый Device ID создан:', deviceId);
    } else {
      console.log('🆔 Device ID загружен:', deviceId);
    }
    
    return deviceId;
  }

  // Получить количество прохождений теста с этого устройства
  function getTestCompletionCount() {
    const count = parseInt(localStorage.getItem('philosophyTest_completionCount') || '0');
    return count;
  }

  // Увеличить счетчик прохождений
  function incrementTestCompletionCount() {
    const count = getTestCompletionCount() + 1;
    localStorage.setItem('philosophyTest_completionCount', count.toString());
    console.log('📊 Прохождений с этого устройства:', count);
    return count;
  }

  // Класс для отслеживания времени на сайте
  class SessionTimer {
    constructor() {
      this.startTime = null;
      this.totalTime = 0; // в секундах
      this.isActive = false;
      this.timerInterval = null;
      this.displayElement = null;
      
      this.init();
    }

    init() {
      // Загружаем сохраненное время из localStorage
      const savedTime = localStorage.getItem('philosophyTest_sessionTime');
      const savedStart = localStorage.getItem('philosophyTest_sessionStart');
      
      if (savedTime) {
        this.totalTime = parseInt(savedTime) || 0;
      }
      
      if (savedStart) {
        this.startTime = parseInt(savedStart);
      } else {
        this.startTime = Date.now();
        localStorage.setItem('philosophyTest_sessionStart', this.startTime.toString());
      }
      
      this.start();
      this.createDisplay();
      
      // Сохраняем время перед закрытием страницы
      window.addEventListener('beforeunload', () => {
        this.save();
      });
      
      // Автосохранение каждые 5 секунд
      setInterval(() => {
        this.save();
      }, 5000);
      
      console.log('⏱️ Таймер сессии инициализирован');
    }

    start() {
      if (this.isActive) return;
      
      this.isActive = true;
      this.timerInterval = setInterval(() => {
        this.totalTime++;
        this.updateDisplay();
      }, 1000);
    }

    stop() {
      if (!this.isActive) return;
      
      this.isActive = false;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.save();
    }

    save() {
      localStorage.setItem('philosophyTest_sessionTime', this.totalTime.toString());
    }

    reset() {
      this.totalTime = 0;
      this.startTime = Date.now();
      localStorage.setItem('philosophyTest_sessionTime', '0');
      localStorage.setItem('philosophyTest_sessionStart', this.startTime.toString());
      this.updateDisplay();
      console.log('⏱️ Таймер сброшен');
    }

    getTimeInSeconds() {
      return this.totalTime;
    }

    getFormattedTime() {
      const hours = Math.floor(this.totalTime / 3600);
      const minutes = Math.floor((this.totalTime % 3600) / 60);
      const seconds = this.totalTime % 60;
      
      if (hours > 0) {
        return `${hours}ч ${minutes}м ${seconds}с`;
      } else if (minutes > 0) {
        return `${minutes}м ${seconds}с`;
      } else {
        return `${seconds}с`;
      }
    }

    createDisplay() {
      // Создаем элемент для отображения таймера
      this.displayElement = document.createElement('div');
      this.displayElement.id = 'sessionTimer';
      this.displayElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--card);
        color: var(--text);
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: var(--shadow);
        border: 1px solid var(--border);
        z-index: 100;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.3s ease;
      `;
      
      this.displayElement.innerHTML = `
        <span style="font-size: 14px;">⏱️</span>
        <span id="timerText">0с</span>
      `;
      
      document.body.appendChild(this.displayElement);
      this.updateDisplay();
      
      // Добавляем hover эффект
      this.displayElement.addEventListener('mouseenter', () => {
        this.displayElement.style.transform = 'scale(1.05)';
      });
      
      this.displayElement.addEventListener('mouseleave', () => {
        this.displayElement.style.transform = 'scale(1)';
      });
    }

    updateDisplay() {
      const textElement = document.getElementById('timerText');
      if (textElement) {
        textElement.textContent = this.getFormattedTime();
      }
    }

    destroy() {
      this.stop();
      if (this.displayElement) {
        this.displayElement.remove();
      }
    }
  }

  // Глобальная инициализация
  const deviceId = getDeviceId();
  const sessionTimer = new SessionTimer();

  // Экспортируем в window
  window.philosophyTestSession = {
    getDeviceId: () => deviceId,
    getSessionTime: () => sessionTimer.getTimeInSeconds(),
    getFormattedSessionTime: () => sessionTimer.getFormattedTime(),
    getTestCompletionCount: getTestCompletionCount,
    incrementTestCompletionCount: incrementTestCompletionCount,
    resetTimer: () => sessionTimer.reset(),
    
    // Получить полные данные сессии для отправки
    getSessionData: () => {
      return {
        deviceId: deviceId,
        sessionTime: sessionTimer.getTimeInSeconds(),
        sessionTimeFormatted: sessionTimer.getFormattedTime(),
        completionCount: getTestCompletionCount(),
        startTime: new Date(sessionTimer.startTime).toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  };

  console.log('✅ Session Tracker инициализирован');
  console.log('🆔 Device ID:', deviceId);
  console.log('📊 Прохождений:', getTestCompletionCount());

})();
