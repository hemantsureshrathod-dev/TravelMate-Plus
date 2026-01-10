import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Map, Calendar, Heart, Plus, Zap, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { trips, savedPlaces, stats, deleteTrip } = useData();
    // No local state needed for trips/savedPlaces anymore as they come from Context

    const handleDeleteTrip = (id: string) => {
        if (confirm('Delete this trip?')) {
            deleteTrip(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-display font-bold text-slate-900">
                            Hello, {user?.name?.split(' ')[0] || 'Traveler'}! 👋
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Your adventure dashboard.</p>
                    </motion.div>

                    <Link to="/planner">
                        <Button className="rounded-full px-6 py-3 shadow-lg shadow-primary/20">
                            <Plus className="w-5 h-5 mr-2" /> Plan New Trip
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        icon={<Map className="w-6 h-6 text-blue-600" />}
                        label="Total Trips"
                        value={stats.totalTrips}
                        color="bg-blue-50"
                    />
                    <StatsCard
                        icon={<Heart className="w-6 h-6 text-pink-600" />}
                        label="Saved Places"
                        value={stats.savedCount}
                        color="bg-pink-50"
                    />
                    <StatsCard
                        icon={<Zap className="w-6 h-6 text-green-600" />}
                        label="EV Km Planned"
                        value={stats.evKm} // Mock calculation
                        unit=" km"
                        color="bg-green-50"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* My Trips */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-primary" /> My Trips
                        </h2>

                        {trips.length > 0 ? (
                            <div className="space-y-4">
                                {trips.map((trip, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trip.travelType === 'EV' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {trip.travelType === 'EV' ? <Zap /> : <Map />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{trip.destination}</h3>
                                                <p className="text-sm text-gray-500">{trip.startDate} - {trip.endDate}</p>
                                                {trip.travelType === 'EV' && (
                                                    <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded mt-1">
                                                        <Zap className="w-3 h-3 mr-1" /> EV Trip
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTrip(trip._id || trip.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 text-center">
                                <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">No trips planned yet.</p>
                                <Link to="/planner">
                                    <Button variant="outline">Start Planning</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Saved Places */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Heart className="w-6 h-6 text-pink-500" /> Saved Places
                        </h2>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
                            {savedPlaces.length > 0 ? (
                                <div className="space-y-4">
                                    {savedPlaces.map((place, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <img src={place.images[0]} alt={place.name} className="w-16 h-16 rounded-xl object-cover" />
                                            <div>
                                                <h4 className="font-bold text-sm">{place.name}</h4>
                                                <p className="text-xs text-gray-500">{place.location.city}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    <p>No favorites yet.</p>
                                    <Link to="/explore" className="text-primary text-sm hover:underline mt-2 inline-block">Explore Now</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ icon, label, value, unit = '', color }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4"
    >
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-3xl font-display font-bold text-slate-900">{value}{unit}</p>
        </div>
    </motion.div>
);
