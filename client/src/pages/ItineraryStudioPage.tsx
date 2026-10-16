import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Wallet,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  ArrowLeft,
  AlertCircle,
  Share2,
  Printer,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { DayPlan, Activity, ActivityCategory } from '../types/trip';
import * as tripService from '../services/tripService';

export const ItineraryStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [draft, setDraft] = useState<any | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit / Add Activity Modal state
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<{
    dayIndex: number;
    activityIndex?: number;
    activity: Partial<Activity>;
  } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('travelmate_current_draft');
    if (!stored) {
      navigate('/plan', { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setDraft(parsed);
      setEditedTitle(parsed.title || 'Maharashtra Journey');
    } catch {
      navigate('/plan', { replace: true });
    }
  }, [navigate]);

  if (!draft) return null;

  const currentDay: DayPlan = draft.days[activeDayIndex] || draft.days[0];

  // Recalculate total estimated cost
  const totalCost = draft.days.reduce((sum: number, day: DayPlan) => {
    return sum + day.activities.reduce((dSum, act) => dSum + (Number(act.estimatedCost) || 0), 0);
  }, 0);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      const updated = { ...draft, title: editedTitle.trim() };
      setDraft(updated);
      sessionStorage.setItem('travelmate_current_draft', JSON.stringify(updated));
    }
    setIsEditingTitle(false);
  };

  const handleDeleteActivity = (dayIdx: number, actIdx: number) => {
    const updatedDays = [...draft.days];
    updatedDays[dayIdx].activities.splice(actIdx, 1);
    const updated = { ...draft, days: updatedDays };
    setDraft(updated);
    sessionStorage.setItem('travelmate_current_draft', JSON.stringify(updated));
  };

  const handleOpenAddActivity = (dayIndex: number) => {
    setEditingActivity({
      dayIndex,
      activity: {
        id: `act-${Date.now()}`,
        time: '12:00 PM',
        title: '',
        description: '',
        location: draft.destination,
        estimatedDuration: '1.5 hours',
        estimatedCost: 200,
        category: 'sightseeing',
        notes: '',
      },
    });
    setActivityModalOpen(true);
  };

  const handleOpenEditActivity = (dayIndex: number, activityIndex: number) => {
    const act = draft.days[dayIndex].activities[activityIndex];
    setEditingActivity({
      dayIndex,
      activityIndex,
      activity: { ...act },
    });
    setActivityModalOpen(true);
  };

  const handleSaveActivityModal = () => {
    if (!editingActivity || !editingActivity.activity.title) return;

    const updatedDays = [...draft.days];
    const targetDay = updatedDays[editingActivity.dayIndex];

    const finalActivity: Activity = {
      id: editingActivity.activity.id || `act-${Date.now()}`,
      time: editingActivity.activity.time || '10:00 AM',
      title: editingActivity.activity.title,
      description: editingActivity.activity.description || '',
      location: editingActivity.activity.location || draft.destination,
      estimatedDuration: editingActivity.activity.estimatedDuration || '1 hour',
      estimatedCost: Number(editingActivity.activity.estimatedCost) || 0,
      category: (editingActivity.activity.category as ActivityCategory) || 'sightseeing',
      notes: editingActivity.activity.notes || '',
    };

    if (editingActivity.activityIndex !== undefined) {
      targetDay.activities[editingActivity.activityIndex] = finalActivity;
    } else {
      targetDay.activities.push(finalActivity);
    }

    const updated = { ...draft, days: updatedDays };
    setDraft(updated);
    sessionStorage.setItem('travelmate_current_draft', JSON.stringify(updated));
    setActivityModalOpen(false);
    setEditingActivity(null);
  };

  const handleSaveToMongoDB = async () => {
    setErrorMessage(null);
    if (!isAuthenticated) {
      // Prompt user to login
      navigate('/login', { state: { from: { pathname: '/studio' } } });
      return;
    }

    setIsSaving(true);
    try {
      const tripToSave = {
        title: draft.title,
        destination: draft.destination,
        startDate: draft.startDate || undefined,
        endDate: draft.endDate || undefined,
        durationDays: draft.durationDays || draft.days.length,
        travellers: draft.travellers || 1,
        budget: draft.budget || totalCost,
        currency: draft.currency || 'INR',
        interests: draft.interests || [],
        pace: draft.pace || 'moderate',
        transport: draft.transport || 'Mixed / Car',
        summary: draft.summary || '',
        days: draft.days,
        estimatedTotalCost: totalCost,
        notes: draft.notes || [],
        status: 'planned' as const,
      };

      await tripService.createTrip(tripToSave);
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save itinerary to database.');
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE3E5]">
        <button
          onClick={() => navigate('/plan')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#6C7A80] hover:text-[#26333A] self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Planner</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Itinerary
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveToMongoDB}
            isLoading={isSaving}
            leftIcon={saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          >
            {saveSuccess
              ? 'Saved to Dashboard!'
              : isAuthenticated
              ? 'Save Itinerary'
              : 'Sign in to Save'}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Alert type="error" title="Save Error">
          {errorMessage}
        </Alert>
      )}

      {/* Trip Overview Header */}
      <Card className="p-6 sm:p-8 space-y-5 bg-white border-[#DCE3E5]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm" className="gap-1">
                <Sparkles className="w-3 h-3 text-[#5E8CA6]" />
                <span>AI-Generated Plan</span>
              </Badge>
              <Badge variant="slate" size="sm">
                {draft.destination}
              </Badge>
            </div>

            {isEditingTitle ? (
              <div className="flex items-center gap-2 max-w-lg mt-1">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-2xl font-bold rounded-lg border border-[#5E8CA6] px-2.5 py-1 text-[#26333A] focus:outline-none"
                  autoFocus
                />
                <Button size="sm" variant="primary" onClick={handleSaveTitle}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#26333A]">
                  {draft.title}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-60 hover:opacity-100 p-1 rounded-md hover:bg-[#F3F5F4] transition-all text-[#6C7A80]"
                  title="Rename Trip"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#6C7A80] max-w-3xl leading-relaxed">
              {draft.summary}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 p-4 rounded-xl bg-[#F3F5F4] border border-[#DCE3E5] shrink-0">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6C7A80] block text-left sm:text-right">
                Estimated Total
              </span>
              <span className="text-xl font-bold text-[#26333A]">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-xs text-[#6C7A80] text-left sm:text-right space-y-0.5">
              <div>{draft.durationDays || draft.days.length} Days • {draft.travellers || 2} Travellers</div>
              <div className="capitalize font-medium text-[#5E8CA6]">{draft.pace || 'Moderate'} Pace</div>
            </div>
          </div>
        </div>

        {/* AI Disclaimer Alert */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#DDE8EC]/40 border border-[#C5D7DF] text-xs text-[#26333A]">
          <ShieldAlert className="w-4 h-4 text-[#5E8CA6] shrink-0 mt-0.5" />
          <span>
            <strong>AI Travel Estimates:</strong> Suggested times, entrance tickets, and road routes are intelligent estimates. Please verify seasonal ferry schedules, Ghat road conditions, and monsoon temple hours locally.
          </span>
        </div>
      </Card>

      {/* Day by Day Studio Section */}
      <div className="space-y-6">
        {/* Day selection tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#DCE3E5]">
          {draft.days.map((day: DayPlan, idx: number) => (
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
              <span className={`text-[10px] font-normal ${activeDayIndex === idx ? 'text-white/80' : 'text-[#8F9FA5]'}`}>
                ({day.activities.length} stops)
              </span>
            </button>
          ))}
        </div>

        {/* Current Active Day Plan */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#DCE3E5]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E8CA6]">
                Day {currentDay.dayNumber} Theme
              </span>
              <h2 className="text-lg font-bold text-[#26333A] mt-0.5">
                {currentDay.theme}
              </h2>
              {currentDay.dayNotes && (
                <p className="text-xs text-[#6C7A80] mt-1">{currentDay.dayNotes}</p>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpenAddActivity(activeDayIndex)}
              leftIcon={<Plus className="w-4 h-4 text-[#5E8CA6]" />}
            >
              Add Activity
            </Button>
          </div>

          {/* Activity Cards List */}
          <div className="space-y-3">
            {currentDay.activities.map((act: Activity, actIdx: number) => (
              <Card
                key={act.id || actIdx}
                className="p-5 border-[#DCE3E5] hover:border-[#5E8CA6]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Time pill */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-[#F3F5F4] border border-[#DCE3E5] px-2.5 py-1.5 shrink-0 text-center min-w-[70px]">
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

                  {/* Edit / Delete actions */}
                  <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
                    <button
                      onClick={() => handleOpenEditActivity(activeDayIndex, actIdx)}
                      className="p-1.5 rounded-lg text-[#6C7A80] hover:text-[#26333A] hover:bg-[#F3F5F4] transition-colors"
                      title="Edit Activity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activeDayIndex, actIdx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Remove Activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Travel Notes & Tips */}
      {draft.notes && draft.notes.length > 0 && (
        <Card className="p-6 bg-white border-[#DCE3E5]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#26333A] mb-3">
            Practical Road & Travel Advice
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#6C7A80]">
            {draft.notes.map((note: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#5E8CA6] font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Edit / Add Activity Modal */}
      {activityModalOpen && editingActivity && (
        <Modal
          isOpen={activityModalOpen}
          onClose={() => setActivityModalOpen(false)}
          title={editingActivity.activityIndex !== undefined ? 'Edit Activity' : 'Add Activity'}
          description={`Day ${draft.days[editingActivity.dayIndex].dayNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Input
              label="Activity Title"
              value={editingActivity.activity.title || ''}
              onChange={(e) =>
                setEditingActivity({
                  ...editingActivity,
                  activity: { ...editingActivity.activity, title: e.target.value },
                })
              }
              placeholder="e.g. Karla Caves Exploration"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Timing"
                value={editingActivity.activity.time || ''}
                onChange={(e) =>
                  setEditingActivity({
                    ...editingActivity,
                    activity: { ...editingActivity.activity, time: e.target.value },
                  })
                }
                placeholder="e.g. 10:30 AM"
              />

              <Input
                label="Duration"
                value={editingActivity.activity.estimatedDuration || ''}
                onChange={(e) =>
                  setEditingActivity({
                    ...editingActivity,
                    activity: { ...editingActivity.activity, estimatedDuration: e.target.value },
                  })
                }
                placeholder="e.g. 2 hours"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Location"
                value={editingActivity.activity.location || ''}
                onChange={(e) =>
                  setEditingActivity({
                    ...editingActivity,
                    activity: { ...editingActivity.activity, location: e.target.value },
                  })
                }
                placeholder="Attraction or landmark area"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                  Category
                </label>
                <select
                  value={editingActivity.activity.category || 'sightseeing'}
                  onChange={(e) =>
                    setEditingActivity({
                      ...editingActivity,
                      activity: { ...editingActivity.activity, category: e.target.value as any },
                    })
                  }
                  className="w-full rounded-xl border border-[#DCE3E5] bg-white px-3 py-2 text-sm text-[#26333A] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30"
                >
                  <option value="sightseeing">Sightseeing</option>
                  <option value="food">Food & Dining</option>
                  <option value="nature">Nature & Outdoors</option>
                  <option value="heritage">Heritage & History</option>
                  <option value="transport">Transit & Drive</option>
                  <option value="relaxation">Relaxation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                Estimated Cost (₹ INR)
              </label>
              <input
                type="number"
                min={0}
                value={editingActivity.activity.estimatedCost || 0}
                onChange={(e) =>
                  setEditingActivity({
                    ...editingActivity,
                    activity: { ...editingActivity.activity, estimatedCost: Number(e.target.value) },
                  })
                }
                className="w-full rounded-xl border border-[#DCE3E5] bg-white px-3 py-2 text-sm text-[#26333A] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C7A80] mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={editingActivity.activity.description || ''}
                onChange={(e) =>
                  setEditingActivity({
                    ...editingActivity,
                    activity: { ...editingActivity.activity, description: e.target.value },
                  })
                }
                placeholder="What to do, see, and enjoy here..."
                className="w-full rounded-xl border border-[#DCE3E5] bg-white px-3 py-2 text-sm text-[#26333A] focus:outline-none focus:ring-2 focus:ring-[#5E8CA6]/30"
              />
            </div>

            <div className="pt-4 border-t border-[#DCE3E5] flex justify-end gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setActivityModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSaveActivityModal}
              >
                Save Activity
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
