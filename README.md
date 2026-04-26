# 🏥 MediAgent — Telemedicine Prescreener

A full-stack AI-powered telemedicine prescreening app built with React, Express, SQLite, and the Anthropic API.

> ⚠️ **Disclaimer**: MediAgent is an AI prescreener only. It does not provide final diagnoses and cannot replace a licensed healthcare professional.

---

## 📁 Project Structure

```
Telemedicine/
├── backend/           # Express API server
│   ├── routes/
│   │   ├── chat.js       # AI chat endpoint (Anthropic SDK)
│   │   └── sessions.js   # Session CRUD routes
│   ├── db.js             # SQLite database init
│   ├── server.js         # Entry point
│   ├── .env.example      # Environment variables template
│   └── package.json
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # Session list sidebar
│   │   │   ├── ChatArea.jsx    # Chat UI
│   │   │   └── RightPanel.jsx  # Triage + prescription panel
│   │   ├── App.jsx       # Root component
│   │   ├── api.js        # Backend API service layer
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── db/                # SQLite database files (auto-created)
```

---

## 🚀 Setup & Running

### 1. Clone / Download this folder

### 2. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=5000
DB_PATH=../db/mediagent.db
```

Get your key at: https://console.anthropic.com

Start the backend:
```bash
npm run dev    # development (auto-restart)
# or
npm start      # production
```

The API will run at `http://localhost:5000`

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`

---

## ✨ Features

- **AI Triage** — Empathetic symptom assessment via Claude
- **Multi-language** — Auto-detects and responds in user's language
- **Session History** — Persisted in SQLite across page reloads
- **Risk Assessment** — Low / Medium / High triage with color coding
- **Draft Prescription Card** — Provisional report for your doctor
- **PDF Export** — Download the report via jsPDF
- **Voice Input** — Speak your symptoms (Chrome recommended)
- **Quick Replies** — AI-suggested follow-up prompts
- **Retry Logic** — Exponential backoff on API rate limits

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/sessions` | List all sessions |
| POST | `/api/sessions` | Create new session |
| PATCH | `/api/sessions/:id` | Update session preview |
| DELETE | `/api/sessions/:id` | Delete session |
| GET | `/api/sessions/:id/messages` | Get session messages |
| POST | `/api/chat` | Send message, get AI reply |

---

## 🔮 Future Expansions

- Firebase Auth for cross-device session sync
- Doctor Dashboard to review and approve triage notes
- Image uploads for rashes/wounds (Gemini vision)
- Native audio streaming for real-time voice consultation
