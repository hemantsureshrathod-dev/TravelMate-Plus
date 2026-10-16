import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Wallet,
  Users,
  Printer,
  Sparkles,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { Trip, DayPlan, Activity } from '../types/trip';
import * as tripService from '../services/tripService';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Alert } from '../components/common/Alert';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    tripService
      .getTripById(id)
      .then((data) => setTrip(data))
      .catch((err) => setError(err.message || 'Failed to load trip details.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner label="Loading trip itinerary..." size="lg" />;
  }

  if (error || !trip) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <Alert type="error" title="Itinerary Not Available">
          {error || 'The requested trip could not be found.'}
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mt-4"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const currentDay = trip.days[activeDayIndex] || trip.days[0];

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'food':
        return 'amber';
      case 'nature':
        return 'emerald';
      case 'heritage':
        return 'blue';
      case 'relaxation':
        return 'slate';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DCE3E5]">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#6C7A80] hover:text-[#26333A]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Saved Trips</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print Itinerary
        </Button>
      </div>

      {/* Header Banner */}
      <Card className="p-6 sm:p-8 space-y-4 bg-white border-[#DCE3E5]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm">
                {trip.destination}
              </Badge>
              <Badge variant="emerald" size="sm">
                Saved Plan
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#26333A]">
              {trip.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#6C7A80] max-w-2xl leading-relaxed">
              {trip.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F3F5F4] border border-[#DCE3E5] shrink-0 text-left md:text-right space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#6C7A80] block">
              Estimated Total
            </span>
            <span className="text-2xl font-bold text-[#26333A]">
              ₹{(trip.estimatedTotalCost || trip.budget).toLocaleString('en-IN')}
            </span>
            <div className="text-xs text-[#6C7A80]">
              {trip.durationDays} Days • {trip.travellers} Travellers
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#DDE8EC]/40 border border-[#C5D7DF] text-xs text-[#26333A]">
          <ShieldAlert className="w-4 h-4 text-[#5E8CA6] shrink-0 mt-0.5" />
          <span>
            <strong>Travel Notice:</strong> Estimated times and costs in INR. Confirm local timings and monsoon travel advisories before departing.
          </span>
        </div>
      </Card>

      {/* Day Selector */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#DCE3E5]">
          {trip.days.map((day: DayPlan, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveDayIndex(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeDayIndex === idx
                  ? 'bg-[#5E8CA6] text-white border-[#5E8CA6] shadow-sm'
                  : 'bg-white text-[#6C7A80] border-[#DCE3E5] hover:bg-[#F3F5F4] hover:text-[#26333A]'
              }`}
            >
              <span>Day {day.dayNumber}</span>
              <span className={`text-[10px] ${activeDayIndex === idx ? 'text-white/80' : 'text-[#8F9FA5]'}`}>
                ({day.activities.length} stops)
              </span>
            </button>
          ))}
        </div>

        {/* Day Card */}
        {currentDay && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white border border-[#DCE3E5]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E8CA6]">
                Day {currentDay.dayNumber} Focus
              </span>
              <h2 className="text-lg font-bold text-[#26333A] mt-0.5">
                {currentDay.theme}
              </h2>
              {currentDay.dayNotes && (
                <p className="text-xs text-[#6C7A80] mt-1">{currentDay.dayNotes}</p>
              )}
            </div>

            {/* Activities */}
            <div className="space-y-3">
              {currentDay.activities.map((act: Activity, actIdx: number) => (
                <Card key={act.id || actIdx} className="p-5 border-[#DCE3E5]">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-[#F3F5F4] border border-[#DCE3E5] px-2.5 py-1.5 shrink-0 min-w-[70px]">
                      <Clock className="w-3.5 h-3.5 text-[#5E8CA6] mb-0.5" />
                      <span className="text-[11px] font-bold text-[#26333A] whitespace-nowrap">
                        {act.time}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[#26333A]">
                          {act.title}
                        </h3>
                        <Badge variant={getCategoryBadgeVariant(act.category) as any} size="sm">
                          {act.category}
                        </Badge>
                      </div>

                      <p className="text-xs sm:text-sm text-[#6C7A80] leading-relaxed">
                        {act.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#6C7A80]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#5E8CA6]" />
                          <span>{act.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#5E8CA6]" />
                          <span>{act.estimatedDuration}</span>
                        </span>
                        {act.estimatedCost > 0 && (
                          <span className="flex items-center gap-1 font-semibold text-[#26333A]">
                            <Wallet className="w-3.5 h-3.5 text-[#5E8CA6]" />
                            <span>₹{act.estimatedCost.toLocaleString('en-IN')} est.</span>
                          </span>
                        )}
                      </div>

                      {act.notes && (
                        <p className="text-[11px] text-[#5E8CA6] bg-[#DDE8EC]/30 px-2.5 py-1 rounded-md inline-block mt-1">
                          Tip: {act.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Advisory Notes */}
      {trip.notes && trip.notes.length > 0 && (
        <Card className="p-6 bg-white border-[#DCE3E5]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#26333A] mb-3">
            Practical Travel Notes
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#6C7A80]">
            {trip.notes.map((note: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#5E8CA6] font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
