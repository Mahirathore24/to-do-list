import React, { useState, useEffect } from 'react';
import axios from 'axios';

// simple id generator for local tasks
const idFn = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [btnAnim, setBtnAnim] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Fetch tasks from backend (fallback to localStorage)
  useEffect(() => {
    let mounted = true;
    axios.get('http://localhost:5000/api/tasks')
      .then(res => { if (mounted && Array.isArray(res.data)) setTasks(res.data); })
      .catch(() => {
        try {
          const raw = localStorage.getItem('tasks_local_v1');
          setTasks(raw ? JSON.parse(raw) : []);
        } catch (e) { setTasks([]); }
      });
    return () => { mounted = false; };
  }, []);

  // persist to localStorage as a fallback persistence
  useEffect(() => {
    try { localStorage.setItem('tasks_local_v1', JSON.stringify(tasks)); } catch (e) {}
  }, [tasks]);

  // Add task
  const addTask = async () => {
    if (!input.trim()) {
      // shake to indicate empty
      setBtnAnim('shake');
      setTimeout(() => setBtnAnim(''), 500);
      return;
    }

    // pop animation on add
    setBtnAnim('pop');
    const newTask = { id: idFn(), text: input, completed: false };
    // optimistic local add
    setTasks(prev => [newTask, ...prev]);
    setInput('');
    try {
      // try to notify backend (best-effort)
      await axios.post('/api/tasks', { text: input });
      // on success we could re-fetch, but keep optimistic list to avoid flicker
    } catch (err) {
      // backend not available — already added locally
    }
    // keep the pop briefly then clear
    setTimeout(() => setBtnAnim('sparkle'), 500);
    setTimeout(() => setBtnAnim(''), 1200);
  };

  // Remove task
  const removeTask = async (id) => {
    // optimistic remove locally
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await axios.delete(`/api/tasks/${id}`);
    } catch (err) {
      // ignore backend error
    }
  };

  // Toggle complete
  const toggleComplete = async (task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    try {
      await axios.patch(`/api/tasks/${task.id}`, { completed: !task.completed });
    } catch (err) {}
  };

  // Start editing
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: editingText } : t));
    try { await axios.patch(`/api/tasks/${id}`, { text: editingText }); } catch (err) {}
    setEditingId(null);
    setEditingText('');
  };

  // derived list by filter
  const visible = tasks.filter(t => (filter === 'all') ? true : (filter === 'active') ? !t.completed : t.completed);

  // progress
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  
  return (
    <div>
      <div className="crazy-header">To-Do List</div>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add something crazy..."
          className="crazy-input"
        />
        <button
          onClick={addTask}
          className={`crazy-add ${btnAnim === 'pop' ? 'animate-add' : ''} ${btnAnim === 'shake' ? 'animate-shake' : ''} ${btnAnim === 'sparkle' ? 'sparkle' : ''}`}
        >
          Add Task
        </button>
      </div>
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: progressPct + '%' }}></div>
      </div>

      <div className="filter-bar">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
        <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <ul className="crazy-list">
        {visible.map(task => (
          <li key={task.id}>
            <div className="task-left">
              <input type="checkbox" checked={!!task.completed} onChange={() => toggleComplete(task)} />
              {editingId === task.id ? (
                <input value={editingText} onChange={e => setEditingText(e.target.value)} style={{ borderRadius: '6px', padding: '4px' }} />
              ) : (
                <span className={`task-text ${task.completed ? 'completed' : ''}`}>{task.text}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editingId === task.id ? (
                <>
                  <button className="task-edit" onClick={() => saveEdit(task.id)}>Save</button>
                  <button className="task-edit" onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="task-edit" onClick={() => startEdit(task)}>Edit</button>
                  <button className="crazy-remove" onClick={() => removeTask(task.id)}>Remove</button>
                </>
              )}
            </div>
          </li>
        ))}
        {visible.length === 0 && (
          <li style={{ textAlign: 'center', color: '#7873f5', fontWeight: 'bold', fontSize: '1.1rem' }}>
            No tasks to show.
          </li>
        )}
      </ul>
    </div>
  );
}
