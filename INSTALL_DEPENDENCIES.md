# Встановлення залежностей для імпорту SB

## Python залежності

```bash
# Встановити всі необхідні пакети
pip install pdfplumber requests supabase

# Або встановити окремо
pip install pdfplumber  # Для читання PDF з правильними пробілами
pip install requests    # Для запитів до Vedabase (вже встановлено)
pip install supabase    # Для роботи з БД (вже встановлено)
```

## Змінні середовища

```bash
# Експортувати змінні для Supabase
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="eyJ..."

# Або створити .env файл
echo 'SUPABASE_URL="https://your-project.supabase.co"' > .env
echo 'SUPABASE_SERVICE_KEY="eyJ..."' >> .env
```

## Перевірка встановлення

```bash
# Перевірити Python пакети
python3 -c "import pdfplumber; print('✅ pdfplumber')"
python3 -c "import requests; print('✅ requests')"
python3 -c "import supabase; print('✅ supabase')"

# Перевірити скрипт
python3 import_sb_pdf.py --help
```

## Статус залежностей

Поточний статус (автоматично згенеровано):

- ❌ pdfplumber - **потрібно встановити**: `pip install pdfplumber`
- ✅ requests - встановлено
- ✅ supabase - встановлено

## Розташування PDF файлу

Очікуване розташування PDF:
```
/mnt/user-data/uploads/UK_SB_3_2_2024_text_r14.pdf
```

Або скопіюйте PDF у корінь проекту:
```bash
cp /path/to/UK_SB_3_2_2024_text_r14.pdf .
```
