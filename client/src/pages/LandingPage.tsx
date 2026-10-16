import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Compass, Calendar, ArrowRight, ShieldCheck, Check, Clock, Wallet } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Destination } from '../types/destination';
import * as destinationService from '../services/destinationService';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);
  const [quickDestination, setQuickDestination] = useState('');
  const [quickDays, setQuickDays] = useState(3);

  useEffect(() => {
    destinationService
      .getDestinations()
      .then((data) => setFeaturedDestinations(data.slice(0, 4)))
      .catch((err) => console.error('Failed to load featured destinations:', err));
  }, []);

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDestination) {
      navigate('/plan');
      return;
    }
    navigate(`/plan?destination=${encodeURIComponent(quickDestination)}&days=${quickDays}`);
  };

  return (
    <div className="space-y-24 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="blue" size="md" className="gap-1.5 py-1 px-3">
            <Sparkles className="w-3.5 h-3.5 text-[#5E8CA6]" />
            <span>AI-Driven Maharashtra Travel Planning</span>
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#26333A] leading-[1.15]">
            Plan Authentic Journeys with <span className="text-[#5E8CA6]">Scandinavian Clarity</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6C7A80] max-w-2xl leading-relaxed">
            Transform your travel interests, budget, and timing into practical, editable day-by-day itineraries using Google Gemini intelligence. Tailored specifically for Maharashtra & Indian road trips.
          </p>

          {/* Quick Planner Input Box */}
          <Card className="w-full max-w-2xl p-4 sm:p-5 mt-4 border-[#DCE3E5] shadow-lg shadow-[#5E8CA6]/5">
            <form onSubmit={handleQuickPlan} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E8CA6]" />
                <input
                  type="text"
                  placeholder="Where in Maharashtra? (e.g. Lonavala, Alibaug, Nashik)"
                  value={quickDestination}
                  onChange={(e) => setQuickDestination(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE3E5] bg-[#F3F5F4]/50 pl-10 pr-3 py-2.5 text-sm text-[#26333A] placeholder-[#8F9FA5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30 focus:border-[#5E8CA6]"
                />
              </div>

              <div className="relative w-full sm:w-36">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E8CA6]" />
                <select
                  value={quickDays}
                  onChange={(e) => setQuickDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#DCE3E5] bg-[#F3F5F4]/50 pl-10 pr-3 py-2.5 text-sm text-[#26333A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30 focus:border-[#5E8CA6]"
                >
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={4}>4 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:w-auto shrink-0"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Plan Itinerary
              </Button>
            </form>
          </Card>

          {/* Value signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-[#6C7A80]">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#5E8CA6]" />
              <span>Real Gemini AI Generation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#5E8CA6]" />
              <span>Persistent MongoDB Cloud Storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#5E8CA6]" />
              <span>Fully Editable Day Plans</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="slate" size="sm" className="mb-2">
              Curated Catalog
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#26333A]">
              Explore Western Ghats & Coastline
            </h2>
            <p className="text-sm text-[#6C7A80] mt-1">
              Carefully curated Maharashtra getaways with verified coordinates and local highlights.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/destinations')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All Destinations
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((dest) => (
            <Card
              key={dest.id}
              hoverable
              onClick={() => navigate(`/plan?destination=${encodeURIComponent(dest.name)}`)}
              className="p-0 overflow-hidden cursor-pointer flex flex-col group border-[#DCE3E5]"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#DDE8EC]">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="blue" size="sm" className="bg-white/90 backdrop-blur-xs font-semibold">
                    {dest.category.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-semibold text-base text-[#26333A] group-hover:text-[#5E8CA6] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[#6C7A80] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#5E8CA6]" />
                    <span>{dest.region}</span>
                  </p>
                  <p className="text-xs text-[#6C7A80] line-clamp-2 mt-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#DCE3E5] flex items-center justify-between text-xs text-[#6C7A80]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#5E8CA6]" />
                    <span>{dest.idealDurationDays} Days Ideal</span>
                  </span>
                  <span className="font-semibold text-[#26333A]">
                    ₹{dest.averageDailyBudgetINR.toLocaleString('en-IN')}/day
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-[#DCE3E5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <Badge variant="emerald" size="sm">
              Simple Workflow
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#26333A]">
              How TravelMate+ Transforms Your Travel
            </h2>
            <p className="text-sm text-[#6C7A80]">
              No generic templates. Every plan is generated from scratch to fit your exact budget, interests, and pace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col p-6 rounded-2xl bg-[#F3F5F4]/60 border border-[#DCE3E5] space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5E8CA6] text-white font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-semibold text-[#26333A]">Set Travel Preferences</h3>
              <p className="text-xs sm:text-sm text-[#6C7A80] leading-relaxed">
                Specify destination, duration, traveller count, budget in INR, desired travel pace, and interests like forts, food, or waterfalls.
              </p>
            </div>

            <div className="flex flex-col p-6 rounded-2xl bg-[#F3F5F4]/60 border border-[#DCE3E5] space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5E8CA6] text-white font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-semibold text-[#26333A]">Generate with Gemini AI</h3>
              <p className="text-xs sm:text-sm text-[#6C7A80] leading-relaxed">
                Our backend AI constructs an authentic schedule with estimated activity durations, local cuisine recommendations, and realistic transit buffers.
              </p>
            </div>

            <div className="flex flex-col p-6 rounded-2xl bg-[#F3F5F4]/60 border border-[#DCE3E5] space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5E8CA6] text-white font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-semibold text-[#26333A]">Edit, Save & Retrieve</h3>
              <p className="text-xs sm:text-sm text-[#6C7A80] leading-relaxed">
                Fine-tune activities, adjust costs or descriptions, and save directly to your account. Access your trips from any device whenever you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-linear-to-r from-[#26333A] to-[#364953] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-[#DDE8EC] font-semibold">
              Ready for your next weekend escape?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Create your custom Maharashtra itinerary in under 30 seconds
            </h2>
            <p className="text-xs sm:text-sm text-[#DCE3E5] leading-relaxed">
              No spreadsheets, no guesswork. Get structured timings, estimated expenses in INR, and practical local tips.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/plan')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Planning Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
