import React, { useState } from 'react';
import { MapPin, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

interface Place {
    _id: string;
    name: string;
    description: string;
    category: string;
    location: { city: string; lat?: number; lng?: number };
    images: string[];
    rating?: number;
    distance?: number;
}

interface PlaceCardProps {
    place: Place;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    const { toggleSavePlace, isSaved } = useData();
    const saved = isSaved(place._id);
    const [loading, setLoading] = useState(false);

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);

        setTimeout(() => {
            toggleSavePlace(place._id);
            setLoading(false);
        }, 200);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={place.images[0] || 'https://via.placeholder.com/400x300?text=Maharashtra'}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                {/* Badges */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30 uppercase tracking-wider">
                        {place.category === 'EV_Station' ? 'EV Station' : place.category}
                    </span>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`absolute top-4 right-4 p-2 backdrop-blur-md rounded-full transition-colors ${saved ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white hover:text-red-500'}`}
                >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>

                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold font-display leading-tight mb-1">{place.name}</h3>
                    <div className="flex items-center text-white/80 text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {place.location.city}
                    </div>
                </div>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between">
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {place.description}
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-slate-700">{place.rating?.toFixed(1) || '4.5'}</span>
                        {place.distance && (
                            <span className="text-xs text-slate-400 ml-2">• {place.distance.toFixed(1)} km</span>
                        )}
                    </div>
                    <button className="text-sm font-semibold text-primary group-hover:underline">
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
