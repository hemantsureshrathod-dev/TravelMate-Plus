# TravelMate+ Quick Start Guide ⚡

Get TravelMate+ running in 5 minutes!

## 1. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend  
cd ../client && npm install
```

## 2. Setup Environment

Create `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/travelmate
JWT_SECRET=my_secret_key_12345
PORT=5000
AI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

## 3. Start MongoDB

**Local:**
```bash
mongod
```

**Or use MongoDB Atlas** (cloud) - just update MONGO_URI

## 4. Seed Database

```bash
cd server
npm run seed
```

## 5. Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

## 6. Open Browser

👉 **http://localhost:5173**

---

## 🎯 Test Checklist

- [ ] Homepage loads
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard accessible
- [ ] Explore shows places
- [ ] Trip planner creates trips
- [ ] AI chat responds (click bottom-right icon)
- [ ] Location detection works (in Explore page)
- [ ] Language toggle works (navbar globe icon)

---

## 🔑 Default Test Credentials

After signup, login with:
- Email: (any email)
- Password: (your password)

---

## 📚 Full Documentation

- **README.md** - Complete documentation
- **SETUP.md** - Detailed setup guide
- **QUICK_START.md** - This file

---

**Need help?** Check SETUP.md for troubleshooting!
