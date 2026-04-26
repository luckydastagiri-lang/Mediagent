# Mediagent
 AI Telemedicine Chatbot with Prescription Scanner

# 🏥 MediAgent – AI Telemedicine Platform

MediAgent is an AI-powered telemedicine web application that helps users understand prescriptions, chat with an AI doctor, and get basic health guidance.

---

## 🚀 Features

### 🤖 AI Doctor Chatbot
- Chat with an AI medical assistant
- Provides:
  - Possible disease
  - Risk level
  - Medicines (basic suggestions)
  - Advice & precautions
  - Food to avoid

---

### 📄 Prescription Scanner
- Upload prescription image
- OCR extracts text
- AI explains:
  - Medicines
  - Dosage
  - Usage instructions

---

### 🔐 Authentication
- Firebase Authentication
- Email & Password login
- Google login

---

### 💬 Chat System
- Session-based chat
- Stores conversation history (optional)
- Quick replies (future feature)

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- CSS (Custom UI)
- React Router

### Backend
- Node.js
- Express.js
- Gemini API (Google Generative AI)

### Other Tools
- Tesseract.js (OCR)
- Firebase (Auth)

---

## 📁 Project Structure
MediAgent/
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── api.js
│ │ └── firebase.js
│
├── backend/
│ ├── routes/
│ │ ├── chat.js
│ │ └── sessions.js
│ ├── server.js
│ └── db.js
