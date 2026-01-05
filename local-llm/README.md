# Vedavoice Local LLM

Локальна RAG-система для вивчення книг Шріли Прабгупади. Працює повністю на вашому комп'ютері.

## Системні вимоги

- **GPU**: NVIDIA з 8+ GB VRAM (RTX 3070+) або Apple Silicon M1+
- **RAM**: 16+ GB
- **Диск**: ~20 GB для моделей
- **Python**: 3.10+

## Швидкий старт

### 1. Встановіть Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Завантажте з https://ollama.ai/download
```

### 2. Завантажте моделі

```bash
# LLM модель (виберіть одну)
ollama pull qwen2.5:14b      # Рекомендовано (9 GB, найкраща для укр/санскрит)
ollama pull qwen2.5:7b       # Швидша, менш точна (4.7 GB)
ollama pull llama3.1:8b      # Альтернатива (4.7 GB)

# Embedding модель
ollama pull nomic-embed-text
```

### 3. Налаштуйте Python оточення

```bash
cd local-llm

# Створіть віртуальне оточення
python -m venv venv
source venv/bin/activate  # Linux/macOS
# або: venv\Scripts\activate  # Windows

# Встановіть залежності
pip install -r requirements.txt
```

### 4. Налаштуйте змінні оточення

```bash
# Створіть .env файл
cp .env.example .env

# Відредагуйте .env та додайте ваш Supabase ключ
# SUPABASE_ANON_KEY=your_key_here
```

### 5. Проіндексуйте книги

```bash
# Переконайтесь, що Ollama працює
ollama serve  # в окремому терміналі

# Запустіть індексацію
python indexer.py
```

Це створить векторну базу даних з усіх книг у Supabase.

### 6. Запустіть сервер

```bash
python server.py
```

Сервер буде доступний на `http://localhost:8000`

### 7. Використовуйте в Vedavoice

Відкрийте `http://localhost:8080/chat/local` у браузері.

## Конфігурація

Редагуйте `config.py` або створіть `.env` файл:

```env
# Supabase
SUPABASE_URL=https://qeplxgqadcbwlrbgydlb.supabase.co
SUPABASE_ANON_KEY=your_key_here

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
LLM_MODEL=qwen2.5:14b
EMBEDDING_MODEL=nomic-embed-text

# RAG
CHUNK_SIZE=512
CHUNK_OVERLAP=50
SIMILARITY_TOP_K=5

# Server
HOST=0.0.0.0
PORT=8000
```

## API Endpoints

### POST /chat
Запит до RAG системи.

```json
{
  "message": "Що таке бгакті?",
  "history": [
    {"role": "user", "content": "Попереднє питання"},
    {"role": "assistant", "content": "Попередня відповідь"}
  ],
  "stream": false
}
```

### POST /chat/stream
Потокова відповідь (SSE).

### POST /search
Семантичний пошук у книгах.

```json
{
  "query": "карма",
  "top_k": 5
}
```

### GET /health
Статус сервера.

### GET /models
Доступні моделі.

## Рекомендовані моделі

| Модель | Розмір | Опис |
|--------|--------|------|
| qwen2.5:14b | 9 GB | Найкраща для багатомовності (укр/англ/санскрит) |
| qwen2.5:7b | 4.7 GB | Швидша, менш точна |
| llama3.1:8b | 4.7 GB | Хороша загальна модель |
| mistral:7b | 4.1 GB | Швидка та ефективна |

## Структура проекту

```
local-llm/
├── config.py          # Конфігурація
├── indexer.py         # Індексація книг
├── rag_engine.py      # RAG система
├── server.py          # FastAPI сервер
├── requirements.txt   # Залежності Python
├── .env.example       # Приклад конфігурації
└── chroma_db/         # Векторна база (створюється автоматично)
```

## Оновлення індексу

При додаванні нових книг запустіть повторну індексацію:

```bash
python indexer.py --fresh
```

## Вирішення проблем

### Ollama не запускається
```bash
# Перевірте статус
ollama list

# Перезапустіть
pkill ollama
ollama serve
```

### Помилка CUDA/GPU
```bash
# Перевірте CUDA
nvidia-smi

# Використовуйте CPU (повільніше)
# Відредагуйте OLLAMA_HOST=0.0.0.0 в .env
```

### Недостатньо пам'яті
Використовуйте меншу модель:
```bash
ollama pull qwen2.5:7b
# Змініть LLM_MODEL=qwen2.5:7b в .env
```

## Ліцензія

MIT License - для особистого та освітнього використання.

Харе Крішна!
