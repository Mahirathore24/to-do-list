const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// In-memory storage (since we can't use files in serverless)
const users = [];
const tasks = [];

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-12345';

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    users.push(user);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ success: false });
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
});

// Task routes
app.get('/api/tasks', authMiddleware, (req, res) => {
  const userTasks = tasks.filter(t => t.user === req.userId);
  res.json({ success: true, tasks: userTasks });
});

app.post('/api/tasks', authMiddleware, (req, res) => {
  try {
    const task = {
      id: Date.now().toString(),
      user: req.userId,
      text: req.body.text,
      description: req.body.description || '',
      category: req.body.category || 'Personal',
      completed: false,
      dueDate: req.body.dueDate || null,
      reminderAt: req.body.reminderAt || null,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      priority: req.body.priority || 'low',
      attachments: req.body.attachments || [],
      recurring: req.body.recurring || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tasks.push(task);
    res.json({ success: true, tasks: tasks.filter(t => t.user === req.userId) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/tasks/:id', authMiddleware, (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id && t.user === req.userId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    
    Object.keys(req.body).forEach(key => {
      if (key !== 'id' && key !== 'user') {
        task[key] = req.body[key];
      }
    });
    task.updatedAt = new Date();
    
    res.json({ success: true, tasks: tasks.filter(t => t.user === req.userId) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
  try {
    const index = tasks.findIndex(t => t.id === req.params.id && t.user === req.userId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Task not found' });
    
    tasks.splice(index, 1);
    res.json({ success: true, tasks: tasks.filter(t => t.user === req.userId) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', storage: 'in-memory' });
});

module.exports.handler = serverless(app);
