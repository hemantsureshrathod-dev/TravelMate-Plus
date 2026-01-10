import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { protect } from '../middleware/authMiddleware';
import { ChatHistory } from '../models/ChatHistory';
import { User } from '../models/User';
import { Place } from '../models/Place';

const router = express.Router();

// Initialize Gemini
const genAI = process.env.AI_API_KEY ? new GoogleGenerativeAI(process.env.AI_API_KEY) : null;

// Maharashtra cities and places data for fallback responses
const maharashtraCities = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Lonavala', 'Mahabaleshwar', 'Alibaug', 'Shirdi', 'Ajanta', 'Ellora', 'Matheran', 'Ratnagiri', 'Sindhudurg'];
const maharashtraAttractions = [
    'Gateway of India, Mumbai', 'Shaniwar Wada, Pune', 'Ajanta Caves, Aurangabad', 'Ellora Caves, Aurangabad',
    'Siddhivinayak Temple, Mumbai', 'Trimbakeshwar Temple, Nashik', 'Mahalaxmi Temple, Kolhapur', 'Karla Caves, Lonavala',
    'Pratapgad Fort, Satara', 'Raigad Fort, Raigad', 'Sinhagad Fort, Pune', 'Tikona Fort, Lonavala'
];

// Generate intelligent Maharashtra-specific response (fallback if AI unavailable)
const generateMaharashtraResponse = async (message: string, userPreferences?: any) => {
    const lowerMessage = message.toLowerCase();

    // Trip planning queries
    if (lowerMessage.includes('2 day') || lowerMessage.includes('two day') || lowerMessage.includes('2-day')) {
        if (lowerMessage.includes('pune')) {
            return `🏛️ **2-Day Pune Itinerary**\n\n**Day 1:**\n- Morning: Visit Shaniwar Wada & Aga Khan Palace\n- Afternoon: Explore Osho Ashram & Sinhagad Fort\n- Evening: Shop at FC Road & enjoy street food\n\n**Day 2:**\n- Morning: Karla Caves & Lonavala (30 min drive)\n- Afternoon: Bhimashankar Temple\n- Evening: Parsi Bhonu or Maharashtrian thali at Shabree Restaurant\n\nBest time to visit: October to March. Don't miss Misal Pav for breakfast! 🌶️`;
        }
        if (lowerMessage.includes('mumbai')) {
            return `🏙️ **2-Day Mumbai Itinerary**\n\n**Day 1:**\n- Morning: Gateway of India & Colaba Causeway\n- Afternoon: Marine Drive & Chowpatty Beach\n- Evening: Siddhivinayak Temple & Street food tour\n\n**Day 2:**\n- Morning: Elephanta Caves (ferry ride)\n- Afternoon: Bandra-Worli Sea Link & Bandstand\n- Evening: Try Vada Pav at Ashok Vada Pav, Pav Bhaji at Sardar\n\nMumbai never sleeps! Perfect blend of heritage and modernity. ✨`;
        }
    }

    // Food recommendations
    if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('restaurant')) {
        const foodType = userPreferences?.food || 'Veg';
        if (lowerMessage.includes('marathi') || lowerMessage.includes('kolhapur')) {
            return `🍛 **Authentic Marathi Food in Kolhapur**\n\n**${foodType} Options:**\n- Misal Pav: Hotel Padma or Hotel Shabari\n- Kolhapuri Thali: Authentic spicy thali with ${foodType} options\n- Bhel Puri & Dahi Puri: Street vendors near Rankala Lake\n- Puran Poli: Sweet flatbread (traditional)\n- Amba-Barfi: Local sweet specialty\n\nKolhapur is famous for its spicy cuisine! If you like heat, try Kolhapuri Misal. 🌶️🔥`;
        }
        return `🍽️ **Best Maharashtrian Food to Try:**\n\n- **Misal Pav**: Spicy sprout curry (${foodType} friendly)\n- **Vada Pav**: Mumbai's signature street food\n- **Pav Bhaji**: Buttery vegetable curry\n- **Thalipeeth**: Multi-grain flatbread\n- **Bhel Puri**: Tangy chaat\n- **Sabudana Khichdi**: Fasting food (Jain friendly)\n\nPopular spots: Shabree (Pune), Sardar (Mumbai), Hotel Shabari (Kolhapur)`;
    }

    // Nearby places queries
    if (lowerMessage.includes('near') || lowerMessage.includes('nearby') || lowerMessage.includes('around')) {
        if (lowerMessage.includes('lonavala')) {
            return `🏔️ **Places Near Lonavala:**\n\n- **Khandala** (5 km): Viewpoint and waterfalls\n- **Karla & Bhaja Caves** (10 km): Ancient Buddhist caves\n- **Tiger's Leap** (5 km): Scenic viewpoint\n- **Bushi Dam** (2 km): Beautiful dam\n- **Rajmachi Fort** (15 km): Trekking destination\n- **Pawana Lake** (20 km): Boating and camping\n\nLonavala is perfect for a weekend getaway! Best visited during monsoons (June-September) for lush greenery. 🌧️🌿`;
        }
        if (lowerMessage.includes('pune')) {
            return `📍 **Attractions Near Pune:**\n\n- **Lonavala & Khandala** (64 km): Hill stations\n- **Sinhagad Fort** (30 km): Historical fort\n- **Mahabaleshwar** (120 km): Hill station\n- **Bhimashankar** (110 km): Temple & wildlife\n- **Karls Caves** (60 km): Ancient caves\n- **Lavasa** (65 km): Planned hill city\n\nPune is the cultural capital! Rich history, great food, and proximity to nature. 🏛️`;
        }
        return `🗺️ **Popular Destinations in Maharashtra:**\n\n- **Western Ghats**: Lonavala, Mahabaleshwar, Matheran\n- **Historical**: Pune, Aurangabad (Ajanta-Ellora), Raigad Fort\n- **Beaches**: Alibaug, Ganpatipule, Tarkarli\n- **Spiritual**: Shirdi, Trimbakeshwar, Kolhapur\n- **Wildlife**: Tadoba, Pench, Sanjay Gandhi National Park\n\nTell me which region interests you!`;
    }

    // EV charging stations
    if (lowerMessage.includes('ev') || lowerMessage.includes('charging') || lowerMessage.includes('electric')) {
        return `🔌 **EV Charging Stations in Maharashtra:**\n\n**Major Cities:**\n- Mumbai: Multiple stations at malls, metro stations\n- Pune: EV charging at IT parks, malls, petrol pumps\n- Nagpur: EV-friendly city with public charging\n- Nashik: Stations at major landmarks\n\n**Highways:**\n- Mumbai-Pune Expressway: Charging points at food courts\n- Mumbai-Nashik: Stations every 50-100 km\n\n**Popular Locations:**\n- Phoenix Mall (Pune/Mumbai)\n- Selected Reliance/BPCL petrol pumps\n- Hotel parking lots in tourist areas\n\nMaharashtra is rapidly expanding EV infrastructure! 🚗⚡`;
    }

    // General queries
    if (lowerMessage.includes('best') || lowerMessage.includes('top') || lowerMessage.includes('recommend')) {
        return `⭐ **Top Maharashtra Destinations:**\n\n**Must Visit:**\n1. **Mumbai** - Gateway of India, Marine Drive, Elephanta\n2. **Pune** - Shaniwar Wada, Aga Khan Palace, Sinhagad\n3. **Aurangabad** - Ajanta & Ellora Caves (UNESCO)\n4. **Lonavala** - Hill station, waterfalls, caves\n5. **Mahabaleshwar** - Hill station, strawberry farms\n6. **Kolhapur** - Temples, food, culture\n7. **Shirdi** - Sai Baba Temple\n\n**Hidden Gems:**\n- Ratnagiri beaches\n- Panhala Fort (Kolhapur)\n- Raigad Fort (historic)\n\nWhat type of trip are you planning? Adventure, history, nature, or food?`;
    }

    // Default response
    return `🌴 Welcome to **TravelMate+** - Your Maharashtra Travel Companion!\n\nI can help you with:\n- 📅 Trip planning (2-day, 3-day, week-long)\n- 🍛 Food recommendations (Veg/Non-Veg/Jain)\n- 📍 Nearby attractions and places\n- 🔌 EV charging stations\n- 🏛️ Historical sites & culture\n\nTry asking:\n- "2-day Pune trip"\n- "Best places near Lonavala"\n- "Marathi food in Kolhapur"\n- "EV charging in Mumbai"\n\nWhat would you like to explore in Maharashtra?`;
};

