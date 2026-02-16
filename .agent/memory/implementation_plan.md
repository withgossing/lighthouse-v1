# Features Implemented

## Localization (UI Translation)
- Translated Dashboard, Header, Chat, and Remote Support pages to Korean.
- App Name "Lighthouse" remains in English.

## Bug Fixes
- **CJK Double Input**: Fixed an issue in Chat where Korean characters were duplicated by implementing `e.nativeEvent.isComposing` check.

## New Feature Implementation
### Knowledge Base
- Created `/knowledge/page.tsx` as a placeholder.
- Implemented Client-side search redirection in Header.

### Ticket Management
- Implemented `/tickets` (List View) and `/tickets/[id]` (Detail View).
- Updated Dashboard links to point to these new pages.
- Refactored Ticket Detail timeline for better layout in narrow columns.

### Documentation & Context
- **Monorepo Setup**: Consolidated frontend/backend into one git repo.
- **Root README**: Created `README.md` for project overview.
- **AI Guides**: Created `AI_GUIDE.md` (English) and `AI_GUIDE_KR.md` (Korean) for maintaining context and rules across sessions.

# Implementation Plan - Notifications & User Profile

## Goal Description
Implement functional UI for the Notification bell and User Profile section in the Header. Currently, these are static elements. Integrating a simple Popover for notifications and a Dropdown menu for the user profile will make them interactive.

## Review Required
> [!NOTE]
> Since there is no real authentication system yet, the User Profile will use mock data ("홍길동").

## Proposed Changes

### Frontend
#### [MODIFY] [Header.tsx](file:///Users/gossing/Workplace/lighthouse-v1/frontend/src/components/layout/Header.tsx)
- Implement `useState` to toggle Notification and User Profile popovers.
- Add click handlers to the Bell icon and User avatar.
- Render a list of mock notifications.
- Render a user menu with links (e.g., Profile, Settings, Logout).

## Verification Plan
### Manual Verification
- Click Bell icon -> Verify notification list appears.
- Click User icon -> Verify dropdown menu appears.
- Click outside -> Verify popovers close.
