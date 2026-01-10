import React, { useState } from 'react';
import { Button } from '../components/Button';

import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, CheckCircle, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { generateItinerary } from '../utils/aiLogic';
import { useData } from '../context/DataContext';

export const Planner: React.FC = () => {
    const { user } = useAuth();
    const { addTrip } = useData();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        travelers: 1,
        budget: 'Medium',
        travelType: 'Normal' // New Field
    });
    const [aiPlan, setAiPlan] = useState<any>(null);

    const updateData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateTrip = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Simulate AI Processing
        setLoading(true);
        setTimeout(() => {
            const plan = generateItinerary(formData.destination, 2, formData.travelType as any);
            setAiPlan(plan);

            // Save Trip via Context (Updates State + LocalStorage)
            addTrip({
                ...formData,
                itinerary: plan
            });

            setLoading(false);
            setStep(4); // Move to Success/Review Step
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 min-h-[600px] flex flex-col">
                {/* Progress Bar */}
                <div className="bg-gray-100 h-2 w-full">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                <div className="p-8 flex-grow flex flex-col">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <h3 className="text-2xl font-bold text-slate-800">Asking AI to plan...</h3>
                            <p className="text-gray-500">Checking EV stations & food spots for you.</p>
                        </div>
                    ) : step === 4 ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-6 h-full flex flex-col justify-center items-center"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold">Trip Planned!</h2>
                            <div className="bg-slate-50 p-6 rounded-2xl text-left w-full border border-slate-100">
                                <p className="text-lg font-medium mb-2">🤖 AI Assistant says:</p>
                                <p className="text-slate-600 italic">"{aiPlan?.aiMessage}"</p>
                                <div className="mt-4 flex gap-2 flex-wrap">
                                    {aiPlan?.highlights.map((h: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-white border rounded-full text-xs font-medium text-slate-600 shadow-sm">{h}</span>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={() => navigate('/dashboard')} className="w-full">
                                Go to Dashboard
                            </Button>
                        </motion.div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-display font-bold mb-2">Plan Your Trip</h2>
                            <p className="text-gray-500 mb-8">Step {step} of 3</p>

                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-xl font-semibold">Where are you going?</h3>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                                                placeholder="e.g. Lonavala"
                                                value={formData.destination}
                                                onChange={e => updateData('destination', e.target.value)}
                                                autoFocus
                                            />
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            {['Mumbai', 'Pune', 'Nashik', 'Mahabaleshwar', 'Lonavala'].map(city => (
                                                <button
                                                    key={city}
                                                    onClick={() => updateData('destination', city)}
                                                    className={`px-4 py-2 rounded-full border text-sm transition-colors ${formData.destination === city
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {city}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-xl font-semibold">When & How?</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    value={formData.startDate}
                                                    onChange={e => updateData('startDate', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    value={formData.endDate}
                                                    onChange={e => updateData('endDate', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* EV Toggle */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Travel Mode</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => updateData('travelType', 'Normal')}
                                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.travelType === 'Normal' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-gray-200'
                                                        }`}
                                                >
                                                    <MapPin className={`w-8 h-8 ${formData.travelType === 'Normal' ? 'text-primary' : 'text-gray-400'}`} />
                                                    <span className="font-semibold">Normal</span>
                                                </button>
                                                <button
                                                    onClick={() => updateData('travelType', 'EV')}
                                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.travelType === 'EV' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-100 hover:border-gray-200'
                                                        }`}
                                                >
                                                    <Zap className={`w-8 h-8 ${formData.travelType === 'EV' ? 'text-green-500' : 'text-gray-400'}`} />
                                                    <span className="font-semibold">EV Travel</span>
                                                </button>
                                            </div>
                                            {formData.travelType === 'EV' && (
                                                <p className="text-xs text-green-600 mt-2 flex items-center">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> We'll include charging stops in your plan.
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-xl font-semibold">Review details</h3>
                                        <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="text-primary" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Destination</p>
                                                    <p className="font-bold">{formData.destination}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="text-primary" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Dates</p>
                                                    <p className="font-bold">{formData.startDate} to {formData.endDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {formData.travelType === 'EV' ? <Zap className="text-green-500" /> : <MapPin className="text-gray-500" />}
                                                <div>
                                                    <p className="text-sm text-gray-500">Mode</p>
                                                    <p className="font-bold">{formData.travelType === 'EV' ? 'Electric Vehicle (Green)' : 'Standard'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-auto pt-8 flex justify-between">
                                {step > 1 ? (
                                    <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                                    </Button>
                                ) : (
                                    <div></div>
                                )}

                                {step < 3 ? (
                                    <Button onClick={() => setStep(s => s + 1)} disabled={!formData.destination && step === 1}>
                                        Next <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleCreateTrip}>
                                        Generate Plan with AI <Zap className="ml-2 w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
