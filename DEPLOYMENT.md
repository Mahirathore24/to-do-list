# Deployment Instructions

## 🚀 Deploy Your To-Do List App

### Frontend (Vercel) - FREE

1. **Install Vercel CLI** (if not installed):
```bash
npm install -g vercel
```

2. **Deploy Frontend**:
```bash
cd client
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Scope: Select your account
- Link to existing project? **N**
- Project name: **to-do-list-client** (or press Enter)
- Directory: **./client** (or just press Enter if in client folder)
- Override settings? **N**

### Backend (Render.com) - FREE

1. Go to https://render.com and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: **Mahirathore24/to-do-list**
4. Configure:
   - **Name**: `todo-backend`
   - **Root Directory**: `my-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Add Environment Variables**:
   - Click "Environment" tab
   - Add: `MONGODB_URI` = `mongodb://localhost:27017/todo-app` (or your MongoDB Atlas URL)
   - Add: `PORT` = `5000`

6. Click **"Create Web Service"**

### Update Frontend API URL

After backend is deployed, you'll get a URL like: `https://todo-backend.onrender.com`

Update the API URL in your frontend code to point to this URL.

---

## 🔥 Quick Deploy (Using Vercel CLI)

Run these commands:

```bash
# Deploy frontend
cd '/home/sama/Desktop/to do list'
npx vercel --prod

# Follow the prompts, Vercel will give you a live URL!
```

---

## Alternative: Netlify (Frontend)

1. Go to https://app.netlify.com
2. Drag and drop your `client/dist` folder (after running `npm run build`)
3. Your site will be live instantly!

---

## 📝 Notes:
- Free tier on Render sleeps after 15 minutes of inactivity
- Vercel is always fast and free for frontend
- For production MongoDB, use MongoDB Atlas (free tier available)
