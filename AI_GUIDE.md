# AI Agent Context Guide for Lighthouse Project

This document serves as a context guide for AI agents working on the **Lighthouse** project. It outlines the project structure, technology stack, coding conventions, and current implementation status to ensure consistency across sessions.

## 1. Project Overview
**Lighthouse** is an on-premise, agentless support system for securities firms. It includes a Dashboard, Real-time Chat, Remote Support, and Ticket Management.

- **Type**: Monorepo (Frontend + Backend)
- **Target Audience**: Internal users (Traders, Staff)
- **Environment**: Closed network (Intranet), Offline deployment capable.

## 2. Technology Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
  - **Important**: Use `bg-white` for main backgrounds. Avoid `bg-gray-50` unless necessary for separation.
- **State Management**: Zustand
- **Icons**: Lucide React
- **Real-time**: Socket.io Client

### Backend (`/backend`)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: 
  - **Dev/Current**: SQLite (TypeORM) -> *Fallback due to initial Docker issues.*
  - **Prod Target**: PostgreSQL (TypeORM)
- **Real-time**: Socket.io Gateway (Port 4000)

## 3. Architecture & Ports
- **Frontend**: Runs on `http://localhost:3000` (or 3001 if busy)
- **Backend API**: Runs on `http://localhost:4000`
- **Communication**: Frontend proxies requests or calls Backend directly via CORS.

## 4. Coding Conventions & Rules

### Localization (Language)
- **User Interface (UI)**: **Korean (한국어)** only.
  - Exception: The app name "Lighthouse" is kept in English.
- **Code (Variables, Comments, Commits)**: **English**.

### Design Guidelines
- **Aesthetics**: Clean, Professional, "Premium" feel.
- **Colors**: Use White (`bg-white`) for page backgrounds to look clean. Use Blue/Indigo for primary actions.
- **Components**: Reusable UI components are in `src/components/ui`.

### Specific Implementation Details
- **Chat**:
  - Located in `src/components/chat/ChatWindow.tsx`.
  - **Fix**: Implemented `e.nativeEvent.isComposing` check to prevent CJK double-input bugs.
- **Remote Support**:
  - Located in `src/app/remote/page.tsx`.
  - Uses WebRTC (Mock/Signaling implemented).
- **Tickets**:
  - List: `src/app/tickets/page.tsx`
  - Detail: `src/app/tickets/[id]/page.tsx` (Dynamic Route)
- **Knowledge Base**:
  - Placeholder: `src/app/knowledge/page.tsx`
  - Search: Implemented in `Header.tsx` (Client Component).

## 5. Development Workflow
1. **Running Locally**:
   - Backend: `cd backend && npm run start:dev`
   - Frontend: `cd frontend && npm run dev`
2. **Git**:
   - Commit messages should be in English.
   - Push to `origin main`.

## 6. Current Status (As of Feb 2026)
- [x] Basic UI/UX Implementation (Dashboard, Chat, Remote)
- [x] Localization to Korean
- [x] Database (SQLite) connection
- [x] CJK Input Bug Fix
- [x] Inquiry (Ticket) List & Detail View
- [x] Knowledge Base Placeholder & Interpretation of Search
- [ ] Real WebRTC ICE/TURN Server integration (Mocked)
- [ ] Authentication (Mocked user: "Hong Gil-dong")

## 7. Future Tasks for AI
- Reference this guide to understand the "White Background" rule and "Korean UI" requirement.
- When implementing new features, maintain the Monorepo structure.
- Always check `task.md` for the latest progress.
