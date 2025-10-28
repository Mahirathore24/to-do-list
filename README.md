# Creative To-Do List App 🎨✨

A full-stack To-Do List application with a playful, animated UI and MongoDB integration.

## Features

- ✅ Add, edit, delete, and complete tasks
- 🎯 Filter tasks (All, Active, Completed)
- 📊 Visual progress bar
- 🎨 Crazy animations and gradient effects
- 💾 MongoDB persistence with localStorage fallback
- 🚀 Fast and responsive interface

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind-inspired CSS
- Axios

### Backend
- Node.js
- Express 5
- MongoDB with Mongoose
- CORS enabled

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/mahirathore24/to-do-list.git
cd to-do-list
```

2. Install backend dependencies:
```bash
cd my-backend
npm install
```

3. Create `.env` file in `my-backend` directory:
```
MONGODB_URI=mongodb://localhost:27017/todo-app
PORT=5000
```

4. Install frontend dependencies:
```bash
cd ../client
npm install
```

## Running the Application

1. Start MongoDB service (if not already running):
```bash
sudo systemctl start mongod
```

2. Start the backend server:
```bash
cd my-backend
npm start
```
Backend will run on `http://localhost:5000`

3. Start the frontend development server:
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:3000` (or next available port)

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task (text or completed status)
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```
to-do-list/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   └── index.css      # Styles and animations
│   └── package.json
├── my-backend/            # Backend Express server
│   ├── models/
│   │   └── Task.js        # Task schema
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

## License

MIT
