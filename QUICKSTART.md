# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Setup Steps

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Create backend environment file:**
   Create a file `backend/.env` with:
   ```
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend server on http://localhost:5000
   - Frontend app on http://localhost:3000

4. **Open your browser:**
   Navigate to http://localhost:3000

## Testing the Application

1. **As a Teacher:**
   - Select "I'm a Teacher" on the welcome screen
   - Create a poll with a question and options
   - Set time limit (30-120 seconds)
   - Click "Ask Question"
   - View live results as students answer

2. **As a Student:**
   - Open a new browser tab/window
   - Select "I'm a Student"
   - Enter your name
   - Wait for teacher to ask a question
   - Select an answer and submit
   - View results

## Features to Test

- ✅ Real-time polling updates
- ✅ Timer countdown
- ✅ Chat functionality (click chat icon)
- ✅ Participants list (teacher view)
- ✅ Remove student (teacher can kick out students)
- ✅ Poll history (teacher view)
- ✅ Multiple students can join simultaneously

## Troubleshooting

- **Backend not starting:** Check if port 5000 is available
- **Frontend not connecting:** Verify backend is running and check CORS settings
- **Socket connection issues:** Ensure both servers are running and URLs match

## Deployment Notes

For production deployment:
1. Update `FRONTEND_URL` in backend/.env to your frontend URL
2. Set `REACT_APP_SOCKET_URL` environment variable for frontend build
3. Build frontend: `cd frontend && npm run build`
4. Deploy backend and frontend separately

