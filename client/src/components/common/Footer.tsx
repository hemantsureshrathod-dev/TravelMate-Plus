import React from 'react';
import { Compass, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#DCE3E5] bg-white text-[#6C7A80] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Purpose */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5E8CA6] text-white">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-[#26333A]">TravelMate+</span>
          </div>
          <p className="text-xs leading-relaxed text-[#6C7A80]">
            AI-powered travel planning calibrated for Maharashtra, the Western Ghats, Konkan coastline, and heritage corridors.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8F9FA5] pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5E8CA6]" />
            <span>Structured Gemini 1.5/2.0 API & MongoDB</span>
          </div>
        </div>

        {/* Discover Destinations */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#26333A] mb-3">
            Maharashtra Regions
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/destinations?category=hill_station" className="hover:text-[#5E8CA6] transition-colors">Sahyadri Hill Stations</Link></li>
            <li><Link to="/destinations?category=coastal" className="hover:text-[#5E8CA6] transition-colors">Konkan Coast & Sea Forts</Link></li>
            <li><Link to="/destinations?category=heritage" className="hover:text-[#5E8CA6] transition-colors">Ajanta & Ellora World Heritage</Link></li>
            <li><Link to="/destinations?category=wildlife" className="hover:text-[#5E8CA6] transition-colors">Tadoba Tiger Reserve Safari</Link></li>
            <li><Link to="/destinations?category=spiritual" className="hover:text-[#5E8CA6] transition-colors">Nashik & Trimbakeshwar</Link></li>
          </ul>
        </div>

        {/* Planning Tools */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#26333A] mb-3">
            Planning Studio
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/plan" className="hover:text-[#5E8CA6] transition-colors">AI Itinerary Generator</Link></li>
            <li><Link to="/destinations" className="hover:text-[#5E8CA6] transition-colors">Interactive Map Explorer</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#5E8CA6] transition-colors">My Saved Trips</Link></li>
            <li><Link to="/register" className="hover:text-[#5E8CA6] transition-colors">Create Free Account</Link></li>
          </ul>
        </div>

        {/* Legal & Disclaimers */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#26333A] mb-3">
            Advisories
          </h4>
          <p className="text-xs text-[#8F9FA5] leading-relaxed">
            All AI-generated itineraries, costs, and durations are estimates. Travellers are advised to verify timings, forest permits, seasonal ferry schedules, and local weather before traveling.
          </p>
          <p className="text-[11px] text-[#8F9FA5] pt-2">
            © {new Date().getFullYear()} TravelMate+. Designed with Scandinavian clarity.
          </p>
        </div>
      </div>
    </footer>
  );
};
