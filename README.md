AutoTask Backend - Stable production-ready scaffold (Option A)

Folder structure:
- package.json (root)
- src/server.js
- src/models/
- src/routes/
- src/middleware/
- src/init/

Deployment (Render):
1. Create a GitHub repo and upload these files at the repo root (not inside another folder).
2. On Render, create a new Web Service, connect the GitHub repo, leave Root Directory blank.
3. Build command: npm install
4. Start command: npm start
5. Add environment variables (MONGODB_URI, JWT_SECRET, FOUNDER_KEY, etc.) in Render dashboard.

Notes:
- CL Tech endpoints are placeholders that return safe JSON. Implement actual AI logic later.
- Do not commit .env files to GitHub.
