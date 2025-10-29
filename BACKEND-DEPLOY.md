# 🚀 ONE-CLICK BACKEND DEPLOYMENT

## Deploy Backend to Railway.app (FREE - No Credit Card!)

### Option 1: Railway Deploy Button (Easiest!)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/nodejs)

**Steps:**
1. Click the button above
2. Sign up with GitHub
3. Railway will auto-detect Node.js
4. Add environment variable:
   ```
   MONGODB_URI=mongodb+srv://todouser:todopass123@cluster0.mongodb.net/todolist?retryWrites=true&w=majority
   ```
5. Click "Deploy Now"
6. Get your URL: `https://your-app.up.railway.app`

---

### Option 2: Manual Railway Deployment

1. **Go to:** https://railway.app/new
2. **Select:** "Deploy from GitHub repo"
3. **Choose:** `Mahirathore24/to-do-list`
4. **Settings:**
   - Root Directory: `my-backend`
   - Start Command: `node index.js`
   - Add Variable: `MONGODB_URI` (see below)
   - Add Variable: `PORT=5000`

---

## 🗄️ FREE MongoDB Database

### Quick MongoDB Atlas Setup (5 minutes):

1. **Visit:** https://www.mongodb.com/cloud/atlas/register
2. **Create Account** (use GitHub)
3. **Create FREE Cluster:**
   - Choose AWS
   - Region: Closest to you
   - Cluster Tier: M0 Sandbox (FREE Forever!)
   - Cluster Name: `TodoCluster`
4. **Create Database User:**
   - Username: `todouser`
   - Password: `todopass123` (or generate strong one)
5. **Network Access:**
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (`0.0.0.0/0`)
   - Click "Confirm"
6. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://todouser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `todolist`
   - Final: 
   ```
   mongodb+srv://todouser:todopass123@cluster0.xxxxx.mongodb.net/todolist?retryWrites=true&w=majority
   ```

---

## Alternative: Use Render.com (Also FREE)

1. **Go to:** https://render.com/
2. **New Web Service**
3. **Connect:** `Mahirathore24/to-do-list`
4. **Settings:**
   ```
   Name: todo-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: my-backend
   Runtime: Node
   Build Command: npm install
   Start Command: node index.js
   ```
5. **Environment Variables:**
   ```
   MONGODB_URI = [your MongoDB Atlas URI]
   PORT = 5000
   ```
6. **Create Web Service** (Free tier)
7. Wait 2-3 minutes for deployment

**You'll get URL like:** `https://todo-backend-xxxx.onrender.com`

---

## Alternative: Use Cyclic.sh (Simplest!)

1. **Go to:** https://app.cyclic.sh/
2. **Link Your GitHub**
3. **Select repo:** `Mahirathore24/to-do-list`
4. **Root folder:** `my-backend`
5. **Add Environment Variable:**
   ```
   MONGODB_URI = [your MongoDB Atlas URI]
   ```
6. **Deploy!**

---

## 🔗 After Backend Deployment:

**Your backend URL will be:**
- Railway: `https://your-app.up.railway.app`
- Render: `https://todo-backend-xxxx.onrender.com`
- Cyclic: `https://your-app.cyclic.app`

**Copy this URL and update frontend!**

---

## ⚡ Update Frontend API URL

After getting backend URL, update `client/src/App.jsx`:

```javascript
// Line 13 - Change from:
const API_URL = 'http://localhost:5000/api/tasks';

// To:
const API_URL = 'https://YOUR-BACKEND-URL.railway.app/api/tasks';
```

Then rebuild and redeploy frontend:
```bash
cd client
npm run build
cd dist
git init
git add -A
git commit -m "Update API URL"
git branch -M gh-pages
git push -f https://github.com/Mahirathore24/to-do-list.git gh-pages
```

---

## 🎯 Current Status:

✅ **Frontend:** https://mahirathore24.github.io/to-do-list/
⏳ **Backend:** Deploy using any option above (5-10 minutes)

---

## 💡 Pro Tip:

For fastest deployment:
1. Use **Cyclic.sh** - literally 2 clicks!
2. Or use **Railway** - great free tier
3. MongoDB Atlas setup takes 5 minutes

**Total deployment time: 10-15 minutes max!**
