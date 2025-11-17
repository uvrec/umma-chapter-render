#!/bin/bash
# Простий скрипт для імпорту Śrīmad-Bhāgavatam з EPUB → Supabase

set -e  # Зупинитися при помилці

echo "📚 Імпорт Śrīmad-Bhāgavatam з EPUB → Supabase"
echo "=============================================="
echo ""

# Перевірка наявності Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 не знайдено. Встановіть Python 3."
    exit 1
fi

# Перевірка змінних середовища для реального імпорту
check_env_vars() {
    if [ -z "$SUPABASE_URL" ]; then
        echo "❌ SUPABASE_URL не встановлено"
        echo "   Встановіть: export SUPABASE_URL='https://your-project.supabase.co'"
        exit 1
    fi

    if [ -z "$SUPABASE_SERVICE_KEY" ]; then
        echo "❌ SUPABASE_SERVICE_KEY не встановлено"
        echo "   Встановіть: export SUPABASE_SERVICE_KEY='your-service-role-key'"
        exit 1
    fi
}

# Функція для імпорту однієї пісні
import_canto() {
    local canto=$1
    local epub_file=$2
    local chapters=$3

    echo ""
    echo "🎵 Імпорт Пісні $canto (глави $chapters)..."
    echo "   Файл: $epub_file"

    if [ ! -f "$epub_file" ]; then
        echo "   ❌ Файл не знайдено: $epub_file"
        return 1
    fi

    # Перевірити змінні перед імпортом
    check_env_vars

    python3 import_sb_epub.py \
        --epub "$epub_file" \
        --canto "$canto" \
        --chapters "$chapters"

    if [ $? -eq 0 ]; then
        echo "   ✅ Пісня $canto успішно імпортована!"
    else
        echo "   ❌ Помилка при імпорті Пісні $canto"
        return 1
    fi
}

# Меню вибору
echo "Оберіть, що імпортувати:"
echo ""
echo "  1) Пісня 2 (10 глав)"
echo "  2) Пісня 3 (33 глави)"
echo "  3) Обидві пісні (2 + 3)"
echo "  4) Суха прогонка (dry-run) Пісні 2"
echo "  5) Суха прогонка (dry-run) Пісні 3"
echo "  6) Вихід"
echo ""
read -p "Ваш вибір (1-6): " choice

case $choice in
    1)
        import_canto 2 "UK_SB_2_epub_r2.epub" "1-10"
        ;;
    2)
        import_canto 3 "UK_SB_3_epub_r1.epub" "1-33"
        ;;
    3)
        import_canto 2 "UK_SB_2_epub_r2.epub" "1-10"
        import_canto 3 "UK_SB_3_epub_r1.epub" "1-33"
        ;;
    4)
        echo ""
        echo "🧪 Суха прогонка Пісні 2..."
        python3 import_sb_epub.py --epub UK_SB_2_epub_r2.epub --canto 2 --chapters 1-10 --dry-run --skip-vedabase
        ;;
    5)
        echo ""
        echo "🧪 Суха прогонка Пісні 3..."
        python3 import_sb_epub.py --epub UK_SB_3_epub_r1.epub --canto 3 --chapters 1-33 --dry-run --skip-vedabase
        ;;
    6)
        echo "Вихід."
        exit 0
        ;;
    *)
        echo "❌ Невірний вибір"
        exit 1
        ;;
esac

echo ""
echo "✅ Готово!"
