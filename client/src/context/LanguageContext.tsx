import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'mr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
    welcome: {
        en: 'Welcome to TravelMate+',
        mr: 'ट्रॅव्हलमेट+ मध्ये आपले स्वागत आहे',
    },
    planTrip: {
        en: 'Plan a Trip',
        mr: 'सहलीचे नियोजन करा',
    },
    findFood: {
        en: 'Find Food',
        mr: 'जेवण शोधा',
    },
    explore: {
        en: 'Explore Places',
        mr: 'ठिकाणे एक्सप्लोर करा',
    },
    login: {
        en: 'Login',
        mr: 'लॉगिन',
    },
    signup: {
        en: 'Sign Up',
        mr: 'साइन अप',
    },
    dashboard: {
        en: 'Dashboard',
        mr: 'डॅशबोर्ड',
    },
    logout: {
        en: 'Logout',
        mr: 'बाहेर पडा',
    },
    name: {
        en: 'Name',
        mr: 'नाव',
    },
    email: {
        en: 'Email',
        mr: 'ईमेल',
    },
    password: {
        en: 'Password',
        mr: 'पासवर्ड',
    },
    createAccount: {
        en: 'Create Account',
        mr: 'खाते तयार करा',
    },
    welcomeBack: {
        en: 'Welcome Back',
        mr: 'पुन्हा स्वागत आहे',
    },
    alreadyHaveAccount: {
        en: 'Already have an account?',
        mr: 'आधीपासून खाते आहे?',
    },
    dontHaveAccount: {
        en: "Don't have an account?",
        mr: 'खाते नाही?',
    },
    exploreMaharashtra: {
        en: 'Explore Maharashtra',
        mr: 'महाराष्ट्र एक्सप्लोर करा',
    },
    nearby: {
        en: 'Nearby',
        mr: 'जवळचे',
    },
    attractions: {
        en: 'Attractions',
        mr: 'आकर्षणे',
    },
    food: {
        en: 'Food',
        mr: 'जेवण',
    },
    stay: {
        en: 'Stay',
        mr: 'राहण्याची व्यवस्था',
    },
    evStations: {
        en: 'EV Charging Stations',
        mr: 'इव्ही चार्जिंग स्टेशन',
    },
    all: {
        en: 'All',
        mr: 'सर्व',
    },
    useMyLocation: {
        en: 'Use My Location',
        mr: 'माझी स्थान वापरा',
    },
    savedTrips: {
        en: 'Saved Trips',
        mr: 'जतन केलेल्या सहली',
    },
    myTrips: {
        en: 'My Trips',
        mr: 'माझ्या सहली',
    },
    preferences: {
        en: 'Preferences',
        mr: 'प्राधान्ये',
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        if (!translations[key]) return key;
        return translations[key][language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
