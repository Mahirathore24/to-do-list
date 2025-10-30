import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './Auth';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [reminderAt, setReminderAt] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [priority, setPriority] = useState('low');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [recurring, setRecurring] = useState('none');
  const [alerted, setAlerted] = useState([]);
  const [btnAnim, setBtnAnim] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [quote, setQuote] = useState({ text: 'Loading inspiration...', author: '' });
  // Check if user is logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  // Fetch tasks when user logs in
  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchQuote();
    }
  }, [token]);

  // Fetch motivational quote
  const fetchQuote = async () => {
    try {
      const quotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
        { text: "Your limitation—it's only your imagination.", author: "Anonymous" },
        { text: "Great things never come from comfort zones.", author: "Anonymous" },
        { text: "Dream it. Wish it. Do it.", author: "Anonymous" }
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    } catch (err) {
      console.error('Failed to fetch quote:', err);
    }
  };

  // Handle login
  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setTasks([]);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  // Poll for reminders every 30 seconds (MUST be before early return)
  useEffect(() => {
    if (!token) return; // Skip if not logged in
    
    let mounted = true;
    const checkReminders = () => {
      if (!mounted) return;
      const now = new Date();
      tasks.forEach(t => {
        if (!t.reminderAt || t.completed) return;
        const rid = t._id || t.id;
        if (alerted.includes(rid)) return;
        const rem = new Date(t.reminderAt);
        const diff = rem - now;
        // if reminder is within next 60 seconds or overdue
        if (diff <= 60000 && diff >= -60000) {
          // show browser notification
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('Task reminder', { body: t.text });
          }
          setAlerted(prev => [...prev, rid]);
        }
      });
    };

    // ask permission once
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const iv = setInterval(checkReminders, 30000);
    // run immediately as well
    checkReminders();
    return () => { mounted = false; clearInterval(iv); };
  }, [tasks, alerted, token]);

  // Show login if not authenticated
  if (!user || !token) {
    return <Auth onLogin={handleLogin} />;
  }

  // Add task

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
    
    try {
      // If attachment present, upload first
      let attachments = [];
      if (attachmentFile) {
        const fd = new FormData();
        fd.append('file', attachmentFile);
        const up = await axios.post('/api/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (up.data && up.data.url) attachments.push(up.data.url);
      }

      const payload = {
        text: input,
        description: description,
        category: category,
        dueDate: dueDate || null,
        reminderAt: reminderAt || null,
        tags: tagsInput || '',
        priority,
        attachments,
        recurring: { interval: recurring, every: 1 }
      };

      const res = await axios.post('/api/tasks', payload);
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
      // clear inputs
      setInput('');
      setDescription('');
      setCategory('Personal');
      setDueDate('');
      setReminderAt('');
      setTagsInput('');
      setPriority('low');
      setAttachmentFile(null);
      setRecurring('none');

      // Success animation
      setTimeout(() => setBtnAnim('sparkle'), 500);
      setTimeout(() => setBtnAnim(''), 1200);
    } catch (err) {
      console.error('Failed to add task:', err);
      setBtnAnim('');
    }
  };

  // Remove task
  const removeTask = async (id) => {
    try {
      const res = await axios.delete(`/api/tasks/${id}`);
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to remove task:', err);
    }
  };

  // Toggle complete
  const toggleComplete = async (task) => {
    try {
      const res = await axios.patch(`/api/tasks/${task._id || task.id}`, { 
        completed: !task.completed 
      });
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  // Start editing
  const startEdit = (task) => {
    setEditingId(task._id || task.id);
    setEditingText(task.text);
    setEditingDescription(task.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
    setEditingDescription('');
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    try {
      const res = await axios.patch(`/api/tasks/${id}`, { 
        text: editingText,
        description: editingDescription
      });
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
    setEditingId(null);
    setEditingText('');
    setEditingDescription('');
  };

  // derived list by filter
  const visible = tasks
    .filter(t => (filter === 'all') ? true : (filter === 'active') ? !t.completed : t.completed)
    .filter(t => searchQuery ? t.text.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  // progress
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  
  return (
    <div>
      <div className="user-header">
        <span>👋 Welcome, {user.name}!</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={toggleDarkMode} className="theme-toggle" title="Toggle Dark Mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </div>
      <div className="crazy-header">To-Do List</div>
      
      {/* Motivational Quote */}
      <div className="quote-box">
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>
      
      {/* Search Bar */}
      <div style={{ textAlign: 'center', marginTop: '1rem', padding: '0 2rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="🔍 Search tasks..."
          className="search-bar"
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '0.8rem 1rem',
            borderRadius: '25px',
            border: '2px solid #667eea',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '0 2rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="✨ Task title..."
          className="crazy-input"
          style={{ width: '100%', maxWidth: '600px', marginBottom: '0.5rem' }}
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="📝 Add description or notes..."
          className="task-description-input"
          rows="2"
          style={{ 
            width: '100%', 
            maxWidth: '600px', 
            padding: '0.8rem', 
            borderRadius: '12px',
            border: '2px solid #ddd',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            marginBottom: '0.5rem'
          }}
        />
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select value={category} onChange={e => setCategory(e.target.value)} title="Category">
            <option value="Personal">🏠 Personal</option>
            <option value="Work">💼 Work</option>
            <option value="Shopping">🛒 Shopping</option>
            <option value="Health">💪 Health</option>
            <option value="Study">📚 Study</option>
            <option value="Other">📌 Other</option>
          </select>
          <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} title="Due date" />
          <input type="datetime-local" value={reminderAt} onChange={e => setReminderAt(e.target.value)} title="Reminder time" />
          <input placeholder="tags (comma separated)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <select value={recurring} onChange={e => setRecurring(e.target.value)}>
            <option value="none">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input type="file" onChange={e => setAttachmentFile(e.target.files[0])} />
          <button
            onClick={addTask}
            className={`crazy-add ${btnAnim === 'pop' ? 'animate-add' : ''} ${btnAnim === 'shake' ? 'animate-shake' : ''} ${btnAnim === 'sparkle' ? 'sparkle' : ''}`}
          >
            Add Task
          </button>
        </div>
      </div>
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: progressPct + '%' }}></div>
        <div className="progress-text">{progressPct}% Complete</div>
      </div>

      <div className="filter-bar">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
        <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <ul className="crazy-list">
        {visible.map(task => {
          const taskId = task._id || task.id;
          return (
          <li key={taskId}>
            <div className="task-left">
              <input type="checkbox" checked={!!task.completed} onChange={() => toggleComplete(task)} />
              {editingId === taskId ? (
                <div style={{ flex: 1 }}>
                  <input 
                    value={editingText} 
                    onChange={e => setEditingText(e.target.value)} 
                    style={{ borderRadius: '6px', padding: '4px', width: '100%', marginBottom: '4px' }} 
                    placeholder="Task title"
                  />
                  <textarea
                    value={editingDescription}
                    onChange={e => setEditingDescription(e.target.value)}
                    style={{ borderRadius: '6px', padding: '4px', width: '100%', fontSize: '0.9rem' }}
                    rows="2"
                    placeholder="Description..."
                  />
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <div className={`task-text ${task.completed ? 'completed' : ''}`}>
                    {task.category && <span className="task-category">{task.category}</span>}
                    {task.text}
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px', fontStyle: 'italic' }}>
                      {task.description}
                    </div>
                  )}
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px' }}>
                    {task.dueDate && (<span style={{ marginRight: '0.6rem' }}>📅 {new Date(task.dueDate).toLocaleString()}</span>)}
                    {task.priority && (<span style={{ marginRight: '0.6rem' }}>
                      {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
                    </span>)}
                    {task.tags && task.tags.length > 0 && (<span style={{ marginRight: '0.6rem' }}>🏷️ {task.tags.join(', ')}</span>)}
                    {task.attachments && task.attachments.length > 0 && (
                      <span style={{ marginLeft: '0.4rem' }}>
                        📎 {task.attachments.map(a => <a key={a} href={a} target="_blank" rel="noreferrer" style={{ color: '#667eea', marginRight: '6px' }}>{a.split('/').pop()}</a>)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editingId === taskId ? (
                <>
                  <button className="task-edit" onClick={() => saveEdit(taskId)}>Save</button>
                  <button className="task-edit" onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="task-edit" onClick={() => startEdit(task)}>Edit</button>
                  <button className="crazy-remove" onClick={() => removeTask(taskId)}>Remove</button>
                </>
              )}
            </div>
          </li>
        )})}
        {visible.length === 0 && (
          <li style={{ textAlign: 'center', color: '#7873f5', fontWeight: 'bold', fontSize: '1.1rem' }}>
            No tasks to show.
          </li>
        )}
      </ul>
    </div>
  );
}
