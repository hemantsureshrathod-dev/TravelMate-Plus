import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Destination } from '../../types/destination';

// Custom clean pin icon
const createPinIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${isSelected ? '#26333A' : '#5E8CA6'};
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 12px rgba(38,51,58,0.25);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export interface LeafletMapProps {
  destinations: Destination[];
  selectedDestination?: Destination | null;
  onSelectDestination?: (destination: Destination) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  className = 'h-[460px]',
  center = [19.076, 74.5], // Maharashtra geographic center
  zoom = 7,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Don't necessarily destroy on every re-render, but clean up on unmount
    };
  }, []);

  // Update markers when destinations or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    destinations.forEach((dest) => {
      if (!dest.lat || !dest.lng) return;

      const isSelected = selectedDestination?.id === dest.id;
      const marker = L.marker([dest.lat, dest.lng], {
        icon: createPinIcon(isSelected),
      }).addTo(map);

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; padding: 4px; min-width: 180px;">
          <h4 style="margin: 0 0 4px; font-weight: 700; color: #26333A; font-size: 14px;">${dest.name}</h4>
          <p style="margin: 0 0 6px; color: #6C7A80; font-size: 11px;">${dest.region}</p>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 12px; background-color: #DDE8EC; color: #3E657A; font-size: 11px; font-weight: 600; margin-bottom: 8px;">
            ${dest.idealDurationDays} Days Ideal
          </div>
          <button id="map-select-${dest.id}" style="
            display: block;
            width: 100%;
            background-color: #5E8CA6;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
          ">
            Plan Trip Here
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-select-${dest.id}`);
        if (btn && onSelectDestination) {
          btn.onclick = () => onSelectDestination(dest);
        }
      });

      marker.on('click', () => {
        if (onSelectDestination) {
          onSelectDestination(dest);
        }
      });

      markersRef.current[dest.id] = marker;
    });

    if (selectedDestination && markersRef.current[selectedDestination.id]) {
      const selectedMarker = markersRef.current[selectedDestination.id];
      map.setView([selectedDestination.lat, selectedDestination.lng], 9, { animate: true });
      selectedMarker.openPopup();
    }
  }, [destinations, selectedDestination, onSelectDestination]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#DCE3E5] shadow-xs ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
