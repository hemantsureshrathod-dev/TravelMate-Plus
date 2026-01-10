# TravelMate+ 🌴

**TravelMate+** is a complete, production-ready full-stack web application designed exclusively for **Maharashtra, India**. Built for Buildathon evaluation with focus on functionality, UI/UX, responsiveness, AI integration, data persistence, and real-time features.

![TravelMate+](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-brightgreen)

---

## 🎯 Features

### Core Features
- ✅ **User Authentication** - JWT-based secure login/signup
- ✅ **AI-Powered Travel Assistant** - Maharashtra-specific chatbot with intelligent responses
- ✅ **Trip Planner** - Multi-step trip planning with date selection
- ✅ **Explore Places** - Browse attractions, food, stays, and EV charging stations
- ✅ **Location Detection** - Browser Geolocation API for nearby places
- ✅ **Nearby Search** - Find attractions, food, and EV stations within radius
- ✅ **User Dashboard** - Manage trips, preferences, and saved places
- ✅ **Bilingual Support** - English and Marathi language toggle
- ✅ **Data Persistence** - MongoDB for trips, preferences, saved places, chat history
- ✅ **Responsive Design** - Mobile-first, works on all devices

### Maharashtra-Specific Features
- 🗺️ Curated places across major cities (Mumbai, Pune, Nashik, Kolhapur, Aurangabad, etc.)
- 🍛 Food recommendations based on preferences (Veg/Non-Veg/Jain)
- 🔌 EV charging station locations
- 🏛️ Historical sites and cultural attractions
- 🌊 Beaches, hill stations, and natural attractions

---

## 🚀 Tech Stack

### Frontend
- **React 19.2** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS 4.1** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router 7** - Navigation
- **Axios** - API calls

### Backend
- **Node.js** with **Express**
- **TypeScript** - Type safety
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Gemini AI** - Travel assistant

### Database
- **MongoDB** - NoSQL database
- Models: User, Trip, Place, SavedPlace, ChatHistory

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Kirannnn
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
MONGO_URI=mongodb://localhost:27017/travelmate
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
AI_API_KEY=your_google_gemini_api_key  # Optional but recommended
CLIENT_URL=http://localhost:5173
```

**Seed the database** (to populate Maharashtra places):
```bash
npm run seed
```

**Start the backend server**:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in `client/` directory (if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend dev server**:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📁 Project Structure

```
TravelMate+
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth, Language)
│   │   ├── utils/         # Utilities (API client)
│   │   └── App.tsx
│   └── package.json
│
├── server/                 # Backend Express app
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── scripts/       # Seed data script
│   │   └── index.ts
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

### User
- `name`, `email`, `password` (hashed)
- `preferences`: `{ food: 'Veg'|'Non-Veg'|'Jain', interests: [] }`
- `savedTrips`: Array of Trip IDs

### Trip
- `userId`, `destination`, `startDate`, `endDate`
- `itinerary`: Flexible JSON structure

### Place
- `name`, `description`
- `location`: `{ lat, lng, city }`
- `category`: `'Attraction'|'Food'|'Stay'|'EV_Station'`
- `rating`, `tags`, `images`

### SavedPlace
- `userId`, `placeId`

### ChatHistory
- `userId`
- `messages`: `[{ role: 'user'|'assistant', content, timestamp }]`

---

## 🔌 API Routes

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/preferences` - Update preferences (protected)

### Places
- `GET /api/places` - Get all places (filter by city/category)
- `GET /api/places/nearby` - Get nearby places (requires lat/lng)
- `POST /api/places` - Add place (protected)
- `POST /api/places/:id/save` - Save place (protected)
- `GET /api/places/saved` - Get saved places (protected)

### Trips
- `POST /api/trips` - Create trip (protected)
- `GET /api/trips` - Get user's trips (protected)
- `GET /api/trips/:id` - Get single trip (protected)

### AI Chat
- `POST /api/chat` - Chat with AI assistant (protected)
- `GET /api/chat/history` - Get chat history (protected)

---

## 🎨 UI/UX Features

- **Modern Travel UI** - Inspired by top travel websites (MakeMyTrip, Airbnb style)
- **Smooth Animations** - Framer Motion for transitions
- **Responsive Design** - Mobile-first, tablet, desktop
- **Dark/Light Mode Ready** - Clean color scheme
- **Icons** - Lucide React icons
- **Loading States** - Proper loading indicators
- **Error Handling** - User-friendly error messages

---

## 🤖 AI Integration

The AI Travel Assistant uses **Google Gemini AI** (with intelligent fallback if API key not provided):

- **Maharashtra-Specific** - Only answers queries about Maharashtra
- **Contextual Responses** - Remembers user preferences (food type)
- **Itinerary Planning** - Creates day-wise plans
- **Food Recommendations** - Based on Veg/Non-Veg/Jain preferences
- **EV Charging Info** - Provides charging station locations
- **Natural Language** - Understands queries like "2-day Pune trip"

**Fallback Mode**: If AI API key is not provided, intelligent rule-based responses are generated.

---

## 🌐 Language Support

- **Default**: English
- **Secondary**: Marathi (मराठी)
- **Toggle Button**: In navbar
- **Dynamic Translation**: Content switches without reload
- **Natural Translations**: Marathi translations are contextually appropriate

---

## 📱 Location Features

- **Browser Geolocation API** - Detects user location
- **Maharashtra Boundary Check** - Validates location is in Maharashtra
- **Nearby Places** - Shows attractions, food, EV stations within 50km
- **Distance Calculation** - Shows distance from user location
- **City Selection** - Fallback manual city selection if location unavailable

---

## 🧪 Testing Checklist

- ✅ Login/Signup works
- ✅ All pages load correctly
- ✅ Trip planning creates trips
- ✅ Explore shows places
- ✅ Location detection works (in Maharashtra)
- ✅ AI chatbot responds
- ✅ Language toggle works
- ✅ Dashboard shows user data
- ✅ Data persists after logout/login
- ✅ Responsive on mobile/tablet/desktop

---

## 🚀 Deployment

### Backend (Example: Render/Railway)
1. Set environment variables
2. Deploy Node.js app
3. Connect to MongoDB Atlas or hosted MongoDB

### Frontend (Example: Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set API URL environment variable

---

## 📝 Environment Variables

### Server (.env)
```
MONGO_URI=mongodb://localhost:27017/travelmate
JWT_SECRET=your_secret_key
PORT=5000
AI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### Client (.env - optional)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🎯 Buildathon Evaluation Criteria

✅ **Login Page (15%)** - Complete with validation, error handling  
✅ **Responsiveness (10%)** - Mobile-first, fully responsive  
✅ **UI (15%)** - Modern travel-style interface  
✅ **AI Integration (20%)** - Maharashtra-specific intelligent chatbot  
✅ **Data Persistence (10%)** - All data saved to MongoDB  
✅ **All Features Working** - Every button, API, feature tested  
✅ **Problem Statement** - Solves language barrier, food confusion, planning issues, EV charging  

---

## 🤝 Contributing

This is a Buildathon project. For improvements:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

This project is built for educational/Buildathon purposes.

---

## 👨‍💻 Author

Built for Buildathon 2026

---

## 🙏 Acknowledgments

- Maharashtra Tourism Board
- Google Gemini AI
- MongoDB Community
- React & Express communities

---

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ for Maharashtra Tourism**
