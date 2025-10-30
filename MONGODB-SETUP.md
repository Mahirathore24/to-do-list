# MongoDB Atlas Setup Guide 🍃

## Quick Setup (5 minutes)

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Choose **FREE M0 Cluster** (512MB - Forever Free)

### Step 2: Create Database
1. Click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select region closest to you (e.g., AWS Mumbai)
4. Click "Create"

### Step 3: Setup Database Access
1. Click "Database Access" in left menu
2. Click "Add New Database User"
3. Username: `todouser`
4. Password: Generate secure password (save it!)
5. Built-in Role: Select "Read and write to any database"
6. Click "Add User"

### Step 4: Setup Network Access
1. Click "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" in left menu
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://todouser:<password>@cluster0.xxxxx.mongodb.net/
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `todolist`

### Step 6: Update Your .env File
```env
MONGODB_URI=mongodb+srv://todouser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/todolist
PORT=5000
NODE_ENV=production
```

### Test Connection
```bash
cd my-backend
node index.js
```

You should see: ✅ MongoDB connected successfully!

---

## Alternative: Install MongoDB Locally

### For Linux (Ubuntu/Debian):
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Test Local MongoDB:
```bash
# Your current .env is already configured for local MongoDB
cd my-backend
node index.js
```

---

## Which Option to Choose?

✅ **MongoDB Atlas (Cloud)** - Recommended for:
- Quick setup (5 minutes)
- No local installation needed
- Works when deployed to Render/Railway
- Free tier: 512MB storage
- Automatic backups

✅ **Local MongoDB** - Good for:
- Development/testing
- No internet required
- Faster response time
- Full control

---

## Current Status

Your backend is configured to connect to: `mongodb://localhost:27017/todolist`

To use MongoDB Atlas instead, just update the `MONGODB_URI` in your `.env` file!
