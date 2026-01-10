import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { MapPin, Utensils, Zap, Compass, ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Home: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col w-full overflow-hidden">
            {/* Immersive Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
                    {/* Fallback Image if video fails or just use high quality image */}
                    <img
                        src="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=2670&auto=format&fit=crop"
                        alt="Maharashtra Landscape"
                        className="w-full h-full object-cover scale-105 animate-[pulse_20s_infinite_ease-in-out_alternate]"
                    />
                </div>

                <div className="relative z-20 px-4 max-w-5xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium mb-6 animate-fade-in">
                            ✨ Experience Incredible Maharashtra
                        </span>
                        <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 leading-tight tracking-tight drop-shadow-2xl">
                            {t('welcome')}
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-lg md:text-2xl mb-10 text-white/90 max-w-2xl font-light leading-relaxed drop-shadow-lg"
                    >
                        From the misty Sahyadri hills to the pristine Konkan coast.
                        Plan your perfect journey with AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                    >
                        <Link to="/planner">
                            <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-primary border-none">
                                {t('planTrip')}
                            </Button>
                        </Link>
                        <Link to="/explore">
                            <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg bg-white/10 backdrop-blur-md border border-white/40 text-white hover:bg-white/20 hover:scale-105 transition-transform">
                                {t('explore')}
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-white rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Why TravelMate+?</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">We combine cutting-edge AI with local expertise to build the ultimate travel companion.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                        {/* Feature 1 - Large */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 row-span-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Compass size={120} />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-center">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Compass className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">AI-Powered Planning</h3>
                                <p className="text-slate-500">Get personalized itineraries based on your budget, interests, and time. No more hours spent researching.</p>
                            </div>
                        </motion.div>

                        {/* Feature 2 - Tall */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-1 row-span-2 bg-gradient-to-br from-primary to-orange-500 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden"
                        >
                            <div className="absolute bottom-0 right-0 p-6 opacity-20">
                                <Utensils size={150} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-white">
                                    <Utensils className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Authentic Flavors</h3>
                                <p className="text-white/90 leading-relaxed mb-6">Discover the soul of Maharashtra through its food. From spicy Misal Pav in Pune to Konkani seafood.</p>
                                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold">Top Pick</span>
                                    </div>
                                    <p className="text-sm">"Shrorewadi Misal, Pune"</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">EV Friendly</h3>
                            </div>
                            <p className="text-slate-500 text-sm">Real-time location of charging stations across remote routes.</p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-4">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Hidden Gems</h3>
                            </div>
                            <p className="text-slate-500 text-sm">Explore uncrowded beaches, ancient forts, and secret waterfalls.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Ready to start your adventure?</h2>
                    <Link to="/signup">
                        <Button size="lg" className="rounded-full px-10 py-4 text-xl bg-white text-slate-900 hover:bg-gray-100">
                            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};
