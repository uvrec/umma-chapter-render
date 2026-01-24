# 📚 Правильний імпорт Śrīmad-Bhāgavatam з EPUB

## ⚠️ НЕ використовувати існуючий код!

Код який ви показали **небезпечний** і використовує **видалені файли**:
```typescript
import { parseChapterFromEPUBHTML } from "@/utils/import/srimad_bhagavatam_epub_parser"; // ❌ ВИДАЛЕНО
import { mergeSBChapters } from "@/utils/import/srimad_bhagavatam_merger"; // ❌ ВИДАЛЕНО
```

Ці файли були видалені в commit `445fb05` після інциденту з втратою даних.

---

## ✅ Правильний підхід

### 1. Використовувати існуючі інструменти

**EPUB читання**:
```typescript
import { extractHTMLFromEPUB } from "@/utils/import/epub";
import JSZip from "jszip";
```

**Конвертація IAST → українська**:
```typescript
import { convertIASTtoUkrainian } from "@/utils/textNormalizer";
```

**Парсинг Vedabase**:
```typescript
import { parseVedabaseCC } from "@/utils/dualSourceParser";
```

---

### 2. Структура імпорту

```typescript
// 1. Отримати Ukrainian з EPUB
const epubFile = await fetch('/epub/UK_SB_3_epub_r1.epub');
const zip = await JSZip.loadAsync(await epubFile.arrayBuffer());
const chapterHTML = await zip.file('OEBPS/UKS317XT.xhtml').async('text');

// 2. Парсити Ukrainian вірші з HTML
const verses_uk = parseEPUBChapter(chapterHTML);

// 3. Отримати English з Vedabase
const vedabaseURL = `https://vedabase.io/en/library/sb/3/17/1`;
const { data } = await supabase.functions.invoke("fetch-html", { body: { url: vedabaseURL } });
const verse_en = parseVedabaseCC(data.html, vedabaseURL);

// 4. Об'єднати UK + EN
const merged = {
  verse_number: "1",
  // Sanskrit (однаковий для обох мов)
  sanskrit: verse_en.bengali || "",

  // Transliteration EN з Vedabase
  transliteration_en: verse_en.transliteration_en || "",

  // Transliteration UK - КОНВЕРТУВАТИ з EN!
  transliteration_uk: convertIASTtoUkrainian(verse_en.transliteration_en || ""),

  // Synonyms EN з Vedabase
  synonyms_en: verse_en.synonyms_en || "",

  // Synonyms UK - ГЕНЕРУВАТИ з EN термінів + fallback на EN переклади!
  synonyms_uk: generateSynonymsUK(verse_en.synonyms_en || ""),

  // Translations
  translation_uk: verse_uk.translation || "",
  translation_en: verse_en.translation_en || "",

  // Commentary
  commentary_uk: verse_uk.commentary || "",
  commentary_en: verse_en.purport_en || "",
};

// 5. Зберегти в БД через UPSERT
const { error } = await supabase
  .from("verses")
  .upsert({
    chapter_id: chapterId,
    verse_number: merged.verse_number,
    ...merged,
    is_published: true,
  }, {
    onConflict: 'chapter_id, verse_number'
  });
```

---

### 3. Функція generateSynonymsUA

**Обов'язкова!** Генерує українські synonyms з англійських:

```typescript
function generateSynonymsUA(synonyms_en: string): string {
  if (!synonyms_en) return '';

  // Розділити на пари "term — translation"
  const pairs = synonyms_en.split(';').map(p => p.trim()).filter(p => p);

  const result: string[] = [];

  for (const pair of pairs) {
    const parts = pair.split('—').map(p => p.trim());

    if (parts.length === 2) {
      const iastTerm = parts[0]; // "atha"
      const enTranslation = parts[1]; // "now"

      // Конвертувати IAST термін → українська кирилиця
      const uaTerm = convertIASTtoUkrainian(iastTerm).toLowerCase(); // "атха"

      // ⚠️ Fallback: Якщо немає UA перекладу з EPUB, використати EN
      const uaTranslation = enTranslation; // TODO: Взяти з EPUB якщо є!

      result.push(`${uaTerm} — ${uaTranslation}`);
    } else if (parts.length === 1) {
      // Тільки термін без перекладу
      const uaTerm = convertIASTtoUkrainian(parts[0]).toLowerCase();
      result.push(uaTerm);
    }
  }

  return result.join('; ');
}
```

---

### 4. Безпека

**ОБОВ'ЯЗКОВО**:
1. ❌ **НЕ автоматично запускати** імпорт при завантаженні сторінки
2. ✅ **Використовувати UPSERT** замість INSERT (уникнути дублікатів)
3. ✅ **Перевіряти дані** перед збереженням
4. ✅ **Логувати всі операції** в консоль
5. ✅ **Dry-run режим** для тестування

**Приклад безпечного збереження**:
```typescript
// Перевірити чи глава вже існує
const { data: existing } = await supabase
  .from("chapters")
  .select("id")
  .eq("canto_id", CANTO_3_ID)
  .eq("chapter_number", chapterNum)
  .maybeSingle();

if (existing) {
  console.warn(`⚠️ Глава ${chapterNum} вже існує! Оновлюю...`);
  chapterId = existing.id;
} else {
  // Створити нову
  const { data: newChapter } = await supabase
    .from("chapters")
    .insert({ ... })
    .select()
    .single();
  chapterId = newChapter.id;
}

// Зберегти вірші через UPSERT
await supabase
  .from("verses")
  .upsert(versesData, {
    onConflict: 'chapter_id, verse_number',
    ignoreDuplicates: false // Оновлювати існуючі!
  });
```

---

## 📋 Чеклист перед імпортом

- [ ] Зробити backup БД в Supabase Dashboard
- [ ] Запустити `diagnose_single_fields.sql` для перевірки стану
- [ ] Запустити `find_atga_problem.sql` для перевірки існуючих помилок
- [ ] Переконатись що EPUB файли є: `/epub/UK_SB_3_epub_r1.epub`
- [ ] Перевірити що `convertIASTtoUkrainian()` працює: `th → тх`
- [ ] Тестувати на 1-2 главах спочатку (dry-run)
- [ ] Перевірити результат в БД перед масовим імпортом

---

## 🚫 Що НЕ робити

1. ❌ НЕ використовувати автоматичний запуск (`useEffect` при завантаженні)
2. ❌ НЕ використовувати `INSERT` (тільки `UPSERT`)
3. ❌ НЕ використовувати видалені файли (`srimad_bhagavatam_epub_parser`)
4. ❌ НЕ чіпати механізм Gitabase (потрібен для CC)
5. ❌ НЕ використовувати одинарні поля (`transliteration`, `synonyms`)
6. ❌ НЕ зберігати без конвертації `transliteration_uk` з `transliteration_en`

---

## ✅ Що РОБИТИ

1. ✅ Використовувати `convertIASTtoUkrainian()` для всієї транслітерації
2. ✅ Генерувати `synonyms_uk` з `synonyms_en` через `generateSynonymsUK()`
3. ✅ Завжди заповнювати ОБИ поля: `_uk` ТА `_en`
4. ✅ Використовувати `UPSERT` з `onConflict`
5. ✅ Логувати кожен крок в консоль
6. ✅ Мати dry-run режим для тестування

---

**Потрібна допомога з реалізацією?** Скажіть - я створю повний робочий код!

---

**Автор**: Claude Code
**Дата**: 2025-11-17
**Версія**: 1.0
