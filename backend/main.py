from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Group Chat Semantic Search API is running",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
