# Focusly

Focusly is a desktop-first, AI-powered SaaS learning platform that automatically generates notes, flashcards, and provides real-time tutoring for students and professionals.

## Project Structure

- `frontend/`: React + Vite + TailwindCSS application.
- `backend/`: Node.js + Express + Prisma application.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Setup

1.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    npx prisma migrate dev --name init
    npm start
    ```

2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Features

-   **Voice Note Taking**: Integrate browser speech-to-text.
-   **Flashcard Generator**: Generate Q&A cards from notes.
-   **Real-Time AI Tutor**: Chat interface with AI.
