import React, { createContext, useContext, useState, useEffect } from 'react';
import { PLACES_DATA } from '../data/placesData';

const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [trips, setTrips] = useState<any[]>([]);
    const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
    const [places, setPlaces] = useState<any[]>(PLACES_DATA);
    // Initialize stats derived from state for immediate UI updates
    const [stats, setStats] = useState({ totalTrips: 0, savedCount: 0, evKm: 0 });

    // Load initial data from localStorage
    useEffect(() => {
        const storedTrips = JSON.parse(localStorage.getItem('tm_trips') || '[]');
        const storedSaved = JSON.parse(localStorage.getItem('tm_saved_places') || '[]');
        setTrips(storedTrips);
        setSavedPlaces(storedSaved);
    }, []);

    // Sync stats whenever trips or saved places change
    useEffect(() => {
        const evTrips = trips.filter((t: any) => t.travelType === 'EV').length;
        setStats({
            totalTrips: trips.length,
            savedCount: savedPlaces.length,
            evKm: evTrips * 120 // Mock calculation logic
        });
    }, [trips, savedPlaces]);

    // ACTIONS
    const addTrip = (trip: any) => {
        const newTrip = { ...trip, _id: Date.now().toString(), status: 'Upcoming' };
        const updatedTrips = [...trips, newTrip];
        setTrips(updatedTrips);
        localStorage.setItem('tm_trips', JSON.stringify(updatedTrips));
    };

    const deleteTrip = (id: string) => { // Added delete for completeness
        const updatedTrips = trips.filter((t: any) => t._id !== id && t.id !== id);
        setTrips(updatedTrips);
        localStorage.setItem('tm_trips', JSON.stringify(updatedTrips));
    };

    const toggleSavePlace = (placeId: string) => {
        let newSaved;
        if (savedPlaces.includes(placeId)) {
            newSaved = savedPlaces.filter(id => id !== placeId);
        } else {
            newSaved = [...savedPlaces, placeId];
        }
        setSavedPlaces(newSaved);
        localStorage.setItem('tm_saved_places', JSON.stringify(newSaved));
        return newSaved.includes(placeId);
    };

    const isSaved = (placeId: string) => savedPlaces.includes(placeId);

    const getPlacesByCity = (city: string) => {
        if (!city || city === 'All') return places;
        return places.filter(p => p.location.city.toLowerCase() === city.toLowerCase());
    };

    return (
        <DataContext.Provider value={{
            trips,
            savedPlaces,
            stats,
            addTrip,
            deleteTrip,
            toggleSavePlace,
            isSaved,
            places,
            getPlacesByCity
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
