#!/bin/bash
# Скрипт для завантаження SB Canto 2 з vedabase.io
# Використання: bash tools/fetch-sb-vedabase.sh

CANTO=2
OUTPUT_DIR="tools/outputs/vedabase_sb${CANTO}"
mkdir -p "$OUTPUT_DIR"

# Читаємо структуру з української версії
UK_JSON="src/data/sb-canto2-parsed.json"

echo "=============================================="
echo "Fetching SB Canto ${CANTO} from vedabase.io"
echo "=============================================="

# Функція для завантаження одного вірша
fetch_verse() {
  local chapter=$1
  local verse=$2
  local output_file="${OUTPUT_DIR}/ch${chapter}_v${verse}.html"
  local url="https://vedabase.io/en/library/sb/${CANTO}/${chapter}/${verse}/"

  if [[ -f "$output_file" ]]; then
    echo "  Cached: ${chapter}.${verse}"
    return 0
  fi

  echo "  Fetching: ${chapter}.${verse}..."

  for attempt in 1 2 3 4; do
    curl -s -L --max-time 30 \
      -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
      -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
      -H "Accept-Language: en-US,en;q=0.5" \
      --compressed \
      "$url" > "$output_file" 2>/dev/null

    if [[ -s "$output_file" ]] && grep -q "av-translation" "$output_file" 2>/dev/null; then
      echo "  OK: ${chapter}.${verse}"
      return 0
    fi

    echo "  Retry ${attempt}: ${chapter}.${verse}"
    rm -f "$output_file"
    sleep $((attempt * 2))
  done

  echo "  FAILED: ${chapter}.${verse}"
  return 1
}

# Витягуємо список глав та віршів з UK JSON
chapters=$(jq -r '.chapters[] | "\(.chapter_number)"' "$UK_JSON")

for chapter in $chapters; do
  echo ""
  echo "Chapter ${chapter}"
  echo "----------------------------------------"

  # Витягуємо вірші для цієї глави
  verses=$(jq -r ".chapters[] | select(.chapter_number == ${chapter}) | .verses[] | .verse_number" "$UK_JSON")

  for verse_num in $verses; do
    # Пропускаємо нечислові вірші (ЗВЕРНЕННЯ тощо)
    if ! [[ "$verse_num" =~ ^[0-9] ]]; then
      echo "  Skip: ${verse_num}"
      continue
    fi

    # Для об'єднаних віршів (наприклад 2-7) - завантажуємо за URL з діапазоном
    # Vedabase використовує URL формату /sb/2/3/2-7/ для об'єднаних віршів
    fetch_verse "$chapter" "$verse_num"
    sleep 0.5
  done
done

echo ""
echo "=============================================="
echo "Download complete!"
echo "Files saved to: ${OUTPUT_DIR}"
echo "=============================================="

# Підрахунок
total=$(find "$OUTPUT_DIR" -name "*.html" | wc -l)
echo "Total files: ${total}"
