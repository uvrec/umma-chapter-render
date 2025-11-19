# Конкретні виправлення для UUID vs Numbers naming

## ФАЙЛ 1: src/App.tsx

### Проблема
Маршрути для старої системи (без canto) використовують `:chapterId`, але це насправді число `chapter_number`.

### Строки для виправлення: 123-124

**БУЛО:**
```tsx
<Route path="/veda-reader/:bookId/:chapterId" element={<ChapterVersesList />} />
<Route path="/veda-reader/:bookId/:chapterId/:verseNumber" element={<VedaReaderDB />} />
```

**ПОВИННО БУТИ:**
```tsx
<Route path="/veda-reader/:bookId/:chapterNumber" element={<ChapterVersesList />} />
<Route path="/veda-reader/:bookId/:chapterNumber/:verseNumber" element={<VedaReaderDB />} />
```

### Чому це важливо
1. `:chapterId` оманливо позначає UUID, але насправді це число
2. Це 100% збігається з новою системою з canto (`:chapterNumber`)
3. Код стає самодокументуючим

---

## ФАЙЛ 2: src/components/VedaReaderDB.tsx

### Проблема
Функція отримує `chapterId` з URL, що оманливо, і потребує fallback для обох маршрутів.

### Строка 30-38

**БУЛО:**
```tsx
const {
  bookId,
  chapterId,
  cantoNumber,
  chapterNumber,
  verseNumber,
  verseId
} = useParams();
const routeVerseNumber = verseNumber ?? verseId;
```

**ПОВИННО БУТИ:**
```tsx
const {
  bookId,
  chapterNumber: chapterNumberLegacy,  // Старий маршрут передає це як :chapterId
  cantoNumber,
  chapterNumber,                        // Новий маршрут з canto
  verseNumber,
  verseId
} = useParams();
const routeVerseNumber = verseNumber ?? verseId;

// Виберемо який параметр використовувати залежно від маршруту
const effectiveChapterParam = cantoNumber ? chapterNumber : (chapterNumberLegacy || chapterNumber);
```

### Додатково (строка 117-118)
Оновіть цей рядок з новим параметром:

**БУЛО:**
```tsx
let effectiveChapterParam = isCantoMode ? chapterNumber : chapterId;
if (bookId === 'noi' && !chapterId && routeVerseNumber) {
```

**ПОВИННО БУТИ:**
```tsx
let effectiveChapterParam = isCantoMode ? chapterNumber : (chapterNumberLegacy || chapterNumber);
if (bookId === 'noi' && !chapterNumberLegacy && routeVerseNumber) {
```

### Додати коментар (після строки 37)
```tsx
// ВАЖЛИВО: 
// - routeVerseNumber може бути:
//   1. verse_number (число) - для URL /veda-reader/gita/1/5
//   2. verse UUID - для backward compatibility (рідко)
//   3. Діапазон типу "7-8" - для композитних віршів
```

---

## ФАЙЛ 3: src/pages/ChapterVersesList.tsx

### Проблема
Функція отримує `chapterId` з URL, що оманливо.

### Строка 20-25

**БУЛО:**
```tsx
const {
  bookId,
  chapterId,
  cantoNumber,
  chapterNumber
} = useParams();
```

**ПОВИННО БУТИ:**
```tsx
const {
  bookId,
  chapterNumber: chapterNumberLegacy,  // Старий маршрут передає це як :chapterId
  cantoNumber,
  chapterNumber                         // Новий маршрут з canto
} = useParams();
```

### Строка 42
**БУЛО:**
```tsx
const effectiveChapterParam = isCantoMode ? chapterNumber : chapterId;
```

**ПОВИННО БУТИ:**
```tsx
const effectiveChapterParam = isCantoMode ? chapterNumber : (chapterNumberLegacy || chapterNumber);
```

---

## ФАЙЛ 4: src/hooks/useDailyQuote.ts

### Проблема
Коментар для ясності - код вже правильний!

### Строка 273-284

**ДОДАТИ КОМЕНТАР перед цим кодом:**
```tsx
/**
 * Генеруємо посилання на вірш у читачі
 * Коректна логіка:
 * - Якщо є cantos: `/veda-reader/{bookSlug}/canto/{cantoNumber}/chapter/{chapterNumber}/{verseNumber}`
 * - Без cantos: `/veda-reader/{bookSlug}/{chapterNumber}/{verseNumber}`
 * 
 * ВАЖЛИВО: У старих маршрутах `:chapterId` насправді це число (chapter_number), а не UUID!
 */
const link = quote.quote_type === 'verse' && quote.verse?.chapter?.book
```

Код вже правильний, тільки коментар для ясності.

---

## ПЕРЕВІРКА ПІСЛЯ ВИПРАВЛЕННЯ

### Тестуйте ці маршрути:
1. `/veda-reader/gita` - книга
2. `/veda-reader/gita/1` - (повинна перейти на список віршів, але Вас можуть перенаправити на новий маршрут)
3. `/veda-reader/gita/1/5` - вірш 5 глави 1
4. `/veda-reader/gita/canto/1/chapter/1` - список віршів з canto
5. `/veda-reader/gita/canto/1/chapter/1/5` - вірш з canto

### Перевірте console для помилок:
- Не повинно бути помилок типу "Cannot read property 'chapter_number' of undefined"
- Не повинно бути помилок типу "NaN" при пошуку віршів

### Протестуйте функціональність:
- Перелистування віршів (← →)
- Перелистування глав
- Daily quote посилання
- Пошук віршів

---

## РЕЗЮМЕ ЗМІН

| Файл | Строки | Назва параметра | Було | Стало |
|------|--------|---|------|--------|
| App.tsx | 123 | chapterId | `:chapterId` | `:chapterNumber` |
| App.tsx | 124 | chapterId | `:chapterId` | `:chapterNumber` |
| VedaReaderDB.tsx | 32 | chapterId | `chapterId` | `chapterNumber: chapterNumberLegacy` |
| VedaReaderDB.tsx | 117 | effectiveChapterParam | `chapterId` | `chapterNumberLegacy \|\| chapterNumber` |
| ChapterVersesList.tsx | 22 | chapterId | `chapterId` | `chapterNumber: chapterNumberLegacy` |
| ChapterVersesList.tsx | 42 | effectiveChapterParam | `chapterId` | `chapterNumberLegacy \|\| chapterNumber` |

---

## ЧАС ДЛЯ РЕАЛІЗАЦІЇ
- Читання та розуміння: ~5 хвилин
- Редагування файлів: ~15 хвилин
- Тестування: ~10 хвилин
- **УСЬОГО: ~30 хвилин**

## РИЗИК
- **Низький** - це просто rename параметрів
- **Без змін БД**
- **Без змін бізнес-логіки**
- **Повна backward compatibility** завдяки fallback логіці
