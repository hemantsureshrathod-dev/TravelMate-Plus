import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, MapPin, Bookmark, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DCE3E5] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5E8CA6] text-white shadow-sm transition-transform group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#26333A]">
              TravelMate<span className="text-[#5E8CA6] font-extrabold">+</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#6C7A80] -mt-1 font-medium">
              Maharashtra & Beyond
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/destinations"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
              isActive('/destinations')
                ? 'bg-[#DDE8EC] text-[#26333A]'
                : 'text-[#6C7A80] hover:text-[#26333A] hover:bg-[#F3F5F4]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#5E8CA6]" />
            <span>Destinations</span>
          </Link>

          <Link
            to="/plan"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
              isActive('/plan')
                ? 'bg-[#DDE8EC] text-[#26333A]'
                : 'text-[#6C7A80] hover:text-[#26333A] hover:bg-[#F3F5F4]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#5E8CA6]" />
            <span>AI Trip Planner</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/dashboard')
                  ? 'bg-[#DDE8EC] text-[#26333A]'
                  : 'text-[#6C7A80] hover:text-[#26333A] hover:bg-[#F3F5F4]'
              }`}
            >
              <Bookmark className="w-4 h-4 text-[#5E8CA6]" />
              <span>Saved Trips</span>
            </Link>
          )}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#F3F5F4] border border-[#DCE3E5]">
                <div className="w-6 h-6 rounded-full bg-[#5E8CA6] text-white flex items-center justify-center text-xs font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-medium text-[#26333A] max-w-[120px] truncate">
                  {user?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4 text-[#6C7A80]" />}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl p-2 text-[#6C7A80] hover:bg-[#F3F5F4] hover:text-[#26333A]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#DCE3E5] bg-white px-4 pt-2 pb-5 space-y-2">
          <Link
            to="/destinations"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#26333A] hover:bg-[#F3F5F4]"
          >
            <MapPin className="w-4 h-4 text-[#5E8CA6]" />
            <span>Explore Destinations</span>
          </Link>
          <Link
            to="/plan"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#26333A] hover:bg-[#F3F5F4]"
          >
            <Sparkles className="w-4 h-4 text-[#5E8CA6]" />
            <span>AI Trip Planner</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#26333A] hover:bg-[#F3F5F4]"
            >
              <Bookmark className="w-4 h-4 text-[#5E8CA6]" />
              <span>Saved Trips</span>
            </Link>
          )}

          <div className="pt-3 border-t border-[#DCE3E5]">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-1 text-xs text-[#6C7A80]">
                  <span>Signed in as</span>
                  <span className="font-semibold text-[#26333A]">{user?.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/register');
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
