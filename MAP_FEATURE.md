# 🗺️ Events Map Feature

## Overview
The Events Map feature provides an interactive map view for displaying fundraising campaigns with geographic coordinates. Users can switch between list view and map view to explore campaigns visually on an interactive map of Cambodia.

## Features

### ✅ Interactive Map
- **OpenStreetMap Integration**: Uses Leaflet.js and React-Leaflet for interactive mapping
- **Custom Markers**: Category-specific colored markers with emojis
- **Auto-fitting Bounds**: Map automatically adjusts to show all campaigns
- **Smooth Animations**: Animated transitions between views

### 📍 Marker Features
- **Category Colors**: Each campaign category has a distinct color
- **Category Icons**: Visual emoji indicators for quick identification
- **Rich Popups**: Click markers to see detailed campaign information including:
  - Campaign image
  - Title and description
  - Funding progress bar
  - Location and creator information
  - Direct "Donate Now" button

### 🎨 Category Color Coding
- 🏥 Healthcare: Red (#ef4444)
- 🎓 Education: Blue (#3b82f6)
- 🌱 Environment: Green (#059669)
- 🚨 Disaster Relief: Dark Red (#dc2626)
- 🤝 Community Development: Green (#10b981)
- 🐾 Animal Welfare: Orange (#f59e0b)
- 🎨 Arts & Culture: Pink (#ec4899)
- ⚽ Sports: Orange (#f97316)
- 💻 Technology: Indigo (#6366f1)
- ⚖️ Human Rights: Yellow (#eab308)

### 🌐 Map Legend
- Displays category legend for easy reference
- Shows marker colors and corresponding categories
- Positioned at bottom-right for accessibility

### 📱 Responsive Design
- Mobile-friendly map controls
- Adaptive marker sizes
- Touch-friendly popups
- Optimized for all screen sizes

## Technical Implementation

### Components
- **`components/EventsMap.js`**: Main map component
- **`pages/events/index.js`**: Events listing page with map integration

### Libraries Used
- **leaflet**: Core mapping library (v1.9.4)
- **react-leaflet**: React wrapper for Leaflet (v4.2.1)
- Installed with: `npm install leaflet react-leaflet@4.2.1 --legacy-peer-deps`

### Key Functions

#### Custom Marker Creation
```javascript
createCategoryIcon(category, color)
```
Creates custom teardrop-shaped markers with category colors and emojis.

#### Map Bounds
```javascript
MapBounds({ events })
```
Automatically adjusts map viewport to fit all event markers.

#### Category Mapping
```javascript
getCategoryEmoji(category)
getCategoryColor(category)
```
Maps categories to visual representations.

## Usage

### Switching Views
Users can toggle between list and map views using the button in the top right:
- 🗺️ **Map View**: Shows campaigns on interactive map
- 📋 **List View**: Shows campaigns in grid layout

### Viewing Campaign Details
1. Click on any map marker
2. Popup displays campaign information
3. Click "View Details & Donate" to go to campaign page

### Filtering
- All filters (category, search, location) work with map view
- Map updates dynamically based on applied filters
- Only campaigns with coordinates are displayed on map

## Data Requirements

### Event Location Data
For campaigns to appear on the map, they must have:
- `latitude`: Valid latitude coordinate
- `longitude`: Valid longitude coordinate
- Both fields must be present and valid numbers

### Example Event Object
```javascript
{
  id: 1,
  title: "Help Build Schools in Rural Cambodia",
  description: "Campaign description...",
  category: "Education",
  latitude: "11.5564",
  longitude: "104.9282",
  location: "Phnom Penh, Cambodia",
  currentAmount: 5000,
  targetAmount: 10000,
  imageUrl: "https://...",
  ownerName: "John Doe"
}
```

## Translations

### English
- Map View
- List View  
- Campaign Map
- campaigns with location data
- No Events with Location Data
- Loading map...

### Khmer (ភាសាខ្មែរ)
- មើលផែនទី (Map View)
- មើលបញ្ជី (List View)
- ផែនទីយុទ្ធនាការ (Campaign Map)
- យុទ្ធនាការដែលមានទីតាំង (campaigns with location data)
- គ្មានយុទ្ធនាការដែលមានទីតាំង (No Events with Location Data)
- កំពុងផ្ទុកផែនទី... (Loading map...)

## Styling

### Custom Styles
The map includes custom CSS for:
- Popup styling with rounded corners
- Custom marker appearance
- Legend positioning
- Responsive layout

### Global CSS Integration
Leaflet CSS is imported in `styles/globals.css`:
```css
@import 'leaflet/dist/leaflet.css';
```

## Browser Compatibility
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations
- **Dynamic Import**: Map component uses Next.js dynamic import with SSR disabled
- **Lazy Loading**: Map only loads when user switches to map view
- **Marker Clustering**: Consider adding for 100+ campaigns
- **Image Optimization**: Campaign images in popups should be optimized

## Future Enhancements
- [ ] Marker clustering for better performance
- [ ] Heatmap view showing campaign density
- [ ] Custom map styles/themes
- [ ] Geolocation to center map on user's location
- [ ] Drawing tools for area-based filtering
- [ ] Export map as image
- [ ] Offline map tiles

## Troubleshooting

### Map Not Loading
- Check console for errors
- Verify Leaflet CSS is imported
- Ensure react-leaflet version 4.2.1 is installed

### Markers Not Appearing
- Verify events have valid latitude/longitude
- Check that coordinates are numbers (not strings)
- Ensure events pass filters

### Popup Content Missing
- Check event object has all required fields
- Verify formatCurrency and calculateProgress utilities
- Check for console errors

## API Integration

### No Backend Changes Required
The map feature works entirely with existing event data. Just ensure events include optional `latitude` and `longitude` fields when creating campaigns.

## Demo Coordinates (Cambodia)
- Phnom Penh: 11.5564, 104.9282
- Siem Reap: 13.3671, 103.8448
- Sihanoukville: 10.6097, 103.5267
- Battambang: 13.0957, 103.2022
- Kampot: 10.6104, 104.1809

---

**Last Updated**: January 24, 2026
**Version**: 1.0.0
**Author**: SangKumFund Team
