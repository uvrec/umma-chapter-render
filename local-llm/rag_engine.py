"""
RAG Engine - Query engine for Vedavoice books
"""
from typing import List, Optional, Generator
from dataclasses import dataclass

from llama_index.core import VectorStoreIndex, StorageContext, Settings as LlamaSettings
from llama_index.core.chat_engine import CondensePlusContextChatEngine
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding
import chromadb

from config import settings


@dataclass
class SourceReference:
    """A source reference from the RAG retrieval"""
    reference: str
    book_title: str
    chapter_title: str
    verse_number: str
    content_snippet: str
    relevance_score: float


@dataclass
class RAGResponse:
    """Response from the RAG engine"""
    answer: str
    sources: List[SourceReference]
    model: str


class VedavoiceRAG:
    """RAG engine for Vedavoice books"""

    def __init__(self):
        self.llm = None
        self.embed_model = None
        self.index = None
        self.chat_engine = None
        self._initialized = False

    def initialize(self):
        """Initialize the RAG engine with models and index"""
        if self._initialized:
            return

        # Initialize LLM
        self.llm = Ollama(
            model=settings.llm_model,
            base_url=settings.ollama_base_url,
            request_timeout=120.0,
            temperature=0.7,
        )

        # Initialize embedding model
        self.embed_model = OllamaEmbedding(
            model_name=settings.embedding_model,
            base_url=settings.ollama_base_url,
        )

        # Set global settings
        LlamaSettings.llm = self.llm
        LlamaSettings.embed_model = self.embed_model

        # Load vector store
        chroma_client = chromadb.PersistentClient(path=settings.chroma_persist_dir)

        try:
            chroma_collection = chroma_client.get_collection(settings.collection_name)
        except Exception as e:
            raise RuntimeError(
                f"Vector store not found. Please run indexer.py first.\n"
                f"Error: {e}"
            )

        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Create index from existing vector store
        self.index = VectorStoreIndex.from_vector_store(
            vector_store=vector_store,
            storage_context=storage_context,
        )

        self._initialized = True

    def create_chat_engine(self, chat_history: Optional[List[dict]] = None):
        """Create a new chat engine with optional history"""
        if not self._initialized:
            self.initialize()

        # Create retriever
        retriever = self.index.as_retriever(
            similarity_top_k=settings.similarity_top_k,
        )

        # Convert chat history if provided
        memory = ChatMemoryBuffer.from_defaults(token_limit=4096)
        if chat_history:
            for msg in chat_history:
                role = MessageRole.USER if msg["role"] == "user" else MessageRole.ASSISTANT
                memory.put(ChatMessage(role=role, content=msg["content"]))

        # Create chat engine
        chat_engine = CondensePlusContextChatEngine.from_defaults(
            retriever=retriever,
            llm=self.llm,
            memory=memory,
            system_prompt=settings.system_prompt,
            verbose=False,
        )

        return chat_engine

    def query(
        self,
        question: str,
        chat_history: Optional[List[dict]] = None,
    ) -> RAGResponse:
        """
        Query the RAG system with a question

        Args:
            question: The user's question
            chat_history: Optional list of previous messages [{"role": "user/assistant", "content": "..."}]

        Returns:
            RAGResponse with answer and sources
        """
        chat_engine = self.create_chat_engine(chat_history)

        # Get response
        response = chat_engine.chat(question)

        # Extract sources
        sources = []
        if hasattr(response, 'source_nodes'):
            for node in response.source_nodes:
                metadata = node.node.metadata
                sources.append(SourceReference(
                    reference=metadata.get("reference", ""),
                    book_title=metadata.get("book_title", ""),
                    chapter_title=metadata.get("chapter_title", ""),
                    verse_number=metadata.get("verse_number", ""),
                    content_snippet=node.node.text[:300] + "..." if len(node.node.text) > 300 else node.node.text,
                    relevance_score=node.score if hasattr(node, 'score') else 0.0,
                ))

        return RAGResponse(
            answer=str(response),
            sources=sources,
            model=settings.llm_model,
        )

    def query_stream(
        self,
        question: str,
        chat_history: Optional[List[dict]] = None,
    ) -> Generator[str, None, None]:
        """
        Stream response from the RAG system

        Args:
            question: The user's question
            chat_history: Optional list of previous messages

        Yields:
            Chunks of the response text
        """
        chat_engine = self.create_chat_engine(chat_history)

        # Get streaming response
        response = chat_engine.stream_chat(question)

        for token in response.response_gen:
            yield token

    def get_similar_verses(self, query: str, top_k: int = 5) -> List[SourceReference]:
        """
        Find verses similar to the query without generating a response

        Args:
            query: Search query
            top_k: Number of results to return

        Returns:
            List of similar verses with metadata
        """
        if not self._initialized:
            self.initialize()

        retriever = self.index.as_retriever(similarity_top_k=top_k)
        nodes = retriever.retrieve(query)

        results = []
        for node in nodes:
            metadata = node.node.metadata
            results.append(SourceReference(
                reference=metadata.get("reference", ""),
                book_title=metadata.get("book_title", ""),
                chapter_title=metadata.get("chapter_title", ""),
                verse_number=metadata.get("verse_number", ""),
                content_snippet=node.node.text[:500] + "..." if len(node.node.text) > 500 else node.node.text,
                relevance_score=node.score if hasattr(node, 'score') else 0.0,
            ))

        return results


# Global instance
_rag_engine: Optional[VedavoiceRAG] = None


def get_rag_engine() -> VedavoiceRAG:
    """Get or create the global RAG engine instance"""
    global _rag_engine
    if _rag_engine is None:
        _rag_engine = VedavoiceRAG()
        _rag_engine.initialize()
    return _rag_engine
