# Focusly

Focusly is a desktop-first AI-powered SaaS platform designed to revolutionize learning. It helps users study faster and smarter by automatically generating notes, interactive flashcards, and providing real-time AI-driven feedback and tutoring.

---

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Contributing](#contributing)  
- [License](#license)  

---

## About

Focusly blends modern frontend and backend technologies with cutting-edge AI integrations to create a seamless study assistant optimized for laptop and desktop users. The platform emphasizes productivity, user-friendly design, and scalable architecture.

---

## Features

- **Landing & Hero:** Bold gradient background with clear CTAs and trust avatars.  
- **User Authentication:** Secure registration and login using JWT with OAuth placeholders.  
- **Dashboard:** Personalized study dashboard with modular AI-powered widgets.  
- **AI Tools:**  
  - Voice-activated note taking  
  - Auto-generated flashcards and summaries  
  - Real-time question answering and feedback  
- **Secure Backend:** Node.js/Express API with JWT auth and AI microservice integrations.  
- **Desktop-First UI:** Designed exclusively for large screen devices with fixed layouts and no mobile stacking.

---

## Tech Stack

- Frontend: React, TailwindCSS, React Router  
- Backend: Node.js, Express.js  
- Authentication: JWT tokens with HTTP-only cookies  
- AI Services: Voice transcription, text summarization, quiz generation  
- Environment: Environment variables for secrets and keys  

---

## Project Structure

/frontend
/components
/pages
/hooks
App.jsx
/backend
/routes
server.js
/services (AI handlers)
.env
README.md


---

## Installation & Setup

1. Clone the repo  
2. Navigate to `/frontend` and run `npm install`  
3. Navigate to `/backend` and run `npm install`  
4. Create `.env` files for frontend and backend with necessary API keys  
5. Run backend with `npm start`  
6. Run frontend with `npm start`  

---

## Usage

- Access landing page on `localhost:5173`  
- Register or login to access dashboard  
- Explore voice-enabled AI note-taking and flashcard tools  
- Extend AI service integration as needed  

---

## API Endpoints

- POST `/api/register` — User registration  
- POST `/api/login` — User login  
- GET `/api/dashboard` — User data (protected)  
- POST `/api/voice-transcribe` — Voice-to-text processing  
- POST `/api/generate-flashcards` — Flashcard generation  

---

## Contributing

Contributions are welcome!  
- Fork the repo  
- Create feature branches  
- Submit pull requests with clear descriptions  
- Follow existing code style and comment thoroughly 
