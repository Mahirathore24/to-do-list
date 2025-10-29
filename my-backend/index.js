require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// GET /api/tasks - Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const task = new Task({ text: text.trim() });
    await task.save();
    
    // Return all tasks
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/tasks/:id - Update a task
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    const updateData = {};
    if (typeof text === 'string') updateData.text = text.trim();
    if (typeof completed === 'boolean') updateData.completed = completed;
    updateData.updatedAt = Date.now();
    
    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Return all tasks
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Return all tasks
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Todo Backend API is running!',
    endpoints: { health: '/health', tasks: '/api/tasks' }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', mongodb: 'checking...' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
});
