import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Gauge,
  Car,
  Compass,
  ArrowRight,
  Info,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { ItineraryGenerationInput } from '../types/trip';
import * as aiService from '../services/aiService';

const AVAILABLE_INTERESTS = [
  'Sahyadri Nature',
  'Ancient Forts & Maratha History',
  'Authentic Maharashtra Cuisine',
  'Konkan Beaches',
  'Monsoon Waterfalls',
  'Sacred Temples & Ghats',
  'Wildlife Safaris',
  'Vineyard Tours',
  'Peaceful Relaxation',
];

const POPULAR_DESTINATIONS = [
  'Lonavala & Khandala',
  'Mahabaleshwar & Panchgani',
  'Alibaug & Kashid',
  'Ajanta & Ellora Caves',
  'Nashik & Trimbakeshwar',
  'Tadoba Tiger Reserve',
  'Kolhapur',
  'Matheran',
];

export const TripPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [durationDays, setDurationDays] = useState(
    Number(searchParams.get('days')) || 3
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travellers, setTravellers] = useState(2);
  const [budget, setBudget] = useState(15000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Sahyadri Nature',
    'Authentic Maharashtra Cuisine',
  ]);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'fast'>('moderate');
  const [transport, setTransport] = useState('Private Car / Taxi');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  // Sync dates with duration
  useEffect(() => {
    if (startDate && durationDays) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + durationDays - 1);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, durationDays]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!destination.trim()) {
      setError({ message: 'Please specify a destination or region.' });
      return;
    }

    if (durationDays < 1 || durationDays > 14) {
      setError({ message: 'Trip duration must be between 1 and 14 days.' });
      return;
    }

    if (budget < 500) {
      setError({ message: 'Budget must be at least ₹500.' });
      return;
    }

    const payload: ItineraryGenerationInput = {
      destination: destination.trim(),
      durationDays,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      travellers,
      budget,
      currency: 'INR',
      interests: selectedInterests,
      pace,
      transport,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    setIsLoading(true);
    setGenerationStep('Analyzing destination terrain and road travel times...');

    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Curating authentic sightseeing stops, local food, and timing...');
    }, 2000);

    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Formatting structured day-by-day itinerary with estimated INR costs...');
    }, 4500);

    try {
      const response = await aiService.generateItinerary(payload);

      // Store generated draft in sessionStorage for the studio
      sessionStorage.setItem(
        'travelmate_current_draft',
        JSON.stringify({
          ...response.itinerary,
          startDate,
          endDate,
          travellers,
          budget,
          pace,
          transport,
          interests: selectedInterests,
        })
      );

      navigate('/studio');
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to generate itinerary. Please try again.',
        code: err.code,
      });
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <Badge variant="blue" size="md" className="gap-1.5 py-1 px-3">
          <Sparkles className="w-3.5 h-3.5 text-[#5E8CA6]" />
          <span>Google Gemini Travel Intelligence</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#26333A]">
          Create Your Personalized Itinerary
        </h1>
        <p className="text-sm text-[#6C7A80] max-w-xl mx-auto leading-relaxed">
          Configure your travel parameters below. Our AI engine builds an authentic schedule with realistic timings and budget estimates.
        </p>
      </div>

      {error && (
        <Alert type="error" title="Generation Issue">
          <p className="mb-1">{error.message}</p>
          {error.code === 'API_KEY_MISSING' && (
            <p className="text-xs text-rose-800">
              Note: A Google Gemini API key must be set in <code className="bg-rose-100 px-1 py-0.5 rounded">server/.env</code>.
            </p>
          )}
        </Alert>
      )}

      {/* Generation progress loading card */}
      {isLoading ? (
        <Card className="p-10 text-center space-y-6 border-[#5E8CA6]/30 shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#DDE8EC] border-t-[#5E8CA6] animate-spin" />
              <Compass className="w-7 h-7 text-[#5E8CA6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#26333A]">
                Crafting Your Custom Itinerary
              </h3>
              <p className="text-xs sm:text-sm text-[#5E8CA6] font-medium animate-pulse">
                {generationStep}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F3F5F4] border border-[#DCE3E5] text-left text-xs text-[#6C7A80] max-w-md mx-auto space-y-1">
            <span className="font-semibold text-[#26333A] block">Maharashtra Road Tip:</span>
            <span>Ghat roads (Khandala, Amboli, Varandha) typically require 25-30% extra transit time during monsoon and peak weekend hours.</span>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Destination Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5E8CA6]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#26333A]">
                  1. Destination & Region
                </h3>
              </div>

              <Input
                placeholder="e.g. Lonavala & Khandala, Alibaug, Mahabaleshwar, Nashik..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-[#6C7A80] mr-1">Popular:</span>
                {POPULAR_DESTINATIONS.map((pop) => (
                  <button
                    key={pop}
                    type="button"
                    onClick={() => setDestination(pop)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F3F5F4] hover:bg-[#DDE8EC] text-[#26333A] border border-[#DCE3E5] transition-colors"
                  >
                    {pop}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dates & Duration */}
            <div className="space-y-3 pt-4 border-t border-[#DCE3E5]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#5E8CA6]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#26333A]">
                  2. Duration & Schedule
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                    Duration (Days)
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#DCE3E5] bg-white px-3.5 py-2.5 text-sm text-[#26333A] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30 focus:border-[#5E8CA6]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 14].map((d) => (
                      <option key={d} value={d}>
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE3E5] bg-white px-3.5 py-2 text-sm text-[#26333A] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30 focus:border-[#5E8CA6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                    End Date (Auto-calculated)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    readOnly
                    className="w-full rounded-xl border border-[#DCE3E5] bg-[#F3F5F4] px-3.5 py-2 text-sm text-[#6C7A80] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 3. Travellers & Budget */}
            <div className="space-y-3 pt-4 border-t border-[#DCE3E5]">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#5E8CA6]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#26333A]">
                  3. Group Size & Budget (INR)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                    Number of Travellers
                  </label>
                  <select
                    value={travellers}
                    onChange={(e) => setTravellers(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#DCE3E5] bg-white px-3.5 py-2.5 text-sm text-[#26333A] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30 focus:border-[#5E8CA6]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15].map((t) => (
                      <option key={t} value={t}>
                        {t} {t === 1 ? 'Traveller (Solo)' : t === 2 ? 'Travellers (Couple)' : 'Travellers (Group)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                    Total Estimated Budget (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6C7A80]">
                      ₹
                    </span>
                    <input
                      type="number"
                      step={500}
                      min={500}
                      max={1000000}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#DCE3E5] bg-white pl-8 pr-3.5 py-2.5 text-sm text-[#26333A] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30 focus:border-[#5E8CA6]"
                    />
                  </div>
                  <p className="text-[11px] text-[#6C7A80] mt-1">
                    ≈ ₹{Math.round(budget / (durationDays * travellers)).toLocaleString('en-IN')} / person / day
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Interests & Style */}
            <div className="space-y-3 pt-4 border-t border-[#DCE3E5]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#5E8CA6]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#26333A]">
                    4. Interests & Highlights
                  </h3>
                </div>
                <span className="text-xs text-[#6C7A80]">
                  Select all that inspire you
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isChecked = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        isChecked
                          ? 'border-[#5E8CA6] bg-[#DDE8EC]/40 font-semibold text-[#26333A] shadow-xs'
                          : 'border-[#DCE3E5] bg-white text-[#6C7A80] hover:bg-[#F3F5F4]'
                      }`}
                    >
                      <span className="pr-1">{interest}</span>
                      {isChecked && (
                        <Check className="w-4 h-4 text-[#5E8CA6] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Pace & Transport */}
            <div className="space-y-3 pt-4 border-t border-[#DCE3E5]">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#5E8CA6]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#26333A]">
                  5. Travel Pace & Mode
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                    Preferred Pace
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'relaxed', label: 'Relaxed', desc: '2-3 stops/day' },
                      { id: 'moderate', label: 'Moderate', desc: '3-4 stops/day' },
                      { id: 'fast', label: 'Fast-paced', desc: '4-5 stops/day' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPace(p.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          pace === p.id
                            ? 'border-[#5E8CA6] bg-[#DDE8EC]/50 font-bold text-[#26333A]'
                            : 'border-[#DCE3E5] bg-white text-[#6C7A80] hover:bg-[#F3F5F4]'
                        }`}
                      >
                        <div className="text-xs">{p.label}</div>
                        <div className="text-[10px] text-[#6C7A80] font-normal">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                    Transport Preference
                  </label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE3E5] bg-white px-3.5 py-2.5 text-sm text-[#26333A] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30 focus:border-[#5E8CA6]"
                  >
                    <option value="Private Car / Self Drive">Private Car / Self Drive</option>
                    <option value="Hired Outstation Taxi">Hired Outstation Taxi</option>
                    <option value="MSRTC State Bus / Public Transit">MSRTC Bus / Public Transit</option>
                    <option value="Indian Railways Train + Local Auto">Train + Local Auto</option>
                    <option value="Motorcycle Touring">Motorcycle Road Trip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                  Special Instructions or Dietary Needs (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={400}
                  placeholder="e.g., Pure vegetarian food, travelling with senior citizens (avoid difficult stair climbs), interested in authentic Misal Pav spots..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE3E5] bg-white px-3.5 py-2.5 text-sm text-[#26333A] placeholder-[#8F9FA5] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30 focus:border-[#5E8CA6]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-[#DCE3E5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-[#6C7A80]">
                <Info className="w-4 h-4 text-[#5E8CA6]" />
                <span>You can review and edit every activity before saving to your profile.</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<Sparkles className="w-5 h-5" />}
              >
                Generate Itinerary with AI
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
