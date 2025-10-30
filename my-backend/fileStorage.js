const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Initialize tasks file if it doesn't exist
if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify([]));
}

// Read tasks from file
const readTasks = () => {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
};

// Write tasks to file
const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing tasks:', error);
    return false;
  }
};

// Create task
const createTask = (text) => {
  const tasks = readTasks();
  const newTask = {
    _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.unshift(newTask);
  writeTasks(tasks);
  return newTask;
};

// Update task
const updateTask = (id, updates) => {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t._id === id);
  if (index === -1) return null;
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  writeTasks(tasks);
  return tasks[index];
};

// Delete task
const deleteTask = (id) => {
  const tasks = readTasks();
  const filtered = tasks.filter(t => t._id !== id);
  if (filtered.length === tasks.length) return null;
  
  writeTasks(filtered);
  return true;
};

module.exports = {
  readTasks,
  createTask,
  updateTask,
  deleteTask
};
