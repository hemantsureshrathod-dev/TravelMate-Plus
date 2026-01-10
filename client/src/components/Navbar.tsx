import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, User as UserIcon, LogOut, ChevronRight, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'mr' : 'en');
    };

    const getNavLinks = () => {
        const links = [
            { name: t('explore'), path: '/explore' },
            { name: t('planTrip'), path: '/planner' },
        ];
        if (user) {
            links.push({ name: t('dashboard'), path: '/dashboard' });
        }
        return links;
    };

    const navLinks = getNavLinks();

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-primary to-accent p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                            <MapPin className="h-6 w-6" strokeWidth={3} />
                        </div>
                        <span className={`font-display font-bold text-2xl tracking-tighter ${scrolled ? 'text-slate-800' : 'text-slate-800 lg:text-white'
                            }`}>
                            TravelMate<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 font-extrabold">+</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${scrolled || location.pathname !== '/' ? 'text-slate-600' : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <button
                            onClick={toggleLanguage}
                            className={`flex items-center gap-1 text-sm font-medium transition-colors ${scrolled || location.pathname !== '/' ? 'text-slate-600 hover:text-primary' : 'text-white/90 hover:text-white'
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            {language === 'en' ? 'मराठी' : 'English'}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-teal-400 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/50">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`text-sm font-medium hidden lg:block ${scrolled || location.pathname !== '/' ? 'text-slate-700' : 'text-white'
                                        }`}>
                                        {user.name.split(' ')[0]}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className={!scrolled && location.pathname === '/' ? 'text-white hover:bg-white/10' : ''}
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className={!scrolled && location.pathname === '/' ? 'text-white hover:bg-white/10' : ''}>
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow">
                                        {t('signup')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-md ${scrolled || location.pathname !== '/' ? 'text-slate-800' : 'text-white'
                                }`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 absolute top-full left-0 right-0 shadow-xl overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between text-lg font-medium text-slate-800 p-2 rounded-xl hover:bg-gray-50 mb-2"
                                >
                                    {link.name}
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </Link>
                            ))}
                            <button
                                onClick={() => { toggleLanguage(); setIsOpen(false); }}
                                className="w-full flex items-center justify-between text-lg font-medium text-slate-800 p-2 rounded-xl hover:bg-gray-50"
                            >
                                Change to {language === 'en' ? 'Marathi' : 'English'}
                                <Globe className="w-5 h-5 text-gray-400" />
                            </button>

                            <div className="h-px bg-gray-100 my-4" />

                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-2">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Button fullWidth variant="outline" onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-500 border-red-200 hover:bg-red-50">
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button fullWidth variant="outline">Login</Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                                        <Button fullWidth>Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
