# Walkthrough: Securities System Support Application

This document outlines the features and deployment instructions for the newly created Securities System Support Application.

## Architecture Overview

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide Icons.
- **Backend**: NestJS, TypeORM (SQLite/PostgreSQL), Socket.io (WebSocket), WebRTC Signaling.
- **Database**: SQLite (Default) or PostgreSQL (Optional).

## Features Implemented

### 1. Dashboard (`/`)
- Integrated header with user profile placeholder.
- Quick action buttons for "New Inquiry", "Remote Support", "Knowledge Base".
- Recent inquiries list with status indicators.
- System status overview.

### 2. Chat Interface (`/chat`)
- Real-time chat widget style UI.
- Mocked message history.
- Input area with send button.
- Backend `ChatGateway` implemented to handle WebSocket connections and message broadcasting.

### 3. Remote Support (`/remote`)
- WebRTC-based screen sharing interface.
- **Remote Support**: Screen sharing functionality using WebRTC (`getDisplayMedia`) (Agentless).
- **Localization**: Full Korean UI translation (except 'Lighthouse' brand name).
- **Bug Fixes**: Resolved CJK double-input issue in chat window.
- "Stop Sharing" functionality.
- Session status indicators.

### 4. Backend Services
- **Ticket Module**: REST API for creating, reading, updating, and deleting support tickets.
- **Chat Gateway**: WebSocket server handling `joinRoom`, `sendMessage`, and WebRTC signaling (`offer`, `answer`, `ice-candidate`).
- **Database Entities**: `User`, `Ticket`, `Message` entities defined with TypeORM.

### 5. Header Interactions
- **Notifications**: Added a popover displaying mock notifications when clicking the bell icon.
- **User Profile**: Added a dropdown menu with profile links when clicking the user avatar.
- **Global Search**: Enabled search input to redirect to `/knowledge`.

![Notification and User Profile Verification](/Users/gossing/.gemini/antigravity/brain/9d888c44-e716-4027-850c-75e7e673046b/verify_notifications_profile_1771225739221.webp)

### Notification Navigation Verification
Confirmed that clicking a notification item navigates to the corresponding page (e.g., Ticket Detail).

![Notification Click Verification](/Users/gossing/.gemini/antigravity/brain/9d888c44-e716-4027-850c-75e7e673046b/verify_notification_click_1771225906853.webp)

## Deployment Instructions (Closed Network / Offline)

### Prerequisites
- Node.js v18+
- (Optional) Docker for PostgreSQL

### Steps

1.  **Backend Setup**:
    The system uses SQLite by default, so no database setup is required.
    ```bash
    cd backend
    npm install
    npm run start:dev
    ```
    The server will start on http://localhost:4000.
    *To use PostgreSQL, set `DB_TYPE=postgres` env var and ensure DB is running.*

2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The application will be available at http://localhost:3000.

### Offline Consideration
- All UI assets (icons) are bundled via `lucide-react`.
- Fonts are optimized by `next/font` (downloaded at build time).
- No external CDN links are used in the codebase.

## Verification

To verify the system:
1.  Open the **Frontend** URL.
2.  Navigate to **Chat** via the dashboard.
3.  Navigate to **Dashboard** and check the layout.
4.  Navigate to **Remote Support** and test the "Share My Screen" button (requires browser permission).
