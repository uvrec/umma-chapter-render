# Відповідність шрифтів Vedabase.io

**Референс:** https://vedabase.io/uk/library/bg/1/2/
**Дата специфікації:** 2025-11-17

---

## 📚 Таблиця відповідності блоків та шрифтів

| Блок | Шрифт на Vedabase.io | Наша CSS змінна | Використання |
|------|----------------------|-----------------|--------------|
| **Devanagari (देवनागरी)** | Noto Sans (з Devanagari підтримкою) | `--font-devanagari` | Санскрит у письмі Деванагарі |
| **Bengali (বাংলা)** | Noto Serif Bengali (weight: 500) | `--font-bengali` | Бенгальський текст |
| **Verse text (транслітерація)** | notoSerifVedabase (кастомна версія Noto Serif) | `--font-translit` | Транслітерація санскриту кирилицею/латиницею |
| **Synonyms (послівний переклад)** | notoSansVedabase (кастомна версія Noto Sans) | `--font-synonyms` | Послівний переклад |
| **Translation (літературний переклад)** | Noto Serif (variable: 100-900) | `--font-primary` | Літературний переклад |
| **Purport (пояснення)** | Noto Serif (variable: 100-900) | `--font-primary` | Пояснення/коментар |

---

## 🎨 Налаштування за замовчуванням (Vedabase-style)

### Sanskrit / Devanagari
```typescript
{
  fontFamily: 'var(--font-devanagari)', // Noto Sans Devanagari
  fontSize: 1.5,    // 150% від базового
  fontWeight: 400,  // Regular
  fontStyle: 'normal',
  lineHeight: 1.618 // golden ratio
}
```

### Transliteration (Verse Text)
```typescript
{
  fontFamily: 'var(--font-translit)', // Noto Serif (notoSerifVedabase)
  fontSize: 1.1,    // 110% від базового
  fontWeight: 400,  // Regular
  fontStyle: 'normal', // ⚠️ Vedabase використовує normal, не italic!
  lineHeight: 1.6
}
```

### Synonyms (Послівний переклад)
```typescript
{
  fontFamily: 'var(--font-synonyms)', // Noto Sans (notoSansVedabase)
  fontSize: 0.95,   // 95% від базового
  fontWeight: 400,  // Regular
  fontStyle: 'normal',
  lineHeight: 1.75
}
```

### Translation (Літературний переклад)
```typescript
{
  fontFamily: 'var(--font-primary)', // Noto Serif variable 100-900
  fontSize: 1.0,    // 100% від базового
  fontWeight: 400,  // Regular (variable font підтримує 100-900)
  fontStyle: 'normal',
  lineHeight: 1.6
}
```

### Commentary/Purport (Пояснення)
```typescript
{
  fontFamily: 'var(--font-primary)', // Noto Serif variable 100-900
  fontSize: 1.0,    // 100% від базового
  fontWeight: 400,  // Regular (variable font підтримує 100-900)
  fontStyle: 'normal',
  lineHeight: 1.75
}
```

### Bengali (Бенгальський)
```typescript
{
  fontFamily: 'var(--font-bengali)', // Noto Serif Bengali
  fontSize: 1.3,    // 130% від базового (приблизно)
  fontWeight: 500,  // ⚠️ Medium (як на Vedabase!)
  fontStyle: 'normal',
  lineHeight: 1.6
}
```

---

## 📁 Файли конфігурації

### 1. `src/index.css`
Визначає CSS змінні для шрифтів:

