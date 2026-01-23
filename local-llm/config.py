"""
Configuration for Vedavoice Local LLM RAG System
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    # Supabase
    supabase_url: str = Field(default="https://qeplxgqadcbwlrbgydlb.supabase.co")
    supabase_anon_key: str = Field(default="")

    # Ollama
    ollama_base_url: str = Field(default="http://localhost:11434")
    llm_model: str = Field(default="qwen2.5:14b")  # Good for multilingual (Ukrainian/Sanskrit/English)
    embedding_model: str = Field(default="nomic-embed-text")  # Multilingual embeddings

    # RAG Settings
    chunk_size: int = Field(default=512)
    chunk_overlap: int = Field(default=50)
    similarity_top_k: int = Field(default=5)

    # Vector Store
    chroma_persist_dir: str = Field(default="./chroma_db")
    collection_name: str = Field(default="vedavoice_books")

    # Server
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8000)

    # System Prompt
    system_prompt: str = Field(default="""Ти - асистент з вивчення вайшнавської філософії, що базується виключно на книгах Шріли Прабгупади та ґаудія-вайшнавських ачар'їв.

ВАЖЛИВІ ПРАВИЛА:
1. Відповідай ТІЛЬКИ на основі наданого контексту з книг
2. Якщо інформації немає в контексті - чесно скажи про це
3. Завжди вказуй джерело (назва книги, глава, вірш)
4. Використовуй санскритські терміни з поясненнями
5. Відповідай українською мовою, якщо не попросять іншою
6. Будь шанобливим до священних текстів та ачар'їв

При цитуванні:
- Вказуй точне джерело: "У Бгаґавад-ґіті 2.14 сказано..."
- Якщо це коментар: "У коментарі Шріли Прабгупади до БҐ 2.14..."
""")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()


# Book metadata for better context
BOOK_METADATA = {
    "bg": {"title_uk": "Бгаґавад-ґіта як вона є", "title_en": "Bhagavad-gita As It Is", "author": "Шріла Прабгупада"},
    "sb": {"title_uk": "Шрімад-Бгаґаватам", "title_en": "Srimad-Bhagavatam", "author": "Шріла Прабгупада"},
    "cc": {"title_uk": "Чайтанья-чарітамріта", "title_en": "Caitanya-caritamrta", "author": "Шріла Прабгупада"},
    "noi": {"title_uk": "Нектар настанов", "title_en": "Nectar of Instruction", "author": "Шріла Прабгупада"},
    "nod": {"title_uk": "Нектар відданості", "title_en": "Nectar of Devotion", "author": "Шріла Прабгупада"},
    "iso": {"title_uk": "Шрі Ішопанішад", "title_en": "Sri Isopanisad", "author": "Шріла Прабгупада"},
    "kb": {"title_uk": "Крішна - Верховний Бог-Особа", "title_en": "Krishna Book", "author": "Шріла Прабгупада"},
    "tlk": {"title_uk": "Вчення Господа Капіли", "title_en": "Teachings of Lord Kapila", "author": "Шріла Прабгупада"},
    "bs": {"title_uk": "Брахма-самхіта", "title_en": "Brahma-samhita", "author": "Шріла Прабгупада"},
    "saranagati": {"title_uk": "Шаранаґаті", "title_en": "Saranagati", "author": "Бгактівінода Тхакур"},
}
