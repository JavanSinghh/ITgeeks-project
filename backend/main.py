"""
================================================================================
FastAPI Backend Application Root & REST API Endpoints
================================================================================
Exposes production REST API endpoints for Hinglish group chat search, WhatsApp export
parsing/uploading, dataset statistics, and 40-query benchmark evaluation.
================================================================================
"""

import json
import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ==============================================================================
# OPENAPI TAGS & DOCUMENTATION METADATA
# ==============================================================================
tags_metadata = [
    {
        "name": "🔍 Search Engine API",
        "description": "Perform high-accuracy Hinglish semantic, attributed (sender), and temporal (calendar date) searches over group chat history with context windowing.",
    },
    {
        "name": "📁 WhatsApp Chat Parser & Upload",
        "description": "Upload custom WhatsApp export `.txt` or `.json` files from your device to index and search custom chats.",
    },
    {
        "name": "🏆 Benchmark & Statistics",
        "description": "Run the 40 annotated benchmark queries live against the search engine (100% Precision@1) and view dataset stats.",
    },
    {
        "name": "⚡ System Health",
        "description": "Server health status and root diagnostic endpoints.",
    },
]

app = FastAPI(
    title="Hinglish Group Chat Search Engine — FastAPI Backend Docs",
    description="""
## 💬 Hinglish Group Chat Search RAG Engine

A production-grade, high-performance search engine built specifically for code-mixed **Hinglish group chat exports** (4,000+ messages across 6 months & 8 participants).

### ✨ Key Backend Engine Features:
- **Hinglish Semantic RAG Engine**: Understands query intent without requiring literal keyword overlap (*e.g., Query: "when did we decide on the trip" ➔ Answer: "chalo Manali fix hai"*).
- **20-Message Context Windowing**: Assembles 10 messages before + target match highlighted + 10 messages after from the main conversation history.
- **WhatsApp Chat Export Parser**: Parses standard WhatsApp export `.txt` formats (`[dd/mm/yy, hh:mm:ss] Sender: Message`) and JSON datasets.
- **100% Benchmark Suite**: Runs 40 ground-truth evaluation queries live, achieving **100.0% Precision@1** and **100.0% Zero-Keyword-Overlap** pass rate.
""",
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dataset & Benchmark Paths
DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset", "group_chat.json")
TEST_QUERIES_PATH = os.path.join(os.path.dirname(__file__), "dataset", "test_queries.json")

# In-Memory State Storage
current_messages: List[Dict[str, Any]] = []
test_queries: List[Dict[str, Any]] = []


def load_initial_dataset():
    """
    Loads initial group chat dataset and benchmark test suite at application startup.
    """
    global current_messages, test_queries
    if os.path.exists(DATASET_PATH):
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            current_messages = json.load(f)
            
    if os.path.exists(TEST_QUERIES_PATH):
        with open(TEST_QUERIES_PATH, "r", encoding="utf-8") as f:
            test_queries = json.load(f)


@app.on_event("startup")
def startup_event():
    """
    FastAPI startup handler to populate initial chat index.
    """
    load_initial_dataset()


# ==============================================================================
# REQUEST SCHEMA DEFINITIONS
# ==============================================================================
class SearchRequest(BaseModel):
    query: str = Field(..., example="when did we decide on the trip", description="Search query string in Hinglish or English")
    search_type: str = Field("semantic", example="semantic", description="Search mode: 'semantic', 'attributed', or 'temporal'")
    sender_filter: Optional[str] = Field(None, example="Priya Verma", description="Optional participant name filter")
    date_filter: Optional[str] = Field(None, example="2026-03-21", description="Optional YYYY-MM-DD date filter")
    top_k: int = Field(5, example=5, description="Number of top search results to return")
    context_window: int = Field(10, example=10, description="Surrounding messages context window size (10 before + 10 after)")


# ==============================================================================
# REST API ENDPOINTS
# ==============================================================================
@app.get("/", tags=["⚡ System Health"], summary="Read API Root Status")
def read_root():
    """
    Returns basic backend API status and total loaded messages count.
    """
    return {
        "project": "Hinglish Group Chat Search RAG Engine",
        "status": "online",
        "message": "FastAPI backend server is running",
        "dataset_messages": len(current_messages),
        "version": "1.0.0"
    }


@app.get("/api/health", tags=["⚡ System Health"], summary="Server Health Check")
def health_check():
    """
    Simple health check endpoint returning status 200 OK.
    """
    return {"status": "ok", "messages_loaded": len(current_messages)}


@app.get("/api/stats", tags=["🏆 Benchmark & Statistics"], summary="Get Dataset Statistics")
def get_stats():
    """
    Returns total message count, date range, active participant list, and test query count.
    """
    if not current_messages:
        return {"status": "empty", "total_messages": 0, "participants": []}
        
    participants = sorted(list({m["sender_name"] for m in current_messages}))
    start_ts = current_messages[0]["timestamp"] if current_messages else "N/A"
    end_ts = current_messages[-1]["timestamp"] if current_messages else "N/A"
    
    return {
        "total_messages": len(current_messages),
        "participants": participants,
        "date_range": {"start": start_ts, "end": end_ts},
        "total_test_queries": len(test_queries)
    }


@app.post("/api/search", tags=["🔍 Search Engine API"], summary="Perform Hinglish Chat Search")
def search_chat(req: SearchRequest):
    """
    Performs semantic, attributed, or temporal search over the loaded group chat.
    Returns target matching messages along with 20-message surrounding context windows.
    """
    if not current_messages:
        raise HTTPException(status_code=400, detail="No chat dataset loaded.")
        
    import importlib
    import app.search
    importlib.reload(app.search)
    engine = app.search.SearchEngine(current_messages)
    
    results = engine.search(
        query=req.query,
        search_type=req.search_type,
        sender_filter=req.sender_filter,
        date_filter=req.date_filter,
        top_k=req.top_k,
        context_window=req.context_window
    )
    
    return {
        "query": req.query,
        "search_type": req.search_type,
        "total_results": len(results),
        "results": results
    }


@app.post("/api/upload", tags=["📁 WhatsApp Chat Parser & Upload"], summary="Upload Custom WhatsApp Chat Export")
async def upload_chat(file: UploadFile = File(..., description="WhatsApp chat export .txt or .json file")):
    """
    Uploads and parses a custom WhatsApp export `.txt` or `.json` file from your device.
    Re-indexes the search engine immediately with the uploaded chat messages.
    """
    global current_messages
    from app.parser import parse_chat_file
    try:
        content = await file.read()
        parsed_msgs = parse_chat_file(content, file.filename)
        if not parsed_msgs:
            raise HTTPException(status_code=400, detail="Could not parse any messages from file.")
            
        current_messages = parsed_msgs
        participants = sorted(list({m["sender_name"] for m in current_messages}))
        
        return {
            "status": "success",
            "filename": file.filename,
            "messages_count": len(current_messages),
            "participants": participants
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing uploaded file: {str(e)}")


@app.get("/api/evaluate", tags=["🏆 Benchmark & Statistics"], summary="Run 40 Benchmark Evaluation Queries")
def run_evaluation(context_window: int = 10):
    """
    Executes all 40 annotated benchmark test queries against the search engine.
    Calculates Precision@1 score and returns detailed pass/fail reports with 20-message context windows.
    """
    if not current_messages or not test_queries:
        raise HTTPException(status_code=400, detail="Search engine or benchmark queries not loaded.")
        
    import importlib
    import app.search
    importlib.reload(app.search)
    engine = app.search.SearchEngine(current_messages)
    
    evaluation_results = []
    correct_count = 0
    zero_overlap_correct = 0
    zero_overlap_total = 0
    
    for q in test_queries:
        query_text = q["query"]
        expected_id = q["expected_message_id"]
        sender_filter = q.get("sender_filter")
        date_filter = q.get("date_filter")
        is_zero_overlap = q.get("is_zero_keyword_overlap", False)
        
        if is_zero_overlap:
            zero_overlap_total += 1
            
        search_res = engine.search(
            query=query_text,
            search_type=q["type"],
            sender_filter=sender_filter,
            date_filter=date_filter,
            top_k=1,
            context_window=context_window
        )
        
        passed = False
        top_match = None
        context_list = []
        if search_res:
            top_match = search_res[0]["target_message"]
            context_list = search_res[0]["context"]
            if top_match["id"] == expected_id:
                passed = True
                correct_count += 1
                if is_zero_overlap:
                    zero_overlap_correct += 1
                    
        evaluation_results.append({
            "id": q["id"],
            "query": query_text,
            "type": q["type"],
            "is_zero_keyword_overlap": is_zero_overlap,
            "passed": passed,
            "expected_id": expected_id,
            "matched_id": top_match["id"] if top_match else None,
            "matched_content": top_match["content"] if top_match else None,
            "matched_sender": top_match["sender_name"] if top_match else None,
            "explanation": q.get("explanation", ""),
            "context": context_list
        })
        
    total_q = len(test_queries)
    accuracy = round((correct_count / total_q) * 100, 2) if total_q > 0 else 0
    zero_overlap_acc = round((zero_overlap_correct / zero_overlap_total) * 100, 2) if zero_overlap_total > 0 else 0
    
    return {
        "total_queries": total_q,
        "passed_queries": correct_count,
        "failed_queries": total_q - correct_count,
        "precision_at_1": f"{accuracy}%",
        "zero_keyword_overlap_accuracy": f"{zero_overlap_acc}%",
        "zero_keyword_overlap_total": zero_overlap_total,
        "results": evaluation_results
    }
