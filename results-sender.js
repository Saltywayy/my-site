// results-sender.js - Отправка результатов вам

// ========================================
// ВАРИАНТ 1: Отправка через Netlify Forms (РЕКОМЕНДУЕТСЯ)
// ========================================
// Netlify автоматически обрабатывает формы и отправляет на email

async function sendResultsViaNetlifyForm(result, formData) {
  try {
    const data = new FormData();
    data.append('form-name', 'test-results');
    data.append('philosophy', result.philosophy);
    data.append('subtype', result.subtype);
    data.append('meaningIndex', result.meaningIndex);
    data.append('description', result.description);
    
    // Добавляем демографические данные
    if (result.demographics) {
      for (const [key, value] of Object.entries(result.demographics)) {
        data.append(key, value);
      }
    }
    
    // Добавляем timestamp
    data.append('timestamp', new Date().toISOString());
    data.append('url', window.location.href);
    
    const response = await fetch('/', {
      method: 'POST',
      body: data
    });
    
    if (response.ok) {
      console.log('✅ Результаты отправлены через Netlify Form');
      return true;
    } else {
      throw new Error('Ошибка отправки');
    }
  } catch (error) {
    console.error('❌ Ошибка отправки результатов:', error);
    return false;
  }
}

// ========================================
// ВАРИАНТ 2: Отправка через Google Forms
// ========================================
// Бесплатно, все результаты попадают в Google Sheets

async function sendResultsViaGoogleForms(result) {
  try {
    // ЗАМЕНИТЕ НА ВАШ URL Google Forms
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
    
    // ID полей из вашей Google формы (см. инструкцию ниже)
    const FIELD_IDS = {
      philosophy: 'entry.123456789',      // Замените на реальные ID
      subtype: 'entry.987654321',
      meaningIndex: 'entry.111111111',
      age: 'entry.222222222',
      gender: 'entry.333333333'
    };
    
    const data = new FormData();
    data.append(FIELD_IDS.philosophy, result.philosophy);
    data.append(FIELD_IDS.subtype, result.subtype);
    data.append(FIELD_IDS.meaningIndex, result.meaningIndex);
    
    if (result.demographics) {
      data.append(FIELD_IDS.age, result.demographics['Возраст'] || '');
      data.append(FIELD_IDS.gender, result.demographics['Пол'] || '');
    }
    
    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: data,
      mode: 'no-cors' // Важно для Google Forms
    });
    
    console.log('✅ Результаты отправлены в Google Forms');
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки в Google Forms:', error);
    return false;
  }
}

// ========================================
// ВАРИАНТ 3: Отправка через Email (EmailJS)
// ========================================
// Бесплатно 200 писем/месяц

async function sendResultsViaEmail(result) {
  try {
    // Настройте на https://www.emailjs.com/
    const SERVICE_ID = 'YOUR_SERVICE_ID';      // Замените
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';    // Замените
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';      // Замените
    
    if (!window.emailjs) {
      console.error('EmailJS не загружен');
      return false;
    }
    
    const templateParams = {
      philosophy: result.philosophy,
      subtype: result.subtype,
      meaningIndex: result.meaningIndex,
      description: result.description,
      age: result.demographics?.['Возраст'] || 'Не указан',
      gender: result.demographics?.['Пол'] || 'Не указан',
      education: result.demographics?.['Наивысший уровень образования'] || 'Не указано',
      timestamp: new Date().toLocaleString('ru-RU'),
      url: window.location.href
    };
    
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    
    console.log('✅ Результаты отправлены на email');
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error);
    return false;
  }
}

// ========================================
// ВАРИАНТ 4: Отправка в Telegram Bot
// ========================================
// Бесплатно, быстро настраивается

async function sendResultsViaTeleg(result) {
  try {
    // Создайте бота через @BotFather и получите токен
    const BOT_TOKEN = 'YOUR_BOT_TOKEN';        // Замените
    const CHAT_ID = 'YOUR_CHAT_ID';            // Замените (ваш Telegram ID)
    
    const message = `
🧠 НОВЫЙ РЕЗУЛЬТАТ ТЕСТА

📖 Философия: ${result.philosophy}
🎯 Подтип: ${result.subtype}
📊 Индекс: ${result.meaningIndex}/100

👤 Демография:
${Object.entries(result.demographics || {})
  .map(([k, v]) => `• ${k}: ${v}`)
  .join('\n')}

🕒 Время: ${new Date().toLocaleString('ru-RU')}
🔗 URL: ${window.location.href}
    `.trim();
    
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    if (response.ok) {
      console.log('✅ Результаты отправлены в Telegram');
      return true;
    } else {
      throw new Error('Ошибка Telegram API');
    }
  } catch (error) {
    console.error('❌ Ошибка отправки в Telegram:', error);
    return false;
  }
}

