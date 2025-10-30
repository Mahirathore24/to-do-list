# 🗄️ MongoDB Atlas Setup Guide (Step-by-Step)

## ✅ Complete Setup Process

### Step 1: Create MongoDB Atlas Account (2 minutes)

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with:
   - Email aur password
   - Ya Google/GitHub se sign up
3. **Verify email** (check inbox)

---

### Step 2: Create Free Cluster (3 minutes)

1. **After login**, click **"Build a Database"**
2. **Choose Plan**:
   - Select **"M0 FREE"** (0 rupees - forever free!)
   - 512 MB storage
3. **Choose Cloud Provider**:
   - Provider: **AWS** (recommended)
   - Region: **Mumbai (ap-south-1)** (fastest for India)
4. **Cluster Name**: `TodoCluster` (ya koi bhi naam)
5. Click **"Create"** - wait 3-5 minutes for cluster creation

---

### Step 3: Create Database User (1 minute)

**Security → Database Access → Add New Database User**

1. **Authentication Method**: Password
2. **Username**: `todouser` (ya koi bhi)
3. **Password**: 
   - Click "Autogenerate Secure Password" 
   - **SAVE THIS PASSWORD** (copy somewhere safe!)
   - Example: `Abc123XYZ456`
4. **User Privileges**: 
   - Select **"Read and write to any database"**
5. Click **"Add User"**

---

### Step 4: Allow Network Access (1 minute)

**Security → Network Access → Add IP Address**

1. Click **"Add IP Address"**
2. **Two options**:
   
   **Option A (Easy - For Testing):**
   - Click **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - Click "Confirm"
   
   **Option B (Secure - For Production):**
   - Add Render.com IPs (after backend deploys)
   - Get IP from Render logs

3. Click **"Confirm"**

---

### Step 5: Get Connection String (2 minutes)

1. **Go to**: Database → Clusters
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy the connection string**:

```
mongodb+srv://todouser:<password>@todocluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

7. **Edit the string**:
   - Replace `<password>` with your actual password
   - Add database name: `/todolist` before `?`

**Final format**:
```
mongodb+srv://todouser:Abc123XYZ456@todocluster.xxxxx.mongodb.net/todolist?retryWrites=true&w=majority
```

---

### Step 6: Create Database & Collection (Optional - Auto-creates)

MongoDB will automatically create database and collections when you first save data.

But if you want to create manually:

1. **Database → Browse Collections**
2. Click **"Add My Own Data"**
3. **Database name**: `todolist`
4. **Collection name**: `tasks`
5. Click "Create"

---

## 🔧 Environment Variables for Backend

### For Local Development (`.env` file):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-12345
MONGODB_URI=mongodb+srv://todouser:YourPassword@todocluster.xxxxx.mongodb.net/todolist?retryWrites=true&w=majority
```

### For Render.com Production:

Add these in **Render Dashboard → Environment**:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `change-this-to-random-string-67890` |
| `MONGODB_URI` | `mongodb+srv://todouser:YourPassword@cluster.mongodb.net/todolist?retryWrites=true&w=majority` |

---

## ✅ Test Connection Locally

```bash
cd my-backend
node index.js
```

**Expected output**:
```
✅ Server running on port 5000
✅ MongoDB Connected: todocluster-shard-00-00.xxxxx.mongodb.net
📊 Database: todolist
💾 Using MongoDB for storage
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "MongoNetworkError: failed to connect"
**Solution**: 
- Check Network Access → IP is `0.0.0.0/0` 
- Or add your current IP

### Issue 2: "Authentication failed"
**Solution**: 
- Double-check username and password in connection string
- Password me special characters (`@`, `#`) hain toh URL encode karo

### Issue 3: "connection string is invalid"
**Solution**: 
- Ensure format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?options`
- Database name `/todolist` add kiya hai?

---

## 📊 Dashboard Features

**Monitor your database**:
1. **Metrics** - CPU, memory, connections
2. **Browse Collections** - See your tasks data
3. **Alerts** - Get notified of issues
4. **Backup** - Free automated backups

---

## 🔐 Security Best Practices

1. ✅ Use strong passwords
2. ✅ Enable 2FA on Atlas account
3. ✅ Restrict IP access (production)
4. ✅ Use separate users for dev/prod
5. ✅ Rotate passwords regularly

---

## 💰 Pricing

**FREE Tier (M0)**:
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ No credit card needed
- ✅ Never expires
- ✅ Perfect for development

**Upgrade later** if you need more storage/performance.

---

## 🎯 Quick Summary

**What you need from Atlas:**
1. ✅ Account created
2. ✅ Cluster created (M0 free)
3. ✅ Database user created
4. ✅ IP whitelisted (0.0.0.0/0)
5. ✅ Connection string copied

**Then:**
- Add `MONGODB_URI` to Render environment
- Deploy backend
- Done! 🚀

---

**Time**: 10 minutes total
**Cost**: ₹0 (FREE forever)
**Result**: Production-ready cloud database!
