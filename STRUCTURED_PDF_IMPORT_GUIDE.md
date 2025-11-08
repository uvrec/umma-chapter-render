# 📚 Посібник з структурованого імпорту PDF

Система для інтелектуального розпізнавання та витягування структурованих віршів з PDF файлів ведичних текстів.

## 🎯 Можливості

### ✅ Розпізнає:
- **Санскрит** (Devanagari/Bengali)
- **Транслітерація** (IAST з діакритикою)
- **Синоніми** (пословний переклад)
- **Переклад** (англійський та український)
- **Пояснення** (коментарі до віршів)
- **Складені вірші** (діапазони: 22-23, 256-266)

### ✅ Підтримує:
- Двомовні тексти (англійський + український)
- Продовження коментарів на наступних сторінках
- Великі PDF файли (з прогресом)
- Скасування обробки (AbortSignal)

---

## 📖 Використання

### Базовий приклад:

```typescript
import { extractStructuredVersesFromPDF } from '@/utils/import/pdf';

// 1. Отримати файл від користувача
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

// 2. Витягти структуровані вірші
const result = await extractStructuredVersesFromPDF(file);

// 3. Переглянути результат
console.log(`✅ Розпізнано ${result.summary.total} віршів`);
console.log(`📝 З транслітерацією: ${result.summary.hasTransliteration}`);
console.log(`📖 З синонімами: ${result.summary.hasSynonyms}`);
console.log(`💬 З поясненнями: ${result.summary.hasCommentary}`);

// 4. Обробити кожен вірш
result.verses.forEach(verse => {
  console.log(`\n📌 Вірш ${verse.verse_number}:`);
  console.log(`  Санскрит: ${verse.sanskrit}`);
  console.log(`  Переклад (UA): ${verse.translation_ua}`);
});
```

### З відстеженням прогресу:

```typescript
const result = await extractStructuredVersesFromPDF(file, {
  onProgress: ({ page, total }) => {
    const percent = Math.round((page / total) * 100);
    console.log(`📄 Обробка: ${page}/${total} (${percent}%)`);
    updateProgressBar(percent);
  }
});
```

### З обмеженням сторінок:

```typescript
// Обробити тільки перші 50 сторінок
const result = await extractStructuredVersesFromPDF(file, {
  pageLimit: 50
});
```

### Зі скасуванням:

```typescript
const controller = new AbortController();

// Почати обробку
const promise = extractStructuredVersesFromPDF(file, {
  signal: controller.signal
});

// Скасувати через 10 секунд
setTimeout(() => controller.abort(), 10000);

try {
  const result = await promise;
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('❌ Обробку скасовано');
  }
}
```

---

## 📊 Формат результату

### Структура одного вірша:

```typescript
interface StructuredVerse {
  verse_number: string;           // "1" або "22-23"
  sanskrit?: string;              // "বন্দে গুরূনীশভক্তান..."
  transliteration?: string;       // Основна транслітерація
  transliteration_en?: string;    // "vande gurūn īśa-bhaktān..."
  transliteration_ua?: string;    // "ванде ґурӯн īш́а-бгакта̄н..."
  synonyms_en?: string;           // "vande — I offer..."
  synonyms_ua?: string;           // "ванде — я складаю..."
  translation_en?: string;        // "I offer my respectful..."
  translation_ua?: string;        // "Я складаю шанобливі..."
  commentary_en?: string;         // Повний коментар англійською
  commentary_ua?: string;         // Повний коментар українською
}
```

### Повний результат:

```typescript
{
  verses: StructuredVerse[];     // Масив віршів
  summary: {
    total: number;               // Загальна кількість віршів
    hasTransliteration: number;  // Скільки мають транслітерацію
    hasSynonyms: number;         // Скільки мають синоніми
    hasCommentary: number;       // Скільки мають пояснення
  }
}
```

---

## 🔍 Як працює розпізнавання

### 1. **Номер вірша**
Шукає патерни:
- `Verse 1`, `Verses 22-23`
- `Текст 1`, `Вірш 1`
- Просто цифра: `1` або діапазон: `22-23`

### 2. **Санскрит**
Перевіряє Unicode:
- Devanagari: U+0900-U+097F
- Bengali: U+0980-U+09FF

### 3. **Транслітерація**
Шукає IAST діакритику:
- ā ī ū ṛ ṝ ḷ ḹ ṃ ṅ ñ ṭ ḍ ṇ ś ṣ

### 4. **Синоніми**
Маркери:
- `SYNONYMS:` (англ.)
- `СИНОНІМИ:` (укр.)

### 5. **Переклад**
Маркери:
- `TRANSLATION:` (англ.)
- `ПЕРЕКЛАД:` (укр.)

### 6. **Пояснення**
Маркери:
- `PURPORT`, `COMMENTARY` (англ.)
- `ПОЯСНЕННЯ:` (укр.)

---

## 🛠️ Інтеграція з UI

### React компонент:

```tsx
import { useState } from 'react';
import { extractStructuredVersesFromPDF } from '@/utils/import/pdf';

function PDFImporter() {
  const [progress, setProgress] = useState(0);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);

    try {
      const result = await extractStructuredVersesFromPDF(file, {
        onProgress: ({ page, total }) => {
          setProgress((page / total) * 100);
        }
      });

      setVerses(result.verses);
      console.log(`✅ Імпортовано ${result.summary.total} віршів`);
    } catch (error) {
      console.error('❌ Помилка імпорту:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        disabled={loading}
      />

      {loading && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}>
            {Math.round(progress)}%
          </div>
        </div>
      )}

      {verses.length > 0 && (
        <div>
          <h3>Імпортовано {verses.length} віршів</h3>
          {verses.map((v, i) => (
            <div key={i}>
              <strong>Вірш {v.verse_number}</strong>
              <p>{v.translation_ua || v.translation_en}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 💾 Збереження в базу даних

### Приклад з Supabase:

```typescript
import { supabase } from '@/lib/supabase';
import { extractStructuredVersesFromPDF } from '@/utils/import/pdf';

