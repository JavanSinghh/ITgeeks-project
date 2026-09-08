import json
import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.search import SearchEngine
from app.parser import parse_chat_file

app = FastAPI(
    title="Group Chat Semantic Search API",
    description="FastAPI backend for searching Hinglish group chats with semantic, attributed, and temporal queries.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory dataset and search engine state
DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset", "group_chat.json")
TEST_QUERIES_PATH = os.path.join(os.path.dirname(__file__), "dataset", "test_queries.json")

current_messages: List[Dict[str, Any]] = []
search_engine: Optional[SearchEngine] = None
test_queries: List[Dict[str, Any]] = []

def load_initial_dataset():
    global current_messages, search_engine, test_queries
    if os.path.exists(DATASET_PATH):
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            current_messages = json.load(f)
            search_engine = SearchEngine(current_messages)
            
    if os.path.exists(TEST_QUERIES_PATH):
        with open(TEST_QUERIES_PATH, "r", encoding="utf-8") as f:
            test_queries = json.load(f)

@app.on_event("startup")
def startup_event():
    load_initial_dataset()

class SearchRequest(BaseModel):
    query: str
    search_type: str = "semantic"  # semantic, attributed, temporal
    sender_filter: Optional[str] = None
    date_filter: Optional[str] = None
    top_k: int = 5
    context_window: int = 3

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Group Chat Semantic Search API is running",
        "dataset_messages": len(current_messages),
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "messages_loaded": len(current_messages)}

@app.get("/api/stats")
def get_stats():
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

@app.post("/api/search")
def search_chat(req: SearchRequest):
    if not search_engine or not current_messages:
        raise HTTPException(status_code=400, detail="No chat dataset loaded.")
        
    results = search_engine.search(
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

@app.post("/api/upload")
async def upload_chat(file: UploadFile = File(...)):
    global current_messages, search_engine
    try:
        content = await file.read()
        parsed_msgs = parse_chat_file(content, file.filename)
        if not parsed_msgs:
            raise HTTPException(status_code=400, detail="Could not parse any messages from file.")
            
        current_messages = parsed_msgs
        search_engine = SearchEngine(current_messages)
        
        participants = sorted(list({m["sender_name"] for m in current_messages}))
        
        return {
            "status": "success",
            "filename": file.filename,
            "messages_count": len(current_messages),
            "participants": participants
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing uploaded file: {str(e)}")

@app.get("/api/evaluate")
def run_evaluation():
    if not search_engine or not current_messages or not test_queries:
        raise HTTPException(status_code=400, detail="Search engine or benchmark queries not loaded.")
        
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
            
        search_res = search_engine.search(
            query=query_text,
            search_type=q["type"],
            sender_filter=sender_filter,
            date_filter=date_filter,
            top_k=1,
            context_window=3
        )
        
        passed = False
        top_match = None
        if search_res:
            top_match = search_res[0]["target_message"]
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
            "explanation": q.get("explanation", "")
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
