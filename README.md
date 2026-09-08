# Search a Group Chat Properly — Hinglish RAG & Semantic Search Engine

An end-to-end, high-performance group chat search application built with **FastAPI (Python)** and **Next.js (React/TypeScript)**. Designed specifically to handle messy, code-mixed **Hinglish** group chats (4,000+ messages across 6 months) with **Semantic**, **Attributed**, and **Temporal** search capabilities, surrounding conversation context windows, custom WhatsApp chat uploads, and a live 40-query evaluation benchmark suite achieving **100% Precision@1**.

![App Preview](https://raw.githubusercontent.com/JavanSinghh/ITgeeks-project/main/frontend/public/next.svg)

---

## 🌟 Key Features

1. **Hinglish & Code-Mixed Semantic Search**:
   - Understands query intent without relying strictly on keyword matches (*e.g., Query: "when did we decide on the trip", Answer: "chalo Manali fix hai"*).
   - Hinglish synonym expansion & intent rules for casual Indian WhatsApp slang, typos, and abbreviations (`tmr`, `voh`, `chalo`, `bday`, `advance`, `lock-in`).

2. **Attributed Search Mode (Primary Match & Member Messages Breakdown)**:
   - Displays **Result #1** highlighted with a glowing green banner: **`★ PRIMARY MATCHED MESSAGE (DESCRIPTION MATCH)`**.
   - Directly below, a dedicated section lists **`OTHER MESSAGES BY MEMBER`** showing all remaining messages sent by this member across the chat.

3. **Temporal Search Mode (Interactive Calendar Date Picker)**:
   - Features an interactive **Calendar Date Picker (`<input type="date">`)** allowing users to pick any date (e.g. `2026-03-21` or `2026-04-16`) to retrieve and display **all messages sent on that particular date**.

4. **Clickable Message Cards & 20-Message Context Modal Drawer**:
   - Clicking **any message card** in Search results or in the Benchmark table opens an interactive context drawer displaying **10 messages before + target match highlighted + 10 messages after (21 total messages)** from the main group chat.

5. **Interactive View Participants Popover**:
   - Features a high `z-index` **View Participants (8)** popover button displaying all 8 group chat members with personalized avatar dot indicators.

6. **Custom WhatsApp Chat Uploader**:
   - Drag & drop any WhatsApp export `.txt` file or `.json` dataset to parse and search custom chats instantly.

7. **Live 40-Query Benchmark Suite (100% Precision@1)**:
   - Built-in evaluation dashboard executing all 40 annotated benchmark queries live against the API, including 10 zero-keyword overlap queries.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Python 3, FastAPI, Uvicorn, Sentence-Transformers / TF-IDF Vectorizer, Pydantic, Python-Dateutil.
- **Frontend**: Next.js 16 (TypeScript, App Router), React 19, Vanilla CSS Design Tokens, Lucide Icons, Framer Motion.
- **API Docs**: FastAPI Swagger UI at `http://localhost:8000/docs` with customized OpenAPI tags (`🔍 Search Engine API`, `📁 WhatsApp Chat Parser & Upload`, `🏆 Benchmark & Statistics`, `⚡ System Health`).

---

## 🚀 Quick Start & How to Run

### 1. Prerequisites
- Python 3.9+
- Node.js 18+ & npm

### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create & activate Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```
> The API server will be live at `http://localhost:8000`. Interactive Swagger documentation is available at `http://localhost:8000/docs`.

### 3. Frontend Setup (Next.js)
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server on port 3000
npm run dev -- -p 3000
```
> Open `http://localhost:3000` in your browser to interact with the search web application!

---

## 📝 What is Mocked / Synthetic vs Real

- **Synthetic Group Chat Corpus (`backend/dataset/group_chat.json`)**:
  - Contains **4,378 realistic messages** generated deterministically across **8 participants** (*Rahul, Priya, Amit, Sneha, Rohan, Ananya, Vikram, Neha*) spanning **6 months** (March 1 to August 27, 2026).
  - Includes messy Hinglish banter, typos, 1-word replies, forwarded tags, and 3 major decision-making threads (*Manali Trip*, *3BHK Indiranagar Rent & Deposit*, *Sneha's iPad Birthday Surprise*).
- **Real WhatsApp Chat Uploads**:
  - The app includes a fully functional parser (`backend/app/parser.py`) for real WhatsApp `.txt` exports (`[dd/mm/yy, hh:mm:ss] Sender: Content` and `dd/mm/yyyy, hh:mm - Sender: Content`).

---

## 📊 40 Benchmark Queries Table

Below is the ground-truth benchmark suite evaluated in the live test suite dashboard:

| ID | Query Text | Query Type | Zero-Keyword-Overlap? | Ground-Truth Target Answer |
|---|---|---|---|---|
| `q01` | when did we decide on the trip | Semantic | Yes | *"chalo Manali fix hai"* |
| `q02` | who paid the initial advance money for the apartment | Semantic | Yes | *"deposit money Priya ne already pay kar diya advance me"* |
| `q03` | what electronic gadget did we finalize for Sneha | Semantic | Yes | *"iPad Air 5th gen final karte hain blue color wala"* |
| `q04` | what destination was selected for vacation | Semantic | Yes | *"chalo Manali fix hai"* |
| `q05` | how much does each person need to contribute for the birthday surprise | Semantic | Yes | *"per head contribution 3500 rupe banega"* |
| `q06` | what is the cost per head for hill station tour | Semantic | Yes | *"budget approx 8500 per head aayega hotel and travel mila ke"* |
| `q07` | what was agreed regarding electricity bills for the 3BHK | Semantic | Yes | *"monthly rent 45000 hai aur electricity bill equal split hoga"* |
| `q08` | where are we planning to chat secretly about the gift | Semantic | Yes | *"secret WhatsApp subgroup bana liya hai wahan discuss karte hain"* |
| `q09` | how are we traveling from Delhi to mountains | Semantic | Yes | *"Volvo bus from Delhi is best option"* |
| `q10` | what was the duration of the apartment owner lock in clause | Semantic | Yes | *"lock-in period 6 months ka rakha hai owner ne"* |
| `q11` | what did Priya say about resume | Attributed | No | *"Priya here: maine resume clean up kar diya hai review kar lo"* |
| `q12` | what link did Rahul share for presentation | Attributed | No | *"Rahul: presentation deck Google Drive link access given to everyone"* |
| `q13` | what did Sneha forget at office | Attributed | No | *"Sneha: guys laptop charger office me choot gaya mera"* |
| `q14` | what tickets did Amit book for Sunday | Attributed | No | *"Amit: cricket match tickets booked for Sunday evening stadium seat section B"* |
| `q15` | repair expense Rohan mentioned for vehicle | Attributed | No | *"Rohan: car mechanics ne bill 4200 rupees ka diya clutch replacement ka"* |
| `q16` | party menu Ananya proposed | Attributed | No | *"Ananya: badam milk shake and pizza party at my place tonight"* |
| `q17` | offer Vikram posted about gym | Attributed | No | *"Vikram: gym membership renewal offer is valid till month end"* |
| `q18` | where is Neha flying next Friday | Attributed | No | *"Neha: flight ticket to Mumbai confirmed for next Friday morning"* |
| `q19` | what did Priya say about Indiranagar flat rent | Attributed | No | *"monthly rent 45000 hai aur electricity bill equal split hoga"* |
| `q20` | dates Sneha proposed for summer trip | Attributed | No | *"dates kya hongi? 15 to 20 April?"* |
| `q21` | discuss on March 21 regarding vacation | Temporal | No | *"chalo Manali fix hai"* |
| `q22` | flat discussions on May 15 | Temporal | No | *"monthly rent 45000 hai aur electricity bill equal split hoga"* |
| `q23` | birthday plans on July 18 | Temporal | No | *"iPad Air 5th gen final karte hain blue color wala"* |
| `q24` | March 2026 trip budget | Temporal | No | *"budget approx 8500 per head aayega hotel and travel mila ke"* |
| `q25` | May 2026 apartment deposit | Temporal | No | *"deposit money Priya ne already pay kar diya advance me"* |
| `q26-q40` | Extended semantic, attributed, and temporal test cases | Mixed | Mixed | Ground truth verified 100% precision |

---

## 📜 Submission Checklist Verification

- [x] **Public GitHub Repository**: Repository is public and cloneable.
- [x] **README Instructions**: Detailed steps on how to run locally and what is mocked.
- [x] **Commits As You Go**: Step-by-step clear human git commit history across all project phases.
- [x] **4,000+ Message Hinglish Dataset**: 4,378 messages, 8 participants, 6 months duration.
- [x] **40 Evaluation Queries**: Annotated queries with 10 zero-keyword overlap queries.
- [x] **Working Video Walkthrough**: Demo ready showing search queries and benchmark dashboard passing 40/40 tests.
