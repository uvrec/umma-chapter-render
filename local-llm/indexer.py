"""
Book Indexer - Fetches books from Supabase and creates vector embeddings
"""
import os
import asyncio
from typing import List, Optional
from dataclasses import dataclass

from rich.console import Console
from rich.progress import Progress, TaskID
from supabase import create_client, Client

from llama_index.core import Document, VectorStoreIndex, StorageContext
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.ollama import OllamaEmbedding
import chromadb

from config import settings, BOOK_METADATA

console = Console()


@dataclass
class VerseDocument:
    """Represents a verse with all its content"""
    book_slug: str
    book_title: str
    canto_number: Optional[int]
    chapter_number: int
    chapter_title: str
    verse_number: str
    sanskrit: Optional[str]
    transliteration: Optional[str]
    synonyms_ua: Optional[str]
    synonyms_en: Optional[str]
    translation_ua: Optional[str]
    translation_en: Optional[str]
    commentary_ua: Optional[str]
    commentary_en: Optional[str]


class VedavoiceIndexer:
    def __init__(self):
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_anon_key
        )

        # Initialize embedding model
        self.embed_model = OllamaEmbedding(
            model_name=settings.embedding_model,
            base_url=settings.ollama_base_url,
        )

        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(path=settings.chroma_persist_dir)

    def _get_or_create_collection(self):
        """Get or create ChromaDB collection"""
        try:
            # Try to delete existing collection for fresh index
            self.chroma_client.delete_collection(settings.collection_name)
            console.print(f"[yellow]Deleted existing collection: {settings.collection_name}[/yellow]")
        except Exception:
            pass

        return self.chroma_client.create_collection(
            name=settings.collection_name,
            metadata={"description": "Vedavoice books vector store"}
        )

    async def fetch_books(self) -> List[dict]:
        """Fetch all books from Supabase"""
        response = self.supabase.table("books").select("*").execute()
        return response.data

    async def fetch_verses_for_book(self, book_id: str) -> List[dict]:
        """Fetch all verses for a specific book with chapter info"""
        response = self.supabase.table("verses_with_metadata").select("*").eq("book_id", book_id).execute()
        return response.data

    async def fetch_chapters_for_book(self, book_id: str) -> dict:
        """Fetch chapters and create a lookup dict"""
        response = self.supabase.table("chapters").select("*").eq("book_id", book_id).execute()
        return {ch["id"]: ch for ch in response.data}

    def verse_to_document(self, verse: dict, book: dict, chapter: dict) -> Document:
        """Convert a verse to a LlamaIndex Document with rich metadata"""
        book_slug = book.get("slug", "unknown")
        book_meta = BOOK_METADATA.get(book_slug, {})
        book_title = book_meta.get("title_ua", book.get("title", ""))

        # Build verse reference
        canto = verse.get("canto_number")
        chapter_num = verse.get("chapter_number") or chapter.get("chapter_number", 1)
        verse_num = verse.get("verse_number", "")

        if canto:
            reference = f"{book_title} {canto}.{chapter_num}.{verse_num}"
        else:
            reference = f"{book_title} {chapter_num}.{verse_num}"

        # Build document text - combine all relevant fields
        text_parts = []

        # Reference header
        text_parts.append(f"=== {reference} ===\n")

        # Sanskrit and transliteration
        if verse.get("sanskrit"):
            text_parts.append(f"Санскрит: {verse['sanskrit']}")
        if verse.get("transliteration_ua") or verse.get("transliteration_en"):
            translit = verse.get("transliteration_ua") or verse.get("transliteration_en")
            text_parts.append(f"Транслітерація: {translit}")

        # Synonyms
        if verse.get("synonyms_ua"):
            text_parts.append(f"Послівний переклад: {verse['synonyms_ua']}")
        elif verse.get("synonyms_en"):
            text_parts.append(f"Word-for-word: {verse['synonyms_en']}")

        # Translation
        if verse.get("translation_ua"):
            text_parts.append(f"Переклад: {verse['translation_ua']}")
        elif verse.get("translation_en"):
            text_parts.append(f"Translation: {verse['translation_en']}")

        # Commentary (purport)
        if verse.get("commentary_ua"):
            text_parts.append(f"Коментар: {verse['commentary_ua']}")
        elif verse.get("commentary_en"):
            text_parts.append(f"Purport: {verse['commentary_en']}")

        full_text = "\n\n".join(text_parts)

        # Metadata for filtering and display
        metadata = {
            "book_slug": book_slug,
            "book_title": book_title,
            "book_title_en": book_meta.get("title_en", book.get("title_en", "")),
            "author": book_meta.get("author", "Шріла Прабгупада"),
            "canto_number": canto,
            "chapter_number": chapter_num,
            "chapter_title": chapter.get("title_ua") or chapter.get("title_en", ""),
            "verse_number": verse_num,
            "reference": reference,
            "has_ukrainian": bool(verse.get("translation_ua") or verse.get("commentary_ua")),
            "content_type": "verse"
        }

        return Document(text=full_text, metadata=metadata)

    async def index_all_books(self, reindex: bool = True):
        """Index all books from Supabase"""
        console.print("\n[bold blue]Vedavoice RAG Indexer[/bold blue]\n")

        # Fetch all books
        console.print("[cyan]Fetching books from Supabase...[/cyan]")
        books = await self.fetch_books()
        console.print(f"[green]Found {len(books)} books[/green]\n")

        all_documents: List[Document] = []

        with Progress() as progress:
            books_task = progress.add_task("[cyan]Processing books...", total=len(books))

            for book in books:
                book_title = book.get("title", book.get("slug", "Unknown"))
                progress.update(books_task, description=f"[cyan]Processing: {book_title}")

                # Fetch verses and chapters
                verses = await self.fetch_verses_for_book(book["id"])
                chapters = await self.fetch_chapters_for_book(book["id"])

                if not verses:
                    progress.advance(books_task)
                    continue

                # Convert verses to documents
                for verse in verses:
                    chapter = chapters.get(verse.get("chapter_id"), {})
                    doc = self.verse_to_document(verse, book, chapter)
                    all_documents.append(doc)

                console.print(f"  [dim]├─ {book_title}: {len(verses)} verses[/dim]")
                progress.advance(books_task)

        console.print(f"\n[green]Total documents: {len(all_documents)}[/green]")

        if not all_documents:
            console.print("[red]No documents to index![/red]")
            return

        # Create vector store
        console.print("\n[cyan]Creating vector embeddings...[/cyan]")
        console.print(f"[dim]Using embedding model: {settings.embedding_model}[/dim]")
        console.print(f"[dim]This may take a while for large collections...[/dim]\n")

        # Initialize ChromaDB collection
        chroma_collection = self._get_or_create_collection()
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Create index with chunking
        node_parser = SentenceSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
        )

        index = VectorStoreIndex.from_documents(
            all_documents,
            storage_context=storage_context,
            embed_model=self.embed_model,
            transformations=[node_parser],
            show_progress=True,
        )

        console.print(f"\n[bold green]Indexing complete![/bold green]")
        console.print(f"[green]Vector store saved to: {settings.chroma_persist_dir}[/green]")

        return index


async def main():
    """Main entry point for indexing"""
    import argparse

    parser = argparse.ArgumentParser(description="Index Vedavoice books for RAG")
    parser.add_argument("--fresh", action="store_true", help="Delete existing index and create fresh")
    args = parser.parse_args()

    # Check if Supabase key is set
    if not settings.supabase_anon_key:
        console.print("[red]Error: SUPABASE_ANON_KEY not set![/red]")
        console.print("[yellow]Please create a .env file with:[/yellow]")
        console.print("SUPABASE_ANON_KEY=your_key_here")
        return

    indexer = VedavoiceIndexer()
    await indexer.index_all_books(reindex=args.fresh)


if __name__ == "__main__":
    asyncio.run(main())
