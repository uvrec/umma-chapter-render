# Модифікація шрифту в Glyphs 3

Покрокова інструкція для додавання anchor points до кириличних літер для підтримки діакритичних знаків.

## Крок 1: Завантаження базового шрифту

1. Завантажте **Gentium Plus** source files:
   - https://software.sil.org/gentium/download/
   - Виберіть "Source" (містить .glyphs або .ufo файли)

2. Або конвертуйте TTF в Glyphs:
   - File → Open → виберіть `GentiumPlus-Regular.ttf`
   - Glyphs автоматично конвертує

## Крок 2: Перейменування шрифту

**Важливо!** SIL OFL ліцензія вимагає змінити назву при модифікації.

1. File → Font Info (Cmd+I)
2. Вкладка **Font**:
   - Family Name: `Vedavoice Serif`
   - Designer: `SIL International, modified by [ваше ім'я]`
3. Вкладка **Instances**:
   - Перейменуйте всі instances (Regular, Bold, etc.)

## Крок 3: Знайдіть combining marks

У панелі **Glyphs** (ліворуч) знайдіть категорію **Marks** або шукайте:

| Гліф | Назва в Glyphs | Unicode |
|------|----------------|---------|
| ◌̄ | `macroncomb` | U+0304 |
| ◌̇ | `dotaccentcomb` | U+0307 |
| ◌̣ | `dotbelowcomb` | U+0323 |
| ◌́ | `acutecomb` | U+0301 |
| ◌̃ | `tildecomb` | U+0303 |
| ◌̐ | `candrabinducomb` | U+0310 |

## Крок 4: Перевірте anchors у marks

1. Двічі клікніть на `macroncomb` щоб відкрити
2. Переконайтеся що є anchor з назвою `_top`:
   - Якщо немає: Glyph → Add Anchor (Cmd+U)
   - Назва: `_top`
   - Позиція: центр гліфа, на baseline

Аналогічно для інших marks:
- `dotaccentcomb` → `_top`
- `acutecomb` → `_top`
- `tildecomb` → `_top`
- `candrabinducomb` → `_top`
- `dotbelowcomb` → `_bottom`

## Крок 5: Додайте anchors до кириличних літер

### Список літер для редагування

Відкрийте кожну літеру (двічі клікніть) і додайте anchors:

#### Літери з `top` anchor (для діакритик зверху)

| Гліф | Unicode | Anchor position |
|------|---------|-----------------|
| а (a-cy) | U+0430 | top: центр, верх літери |
| А (A-cy) | U+0410 | top: центр, верх літери |
| і (i-cy.loclUKR) | U+0456 | top: центр, верх літери |
| І (I-cy.loclUKR) | U+0406 | top: центр, верх літери |
| м (em-cy) | U+043C | top: центр, верх літери |
| М (Em-cy) | U+041C | top: центр, верх літери |
| н (en-cy) | U+043D | top: центр, верх літери |
| Н (En-cy) | U+041D | top: центр, верх літери |
| ш (sha-cy) | U+0448 | top: центр, верх літери |
| Ш (Sha-cy) | U+0428 | top: центр, верх літери |
| с (es-cy) | U+0441 | top: центр, верх літери |
| С (Es-cy) | U+0421 | top: центр, верх літери |

#### Літери з `bottom` anchor (для діакритик знизу)

| Гліф | Unicode | Anchor position |
|------|---------|-----------------|
| т (te-cy) | U+0442 | bottom: центр, під baseline |
| Т (Te-cy) | U+0422 | bottom: центр, під baseline |
| д (de-cy) | U+0434 | bottom: центр, під baseline |
| Д (De-cy) | U+0414 | bottom: центр, під baseline |
| н (en-cy) | U+043D | bottom: центр, під baseline |
| Н (En-cy) | U+041D | bottom: центр, під baseline |
| р (er-cy) | U+0440 | bottom: центр, під baseline |
| Р (Er-cy) | U+0420 | bottom: центр, під baseline |
| л (el-cy) | U+043B | bottom: центр, під baseline |
| Л (El-cy) | U+041B | bottom: центр, під baseline |
| х (ha-cy) | U+0445 | bottom: центр, під baseline |
| Х (Ha-cy) | U+0425 | bottom: центр, під baseline |
| м (em-cy) | U+043C | bottom: центр, під baseline |
| М (Em-cy) | U+041C | bottom: центр, під baseline |

#### Літери з обома anchors (top + bottom)

- **н** (U+043D) — потрібні і top (для н̇, н̃), і bottom (для н̣)
- **м** (U+043C) — потрібні і top (для м̇), і bottom (для м̣)
- **л** (U+043B) — потрібні і top, і bottom (для л̣̄)
- **р** (U+0440) — потрібні і top, і bottom (для р̣̄)

### Як додати anchor

1. Відкрийте гліф (двічі клікніть)
2. Glyph → Add Anchor (Cmd+U)
3. Введіть назву: `top` або `bottom`
4. Перетягніть anchor у правильну позицію:
   - **top**: горизонтально — центр літери, вертикально — трохи вище верхньої лінії
   - **bottom**: горизонтально — центр літери, вертикально — трохи нижче baseline

### Візуальний приклад

