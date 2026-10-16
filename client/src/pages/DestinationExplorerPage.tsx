import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, Wallet, Map as MapIcon, Grid, Sparkles, X, Compass, ExternalLink } from 'lucide-react';
import { Destination, DestinationCategory } from '../types/destination';
import * as destinationService from '../services/destinationService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { LeafletMap } from '../components/maps/LeafletMap';

export const DestinationExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory>(
    (searchParams.get('category') as DestinationCategory) || 'all'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  useEffect(() => {
    setIsLoading(true);
    destinationService
      .getDestinations({
        search: searchQuery,
        category: selectedCategory,
      })
      .then((data) => setDestinations(data))
      .catch((err) => console.error('Failed to load destinations:', err))
      .finally(() => setIsLoading(false));
  }, [searchQuery, selectedCategory]);

  const handleCategorySelect = (cat: DestinationCategory) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handlePlanForDestination = (dest: Destination) => {
    navigate(`/plan?destination=${encodeURIComponent(dest.name)}&days=${dest.idealDurationDays}`);
  };

  const categories: Array<{ id: DestinationCategory; label: string }> = [
    { id: 'all', label: 'All Destinations' },
    { id: 'hill_station', label: 'Hill Stations' },
    { id: 'coastal', label: 'Coastal & Beaches' },
    { id: 'heritage', label: 'Heritage & Caves' },
    { id: 'wildlife', label: 'Wildlife & Safaris' },
    { id: 'spiritual', label: 'Spiritual & Ghats' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="blue" size="sm" className="mb-2">
            Maharashtra & Indian Corridors
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-[#26333A]">
            Destination Explorer
          </h1>
          <p className="text-sm text-[#6C7A80] mt-1 max-w-2xl">
            Curated destinations across the Western Ghats, Konkan coastline, and ancient Deccan plateau with verified highlights and travel metrics.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#DDE8EC]/60 rounded-xl border border-[#DCE3E5] self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[#26333A] shadow-xs'
                : 'text-[#6C7A80] hover:text-[#26333A]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'map'
                ? 'bg-white text-[#26333A] shadow-xs'
                : 'text-[#6C7A80] hover:text-[#26333A]'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by city, region, tags (e.g. waterfalls, caves, seafood)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[#6C7A80]" />}
              rightIcon={
                searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 hover:text-[#26333A]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : undefined
              }
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-[#5E8CA6] text-white border-[#5E8CA6]'
                  : 'bg-white text-[#6C7A80] border-[#DCE3E5] hover:bg-[#F3F5F4] hover:text-[#26333A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content View */}
      {isLoading ? (
        <LoadingSpinner label="Loading curated destinations..." size="lg" />
      ) : destinations.length === 0 ? (
        <EmptyState
          icon={<Compass className="w-8 h-8 text-[#5E8CA6]" />}
          title="No destinations match your filters"
          description="Try clearing your search terms or selecting another category to see Maharashtra highlights."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      ) : viewMode === 'map' ? (
        <div className="space-y-6">
          <LeafletMap
            destinations={destinations}
            selectedDestination={selectedDestination}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            className="h-[520px]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDestination(d)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedDestination?.id === d.id
                    ? 'border-[#5E8CA6] bg-[#DDE8EC]/30 ring-1 ring-[#5E8CA6]'
                    : 'border-[#DCE3E5] bg-white hover:border-[#5E8CA6]/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm text-[#26333A]">{d.name}</h4>
                    <p className="text-xs text-[#6C7A80]">{d.region}</p>
                  </div>
                  <Badge variant="blue" size="sm">
                    {d.idealDurationDays}d
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Card
              key={dest.id}
              hoverable
              className="p-0 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#DDE8EC]">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="blue" size="sm" className="bg-white/95 backdrop-blur-xs font-semibold">
                      {dest.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold text-base text-[#26333A] group-hover:text-[#5E8CA6] transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-[#6C7A80] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5E8CA6]" />
                      <span>{dest.region}</span>
                    </p>
                  </div>

                  <p className="text-xs text-[#6C7A80] line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1 pt-1">
                    <p className="text-[11px] font-semibold text-[#26333A] uppercase tracking-wider">Highlights</p>
                    <ul className="text-xs text-[#6C7A80] space-y-0.5">
                      {dest.highlights.slice(0, 2).map((h, i) => (
                        <li key={i} className="truncate">• {h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {dest.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#F3F5F4] text-[#6C7A80] border border-[#DCE3E5]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#DCE3E5] mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#6C7A80] pt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#5E8CA6]" />
                    <span>{dest.idealDurationDays} Days Ideal</span>
                  </span>
                  <span className="font-semibold text-[#26333A]">
                    ₹{dest.averageDailyBudgetINR.toLocaleString('en-IN')}/day
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDestination(dest)}
                    className="w-full text-xs"
                  >
                    Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePlanForDestination(dest)}
                    className="w-full text-xs"
                    leftIcon={<Sparkles className="w-3 h-3" />}
                  >
                    Plan Trip
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <Modal
          isOpen={!!selectedDestination}
          onClose={() => setSelectedDestination(null)}
          title={selectedDestination.name}
          description={selectedDestination.region}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="h-56 w-full rounded-xl overflow-hidden bg-[#DDE8EC]">
              <img
                src={selectedDestination.imageUrl}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-[#26333A] leading-relaxed">
              {selectedDestination.description}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F3F5F4] border border-[#DCE3E5] text-xs">
              <div>
                <span className="text-[#6C7A80] block">Best Season</span>
                <span className="font-semibold text-[#26333A]">{selectedDestination.bestTimeToVisit}</span>
              </div>
              <div>
                <span className="text-[#6C7A80] block">Estimated Daily Expense</span>
                <span className="font-semibold text-[#26333A]">
                  ₹{selectedDestination.averageDailyBudgetINR.toLocaleString('en-IN')} / person
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#26333A]">
                Key Attractions & Experiences
              </h4>
              <ul className="text-xs text-[#6C7A80] space-y-1 list-disc list-inside">
                {selectedDestination.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#DCE3E5] flex justify-end gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedDestination(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const target = selectedDestination;
                  setSelectedDestination(null);
                  handlePlanForDestination(target);
                }}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate Itinerary
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
