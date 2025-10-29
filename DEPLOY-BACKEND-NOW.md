# 🚀 ONE-CLICK BACKEND DEPLOYMENT

## ⚡ DEPLOY BACKEND IN 30 SECONDS!

### **Click this button to deploy automatically:**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Mahirathore24/to-do-list)

---

## 📋 AUTOMATIC DEPLOYMENT STEPS:

1. **Click the button above** 👆
2. **Sign in with GitHub** (if not logged in)
3. **Render will automatically:**
   - ✅ Read `render.yaml` from your repo
   - ✅ Install dependencies
   - ✅ Deploy backend
   - ✅ Give you a live URL
4. **Add MongoDB URI:**
   - In Render dashboard → Environment
   - Add: `MONGODB_URI = mongodb://localhost:27017/todolist`
   - Or use MongoDB Atlas (see below)

**Your backend will be live at:**
`https://todo-backend-xxxx.onrender.com`

---

## 🗄️ FREE MONGODB (Optional - For Real Database):

### **Quick MongoDB Atlas Setup:**

1. **Visit:** https://cloud.mongodb.com/v2#/org/new
2. **Create free account** (use GitHub)
3. **Create cluster:**
   - Choose FREE M0 tier
   - Select AWS / Closest region
4. **Create user:**
   - Username: `todouser`
   - Password: `todo123456`
5. **Network Access:**
   - Add IP: `0.0.0.0/0` (allow all)
6. **Get connection string:**
   ```
   mongodb+srv://todouser:todo123456@cluster0.xxxxx.mongodb.net/todolist?retryWrites=true&w=majority
   ```
7. **Update in Render:**
   - Go to your service → Environment
   - Update `MONGODB_URI` with above string

---

## 🎯 AFTER BACKEND IS DEPLOYED:

1. **Copy your backend URL** from Render dashboard
2. **Update frontend API:**
   
   Edit: `client/src/App.jsx` (line 13)
   ```javascript
   const API_URL = 'https://todo-backend-xxxx.onrender.com/api/tasks';
   ```

3. **Rebuild frontend:**
   ```bash
   cd client
   npm run build
   cd dist
   git init
   git add -A
   git commit -m "Connect to live backend"
   git branch -M gh-pages
   git push -f https://github.com/Mahirathore24/to-do-list.git gh-pages
   ```

4. **Wait 2 minutes** and visit: https://mahirathore24.github.io/to-do-list/

---

## 📊 DEPLOYMENT STATUS:

| Service | Status | Link |
|---------|--------|------|
| Frontend | ✅ LIVE | https://mahirathore24.github.io/to-do-list/ |
| Backend | ⏳ Click button above | Will be: `https://todo-backend-xxxx.onrender.com` |
| Database | ⏳ Optional | Use MongoDB Atlas (free) |

---

## 🔥 ALTERNATIVE: Manual Render Deployment

If button doesn't work:

1. Go to: https://dashboard.render.com/select-repo?type=web
2. Select: `Mahirathore24/to-do-list`
3. Settings:
   ```
   Name: todo-backend
   Root Directory: my-backend
   Build Command: npm install
   Start Command: node index.js
   ```
4. Environment:
   ```
   PORT = 5000
   MONGODB_URI = mongodb://localhost:27017/todolist
   ```
5. Click "Create Web Service"

---

## ⚡ FASTEST WAY:

**Just click the deploy button at the top!** 🚀

Render will automatically detect your `render.yaml` and deploy everything!

**Estimated time: 2-3 minutes** ⏱️
