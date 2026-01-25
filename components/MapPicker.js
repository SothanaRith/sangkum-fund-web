import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MapPin, Lightbulb } from 'lucide-react';

// Dynamic import to avoid SSR issues with Leaflet
const MapPickerContent = dynamic(() => import('./MapPickerContent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  ),
});

export default function MapPicker({ isOpen, onClose, onSelectLocation, initialLat, initialLng }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="w-7 h-7" /> Select Event Location
              </h2>
              <p className="text-sm text-white/80 mt-1">Click on the map to set coordinates</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="p-6">
          <MapPickerContent
            onSelectLocation={onSelectLocation}
            initialLat={initialLat}
            initialLng={initialLng}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> Tip: Click anywhere on the map to set your event location
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
