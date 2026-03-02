# Tech Stack Proposal for IT Helpdesk Application

Based on the requirements:
1. AI-assisted development (prioritizing popular, well-documented tech stacks).
2. On-premise (internal network) deployment (requiring standalone deployment capabilities, avoiding heavy cloud-native dependencies).
3. Preference for complete, ready-to-use UI component libraries.

Here are the recommended technology stack options for maximum development speed, maintainability, and alignment with AI generation capabilities.

---

## ⭐️ Option A: The "Modern Full-Stack JS" Route (Highly Recommended for AI & Speed)
This is currently the most popular ecosystem. AI tools (like GitHub Copilot, Claude, GPT-4) excel at generating code for this stack because of the massive amount of training data available.

### Core Stack
*   **Framework**: **Next.js (App Router)**
    *   *Why*: Allows building both the React frontend and backend API routes in a single repository. Extremely well-known by AI. Easy to build into a standalone Node.js server for on-premise deployment.
*   **Language**: **TypeScript**
    *   *Why*: Catch errors early, drastically improves AI code completion accuracy.
*   **Database ORM**: **Prisma**
    *   *Why*: Declarative database schema, auto-generated type-safe queries. AI writes Prisma models perfectly.
*   **Database**: **PostgreSQL**
    *   *Why*: Robust, open-source, industry standard. Easily deployed on-prem via Docker.

### UI / Styling
*   **UI Library**: **Shadcn UI** or **MUI (Material-UI)**
    *   **Shadcn UI (Recommended)**: Built on Tailwind CSS and Radix UI. It gives you raw, accessible components that you own and can easily customize. AI is exceptionally good at generating Tailwind/Shadcn UI code.
    *   **MUI**: A very heavy, but completely fully-featured Material Design library. Good if you want zero custom styling work, but sometimes harder for AI to customize granularly.
*   **Styling**: **Tailwind CSS**

### Deployment Strategy (On-Premise)
*   **Docker & Docker Compose**: Package the Next.js app and PostgreSQL database into containers. This ensures the app runs exactly the same on your internal servers as it does during development.

---

## 🥈 Option B: The "Vue.js Ecosystem" Route (Excellent for Admin Dashboards)
If you prefer a slightly gentler learning curve or a more template-driven approach, the Vue ecosystem is fantastic for dashboard-style applications.

### Core Stack
*   **Framework**: **Nuxt.js (Vue 3)**
    *   *Why*: Similar benefits to Next.js but for Vue. Great developer experience, auto-imports, and built-in server routes (Nitro) which makes on-premise deployment very simple.
*   **Language**: **TypeScript**
*   **Database ORM**: **Prisma** or **Drizzle ORM**
*   **Database**: **PostgreSQL** or **MySQL**

### UI / Styling
*   **UI Library**: **Vuetify 3** or **PrimeVue**
    *   **Vuetify (Recommended for Vue)**: The undisputed king of Vue UI libraries. It is massive and contains almost every component you could ever need for an admin dashboard (data tables, complex forms, dialogs). AI is very familiar with it.

### Deployment Strategy (On-Premise)
*   **Dockerize the Nuxt output (Node server) and DB**.

---

## 🥉 Option C: The "Separated Backend" Route (For Heavy Enterprise Logic)
If you anticipate the backend becoming highly complex or needing to integrate with many legacy internal Java/Python systems later, separating the frontend and backend is safer.

### Core Stack
*   **Frontend**: **React (Vite)** or **Vue (Vite)**
    *   *UI*: Shadcn UI (React) or Vuetify (Vue)
*   **Backend**: **NestJS (Node.js/TypeScript)** or **Spring Boot (Java)**
    *   *Why NestJS*: If sticking to TypeScript, NestJS provides a highly structured, scalable architecture (similar to Angular/Spring).
    *   *Why Spring Boot*: The enterprise standard. Very secure, massive ecosystem for integrating with internal enterprise systems (LDAP, AD, legacy databases).
*   **Database**: **PostgreSQL**

### Deployment Strategy (On-Premise)
*   Deploy Frontend (Nginx container), Backend (Node/Java container), and DB (PostgreSQL container) via Docker Compose.

---

## 🎯 Final Recommendation for Your Scenario

Given the goal is **rapid AI-assisted development**, deployment to an **internal network**, and reliance on **complete UI libraries**, **Option A (Next.js + TypeScript + Prisma + Shadcn UI/Tailwind)** is the strongest choice.

**Why Option A wins here:**
1.  **AI Synergy**: LLMs write Next.js, Tailwind, and Prisma code better than almost any other combination.
2.  **Single Repo (Monorepo)**: You don't have to manage a separate frontend and backend, which drastically simplifies the prompts you give to the AI and reduces context switching.
3.  **On-Premise Ready**: Next.js can be built using `next build` into a standalone Node.js server that runs perfectly well inside a corporate firewall without needing Vercel.

**Decision Point:**
Please review these options. Let me know which Option (A, B, or C) you prefer! Once decided, I will automatically update the 5 Agent Markdown files (`pm-architect-agent.md`, etc.) with the chosen tech stack so they are ready to use.
