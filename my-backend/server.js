import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, text: 'Finish this crazy website!' },
  { id: 2, text: 'Dance like nobody is watching!' },
  { id: 3, text: 'Invent a new emoji 🤪' }
];

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Add a task
app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const newTask = { id: Date.now(), text };
  tasks = [...tasks, newTask];
  res.json(tasks);
});

// Remove a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.json(tasks);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Crazy To-Do backend running on port ${PORT}`);
});
