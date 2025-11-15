// export.js - Экспорт результатов (PDF, соцсети, копирование)

let currentResult = null;

// Генерация текста результата
function generateResultText(result) {
  return `🧠 МОЙ РЕЗУЛЬТАТ ФИЛОСОФСКОГО ТЕСТА

📖 Основная философия: ${result.philosophy}
🎯 Подтип: ${result.subtype}
📊 Индекс смыслоориентации: ${result.meaningIndex}/100

${result.description}

Пройти тест: ${window.location.href}`;
}

// Экспорт в PDF с поддержкой кириллицы
async function exportToPDF(result) {
  try {
    if (typeof window.jspdf === 'undefined') {
      alert('Библиотека PDF не загружена. Убедитесь, что jsPDF подключен в <head>.');
      return;
    }

    const { jsPDF } = window.jspdf;
    
    // Создаем PDF с Arial (поддерживает кириллицу)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Устанавливаем встроенный шрифт с поддержкой Unicode
    doc.setFont("helvetica");
    
    const primaryColor = [43, 123, 228];
    const textColor = [34, 34, 34];
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    let y = 20;
    
    // Заголовок
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    const title = 'Filosofskiy test';
    doc.text(title, pageWidth / 2, y, { align: 'center' });
    
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text('Rezultaty testirovaniya', pageWidth / 2, y, { align: 'center' });
    
    y += 20;
    
    // Основная философия
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Osnovnaya filosofiya:', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    
    // Транслитерация для философии
    const philosophyTranslit = transliterate(result.philosophy);
    const splitPhil = doc.splitTextToSize(philosophyTranslit, maxWidth);
    doc.text(splitPhil, margin, y);
    y += splitPhil.length * 7 + 10;
    
    // Подтип
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Podtip:', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    const subtypeTranslit = transliterate(result.subtype);
    doc.text(subtypeTranslit, margin, y);
    
    y += 15;
    
    // Индекс смыслоориентации
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Indeks smysloorientirovanii:', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text(`${result.meaningIndex}/100`, margin, y);
    
    // Прогресс-бар
    y += 5;
    doc.setFillColor(233, 238, 248);
    doc.rect(margin, y, maxWidth, 6, 'F');
    doc.setFillColor(...primaryColor);
    doc.rect(margin, y, (result.meaningIndex / 100) * maxWidth, 6, 'F');
    
    y += 15;
    
    // Описание (транслитерация)
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Opisanie:', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    
    const descTranslit = transliterate(result.description);
    const splitDescription = doc.splitTextToSize(descTranslit, maxWidth);
    
    // Разбиваем по страницам если нужно
    for (let i = 0; i < splitDescription.length; i++) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(splitDescription[i], margin, y);
      y += 6;
    }
    
    y += 10;
    
    // Демографические данные
    if (result.demographics && Object.keys(result.demographics).length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Demograficheskie dannye:', margin, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(...textColor);
      
      for (const [key, value] of Object.entries(result.demographics)) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        const keyTranslit = transliterate(key);
        const valueTranslit = transliterate(String(value));
        doc.text(`${keyTranslit}: ${valueTranslit}`, margin, y);
        y += 6;
      }
    }
    
    // Футер
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Stranitsa ${i} iz ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
      doc.text(`Filosofskiy test • ${window.location.hostname}`, pageWidth / 2, 290, { align: 'center' });
    }
    
    // Сохранение
    const filename = `Filosofskiy_test_${transliterate(result.philosophy).replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    
    // Отслеживание
    if (window.philosophyTestAnalytics) {
      window.philosophyTestAnalytics.trackExport('pdf');
    }
    
    showNotification('✅ PDF успешно сохранен!', 'success');
  } catch (error) {
    console.error('Ошибка при создании PDF:', error);
    alert('Произошла ошибка при создании PDF. Попробуйте снова.');
  }
}

// Функция транслитерации кириллицы
function transliterate(text) {
  const ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
    'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
    'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts',
    'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };
  
  return text.split('').map(char => ru[char] || char).join('');
}

// Поделиться в VK
function shareToVK(result) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent('Мой результат философского теста');
  const description = encodeURIComponent(`Моя философия: ${result.philosophy}`);
  window.open(
    `https://vk.com/share.php?url=${url}&title=${title}&description=${description}`, 
    '_blank', 
    'width=600,height=400'
  );
  
  if (window.philosophyTestAnalytics) {
    window.philosophyTestAnalytics.trackExport('vk');
  }
}

// Поделиться в Telegram
function shareToTelegram(result) {
  const text = encodeURIComponent(generateResultText(result));
  window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank');
  
  if (window.philosophyTestAnalytics) {
    window.philosophyTestAnalytics.trackExport('telegram');
  }
}

// Поделиться в WhatsApp
function shareToWhatsApp(result) {
  const text = encodeURIComponent(generateResultText(result));
  window.open(`https://wa.me/?text=${text}`, '_blank');
  
  if (window.philosophyTestAnalytics) {
    window.philosophyTestAnalytics.trackExport('whatsapp');
  }
}

// Копировать результат в буфер обмена
async function copyResultToClipboard(result) {
  const text = generateResultText(result);
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showNotification('✅ Результат скопирован в буфер обмена!', 'success');
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        showNotification('✅ Результат скопирован в буфер обмена!', 'success');
      } catch (err) {
        alert('Не удалось скопировать текст');
      }
      
      document.body.removeChild(textArea);
    }
    
    if (window.philosophyTestAnalytics) {
      window.philosophyTestAnalytics.trackExport('copy');
    }
  } catch (error) {
    console.error('Ошибка при копировании:', error);
    alert('Не удалось скопировать результат');
  }
}

// Добавить кнопки экспорта к результатам
function addExportButtons(resultElement, result) {
  currentResult = result;
  
  const buttonsHTML = `
    <div class="export-buttons">
      <button id="exportPDF" class="btn primary">📄 Скачать PDF</button>
      <button id="shareVK" class="btn">📱 VK</button>
      <button id="shareTelegram" class="btn">✈️ Telegram</button>
      <button id="shareWhatsApp" class="btn">💬 WhatsApp</button>
      <button id="copyResult" class="btn">📋 Копировать</button>
    </div>
  `;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = buttonsHTML;
  resultElement.appendChild(tempDiv.firstElementChild);
  
  // Привязываем обработчики
  document.getElementById('exportPDF').addEventListener('click', () => exportToPDF(result));
  document.getElementById('shareVK').addEventListener('click', () => shareToVK(result));
  document.getElementById('shareTelegram').addEventListener('click', () => shareToTelegram(result));
  document.getElementById('shareWhatsApp').addEventListener('click', () => shareToWhatsApp(result));
  document.getElementById('copyResult').addEventListener('click', () => copyResultToClipboard(result));
}

// Экспортируем функции
window.philosophyTestExport = {
  exportToPDF,
  shareToVK,
  shareToTelegram,
  shareToWhatsApp,
  copyResultToClipboard,
  addExportButtons
};

console.log('📤 Модуль экспорта результатов инициализирован');
