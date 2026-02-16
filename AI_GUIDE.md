# Lighthouse - AI Agent Guidelines

This document defines the **Rules**, **Workflow**, and **Skills** required for AI agents working on the Lighthouse project. Adhering to these guidelines ensures consistency, quality, and context preservation across different sessions.

---

## 1. Rules (원칙 및 제약사항)

### 1.1 Language & Localization
- **UI Language**: **Korean (한국어)** is mandatory for all user-facing text.
  - *Exception*: The application name "Lighthouse" must remain in English.
- **Code Language**: All variable names, comments, and commit messages must be in **English**.
- **Translations**: Do not rely on auto-translation for financial terms; use context-appropriate terminology (e.g., "문의" for Ticket, "체결" for Execution).

### 1.2 Design & Styling
- **Backgrounds**: Always use **`bg-white`** for main containers to ensure a clean, premium look. Avoid `bg-gray-50` unless strictly necessary for section separation.
- **Framework**: Use **Tailwind CSS** strictly. Do not introduce new CSS files or styled-components.
- **Icons**: Use `lucide-react` for all iconography.

### 1.3 Architecture & Monorepo
- **Structure**: Respect the folder structure (`frontend/`, `backend/`). Do not move core configuration files.
- **State Management**: Use **Zustand** for global client state.
- **Network**: The application runs in a **closed intranet**. Do not add dependencies that require external CDNs (e.g., Google Fonts via URL). Fonts must be self-hosted or standard system fonts.

### 1.4 Code Quality
- **Type Safety**: strict TypeScript usage is required. Avoid `any` types.
- **Input Handling**: For Chat inputs, always implement the **CJK Composition Fix** (`e.nativeEvent.isComposing`) to prevent double-typing issues.

---

## 2. Workflow (작업 흐름)

### 2.1 Initialization
1. **Check Context**: Read `AI_GUIDE.md` and `task.md` to understand current progress.
2. **Environment Check**: Verify Node.js version and ensure ports `3000` (Frontend) and `4000` (Backend) are free.

### 2.2 Development Cycle
1. **Plan**: Create or update `implementation_plan.md` for complex tasks.
2. **Implement**: 
   - Backend changes first (API/Socket).
   - Frontend integration second.
3. **Verify**:
   - Run `npm run dev` in `frontend` and `npm run start:dev` in `backend`.
   - Test UI interactions (click buttons, submit forms).
4. **Document**: Update `task.md` and `walkthrough.md` with progress.

### 2.3 Deployment & Version Control
- **Commit**: Use imperative mood in English (e.g., "Add feature", "Fix bug").
- **Push**: Always push to `origin main` after completing a significant unit of work.

---

## 3. Skills (필요 역량 및 스택)

### 3.1 Frontend Engineering (Next.js)
- **App Router Proficiency**: Knowledge of `page.tsx`, `layout.tsx`, and Client vs. Server Components.
- **Tailwind Mastery**: Ability to implement complex, responsive layouts using utility classes.
- **Real-time Integration**: Experience connecting `socket.io-client` with React hooks.

### 3.2 Backend Engineering (NestJS)
- **Modular Architecture**: Understanding of Modules, Controllers, and Gateways.
- **WebSocket Gateway**: Ability to handle `SubscribeMessage` and emission events.
- **TypeORM**: Knowledge of Entity definition and Repository patterns (supporting SQLite/PostgreSQL).

### 3.3 Domain Knowledge (Securities/Support)
- **Ticket Lifecycle**: New -> In Progress -> Resolved.
- **Remote Support Flow**: WebRTC Signaling concepts (Offer/Answer/ICE).
- **Intranet Constraints**: Awareness of offline/proxy limitations.

---

## 4. Current Configuration Reference

| Component | Port | Local URL |
|-----------|------|-----------|
| Frontend  | 3000 | http://localhost:3000 |
| Backend   | 4000 | http://localhost:4000 |
| DB (Dev)  | N/A  | SQLite (File-based) |

## 5. Current Status (Updated)
- [x] Notifications & User Profile (Mock Data)
- [x] Global Search (Knowledge Base)
- [x] Ticket Management (List/Detail)

> **Note**: If Port 3000 is busy, Next.js will auto-switch to 3001. Always check terminal output.
