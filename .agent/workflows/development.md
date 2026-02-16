# Development Workflow

## 1. Initialization
1. **Check Context**: Read `.agent/memory/task.md` and `AI_GUIDE.md` to understand current progress.
2. **Environment Check**: Verify Node.js version and ensure ports `3000` (Frontend) and `4000` (Backend) are free.

## 2. Development Cycle
1. **Plan**: Create or update `.agent/memory/implementation_plan.md` for complex tasks.
2. **Implement**: 
   - Backend changes first (API/Socket).
   - Frontend integration second.
3. **Verify**:
   - Run `npm run dev` in `frontend` and `npm run start:dev` in `backend`.
   - Test UI interactions (click buttons, submit forms).
4. **Document**: Update `task.md` and `walkthrough.md` with progress.

## 3. Deployment & Version Control
- **Commit**: Use imperative mood in English (e.g., "Add feature", "Fix bug").
- **Push**: Always push to `origin main` after completing a significant unit of work.
