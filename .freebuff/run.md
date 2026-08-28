# PresentPro Dev Servers

## How to reproduce uncommitted artifacts

- Copy `.env` from main checkout: the `backend/.env` file was created with `PORT=5001` and `MONGO_URI=mongodb://localhost:27017/ppt-maker` (port 5000 was taken by another service).
- The system env already has `PORT=0` set, so `backend/server.js` uses `dotenv.config({ override: true })` to force the `.env` value.

## How to run the servers

### Backend (port 5001)

```bash
cd backend
node server.js
```

Or with the correct PORT:

```bash
cd backend && PORT=5001 node server.js
```

### Frontend (port 3001)

```bash
cd frontend
PORT=3001 BROWSER=none npm start
```

Or with react-app-rewired (which is what package.json scripts use):

```bash
cd frontend
PORT=3001 BROWSER=none npx react-app-rewired start
```

### Windows detached launch

```bash
# Backend
cd backend && start //B node.exe server.js

# Frontend
cd frontend && PORT=3001 BROWSER=none start //B npx.cmd react-app-rewired start
```

## Notes

- Ports: Backend=5001, Frontend=3001 (5000 and 3000 were occupied)
- Frontend API base URL: `http://localhost:5001/api` (set in `frontend/src/api.js`)
- In-memory fallback if MongoDB unavailable
- Frontend uses react-app-rewired with config-overrides.js to handle pptxgenjs node:fs imports
