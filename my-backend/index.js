// : Load environment variables at the very top
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Task = require('./models/Task');
const fileStorage = require('./fileStorage');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// : Use environment variable for PORT (fallback to 5000)
const PORT = process.env.PORT || 5000;

// : Track if MongoDB is available
let useFileStorage = false;

// : Try to connect to MongoDB
connectDB()
  .then(() => {
    console.log('💾 Using MongoDB for storage');
    useFileStorage = false;
  })
  .catch((err) => {
    console.log('⚠️  MongoDB not available, using file-based storage (tasks.json)');
    useFileStorage = true;
  });

// : Middleware setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Uploads route
const uploadsRoute = require('./routes/uploads');
app.use('/api/uploads', uploadsRoute);

// : Authentication Routes (no auth required)
app.use('/api/auth', authRoutes);

// : Task Routes (protected - require authentication)

// GET /api/tasks - Get all tasks for logged-in user
app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    if (useFileStorage) {
      const tasks = fileStorage.readTasks();
      return res.json(tasks);
    }
    // Only get tasks for this user
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { text, description, category, dueDate, reminderAt, tags, priority, attachments, recurring } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (useFileStorage) {
      // fallback simple create
      fileStorage.createTask(text);
      const tasks = fileStorage.readTasks();
      return res.json(tasks);
    }

    // Normalize tags (allow comma-separated string)
    let tagsArr = [];
    if (Array.isArray(tags)) tagsArr = tags;
    else if (typeof tags === 'string' && tags.trim()) tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);

    const taskData = {
      text: text.trim(),
      description: description || '',
      category: category || 'Personal',
      user: req.userId,
      dueDate: dueDate ? new Date(dueDate) : null,
      reminderAt: reminderAt ? new Date(reminderAt) : null,
      tags: tagsArr,
      priority: priority || 'low',
      attachments: Array.isArray(attachments) ? attachments : [],
      recurring: recurring || { interval: 'none', every: 1 }
    };

    const task = new Task(taskData);
    await task.save();

    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/tasks/:id - Update a task
app.patch('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, description, category, completed, dueDate, reminderAt, tags, priority, attachments, recurring } = req.body;

    if (useFileStorage) {
      const updates = {};
      if (typeof text === 'string') updates.text = text.trim();
      if (typeof completed === 'boolean') updates.completed = completed;
      fileStorage.updateTask(id, updates);
      const tasks = fileStorage.readTasks();
      return res.json(tasks);
    }

    const updateData = {};
    if (typeof text === 'string') updateData.text = text.trim();
    if (typeof description === 'string') updateData.description = description.trim();
    if (typeof category === 'string') updateData.category = category;
    if (typeof completed === 'boolean') updateData.completed = completed;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (reminderAt) updateData.reminderAt = new Date(reminderAt);
    if (typeof tags === 'string') updateData.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    else if (Array.isArray(tags)) updateData.tags = tags;
    if (priority) updateData.priority = priority;
    if (Array.isArray(attachments)) updateData.attachments = attachments;
    if (recurring) updateData.recurring = recurring;
    updateData.updatedAt = Date.now();

    // Only update user's own task
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (useFileStorage) {
      const deleted = fileStorage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      const tasks = fileStorage.readTasks();
      return res.json(tasks);
    }

    // Only delete user's own task
    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Health check endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Todo Backend API is running!',
    endpoints: { health: '/health', tasks: '/api/tasks' },
  });
});

app.get('/health', async (req, res) => {
  try {
    res.json({ status: 'healthy', mongodb: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// ✅ Step 6: Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
});
