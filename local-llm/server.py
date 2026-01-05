"""
FastAPI Server for Vedavoice Local LLM
"""
import asyncio
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from rich.console import Console

from config import settings
from rag_engine import get_rag_engine, VedavoiceRAG

console = Console()


# Request/Response Models
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None
    stream: bool = False


class SourceInfo(BaseModel):
    reference: str
    book_title: str
    chapter_title: str
    verse_number: str
    content_snippet: str
    relevance_score: float


class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceInfo]
    model: str


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


class HealthResponse(BaseModel):
    status: str
    model: str
    embedding_model: str
    indexed: bool


# Global RAG engine
rag_engine: Optional[VedavoiceRAG] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize RAG engine on startup"""
    global rag_engine
    console.print("\n[bold blue]Starting Vedavoice Local LLM Server[/bold blue]\n")

    try:
        console.print("[cyan]Initializing RAG engine...[/cyan]")
        rag_engine = get_rag_engine()
        console.print("[green]RAG engine ready![/green]")
        console.print(f"[dim]LLM Model: {settings.llm_model}[/dim]")
        console.print(f"[dim]Embedding Model: {settings.embedding_model}[/dim]")
        console.print(f"\n[bold green]Server ready at http://{settings.host}:{settings.port}[/bold green]\n")
    except Exception as e:
        console.print(f"[red]Failed to initialize RAG engine: {e}[/red]")
        console.print("[yellow]Please ensure:[/yellow]")
        console.print("  1. Ollama is running (ollama serve)")
        console.print(f"  2. Models are pulled (ollama pull {settings.llm_model})")
        console.print("  3. Index exists (python indexer.py)")
        raise

    yield

    console.print("\n[yellow]Shutting down server...[/yellow]")


# Create FastAPI app
app = FastAPI(
    title="Vedavoice Local LLM",
    description="Local RAG-based LLM for Srila Prabhupada's books",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check server health and model status"""
    global rag_engine
    return HealthResponse(
        status="healthy" if rag_engine and rag_engine._initialized else "initializing",
        model=settings.llm_model,
        embedding_model=settings.embedding_model,
        indexed=rag_engine._initialized if rag_engine else False,
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with the RAG system

    Send a message and receive an answer based on Srila Prabhupada's books.
    Optionally include chat history for context.
    """
    global rag_engine

    if not rag_engine:
        raise HTTPException(status_code=503, detail="RAG engine not initialized")

    try:
        # Convert history format
        history = None
        if request.history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.history]

        # Run query in thread pool to not block event loop
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: rag_engine.query(request.message, history)
        )

        return ChatResponse(
            answer=response.answer,
            sources=[
                SourceInfo(
                    reference=s.reference,
                    book_title=s.book_title,
                    chapter_title=s.chapter_title,
                    verse_number=s.verse_number,
                    content_snippet=s.content_snippet,
                    relevance_score=s.relevance_score,
                )
                for s in response.sources
            ],
            model=response.model,
        )
    except Exception as e:
        console.print(f"[red]Error in chat: {e}[/red]")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream chat response

    Returns a streaming response with chunks of the answer.
    Useful for real-time display in the UI.
    """
    global rag_engine

    if not rag_engine:
        raise HTTPException(status_code=503, detail="RAG engine not initialized")

    async def generate():
        try:
            # Convert history format
            history = None
            if request.history:
                history = [{"role": msg.role, "content": msg.content} for msg in request.history]

            # Stream tokens
            for token in rag_engine.query_stream(request.message, history):
                yield f"data: {token}\n\n"

            yield "data: [DONE]\n\n"
        except Exception as e:
            console.print(f"[red]Error in stream: {e}[/red]")
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.post("/search")
async def semantic_search(request: SearchRequest):
    """
    Semantic search in the books

    Find verses similar to the query without generating a response.
    Useful for browsing and exploring related content.
    """
    global rag_engine

    if not rag_engine:
        raise HTTPException(status_code=503, detail="RAG engine not initialized")

    try:
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(
            None,
            lambda: rag_engine.get_similar_verses(request.query, request.top_k)
        )

        return {
            "results": [
                {
                    "reference": r.reference,
                    "book_title": r.book_title,
                    "chapter_title": r.chapter_title,
                    "verse_number": r.verse_number,
                    "content_snippet": r.content_snippet,
                    "relevance_score": r.relevance_score,
                }
                for r in results
            ]
        }
    except Exception as e:
        console.print(f"[red]Error in search: {e}[/red]")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/models")
async def list_models():
    """List available models"""
    return {
        "llm": settings.llm_model,
        "embedding": settings.embedding_model,
        "available_llms": [
            {"name": "qwen2.5:14b", "description": "Recommended for multilingual (UA/EN/Sanskrit)", "size": "9GB"},
            {"name": "qwen2.5:7b", "description": "Faster, less accurate", "size": "4.7GB"},
            {"name": "llama3.1:8b", "description": "Good general purpose", "size": "4.7GB"},
            {"name": "mistral:7b", "description": "Fast and efficient", "size": "4.1GB"},
            {"name": "gemma2:9b", "description": "Google's model", "size": "5.4GB"},
        ]
    }


def main():
    """Run the server"""
    import uvicorn

    console.print(f"\n[bold]Vedavoice Local LLM Server[/bold]")
    console.print(f"[dim]Starting on http://{settings.host}:{settings.port}[/dim]\n")

    uvicorn.run(
        "server:app",
        host=settings.host,
        port=settings.port,
        reload=False,
    )


if __name__ == "__main__":
    main()
