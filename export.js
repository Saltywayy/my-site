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

// Экспорт в PDF с кириллицей
async function exportToPDF(result) {
  try {
    if (typeof window.jspdf === 'undefined') {
      alert('Библиотека PDF не загружена. Убедитесь, что jsPDF подключен в <head>.');
      return;
    }

    const { jsPDF } = window.jspdf;
    
    // Создаем PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });
    
    // Добавляем шрифт с поддержкой кириллицы из URL
    // Используем DejaVu Sans - бесплатный шрифт с кириллицей
    try {
      await addCyrillicFont(doc);
      doc.setFont("DejaVuSans");
    } catch (error) {
      console.warn('Не удалось загрузить шрифт, используем стандартный:', error);
      doc.setFont("helvetica");
    }
    
    const primaryColor = [43, 123, 228];
    const textColor = [34, 34, 34];
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    let y = 20;
    
    // Заголовок
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('Философский тест', pageWidth / 2, y, { align: 'center' });
    
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text('Результаты тестирования', pageWidth / 2, y, { align: 'center' });
    
    y += 20;
    
    // Основная философия
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Основная философия:', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    
    const splitPhil = doc.splitTextToSize(result.philosophy, maxWidth);
    doc.text(splitPhil, margin, y);
    y += splitPhil.length * 7 + 10;
    
    // Подтип
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Подтип:', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text(result.subtype, margin, y);
    
    y += 15;
    
    // Индекс смыслоориентации
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Индекс смыслоориентации:', margin, y);
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
    
    // Описание
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Описание:', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    
    const splitDescription = doc.splitTextToSize(result.description, maxWidth);
    
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
      doc.text('Демографические данные:', margin, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(...textColor);
      
      for (const [key, value] of Object.entries(result.demographics)) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${key}: ${value}`, margin, y);
        y += 6;
      }
    }
    
    // Футер
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Страница ${i} из ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
      doc.text(`Философский тест • ${window.location.hostname}`, pageWidth / 2, 290, { align: 'center' });
    }
    
    // Сохранение
    const filename = `Философский_тест_${result.philosophy.replace(/\s+/g, '_').substring(0, 30)}.pdf`;
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

// Экспорт в PDF с кириллицей через pdfmake
async function exportToPDFwithCyrillic(result) {
  try {
    if (typeof pdfMake === 'undefined') {
      console.warn('pdfMake не загружен, используем jsPDF');
      return exportToPDF(result);
    }

    console.log('Создаем PDF с кириллицей через pdfmake...');

    // Определение документа
    const docDefinition = {
      content: [
        // Заголовок
        {
          text: 'Философский тест',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Результаты тестирования',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },

        // Основная философия
        {
          text: 'Основная философия:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 5]
        },
        {
          text: result.philosophy,
          style: 'content',
          margin: [0, 0, 0, 15]
        },

        // Подтип
        {
          text: 'Подтип:',
          style: 'sectionHeader',
          margin: [0, 0, 0, 5]
        },
        {
          text: result.subtype,
          style: 'content',
          margin: [0, 0, 0, 15]
        },

        // Индекс смыслоориентации
        {
          text: 'Индекс смыслоориентации:',
          style: 'sectionHeader',
          margin: [0, 0, 0, 5]
        },
        {
          text: `${result.meaningIndex}/100`,
          style: 'content',
          margin: [0, 0, 0, 10]
        },

        // Прогресс-бар (имитация через таблицу)
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 515,
                          h: 15,
                          color: '#e9eef8'
                        },
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 515 * (result.meaningIndex / 100),
                          h: 15,
                          color: '#2b7be4'
                        }
                      ]
                    }
                  ],
                  border: [false, false, false, false]
                }
              ]
            ]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 20]
        },

        // Описание
        {
          text: 'Описание:',
          style: 'sectionHeader',
          margin: [0, 0, 0, 5]
        },
        {
          text: result.description,
          style: 'content',
          margin: [0, 0, 0, 20]
        }
      ],
      
      // Стили
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#2b7be4'
        },
        subheader: {
          fontSize: 12,
          color: '#666'
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#2b7be4'
        },
        content: {
          fontSize: 11,
          color: '#222'
        },
        demographics: {
          fontSize: 10,
          color: '#444'
        }
      },
      
      // Параметры страницы
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      
      // Футер
      footer: function(currentPage, pageCount) {
        return {
          columns: [
            {
              text: `Страница ${currentPage} из ${pageCount}`,
              alignment: 'center',
              fontSize: 9,
              color: '#888'
            }
          ],
          margin: [40, 20]
        };
      }
    };

    // Добавляем демографические данные если есть
    if (result.demographics && Object.keys(result.demographics).length > 0) {
      docDefinition.content.push(
        {
          text: 'Демографические данные:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 5],
          pageBreak: 'before'
        }
      );
      
      for (const [key, value] of Object.entries(result.demographics)) {
        docDefinition.content.push({
          text: `${key}: ${value}`,
          style: 'demographics',
          margin: [0, 3, 0, 0]
        });
      }
    }

    // Создаем и скачиваем PDF
    const fileName = `Философский_тест_${sanitizeFilename(result.philosophy)}.pdf`;
    pdfMake.createPdf(docDefinition).download(fileName);

    // Отслеживание
    if (window.philosophyTestAnalytics) {
      window.philosophyTestAnalytics.trackExport('pdf');
    }

    showNotification('✅ PDF успешно сохранен с кириллицей!', 'success');
    return true;

  } catch (error) {
    console.error('Ошибка при создании PDF через pdfmake:', error);
    console.log('Пробуем создать через jsPDF...');
    return exportToPDF(result);
  }
}

// Вспомогательная функция для безопасного имени файла
function sanitizeFilename(str) {
  return str
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
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
  document.getElementById('exportPDF').addEventListener('click', () => {
    // Пробуем сначала pdfmake (с кириллицей), если не получится - jsPDF
    if (typeof pdfMake !== 'undefined') {
      exportToPDFwithCyrillic(result);
    } else {
      exportToPDF(result);
    }
  });
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
