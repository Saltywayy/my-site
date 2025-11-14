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

// Экспорт в PDF
async function exportToPDF(result) {
  try {
    if (typeof window.jspdf === 'undefined') {
      alert('Библиотека PDF не загружена. Убедитесь, что jsPDF подключен в <head>.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const primaryColor = [43, 123, 228];
    const textColor = [34, 34, 34];
    
    let y = 20;
    
    // Заголовок
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('Философский тест', 105, y, { align: 'center' });
    
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text('Результаты тестирования', 105, y, { align: 'center' });
    
    y += 20;
    
    // Основная философия
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Основная философия:', 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text(result.philosophy, 20, y);
    
    y += 15;
    
    // Подтип
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Подтип:', 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text(result.subtype, 20, y);
    
    y += 15;
    
    // Индекс смыслоориентации
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Индекс смыслоориентации:', 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text(`${result.meaningIndex}/100`, 20, y);
    
    // Прогресс-бар
    y += 5;
    doc.setFillColor(233, 238, 248);
    doc.rect(20, y, 170, 6, 'F');
    doc.setFillColor(...primaryColor);
    doc.rect(20, y, (result.meaningIndex / 100) * 170, 6, 'F');
    
    y += 15;
    
    // Описание
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Описание:', 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    
    const splitDescription = doc.splitTextToSize(result.description, 170);
    doc.text(splitDescription, 20, y);
    
    y += splitDescription.length * 6 + 15;
    
    // Демографические данные
    if (result.demographics && Object.keys(result.demographics).length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Демографические данные:', 20, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(...textColor);
      
      for (const [key, value] of Object.entries(result.demographics)) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${key}: ${value}`, 20, y);
        y += 6;
      }
    }
    
    // Футер
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Страница ${i} из ${pageCount}`, 105, 285, { align: 'center' });
      doc.text(`Философский тест • ${window.location.hostname}`, 105, 290, { align: 'center' });
    }
    
    // Сохранение
    const filename = `Философский_тест_${result.philosophy.replace(/\s+/g, '_')}.pdf`;
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
