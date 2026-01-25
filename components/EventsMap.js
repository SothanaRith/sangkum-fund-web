import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatCurrency, calculateProgress } from '@/lib/utils';
import Link from 'next/link';
import { Map, MapPin, Tag, User } from 'lucide-react';

// Fix for default marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different categories
const createCategoryIcon = (category, color) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const getCategoryColor = (category) => {
  const colorMap = {
    'medical': '#ef4444',
    'education': '#3b82f6',
    'emergency': '#dc2626',
    'business': '#8b5cf6',
    'community': '#10b981',
    'animals': '#f59e0b',
    'environment': '#059669',
    'Healthcare': '#ef4444',
    'Education': '#3b82f6',
    'Environment': '#059669',
    'Animal Welfare': '#f59e0b',
    'Community Development': '#10b981',
    'Disaster Relief': '#dc2626',
    'Arts & Culture': '#ec4899',
    'Sports': '#f97316',
    'Technology': '#6366f1',
    'Human Rights': '#eab308',
  };
  return colorMap[category] || '#f97316';
};

// Component to fit map bounds to markers
function MapBounds({ events }) {
  const map = useMap();

  useEffect(() => {
    if (events && events.length > 0) {
      const bounds = events
        .filter(event => event.latitude && event.longitude)
        .map(event => [parseFloat(event.latitude), parseFloat(event.longitude)]);

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    }
  }, [events, map]);

  return null;
}

export default function EventsMap({ events, selectedEvent, onEventSelect }) {
  // Default center (Phnom Penh, Cambodia)
  const defaultCenter = [11.5564, 104.9282];
  const defaultZoom = 12;

  // Filter events that have coordinates
  const eventsWithCoordinates = events.filter(
    event => event.latitude && event.longitude
  );

  if (eventsWithCoordinates.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center p-8">
          <Map className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Events with Location Data
          </h3>
          <p className="text-gray-500">
            Events without coordinates cannot be displayed on the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', minHeight: '600px' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds events={eventsWithCoordinates} />

        {eventsWithCoordinates.map((event) => {
          const position = [parseFloat(event.latitude), parseFloat(event.longitude)];
          const progress = calculateProgress(event.currentAmount, event.targetAmount);
          const icon = createCategoryIcon(event.category, getCategoryColor(event.category));

          return (
            <Marker
              key={event.id}
              position={position}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onEventSelect) {
                    onEventSelect(event);
                  }
                },
              }}
            >
              <Popup className="custom-popup" maxWidth={320}>
                <div className="p-2">
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="mb-3 -mx-2 -mt-2">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-t"
                      />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: getCategoryColor(event.category) }}>
                      <Tag className="w-3 h-3" />
                      {event.category}
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="font-semibold">
                        {formatCurrency(event.currentAmount)} raised
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          background: 'linear-gradient(90deg, #f97316 0%, #fb923c 100%)',
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Goal: {formatCurrency(event.targetAmount)}
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </div>
                  )}

                  {/* Creator */}
                  <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    By {event.ownerName || 'Anonymous'}
                  </div>

                  {/* View Details Button */}
                  <Link href={`/donate/${event.id}`}>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all">
                      View Details & Donate
                    </button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-xs">
        <h4 className="text-xs font-bold text-gray-700 mb-2">Categories</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { name: 'Healthcare', color: '#ef4444' },
            { name: 'Education', color: '#3b82f6' },
            { name: 'Environment', color: '#059669' },
            { name: 'Emergency', color: '#dc2626' },
            { name: 'Community', color: '#10b981' },
            { name: 'Animals', color: '#f59e0b' },
          ].map(cat => (
            <div key={cat.name} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-1.5"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-gray-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 280px;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
}