// @route   POST /api/chat
// @desc    Chat with AI Assistant specifically for Maharashtra Travel
router.post('/', protect, async (req: any, res) => {
    const { message } = req.body;

    try {
        // Get user preferences for personalized responses
        const user = await User.findById(req.user.id);

        let reply: string;

        if (genAI && process.env.AI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

                const contextPrompt = `You are an expert AI Travel Assistant for Maharashtra, India for the app "TravelMate+".
Your goal is to help users plan trips, find food, and discover places ONLY in Maharashtra state, India.

RULES:
1. ONLY answer queries related to Maharashtra tourism, food, culture, heritage, and travel.
2. If asked about places outside Maharashtra, politely decline and suggest Maharashtra alternatives.
3. Be specific about cities, distances, timings, and local names.
4. Suggest hidden gems, local food (Veg/Non-veg/Jain), EV charging stations when relevant.
5. User food preference: ${user?.preferences?.food || 'Veg'}
6. Be concise, friendly, and use emojis appropriately.
7. If asked about itineraries, provide day-wise detailed plans.
8. Include practical tips like best time to visit, travel modes, and local customs.

User Query: "${message}"

Provide a helpful, Maharashtra-specific response:`;

                const result = await model.generateContent(contextPrompt);
                const response = await result.response;
                reply = response.text();
            } catch (aiError) {
                console.error('AI API Error, using fallback:', aiError);
                reply = await generateMaharashtraResponse(message, user?.preferences);
            }
        } else {
            // Fallback intelligent responses
            reply = await generateMaharashtraResponse(message, user?.preferences);
        }

        // Save to chat history
        let chatHistory = await ChatHistory.findOne({ userId: req.user.id });

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user.id,
                messages: []
            });
        }

        chatHistory.messages.push(
            { role: 'user', content: message, timestamp: new Date() },
            { role: 'assistant', content: reply, timestamp: new Date() }
        );

        await chatHistory.save();

        res.json({ reply });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ message: 'Chat service error', error });
    }
});

// @route   GET /api/chat/history
// @desc    Get user's chat history
router.get('/history', protect, async (req: any, res) => {
    try {
        const chatHistory = await ChatHistory.findOne({ userId: req.user.id });
        res.json(chatHistory?.messages || []);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

export default router;
