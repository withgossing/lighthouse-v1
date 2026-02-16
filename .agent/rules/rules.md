# Project Rules

## 1. Language & Localization
- **UI Language**: **Korean (한국어)** is mandatory for all user-facing text.
  - *Exception*: The application name "Lighthouse" must remain in English.
- **Code Language**: All variable names, comments, and commit messages must be in **English**.
- **Translations**: Do not rely on auto-translation for financial terms; use context-appropriate terminology (e.g., "문의" for Ticket, "체결" for Execution).

## 2. Design & Styling
- **Backgrounds**: Always use **`bg-white`** for main containers to ensure a clean, premium look. Avoid `bg-gray-50` unless strictly necessary for section separation.
- **Framework**: Use **Tailwind CSS** strictly. Do not introduce new CSS files or styled-components.
- **Icons**: Use `lucide-react` for all iconography.

## 3. Architecture & Monorepo
- **Structure**: Respect the folder structure (`frontend/`, `backend/`). Do not move core configuration files.
- **State Management**: Use **Zustand** for global client state.
- **Network**: The application runs in a **closed intranet**. Do not add dependencies that require external CDNs (e.g., Google Fonts via URL). Fonts must be self-hosted or standard system fonts.

## 4. Code Quality
- **Type Safety**: strict TypeScript usage is required. Avoid `any` types.
- **Input Handling**: For Chat inputs, always implement the **CJK Composition Fix** (`e.nativeEvent.isComposing`) to prevent double-typing issues.
