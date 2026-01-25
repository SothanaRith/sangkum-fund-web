import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition);

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPickerContent({ onSelectLocation, initialLat, initialLng }) {
  // Default to Phnom Penh, Cambodia if no coordinates provided
  const defaultLat = initialLat || 11.5564;
  const defaultLng = initialLng || 104.9282;
  const [selectedLocation, setSelectedLocation] = useState({ lat: defaultLat, lng: defaultLng });

  const handleLocationSelect = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    onSelectLocation(lat, lng);
  };

  return (
    <div className="space-y-4">
      {/* Selected Coordinates Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-800 font-semibold">Latitude</p>
            <p className="text-lg text-blue-900 font-mono">{selectedLocation.lat.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-sm text-blue-800 font-semibold">Longitude</p>
            <p className="text-lg text-blue-900 font-mono">{selectedLocation.lng.toFixed(6)}</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <MapContainer
          center={[defaultLat, defaultLng]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            onLocationSelect={handleLocationSelect}
            initialPosition={[defaultLat, defaultLng]}
          />
        </MapContainer>
      </div>
    </div>
  );
}
