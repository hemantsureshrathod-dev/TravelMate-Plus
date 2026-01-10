import React, { useEffect, useState } from 'react';
import { PlaceCard } from '../components/PlaceCard';
import { useData } from '../context/DataContext';
import { Button } from '../components/Button';
import { Loader, MapPin, Navigation, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

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

export const Explore: React.FC = () => {
    const { user } = useAuth();
    const { language, t } = useLanguage();
    const { getPlacesByCity } = useData();

    // Default to 'All' or user query
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);

    // Get parameters from URL if any
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const cityFilter = searchParams.get('city');

    useEffect(() => {
        fetchPlaces();
    }, [filter, cityFilter, searchQuery]);

    const fetchPlaces = async () => {
        setLoading(true);
        try {
            setTimeout(() => {
                // Get Base Places (filtered by city if applicable)
                let data = getPlacesByCity(cityFilter || 'All');

                // Apply Category Filter
                if (filter !== 'All') {
                    data = data.filter((p: any) => p.category === filter);
                }

                // Apply Search Filter
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    data = data.filter((p: any) =>
                        p.name.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q) ||
                        p.location.city.toLowerCase().includes(q)
                    );
                }

                setPlaces(data);
                setLoading(false);
            }, 300);
        } catch (error) {
            console.error('Failed to fetch places');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-slate-900">
                            {cityFilter ? `Exploring ${cityFilter}` : t('explore')}
                        </h1>
                        <p className="text-slate-500 mt-2">Discover the best places, food, and stays.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search places, cities..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Attraction', 'Food', 'Stay', 'EV_Station'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all border ${filter === cat
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                                    : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat === 'EV_Station' ? '🔌 EV Stations' : cat}
                        </button>
                    ))}
                </div>

                {/* Places Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : places.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {places.map((place) => (
                            <div key={place._id} className="h-96">
                                <PlaceCard place={place} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No places found</h3>
                        <p className="text-gray-500">Try changing your search or filters.</p>
                        <Button variant="outline" className="mt-4" onClick={() => { setFilter('All'); setSearchQuery(''); }}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
