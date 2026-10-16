import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  Wallet,
  Trash2,
  ExternalLink,
  Plus,
  Sparkles,
  AlertCircle,
  Users,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Trip } from '../types/trip';
import * as tripService from '../services/tripService';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Alert } from '../components/common/Alert';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion modal state
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tripService.getTrips();
      setTrips(data);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve your saved trips.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    try {
      await tripService.deleteTrip(tripToDelete.id);
      setTrips(trips.filter((t) => t.id !== tripToDelete.id));
      setTripToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete trip.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics
  const totalDays = trips.reduce((sum, t) => sum + (t.durationDays || 0), 0);
  const totalBudget = trips.reduce((sum, t) => sum + (t.estimatedTotalCost || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DCE3E5]">
        <div>
          <Badge variant="blue" size="sm" className="mb-2">
            Personal Itinerary Vault
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-[#26333A]">
            Welcome, {user?.name || 'Traveller'}
          </h1>
          <p className="text-sm text-[#6C7A80] mt-1">
            Manage your AI-crafted journeys across Maharashtra. Saved directly to your secure cloud database.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/plan')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Plan New Trip
        </Button>
      </div>

      {error && (
        <Alert type="error" title="Error">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={fetchTrips} className="mt-2">
            Retry
          </Button>
        </Alert>
      )}

      {/* Metrics Row */}
      {trips.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#DDE8EC] text-[#5E8CA6] flex items-center justify-center shrink-0">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#6C7A80] block">
                Total Saved Trips
              </span>
              <span className="text-2xl font-bold text-[#26333A]">{trips.length}</span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#E2F0EA] text-[#2D6650] flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#6C7A80] block">
                Days Planned
              </span>
              <span className="text-2xl font-bold text-[#26333A]">{totalDays} Days</span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#F9EFE4] text-[#8C5D29] flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#6C7A80] block">
                Total Itinerary Budget
              </span>
              <span className="text-2xl font-bold text-[#26333A]">
                ₹{totalBudget.toLocaleString('en-IN')}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Trips Grid or Empty State */}
      {isLoading ? (
        <LoadingSpinner label="Retrieving your saved itineraries from MongoDB..." size="lg" />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={<Compass className="w-8 h-8 text-[#5E8CA6]" />}
          title="No itineraries saved yet"
          description="You haven't saved any trips yet. Generate an AI itinerary tailored to your interests and budget to get started."
          actionLabel="Create Your First Trip"
          onAction={() => navigate('/plan')}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#26333A]">Your Saved Trips</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                hoverable
                className="p-5 flex flex-col justify-between space-y-4 border-[#DCE3E5]"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="blue" size="sm">
                      {trip.destination}
                    </Badge>
                    <span className="text-[11px] text-[#8F9FA5]">
                      {new Date(trip.updatedAt || trip.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#26333A] line-clamp-1">
                    {trip.title}
                  </h3>

                  <p className="text-xs text-[#6C7A80] line-clamp-2 leading-relaxed">
                    {trip.summary || `A ${trip.durationDays}-day curated plan for ${trip.destination}.`}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[#6C7A80] border-t border-[#DCE3E5]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#5E8CA6]" />
                      <span>{trip.durationDays} Days ({trip.days?.length || 0} stages)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#5E8CA6]" />
                      <span>{trip.travellers || 1} Travellers</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#6C7A80]">Estimated Cost:</span>
                    <span className="font-bold text-[#26333A]">
                      ₹{(trip.estimatedTotalCost || trip.budget).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DCE3E5] flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="flex-1 justify-center text-xs"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    View Plan
                  </Button>

                  <button
                    onClick={() => setTripToDelete(trip)}
                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <Modal
          isOpen={!!tripToDelete}
          onClose={() => setTripToDelete(null)}
          title="Delete Saved Trip"
          description="Are you sure you want to permanently delete this itinerary?"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#6C7A80]">
              This will remove <strong>"{tripToDelete.title}"</strong> ({tripToDelete.destination}) from your account. This action cannot be undone.
            </p>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTripToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteTrip}
                isLoading={isDeleting}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
