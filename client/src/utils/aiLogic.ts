export const generateItinerary = (destination: string, days: number = 2, type: 'Normal' | 'EV' = 'Normal') => {
    // Basic templates for demo
    const itineraries: any = {
        'Pune': {
            highlights: ['Shaniwar Wada', 'Aga Khan Palace', 'Sinhagad Fort'],
            food: ['Shabree (Thali)', 'Goodluck Cafe (Bun Maska)', 'Kayani Bakery'],
            schedule: [
                { day: 1, activity: 'Historical Walk', time: 'Morning' },
                { day: 1, activity: 'Local Thali Lunch', time: 'Afternoon' },
                { day: 2, activity: 'Fort Treking', time: 'Morning' }
            ]
        },
        'Mumbai': {
            highlights: ['Gateway of India', 'Marine Drive', 'Colaba Causeway'],
            food: ['Bademiya (Kebabs)', 'Brittania & Co.', 'Bachelorr\'s'],
            schedule: [
                { day: 1, activity: 'Heritage Walk', time: 'Morning' },
                { day: 2, activity: 'Bollywood Tour', time: 'Afternoon' }
            ]
        },
        'Lonavala': {
            highlights: ['Tiger point', 'Bhushi Dam', 'Karla Caves'],
            food: ['Chikki', 'Corn Bhaji', 'Fudge'],
            schedule: [
                { day: 1, activity: 'Waterfall Visit', time: 'Morning' },
                { day: 2, activity: 'Cave Exploration', time: 'Morning' }
            ]
        }
    };

    const cityData = itineraries[destination] || itineraries['Pune']; // Fallback

    // EV Specific addition
    if (type === 'EV') {
        cityData.highlights.push('⚡ Fast Charging Stop at Highway');
        cityData.notes = "EV Range optimal. Charging stops included.";
    }

    return {
        ...cityData,
        generatedAt: new Date().toISOString(),
        aiMessage: `I've crafted a ${days}-day ${type === 'EV' ? 'Eco-Friendly (EV)' : ''} trip to ${destination} for you! Enjoy the mix of heritage and food. 🚀`
    };
};

export const getChatResponse = (message: string) => {
    const msg = message.toLowerCase();

    // Simulate AI thinking time
    return new Promise<{ reply: string }>((resolve) => {
        setTimeout(() => {
            if (msg.includes('hello') || msg.includes('hi')) {
                resolve({ reply: "Hello! I'm here to help you plan your Maharashtra trip. Ask me about Pune, Mumbai, or Lonavala!" });
            } else if (msg.includes('plan') || msg.includes('trip')) {
                resolve({ reply: "I can help with that! Go to the 'Plan a Trip' page to generate a detailed itinerary, or tell me which city you want to visit here." });
            } else if (msg.includes('food') || msg.includes('eat')) {
                resolve({ reply: "Maharashtra has amazing food! Try Misal Pav in Pune, Vada Pav in Mumbai, or Chikki in Lonavala." });
            } else if (msg.includes('pune')) {
                resolve({ reply: "Pune is known for Shaniwar Wada and great cafes. Would you like a 2-day itinerary?" });
            } else if (msg.includes('mumbai')) {
                resolve({ reply: "The City of Dreams! Don't miss Marine Drive and Gateway of India." });
            } else if (msg.includes('ev') || msg.includes('charge')) {
                resolve({ reply: "We have a special EV Mode! Toggle it in the Planner or Explore page to see charging stations nearby." });
            } else {
                resolve({ reply: "That sounds interesting! I recommend exploring our 'Explore Places' section for more details." });
            }
        }, 1000);
    });
};