```
       ↓ top anchor тут
    ┌──●──┐
    │     │
    │  н  │
    │     │
    └──●──┘
       ↑ bottom anchor тут
```

## Крок 6: Тестування

1. View → Show Mark Cloud (покаже всі можливі комбінації)
2. Або введіть у Edit View:
   ```
   /en-cy/macroncomb /en-cy/dotaccentcomb /en-cy/dotbelowcomb
   ```

3. Перевірте всі комбінації:
   ```
   н̄ н̇ н̣ н̃ м̇ м̣ ш́ т̣ д̣ р̣ л̣ х̣ а̄
   ```

## Крок 7: Mark feature

Glyphs автоматично генерує `mark` feature якщо anchors налаштовані правильно.

Перевірте: File → Font Info → Features → mark

Має бути щось на кшталт:
```
feature mark {
    lookup mark1 {
        pos base @Bases_top <anchor ... > mark @Combining_top;
    } mark1;
} mark;
```

## Крок 8: Експорт

1. File → Export (Cmd+E)
2. Виберіть формати:
   - **OTF** — для desktop
   - **WOFF2** — для web (найважливіший!)
   - **TTF** — для сумісності

3. Destination: `/path/to/your/project/public/fonts/`

## Крок 9: Підключення до проекту

### CSS

```css
@font-face {
  font-family: 'Vedavoice Serif';
  src: url('/fonts/VedavoiceSerif-Regular.woff2') format('woff2'),
       url('/fonts/VedavoiceSerif-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Vedavoice Serif';
  src: url('/fonts/VedavoiceSerif-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Vedavoice Serif';
  src: url('/fonts/VedavoiceSerif-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Оновіть index.css

```css
:root {
  --font-translit: "Vedavoice Serif", "Gentium Plus", "Noto Serif", serif;
}
```

---

## Швидкий скрипт для Glyphs (Python)

Відкрийте Window → Macro Panel і вставте:

```python
# Додає top і bottom anchors до кириличних літер
cyrillic_glyphs = {
    # glyph_name: (needs_top, needs_bottom)
    "a-cy": (True, False),      # а
    "A-cy": (True, False),      # А
    "i-cy": (True, False),      # і (або i-cy.loclUKR)
    "I-cy": (True, False),      # І
    "u-cy": (True, False),      # у
    "U-cy": (True, False),      # У
    "de-cy": (False, True),     # д
    "De-cy": (False, True),     # Д
    "el-cy": (True, True),      # л
    "El-cy": (True, True),      # Л
    "em-cy": (True, True),      # м
    "Em-cy": (True, True),      # М
    "en-cy": (True, True),      # н
    "En-cy": (True, True),      # Н
    "er-cy": (True, True),      # р
    "Er-cy": (True, True),      # Р
    "es-cy": (True, False),     # с
    "Es-cy": (True, False),     # С
    "te-cy": (False, True),     # т
    "Te-cy": (False, True),     # Т
    "ha-cy": (False, True),     # х
    "Ha-cy": (False, True),     # Х
    "sha-cy": (True, False),    # ш
    "Sha-cy": (True, False),    # Ш
}

font = Glyphs.font

for glyph_name, (needs_top, needs_bottom) in cyrillic_glyphs.items():
    glyph = font.glyphs[glyph_name]
    if not glyph:
        print(f"⚠️ Гліф {glyph_name} не знайдено")
        continue

    for layer in glyph.layers:
        if layer.isMasterLayer:
            # Розрахунок позицій
            width = layer.width
            center_x = width / 2
            top_y = layer.bounds.origin.y + layer.bounds.size.height + 50
            bottom_y = -80

            # Видаляємо старі anchors з такими назвами
            layer.anchors = [a for a in layer.anchors if a.name not in ("top", "bottom")]

            if needs_top:
                layer.anchors.append(GSAnchor("top", NSPoint(center_x, top_y)))
                print(f"✅ {glyph_name}: додано top anchor")

            if needs_bottom:
                layer.anchors.append(GSAnchor("bottom", NSPoint(center_x, bottom_y)))
                print(f"✅ {glyph_name}: додано bottom anchor")

print("\n🎉 Готово! Перевірте anchors у гліфах.")
```

---

## Корисні посилання

- [Glyphs Handbook: Diacritics](https://glyphsapp.com/learn/diacritics)
- [Glyphs Tutorial: Mark Attachment](https://glyphsapp.com/learn/mark-attachment)
- [SIL Gentium Source](https://github.com/silnrsi/font-gentium)

---

## Troubleshooting

### Діакритика не позиціонується

1. Перевірте що anchor в mark називається `_top` (з підкресленням!)
2. Перевірте що anchor в base називається `top` (без підкреслення!)
3. File → Font Info → Features → натисніть "Update"

### Гліф не знайдено в скрипті

Назви гліфів можуть відрізнятися. Перевірте точну назву:
1. Виберіть гліф
2. Подивіться назву в панелі Info (Cmd+Alt+I)
3. Або: `print([g.name for g in font.glyphs if "cy" in g.name.lower()])`

### WOFF2 не експортується

1. Встановіть плагін: Plugin Manager → "WOFF2 Export"
2. Або використайте [google/woff2](https://github.com/nicbarker/woff2) для конвертації

---

*Документ для Glyphs 3*
*Проект: Vedavoice.org*