```css
:root {
  /* Основний текст (кирилиця + латиниця) - Noto Serif variable 100-900 */
  --font-primary: "Noto Serif", "Gentium Plus", Georgia, serif;

  /* Транслітерація (verse text) - notoSerifVedabase кастомна версія */
  --font-translit: "Noto Serif", serif;

  /* Деванагарі (देवनागरी) - Noto Sans з Devanagari підтримкою */
  --font-devanagari: "Noto Sans Devanagari", sans-serif;

  /* Бенгалі (বাংলা) - Noto Serif Bengali weight 500 */
  --font-bengali: "Noto Serif Bengali", serif;

  /* Послівний переклад (synonyms) - notoSansVedabase кастомна версія */
  --font-synonyms: "Noto Sans", sans-serif;

  /* UI (інтерфейс) */
  --font-ui: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

### 2. `tailwind.config.ts`
Експортує CSS змінні як Tailwind класи:

```typescript
fontFamily: {
  primary: "var(--font-primary)",      // Noto Serif variable
  translit: "var(--font-translit)",    // notoSerifVedabase
  sanskrit: "var(--font-devanagari)",  // Noto Sans Devanagari
  synonyms: "var(--font-synonyms)",    // notoSansVedabase
  bengali: "var(--font-bengali)",      // Noto Serif Bengali
  ui: "var(--font-ui)",                // Montserrat
}
```

### 3. `src/constants/adminTypography.ts`
Визначає доступні шрифти для адмін панелі та дефолтні налаштування.

### 4. `src/components/AdminTypographyPanel.tsx`
UI для налаштування глобальних стилів (доступний тільки для адміністраторів).

---

## 🎯 Як використовувати

### Для розробників:

**Використовуйте CSS змінні в компонентах:**

```tsx
// Sanskrit/Devanagari
<div style={{ fontFamily: 'var(--font-devanagari)' }}>
  ॐ नमो भगवते वासुदेवाय
</div>

// Transliteration
<div style={{ fontFamily: 'var(--font-translit)' }}>
  oṁ namo bhagavate vāsudevāya
</div>

// Synonyms
<div style={{ fontFamily: 'var(--font-synonyms)' }}>
  oṁ — звук Om; namaḥ — вклоніння
</div>

// Translation / Commentary
<div style={{ fontFamily: 'var(--font-primary)' }}>
  О мій Господи, Верховна Особистість Бога...
</div>
```

**Або використовуйте Tailwind класи:**

```tsx
<div className="font-sanskrit">देवनागरी</div>
<div className="font-translit">transliteration</div>
<div className="font-synonyms">synonyms</div>
<div className="font-primary">translation</div>
```

### Для адміністраторів:

1. Відкрийте **⚙️ Settings** (справа внизу)
2. Перейдіть на вкладку **"Стилі (Admin)"**
3. Оберіть блок (Sanskrit, Transliteration, тощо)
4. Налаштуйте:
   - Шрифт (dropdown з доступними варіантами)
   - Розмір (slider 0.5x - 2.5x)
   - Товщина (300-700)
   - Стиль (normal/italic)
   - Колір
   - Міжряддя
5. Зміни зберігаються автоматично

---

## 🔍 Важливі відмінності від Vedabase.io

### 1. Кастомні шрифти
Vedabase використовує кастомні версії шрифтів:
- `notoSerifVedabase` (для транслітерації)
- `notoSansVedabase` (для послівного перекладу)

Ми використовуємо стандартні версії з Google Fonts, але це можна змінити, завантаживши кастомні варіанти.

### 2. Variable fonts
Vedabase використовує Noto Serif як variable font (weight: 100-900).
Ми також підтримуємо це через `--font-primary`.

### 3. Bengali weight
Vedabase чітко використовує **weight: 500** для Bengali.
Переконайтеся, що в адмін панелі для Bengali встановлено weight 500.

---

## 📦 Встановлення шрифтів

Переконайтеся, що всі шрифти підключені в `src/styles/fonts.css`:

```css
/* Noto Sans Devanagari */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

/* Noto Serif (variable) */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@100..900&display=swap');

/* Noto Sans */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');

/* Noto Serif Bengali */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap');
```

---

## ✅ Checklist для відповідності Vedabase.io

- [x] **Devanagari:** Noto Sans Devanagari
- [x] **Transliteration:** Noto Serif (замість Gentium Plus)
- [x] **Synonyms:** Noto Sans (окрема CSS змінна)
- [x] **Translation:** Noto Serif variable 100-900
- [x] **Purport:** Noto Serif variable 100-900
- [x] **Bengali:** Noto Serif Bengali weight 500
- [x] **Tailwind classes:** font-sanskrit, font-translit, font-synonyms, font-primary
- [x] **Admin panel:** Доступний для налаштування всіх стилів

---

**Останнє оновлення:** 2025-11-17
**Автор:** Claude (на основі специфікації користувача)
