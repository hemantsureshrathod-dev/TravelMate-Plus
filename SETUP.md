# TravelMate+ Setup Guide 🚀

Quick setup guide to get TravelMate+ running locally.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB installation ([Download](https://www.mongodb.com/try/download/community))
  - MongoDB Atlas (Free cloud database) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** (comes with Node.js)

## Step-by-Step Setup

### 1. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 2. Configure Environment Variables

#### Backend (.env file in `server/` folder)

Create a file named `.env` in the `server/` directory:

```env
MONGO_URI=mongodb://localhost:27017/travelmate
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=5000
AI_API_KEY=your_google_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

**Note**: 
- For MongoDB Atlas, use: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/travelmate`
- AI_API_KEY is optional but recommended. Get it from: [Google Gemini API](https://makersuite.google.com/app/apikey)
- If AI_API_KEY is not set, the app will use intelligent fallback responses

### 3. Start MongoDB

**If using local MongoDB:**
```bash
# On macOS/Linux
mongod

# On Windows (if installed as service, it should auto-start)
# Or use: net start MongoDB
```

**If using MongoDB Atlas:**
- No setup needed! Just use your connection string in MONGO_URI

### 4. Seed the Database

This will populate Maharashtra places (attractions, food, stays, EV stations):

```bash
cd server
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🧹 Cleared existing places
✅ Seeded 25+ places to database
   - Attractions: 16
   - Food: 5
   - Stays: 3
   - EV Stations: 6
✅ Database seeding completed successfully!
```

### 5. Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📍 API Base URL: http://localhost:5000/api
🤖 AI Service: ✅ Enabled (Gemini)  or  ⚠️  Fallback Mode (No API Key)
```

### 6. Start the Frontend Dev Server

Open a new terminal:

```bash
cd client
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 7. Open in Browser

Navigate to: **http://localhost:5173**

You should see the TravelMate+ homepage! 🎉

---

## Quick Test

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Login at `/login`
3. **Explore**: Browse places at `/explore`
4. **Plan Trip**: Create a trip at `/planner`
5. **Dashboard**: View your trips at `/dashboard`
6. **AI Chat**: Click the chat icon (bottom right) and ask: "2-day Pune trip"
7. **Location**: Click "Use My Location" in Explore (if in Maharashtra)
8. **Language**: Toggle to Marathi using the globe icon in navbar

---

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongoDB connection error`

**Solution**:
- Make sure MongoDB is running: `mongod` or check MongoDB service
- Verify MONGO_URI in `.env` file
- For Atlas: Check username/password and IP whitelist

### Port Already in Use

**Error**: `Port 5000 already in use`

**Solution**:
- Change PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000:
  ```bash
  # macOS/Linux
  lsof -ti:5000 | xargs kill
  
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### AI Service Not Working

**If AI_API_KEY is not set:**
- The app will work with intelligent fallback responses
- To enable full AI: Get API key from [Google Gemini](https://makersuite.google.com/app/apikey)
- Add it to `.env` as `AI_API_KEY=your_key_here`

### CORS Error

**Error**: `CORS policy` errors in browser console

**Solution**:
- Make sure `CLIENT_URL=http://localhost:5173` is in server `.env`
- Check that frontend is running on port 5173 (default Vite port)

### Module Not Found Errors

**Error**: `Cannot find module` or `Module not found`

**Solution**:
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Seed Script Not Working

**Error**: `ts-node not found` or similar

**Solution**:
```bash
cd server
npm install -D ts-node nodemon
npm run seed
```

---

## Production Build

### Build Frontend
```bash
cd client
npm run build
```
Output will be in `client/dist/`

### Build Backend
```bash
cd server
npm run build
```
Output will be in `server/dist/`

### Run Production Server
```bash
cd server
npm start
```

---

## API Testing

You can test APIs using:
- **Postman** - Import the routes
- **curl** - Command line
- **Browser** - For GET requests

Example:
```bash
# Test API health
curl http://localhost:5000/

# Test places (no auth needed)
curl http://localhost:5000/api/places

# Test places by city
curl http://localhost:5000/api/places?city=Pune
```

---

## Project Structure Overview

```
TravelMate+
├── client/              # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React Context
│   │   └── utils/      # Utilities
│   └── package.json
│
├── server/              # Express backend
│   ├── src/
│   │   ├── models/     # MongoDB models
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Auth middleware
│   │   └── scripts/    # Seed script
│   └── package.json
│
├── README.md           # Main documentation
└── SETUP.md           # This file
```

---

## Need Help?

1. Check the main [README.md](./README.md) for detailed documentation
2. Check browser console for frontend errors
3. Check server terminal for backend errors
4. Verify all environment variables are set
5. Make sure MongoDB is running and accessible

---

**Happy Coding! 🎉**

If everything works, you should have a fully functional TravelMate+ app running locally!