// ========================================
// ВАРИАНТ 5: Сохранение в Google Sheets через Apps Script
// ========================================

async function sendResultsViaGoogleSheets(result) {
  try {
    // URL вашего Google Apps Script Web App
    const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    
    const data = {
      timestamp: new Date().toISOString(),
      philosophy: result.philosophy,
      subtype: result.subtype,
      meaningIndex: result.meaningIndex,
      description: result.description,
      ...result.demographics
    };
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    console.log('✅ Результаты отправлены в Google Sheets');
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки в Google Sheets:', error);
    return false;
  }
}

// ========================================
// ГЛАВНАЯ ФУНКЦИЯ - вызывается после расчета результата
// ========================================

async function sendResults(result) {
  console.log('📤 Отправка результатов...');
  
  // Выберите один или несколько методов отправки:
  
  // Метод 1: Netlify Forms (рекомендуется, если используете Netlify)
  await sendResultsViaNetlifyForm(result);
  
  // Метод 2: Google Forms (простой, бесплатный)
  // await sendResultsViaGoogleForms(result);
  
  // Метод 3: Email через EmailJS
  // await sendResultsViaEmail(result);
  
  // Метод 4: Telegram Bot (мгновенные уведомления)
  // await sendResultsViaTeleg(result);
  
  // Метод 5: Google Sheets
  // await sendResultsViaGoogleSheets(result);
}

// Экспортируем функцию
window.sendTestResults = sendResults;

console.log('📬 Модуль отправки результатов инициализирован');

// ========================================
// ИНСТРУКЦИИ ПО НАСТРОЙКЕ
// ========================================

/*

📋 ВАРИАНТ 1: NETLIFY FORMS (РЕКОМЕНДУЕТСЯ)
===========================================
1. Добавьте в index.html перед закрывающим </body>:

<form name="test-results" netlify netlify-honeypot="bot-field" hidden>
  <input type="text" name="philosophy" />
  <input type="text" name="subtype" />
  <input type="text" name="meaningIndex" />
  <input type="text" name="description" />
  <input type="text" name="age" />
  <input type="text" name="gender" />
  <input type="text" name="education" />
  <input type="text" name="timestamp" />
</form>

2. Задеплойте на Netlify
3. В панели Netlify: Forms → Notifications → добавьте свой email
4. Готово! Все результаты будут приходить на email

===========================================

📋 ВАРИАНТ 2: GOOGLE FORMS
===========================================
1. Создайте Google Form: https://forms.google.com
2. Добавьте поля: "Философия", "Подтип", "Индекс", "Возраст", "Пол"
3. Откройте форму → Получить предзаполненную ссылку
4. Заполните форму тестовыми данными → Получить ссылку
5. Скопируйте URL и ID полей (entry.XXXXXX)
6. Вставьте в GOOGLE_FORM_URL и FIELD_IDS
7. Результаты автоматически попадут в Google Sheets

===========================================

📋 ВАРИАНТ 3: EMAILJS
===========================================
1. Зарегистрируйтесь: https://www.emailjs.com/
2. Создайте Email Service (Gmail/Outlook/etc)
3. Создайте Email Template с переменными:
   {{philosophy}}, {{subtype}}, {{meaningIndex}}
4. Получите Service ID, Template ID, Public Key
5. Добавьте в index.html:
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
6. Вставьте ID в код выше

===========================================

📋 ВАРИАНТ 4: TELEGRAM BOT
===========================================
1. Найдите @BotFather в Telegram
2. Отправьте /newbot и следуйте инструкциям
3. Получите Bot Token
4. Найдите @userinfobot и получите свой Chat ID
5. Вставьте BOT_TOKEN и CHAT_ID в код
6. Результаты будут приходить моментально в Telegram!

===========================================

📋 ВАРИАНТ 5: GOOGLE SHEETS
===========================================
1. Создайте Google Sheets
2. Tools → Script Editor
3. Вставьте код:

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp,
    data.philosophy,
    data.subtype,
    data.meaningIndex,
    data.age,
    data.gender
  ]);
  return ContentService.createTextOutput('OK');
}

4. Deploy → New deployment → Web app → Anyone
5. Скопируйте URL и вставьте в SCRIPT_URL

===========================================

🎯 РЕКОМЕНДАЦИЯ:
Используйте Netlify Forms (вариант 1) - самый простой!
Или Telegram Bot (вариант 4) - мгновенные уведомления!

*/
