#!/bin/bash
# Script to check missing transliteration in Srimad Bhagavatam Canto 1

API_URL="https://qeplxgqadcbwlrbgydlb.supabase.co/rest/v1"
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcGx4Z3FhZGNid2xyYmd5ZGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDcyNzUsImV4cCI6MjA3MzY4MzI3NX0.fiA58EYJWNtAzEeG341t98QHmLcY6cwtpgC-TfKx6G0"

# Canto 1 chapters
CHAPTERS=(
    "ec4d3bb4-fcb4-46ee-9a59-413798d70ee2:1:Запитання мудреців"
    "b62830cb-86fe-4273-ae56-bda54919a9b6:2:Божественність і божественне служіння"
    "eaa1fe32-fc09-456c-b47a-05fb625a0fa5:3:Крішна – джерело всіх утілень"
    "23aeab32-a415-49f4-bb1e-f11d89c9f7fb:4:Зʼявлення Шрі Наради"
    "c3cc6db2-f480-4b7f-a3cd-ba495b38995f:5:Нарада дає Вʼясадеві настанови"
    "53bd91ac-644f-4e13-9b13-2ac015fd4ed4:6:Нарада розмовляє з Вʼясадевою"
    "144ce0db-2352-4d7d-86f8-31f48ca8056b:7:Покарання сина Дрони"
    "eeef2e49-840b-48f6-ae44-a50aed6b4674:8:Молитви цариці Кунті"
    "4d2786b9-5c9b-43bd-965e-03de3f4dd3d7:9:Відхід Бгішмадеви"
    "43474b0f-4e21-48f0-8496-c5f1491f7323:10:Господь Крішна вирушає до Двараки"
    "c23afd91-b979-441a-a8c6-89856c5810fd:11:Господь Крішна вступає у Двараку"
    "37b09c4d-e989-46e0-a1b1-a1e0ee9f0f29:12:Народження імператора Парікшіта"
    "ae5e24f5-0e9c-47af-b710-029cf28d468d:13:Дгрітараштра покидає дім"
    "77cdd3bc-9b97-4f66-a756-df8e4ec21ce3:14:Господь Крішна йде з цього світу"
    "c2a0a2dd-1cc9-43f7-baf5-d3028f1cd759:15:Своєчасний відхід Пандавів"
    "2f857e69-c436-4e6b-85b8-8324899b3eb2:16:Як Парікшіт зустрів вік Калі"
    "b5a20f2f-9ed7-4f69-aa8e-3cd04ae7e6a8:17:Кара й помилування Калі"
    "41eb2401-56bf-4dbd-a215-2a2176518165:18:Син брахмана проклинає"
    "bb1c1dd5-8c74-4d7d-8f7b-d79019043b72:19:Зʼявлення Шукадеви Ґосвамі"
)

echo "========================================"
echo "Аналіз транслітерації в Шрімад-Бгаґаватам"
echo "Перша пісня - Творення"
echo "========================================"
echo ""

total_verses=0
total_missing_translit=0
total_missing_translit_uk=0
total_missing_translit_en=0

for chapter_info in "${CHAPTERS[@]}"; do
    IFS=':' read -r chapter_id chapter_num chapter_title <<< "$chapter_info"

    # Get all verses for this chapter
    response=$(curl -s "${API_URL}/verses?select=verse_number,transliteration,transliteration_uk,transliteration_en&chapter_id=eq.${chapter_id}&deleted_at=is.null&order=verse_number_sort" \
        -H "apikey: ${API_KEY}" \
        -H "Authorization: Bearer ${API_KEY}")

    # Count verses
    verse_count=$(echo "$response" | jq 'length')

    # Find verses without any transliteration
    missing_all=$(echo "$response" | jq '[.[] | select(
        (.transliteration == null or .transliteration == "") and
        (.transliteration_uk == null or .transliteration_uk == "") and
        (.transliteration_en == null or .transliteration_en == "")
    )] | length')

    # Find verses without transliteration_uk
    missing_uk=$(echo "$response" | jq '[.[] | select(
        .transliteration_uk == null or .transliteration_uk == ""
    )] | length')

    # Find verses without transliteration_en
    missing_en=$(echo "$response" | jq '[.[] | select(
        .transliteration_en == null or .transliteration_en == ""
    )] | length')

    # Get list of verses missing all transliteration
    missing_verses=$(echo "$response" | jq -r '[.[] | select(
        (.transliteration == null or .transliteration == "") and
        (.transliteration_uk == null or .transliteration_uk == "") and
        (.transliteration_en == null or .transliteration_en == "")
    )] | map(.verse_number) | join(", ")')

    # Update totals
    total_verses=$((total_verses + verse_count))
    total_missing_translit=$((total_missing_translit + missing_all))
    total_missing_translit_uk=$((total_missing_translit_uk + missing_uk))
    total_missing_translit_en=$((total_missing_translit_en + missing_en))

    echo "Глава ${chapter_num}: ${chapter_title}"
    echo "  Віршів: ${verse_count}"

    if [ "$missing_all" -gt 0 ]; then
        echo "  ❌ БЕЗ ТРАНСЛІТЕРАЦІЇ: ${missing_all} віршів"
        echo "     Вірші: ${missing_verses}"
    else
        echo "  ✅ Всі вірші мають транслітерацію"
    fi

    if [ "$missing_uk" -gt 0 ] && [ "$missing_uk" -ne "$missing_all" ]; then
        echo "  ⚠️  Без UK транслітерації: ${missing_uk}"
    fi

    if [ "$missing_en" -gt 0 ] && [ "$missing_en" -ne "$missing_all" ]; then
        echo "  ⚠️  Без EN транслітерації: ${missing_en}"
    fi

    echo ""
done

echo "========================================"
echo "ПІДСУМОК:"
echo "========================================"
echo "Всього віршів в Пісні 1: ${total_verses}"
echo "Без жодної транслітерації: ${total_missing_translit}"
echo "Без транслітерації UK: ${total_missing_translit_uk}"
echo "Без транслітерації EN: ${total_missing_translit_en}"
echo "========================================"
