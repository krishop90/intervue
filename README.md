Video : https://drive.google.com/file/d/1owhMUc1oFwpx8v2UN0v7bEfZmkO28e3-/view?usp=drive_link

# Live Polling System - Intervue.io Assignment

A real-time polling system built with React, Redux, Express.js, and Socket.io for the Intervue.io SDE Intern assignment.

## Features

### Teacher Features
- ✅ Create new polls with custom questions and options
- ✅ View live polling results in real-time
- ✅ Ask new questions only when no question is active or all students have answered
- ✅ Configure poll time limit (30, 60, 90, or 120 seconds)
- ✅ Remove students from the poll
- ✅ View poll history
- ✅ Chat with students

### Student Features
- ✅ Enter name on first visit (stored per tab)
- ✅ Submit answers once a question is asked
- ✅ View live polling results after submission
- ✅ Automatic results display after 60 seconds (or configured time limit)
- ✅ Chat with teacher and other students

## Technology Stack

- **Frontend**: React 18, Redux Toolkit, React Router
- **Backend**: Express.js, Socket.io
- **Real-time Communication**: Socket.io for WebSocket connections

## Project Structure

```
intervue/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # Socket service
│   │   └── App.js
│   └── package.json
└── package.json
```

## Installation

1. Install dependencies for root, backend, and frontend:
```bash
npm run install-all
```

Or install separately:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Running the Application

### Development Mode

Run both backend and frontend concurrently:
```bash
npm run dev
```

Or run separately:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the `backend` directory:
```
PORT=5000
FRONTEND_URL=http://localhost:3000
```

For production, update `REACT_APP_SOCKET_URL` in frontend or set it in `.env` file.

## Usage

1. **Start the application** - Run both backend and frontend servers
2. **Select Role** - Choose between Teacher or Student on the welcome screen
3. **Teacher Flow:**
   - Enter question and options
   - Set time limit
   - Click "Ask Question" to start the poll
   - View live results as students answer
   - Ask new questions when all students have answered
4. **Student Flow:**
   - Enter your name (stored per browser tab)
   - Wait for teacher to ask a question
   - Select an answer and submit
   - View results after submission or when time expires

## Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or Render
- Set environment variables: `PORT` and `FRONTEND_URL`

### Frontend Deployment
- Build the production bundle: `cd frontend && npm run build`
- Deploy `build` folder to platforms like Vercel, Netlify, or GitHub Pages
- Update `REACT_APP_SOCKET_URL` to point to your deployed backend

## Key Features Implementation

- **Real-time Updates**: Socket.io enables instant updates for all connected clients
- **State Management**: Redux Toolkit manages application state
- **UI/UX**: Matches Figma design with purple gradient theme (#7765DA, #4F0DCE)
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Proper error messages and validation

## Assignment Requirements Checklist

### Must-Have Requirements
- ✅ Functional system with all core features working
- ✅ Hosting ready (can be deployed)
- ✅ Teacher can create polls and students can answer them
- ✅ Both teacher and student can view poll results
- ✅ UI follows Figma design

### Good to Have
- ✅ Configurable poll time limit by teacher
- ✅ Option for teacher to remove a student
- ✅ Well-designed user interface

### Bonus Features
- ✅ Chat popup for interaction between students and teachers
- ✅ Teacher can view past poll results

## Notes

- Student names are stored in localStorage per browser tab
- Poll history is stored in memory (not persisted to database)
- Each browser tab acts as a separate student session
- Socket connections are automatically managed

## License

This project is created for the Intervue.io SDE Intern assignment.