async function importPDFToDatabase(file: File, chapterId: string) {
  // 1. Витягти вірші з PDF
  const result = await extractStructuredVersesFromPDF(file);

  // 2. Підготувати дані для вставки
  const versesToInsert = result.verses.map(verse => ({
    chapter_id: chapterId,
    verse_number: verse.verse_number,
    sanskrit: verse.sanskrit || '',
    transliteration_en: verse.transliteration_en || '',
    transliteration_ua: verse.transliteration_ua || '',
    synonyms_en: verse.synonyms_en || '',
    synonyms_ua: verse.synonyms_ua || '',
    translation_en: verse.translation_en || '',
    translation_ua: verse.translation_ua || '',
    commentary_en: verse.commentary_en || '',
    commentary_ua: verse.commentary_ua || '',
  }));

  // 3. Вставити в базу
  const { data, error } = await supabase
    .from('verses')
    .insert(versesToInsert)
    .select();

  if (error) {
    console.error('❌ Помилка збереження:', error);
    throw error;
  }

  console.log(`✅ Збережено ${data.length} віршів`);
  return data;
}

// Використання:
const file = // PDF File
await importPDFToDatabase(file, 'chapter-123');
```

---

## 🧪 Тестування

### Приклад тесту:

```typescript
import { parseStructuredVerses } from '@/utils/import/pdfStructuredParser';

describe('PDF Structured Parser', () => {
  it('розпізнає номер вірша', () => {
    const lines = ['Verse 1', 'বন্দে গুরূনীশভক্তান'];
    const verses = parseStructuredVerses(lines);

    expect(verses).toHaveLength(1);
    expect(verses[0].verse_number).toBe('1');
  });

  it('розпізнає складений вірш', () => {
    const lines = ['22-23', 'संस्कृत текст'];
    const verses = parseStructuredVerses(lines);

    expect(verses[0].verse_number).toBe('22-23');
  });

  it('розпізнає санскрит', () => {
    const lines = ['1', 'বন্দে গুরূনীশভক্তান'];
    const verses = parseStructuredVerses(lines);

    expect(verses[0].sanskrit).toContain('বন্দে');
  });

  it('розпізнає синоніми', () => {
    const lines = [
      '1',
      'SYNONYMS: vande — I offer obeisances'
    ];
    const verses = parseStructuredVerses(lines);

    expect(verses[0].synonyms_en).toContain('vande — I offer');
  });
});
```

---

## 🐛 Troubleshooting

### Проблема: "PDF — це скани без текстового шару"
**Рішення:** PDF містить тільки зображення. Потрібно:
1. Використати OCR (Tesseract, Google Vision API)
2. Або отримати PDF з текстовим шаром

### Проблема: Неправильно розпізнається санскрит
**Рішення:** Перевірте:
1. Чи використовується правильний шрифт (Devanagari/Bengali)
2. Чи правильний Unicode encoding (має бути UTF-8)

### Проблема: Не знаходить синоніми/переклад
**Рішення:** Перевірте:
1. Чи є маркери (SYNONYMS:, TRANSLATION:)
2. Чи правильний регістр маркерів
3. Додайте варіанти маркерів у `detectBlockType()`

### Проблема: Пояснення обрізаються
**Рішення:** Пояснення можуть продовжуватися на наступних сторінках. Перевірте логіку об'єднання блоків.

---

## 📝 Розширення функціональності

### Додавання нових маркерів:

```typescript
// У pdfStructuredParser.ts
function detectBlockType(text: string) {
  // Додати новий маркер:
  if (/^(?:МОЯ_НОВА_МІТКА):/i.test(trimmed)) {
    return 'my_new_type';
  }
  // ...
}
```

### Додавання нової мови:

```typescript
function detectLanguage(text: string): 'en' | 'ua' | 'ru' {
  const ukrainianRegex = /[а-яіїєґА-ЯІЇЄҐ]/;
  const russianRegex = /[ыёъЫЁЪ]/; // Літери тільки в російській

  if (russianRegex.test(text)) return 'ru';
  if (ukrainianRegex.test(text)) return 'ua';
  return 'en';
}
```

---

## 🎓 Додаткові ресурси

- **Специфікація:** `PDF_IMPORT_SPECIFICATION.json` - повна технічна специфікація
- **Приклад результату:** `parsed_test.json` - приклад структурованих даних
- **Утиліти:** `src/utils/import/pdfStructuredParser.ts` - основна логіка парсингу
- **Інтеграція:** `src/utils/import/pdf.ts` - функція `extractStructuredVersesFromPDF()`

---

## 📊 Порівняння з простим парсером

| Функція | Простий (`extractTextFromPDF`) | Структурований (`extractStructuredVersesFromPDF`) |
|---------|--------------------------------|---------------------------------------------------|
| **Результат** | HTML рядок | JSON з структурованими віршами |
| **Розпізнавання** | Тільки номери віршів | Санскрит, транслітерація, синоніми, переклад, пояснення |
| **Мови** | Змішані | Окремо EN та UA |
| **Складені вірші** | ✅ | ✅ |
| **Використання** | Для простого імпорту тексту | Для повного імпорту з усіма деталями |

---

**Автор:** Claude Code
**Версія:** 1.0.0
**Дата:** 2025-11-08
