// results-sender.js - Отправка результатов в Telegram с временем и Device ID

(function() {
  'use strict';

  // ⚠️ ВАЖНО: Замените на ваши данные
  const TELEGRAM_BOT_TOKEN = '8144304163:AAFUmGtCKg95KOliytaaS8f6TOijQFvYXsU'; // Получите у @BotFather
  const TELEGRAM_CHAT_ID = '657863328'; // Ваш chat_id

  // Форматирование результатов для отправки в Telegram
  function formatResultsForTelegram(result) {
    const sessionData = window.philosophyTestSession?.getSessionData() || {};
    
    let message = '📊 *НОВЫЙ РЕЗУЛЬТАТ ТЕСТА*\n\n';
    
    // Device ID и статистика
    message += `🆔 *Device ID:* \`${sessionData.deviceId || 'N/A'}\`\n`;
    message += `🔄 *Прохождений с устройства:* ${sessionData.completionCount || 0}\n`;
    message += `⏱️ *Время на сайте:* ${sessionData.sessionTimeFormatted || 'N/A'}\n`;
    message += `📅 *Дата:* ${new Date().toLocaleString('ru-RU')}\n\n`;
    
    // Результаты теста
    message += `🧠 *Философия:* ${result.philosophy}\n`;
    message += `🎭 *Подтип:* ${result.subtype}\n`;
    message += `📈 *Индекс смысла:* ${result.meaningIndex}/100\n\n`;
    
    // Демография
    message += '👤 *ДЕМОГРАФИЯ:*\n';
    for (let [key, value] of Object.entries(result.demographics || {})) {
      message += `• ${key}: ${value}\n`;
    }
    
    // Техническая информация
    message += `\n🖥️ *ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ:*\n`;
    message += `• Браузер: ${sessionData.userAgent?.substring(0, 50) || 'N/A'}...\n`;
    message += `• Язык: ${sessionData.language || 'N/A'}\n`;
    message += `• Разрешение: ${sessionData.screenResolution || 'N/A'}\n`;
    message += `• Часовой пояс: ${sessionData.timezone || 'N/A'}\n`;
    message += `• Начало сессии: ${sessionData.startTime || 'N/A'}\n`;
    
    // Статус устройства
    const completionCount = sessionData.completionCount || 0;
    if (completionCount === 1) {
      message += `\n✅ *Первое прохождение с этого устройства*`;
    } else {
      message += `\n⚠️ *Повторное прохождение (#${completionCount})*`;
    }
    
    return message;
  }

  // Отправка в Telegram
  async function sendToTelegram(result) {
    try {
      const message = formatResultsForTelegram(result);
      
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.ok) {
        console.log('✅ Результаты успешно отправлены в Telegram');
        
        // Увеличиваем счетчик прохождений
        if (window.philosophyTestSession) {
          window.philosophyTestSession.incrementTestCompletionCount();
        }
        
        return true;
      } else {
        throw new Error(data.description || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Ошибка отправки в Telegram:', error);
      return false;
    }
  }

  // Проверка конфигурации
  function checkConfiguration() {
    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || 
        TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
      console.warn('⚠️ ВНИМАНИЕ: Не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
      console.warn('📖 Инструкция:');
      console.warn('1. Создайте бота через @BotFather и получите токен');
      console.warn('2. Узнайте свой chat_id через @userinfobot');
      console.warn('3. Замените значения в results-sender.js');
      return false;
    }
    return true;
  }

  // Экспорт функции
  window.sendTestResults = async function(result) {
    if (!checkConfiguration()) {
      console.warn('⚠️ Telegram не настроен, результаты не отправлены');
      return false;
    }

    console.log('📤 Отправка результатов в Telegram...');
    const success = await sendToTelegram(result);
    
    if (success) {
      // Показываем уведомление
      if (window.philosophyTestStorage?.showNotification) {
        window.philosophyTestStorage.showNotification(
          '✅ Результаты отправлены!', 
          'success'
        );
      }
    } else {
      if (window.philosophyTestStorage?.showNotification) {
        window.philosophyTestStorage.showNotification(
          '❌ Ошибка отправки', 
          'error'
        );
      }
    }
    
    return success;
  };

  console.log('📨 Модуль отправки результатов инициализирован');
  
  // Проверяем конфигурацию при загрузке
  if (checkConfiguration()) {
    console.log('✅ Telegram настроен корректно');
  }

})();
