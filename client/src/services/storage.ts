import { MOCK_PLACES } from '../data/mockData';

const KEYS = {
    USER: 'tm_user',
    TRIPS: 'tm_trips',
    SAVED_PLACES: 'tm_saved_places'
};

export const storage = {
    // AUTH
    getUser: () => {
        const user = localStorage.getItem(KEYS.USER);
        return user ? JSON.parse(user) : null;
    },
    login: (userData: any) => {
        const userWithToken = { ...userData, token: 'mock-jwt-token' };
        localStorage.setItem(KEYS.USER, JSON.stringify(userWithToken));
        return userWithToken;
    },
    logout: () => {
        localStorage.removeItem(KEYS.USER);
    },

    // TRIPS
    getTrips: () => {
        const trips = localStorage.getItem(KEYS.TRIPS);
        return trips ? JSON.parse(trips) : [];
    },
    addTrip: (tripData: any) => {
        const trips = storage.getTrips();
        const newTrip = { ...tripData, _id: Date.now().toString(), status: 'Upcoming' };
        trips.push(newTrip);
        localStorage.setItem(KEYS.TRIPS, JSON.stringify(trips));
        return newTrip;
    },

    // PLACES
    getPlaces: (filter: any = {}) => {
        let places = [...MOCK_PLACES];

        if (filter.city) {
            places = places.filter(p => p.location.city.toLowerCase() === filter.city.toLowerCase());
        }
        if (filter.category && filter.category !== 'All') {
            places = places.filter(p => p.category === filter.category);
        }
        return places;
    },

    // SAVED PLACES
    getSavedPlaces: () => {
        const savedIds = JSON.parse(localStorage.getItem(KEYS.SAVED_PLACES) || '[]');
        return MOCK_PLACES.filter(p => savedIds.includes(p._id));
    },
    toggleSavePlace: (placeId: string) => {
        let savedIds = JSON.parse(localStorage.getItem(KEYS.SAVED_PLACES) || '[]');
        if (savedIds.includes(placeId)) {
            savedIds = savedIds.filter((id: string) => id !== placeId);
        } else {
            savedIds.push(placeId);
        }
        localStorage.setItem(KEYS.SAVED_PLACES, JSON.stringify(savedIds));
        return savedIds.includes(placeId);
    },
    isSaved: (placeId: string) => {
        const savedIds = JSON.parse(localStorage.getItem(KEYS.SAVED_PLACES) || '[]');
        return savedIds.includes(placeId);
    }
};
