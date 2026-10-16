# TravelMate+ 2.0 — AI Travel Planning for Maharashtra & India

[![Vitest Tests](https://img.shields.io/badge/tests-23%20passed-emerald)](https://github.com/hemantsureshrathod-dev/TravelMate-Plus)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Design](https://img.shields.io/badge/aesthetic-Scandinavian%20Clarity-5E8CA6)](https://travel-mate-plus.vercel.app/)

**TravelMate+** is a greenfield full-stack AI-driven travel planning application tailored specifically for Maharashtra and Indian travel. Built with a calm Scandinavian aesthetic, structured Google Gemini AI itinerary generation, MongoDB cloud persistence, and strict data security.

---

## 🏔️ Product Features & Information Architecture

- **Landing Experience (`/`)**: Calm value proposition, verified Maharashtra highlights (Western Ghats, Sahyadri hill stations, Konkan coast, UNESCO heritage), and instant trip estimator.
- **Curated Destination Explorer (`/destinations`)**: Searchable and filterable by region and travel style (Hill Stations, Coastal, Heritage, Wildlife, Spiritual). Features an interactive Leaflet map with custom Scandinavian pins.
- **AI Itinerary Studio (`/plan` & `/studio`)**:
  - Structured prompt engineering powered by server-side Google Gemini 1.5/2.0 API.
  - Generates realistic day-by-day itineraries with estimated travel times, regional food suggestions, and INR budget breakdowns.
  - Interactive editing: adjust titles, timings, costs, add custom stops, or remove activities.
  - Transparent AI labeling and travel advisories.
- **Personal Dashboard (`/dashboard`)**:
  - Secure personal vault for saved itineraries backed by MongoDB.
  - Strict ownership isolation: users can never read, modify, or delete another user's trips.
  - Full CRUD operations with modal confirmations and printable itinerary views.
- **Robust Authentication (`/register` & `/login`)**:
  - Salted bcrypt password hashing.
  - Signed JWT session management.
  - Rate limiting on authentication and AI generation endpoints to prevent abuse.

---

## 🎨 Scandinavian Design System

The application uses an understated, spacious Scandinavian aesthetic:
- **Background**: `#F3F5F4` (Soft off-white / pale mist)
- **Surface**: `#FFFFFF` (Pure white cards and modals)
- **Primary Accent**: `#5E8CA6` (Muted Fjord Blue)
- **Accent Surface**: `#DDE8EC` (Ice blue chip / active tab surface)
- **Primary Text**: `#26333A` (Deep Nordic Slate)
- **Secondary Text**: `#6C7A80` (Muted granite)
- **Borders**: `#DCE3E5` (Subtle hair-line borders)
- **Typography**: DM Sans & Inter

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Lucide Icons, Leaflet |
| **Backend** | Node.js, Express, TypeScript, Mongoose, MongoDB, Zod, Helmet, Express Rate Limit |
| **AI Engine** | Google Gemini API (`@google/generative-ai`), structured JSON schema validation |
| **Security** | bcryptjs password hashing, JWT bearer auth, strict CORS, Zod input validation |
| **Testing** | Vitest, Supertest for end-to-end API integration tests |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js `v20+` or `v24+`
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 1. Clone & Inspect Repository
```bash
git clone https://github.com/hemantsureshrathod-dev/TravelMate-Plus.git
cd TravelMate-Plus
```

### 2. Configure Environment Variables
Copy the templates into `.env` (never commit secrets to Git):

**Server (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/travelmate
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
CLIENT_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=30
AI_RATE_LIMIT_MAX=15
```

**Client (`client/.env`):**
```env
VITE_API_URL=/api
```

### 3. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the Application
In separate terminal windows:

```bash
# Terminal 1 - Backend Server (port 5000)
cd server
npm run dev

# Terminal 2 - Frontend Client (port 5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

Run the comprehensive Vitest test suite covering health checks, registration, duplicate rejection, login, protected routes, cross-user isolation, and AI generation validation:

```bash
cd server
npm test
```

Build verification:
```bash
# Server TypeScript build
npm --prefix server run build

# Client Vite production build
npm --prefix client run build
```

---

## 🔒 Security Best Practices

- **Zero Plaintext Passwords**: Passwords hashed with bcrypt and 10 salt rounds before persistence.
- **Strict Data Ownership**: Every trip document references its owner (`ObjectId`). Backend controllers verify `trip.owner === req.user.id` on all read, update, and delete actions.
- **Safe Public Error Messages**: Stack traces and database connection details are never exposed to clients.
- **Rate Limiting**: Configured for general API (100 req/15min), auth endpoints (30 req/15min), and AI generation (15 req/min).

---

## 🌐 Deployment Plan

- **Frontend**: Deploys to existing Vercel project (`https://travel-mate-plus.vercel.app/`).
- **Backend**: Can be deployed to Render, Railway, or VPS with MongoDB Atlas connectivity and `GEMINI_API_KEY` configured in environment settings.
