import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  Clock,
  Coins,
  Flame,
  Globe,
  GraduationCap,
  HeartPulse,
  Leaf,
  List,
  Loader2,
  Map,
  MapPin,
  Building2,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
  PawPrint,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  Timer,
  Users,
  Image as ImageIcon,
} from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { formatCurrency, formatDate, calculateProgress, formatTimeAgo } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import { useLanguage } from '@/lib/LanguageContext';

// Dynamic import for map component (SSR disabled)
const EventsMap = dynamic(() => import('@/components/EventsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-2 text-gray-500" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Events() {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [pageSize] = useState(9);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedEventOnMap, setSelectedEventOnMap] = useState(null);
  const [imageError, setImageError] = useState(false);

  const categories = [
    { id: 'all', label: 'All Causes', icon: Globe, color: 'bg-gradient-to-r from-orange-500 to-amber-500' },
    { id: 'medical', label: 'Medical', icon: HeartPulse, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'bg-gradient-to-r from-red-600 to-orange-600' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { id: 'community', label: 'Community', icon: Users, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'animals', label: 'Animals', icon: PawPrint, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { id: 'environment', label: 'Environment', icon: Leaf, color: 'bg-gradient-to-r from-green-600 to-teal-500' },
  ];

  const sortOptions = [
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'newest', label: 'Newest', icon: Sparkles },
    { id: 'ending', label: 'Ending Soon', icon: Timer },
    { id: 'most_funded', label: 'Most Funded', icon: Coins },
    { id: 'nearest', label: 'Nearest to You', icon: MapPin },
  ];

  const locations = [
    { id: 'all', label: 'All Cambodia' },
    { id: 'phnom_penh', label: 'Phnom Penh' },
    { id: 'siem_reap', label: 'Siem Reap' },
    { id: 'sihanoukville', label: 'Sihanoukville' },
    { id: 'battambang', label: 'Battambang' },
    { id: 'kampong_cham', label: 'Kampong Cham' },
    { id: 'takeo', label: 'Takeo' },
    { id: 'kampot', label: 'Kampot' },
  ];

  useEffect(() => {
    loadEvents();
  }, [currentPage, sortBy]);

  useEffect(() => {
    // When search or category changes, reset to page 0
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      loadEvents();
    }
  }, [searchTerm, category, selectedLocation]);

  useEffect(() => {
    // Reset image error when a new event is selected
    if (selectedEventOnMap) {
      setImageError(false);
    }
  }, [selectedEventOnMap]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const sortField = sortBy === 'newest' ? 'createdAt' : 
                       sortBy === 'ending' ? 'endDate' : 
                       sortBy === 'most_funded' ? 'currentAmount' : 'createdAt';
      const sortDirection = sortBy === 'ending' ? 'asc' : 'desc';
      
      const response = await eventsAPI.getAll(currentPage, pageSize, sortField, sortDirection);
      
      // Fetch images for each event
      const eventsWithImages = await Promise.all(
        (response.content || []).map(async (event) => {
          try {
            const images = await eventsAPI.getImages(event.id);
            const primaryImage = images.find(img => img.isPrimary);
            return {
              ...event,
              images: images || [],
              primaryImage: primaryImage || images[0] || null
            };
          } catch (err) {
            console.error(`Failed to load images for event ${event.id}:`, err);
            return { ...event, images: [], primaryImage: null };
          }
        })
      );
      
      // Handle pagination response
      setEvents(eventsWithImages);
      setFilteredEvents(eventsWithImages);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      setHasNext(response.hasNext || false);
      setHasPrevious(response.hasPrevious || false);
      
      // Apply client-side filtering if needed
      filterEvents(eventsWithImages);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = (eventsToFilter) => {
    const normalizedCategory = category?.toLowerCase();
    const normalizedLocation = selectedLocation?.toLowerCase();
    const search = searchTerm.toLowerCase().trim();

    let filtered = [...eventsToFilter];

    // Search filter
    if (search) {
      filtered = filtered.filter((event) => {
        const title = event.title?.toLowerCase() || '';
        const description = event.description?.toLowerCase() || '';
        const owner = event.ownerName?.toLowerCase() || '';
        return title.includes(search) || description.includes(search) || owner.includes(search);
      });
    }

    // Category filter (case-insensitive)
    if (normalizedCategory && normalizedCategory !== 'all') {
      filtered = filtered.filter((event) => (event.category || '').toLowerCase() === normalizedCategory);
    }

    // Location filter (case-insensitive match against stored location)
    if (normalizedLocation && normalizedLocation !== 'all') {
      filtered = filtered.filter((event) => (event.location || '').toLowerCase() === normalizedLocation);
    }

    setFilteredEvents(filtered);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getUrgencyColor = (endDate) => {
    const daysLeft = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) return 'bg-red-500';
    if (daysLeft <= 7) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getDaysLeft = (endDate) => {
    const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (loading && currentPage === 1) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <div className="text-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
            >
              <Star className="w-24 h-24 text-orange-500 mx-auto" fill="currentColor" />
            </motion.div>
            <p className="text-gray-600 text-lg font-medium">Discovering amazing causes...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 text-xl font-medium mb-6">{error}</div>
            <button
                onClick={loadEvents}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
            >
              Try Again
            </button>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 py-16 px-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Make a Difference in Cambodia
              </h1>
              <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Support communities, change lives, and create lasting impact through verified campaigns
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-3xl mx-auto">
                {[
                  { value: '2.3M+', label: 'People Helped', icon: Users },
                  { value: '₿75K+', label: 'Raised', icon: Coins },
                  { value: '12K+', label: 'Campaigns', icon: Target },
                  { value: '98%', label: 'Success Rate', icon: Star },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                    >
                      <div className="text-3xl mb-2">
                        <stat.icon className="w-7 h-7" />
                      </div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-orange-200">{stat.label}</div>
                    </motion.div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search campaigns by name, location, or cause..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-100 text-gray-900 text-lg shadow-2xl hover:shadow-xl transition-all"
                    />
                  {searchTerm && (
                      <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label="Clear search"
                      >
                        <X className="w-5 h-5" />
                      </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-12 px-4">
          {/* Quick View Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              href="/events"
              className="group bg-white rounded-xl border-2 border-orange-200 hover:border-orange-500 p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">All Fundraisers</h3>
                  <p className="text-sm text-gray-600 mt-1">Browse all active campaigns</p>
                </div>
                <ArrowRight className="w-6 h-6 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link
              href="/events/ending"
              className="group bg-white rounded-xl border-2 border-amber-200 hover:border-amber-500 p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">Ending Soon</h3>
                  <p className="text-sm text-gray-600 mt-1">Events ending within 30 days</p>
                </div>
                <Clock className="w-6 h-6 text-amber-600 group-hover:translate-y-[-2px] transition-transform" />
              </div>
            </Link>
          </div>

          {/* Filters Bar */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-orange-300 font-medium text-gray-700"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filters</span>
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div className="hidden lg:flex items-center gap-3 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`px-5 py-2.5 rounded-full transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105 ${cat.id === category ? 'text-white shadow-lg scale-105 ' + cat.color : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                        >
                          <cat.icon className="w-4 h-4" />
                          <span>{cat.label}</span>
                        </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Categories */}
                <div className="lg:hidden mt-4">
                  <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-full transition-all duration-200 font-medium flex items-center gap-2 shadow-sm ${cat.id === category ? 'text-white shadow-md scale-105 ' + cat.color : 'bg-white text-gray-700 border border-gray-200'}`}
                        >
                          <cat.icon className="w-4 h-4" />
                          <span className="whitespace-nowrap">{cat.label}</span>
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 bg-white rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200 font-medium text-gray-700 cursor-pointer transition-all"
                >
                  {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                  ))}
                </select>

                <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 font-medium text-gray-700 hover:border-orange-300"
                >
                  {showMap ? <List className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                  <span className="hidden sm:inline">{showMap ? t('events.listView') : t('events.mapView')}</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                  <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white rounded-2xl shadow-lg p-6 mb-6 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-3">Location</label>
                        <div className="space-y-2">
                          {locations.map((loc) => (
                              <label key={loc.id} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="location"
                                    value={loc.id}
                                    checked={selectedLocation === loc.id}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-4 h-4 text-orange-600"
                                />
                                <span className="text-gray-700">{loc.label}</span>
                              </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-3">Funding Status</label>
                        <div className="space-y-2">
                          {['All', 'Almost Funded', 'Just Started', 'Urgent'].map((status) => (
                              <label key={status} className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                                <span className="text-gray-700">{status}</span>
                              </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-3">Time Left</label>
                        <div className="space-y-2">
                          {['Any', 'Ending this week', 'Ending this month', 'Ongoing'].map((time) => (
                              <label key={time} className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                                <span className="text-gray-700">{time}</span>
                              </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-3">Verification</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" defaultChecked />
                            <span className="text-gray-700 inline-flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4" /> Verified Only
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                            <span className="text-gray-700">Featured Campaigns</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                            <span className="text-gray-700">Charity Partners</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                      <button
                          onClick={() => {
                            setCategory('all');
                            setSelectedLocation('all');
                            setSearchTerm('');
                          }}
                          className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                      >
                        Clear All
                      </button>
                      <button
                          onClick={() => setShowFilters(false)}
                          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8 bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100">
            <div className="text-gray-700 font-medium">
              <span className="text-2xl font-bold text-orange-600">{totalElements}</span>
              <span className="text-gray-600 ml-2">campaigns found</span>
              {searchTerm && <span className="text-gray-500"> for "<span className="font-semibold text-gray-700">{searchTerm}</span>"</span>}
              {category !== 'all' && <span className="text-gray-500"> in <span className="font-semibold text-gray-700">{categories.find(c => c.id === category)?.label}</span></span>}
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
              Showing {filteredEvents.length} of {totalElements}
            </div>
          </div>

          {/* Events Grid or Map */}
          {showMap ? (
              <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8"
              >
                {/* Map Container */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="mb-4 p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Map className="w-5 h-5 text-orange-600" />
                        Campaigns Map
                      </h3>
                      <div className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                        {filteredEvents.filter(e => e.latitude && e.longitude).length} campaigns with location
                      </div>
                    </div>

                    {/* Map */}
                    <div className="h-[600px] lg:h-[700px] rounded-xl overflow-hidden relative">
                      <EventsMap
                          events={filteredEvents}
                          selectedEvent={selectedEventOnMap}
                          onEventSelect={(event) => {
                            setSelectedEventOnMap(event);
                          }}
                      />
                      
                      {/* Map Legend */}
                      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-orange-600" />
                          Legend
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                            <span className="text-gray-700">Urgent (0-7 days)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                            <span className="text-gray-700">Active (8-30 days)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                            <span className="text-gray-700">Long-term (30+ days)</span>
                          </div>
                        </div>
                      </div>

                      {/* Map Controls */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                            className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                            title="Zoom in"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                            className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                            title="Zoom out"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <button
                            className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                            title="Reset view"
                        >
                          <MapPin className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar - Selected Event or Quick Stats */}
                <div className="lg:col-span-1 space-y-4">
                  {selectedEventOnMap ? (
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-4"
                      >
                        {/* Event Image */}
                        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100">
                          {(selectedEventOnMap.primaryImage?.url || selectedEventOnMap.imageUrl) && !imageError ? (
                              <img
                                  src={selectedEventOnMap.primaryImage?.url || selectedEventOnMap.imageUrl}
                                  alt={selectedEventOnMap.title}
                                  className="w-full h-full object-cover"
                                  onError={() => setImageError(true)}
                              />
                          ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <ImageIcon className="w-16 h-16 text-orange-400 mx-auto mb-2" />
                                  <p className="text-sm text-orange-600 font-medium">{selectedEventOnMap.category || 'Campaign'}</p>
                                </div>
                              </div>
                          )}
                          
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-900 shadow-md">
                            {selectedEventOnMap.category || 'General'}
                          </div>
                          
                          {/* Close Button */}
                          <button
                              onClick={() => {
                                setSelectedEventOnMap(null);
                                setImageError(false);
                              }}
                              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all"
                          >
                            <X className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>

                        {/* Event Details */}
                        <div className="p-4 space-y-4">
                          {/* Title & Location */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 line-clamp-2 text-base mb-2">
                                {selectedEventOnMap.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-gray-600 text-xs">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{selectedEventOnMap.location || 'Cambodia'}</span>
                                </div>
                                {selectedEventOnMap.status === 'VERIFIED' && (
                                    <div className="flex items-center gap-1 text-green-600 text-xs">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span className="font-medium">Verified</span>
                                    </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(selectedEventOnMap.currentAmount)}
                              </span>
                              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                {Math.round((selectedEventOnMap.currentAmount / selectedEventOnMap.goalAmount) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(
                                        (selectedEventOnMap.currentAmount / selectedEventOnMap.goalAmount) * 100,
                                        100
                                    )}%`
                                  }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">
                              Goal: {formatCurrency(selectedEventOnMap.goalAmount)}
                            </p>
                          </div>

                          {/* Supporters & Days Left */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                              <div className="flex items-center gap-1 mb-1">
                                <Users className="w-3.5 h-3.5 text-orange-600" />
                                <p className="text-xs text-gray-600">Supporters</p>
                              </div>
                              <p className="font-bold text-orange-600 text-lg">{selectedEventOnMap.donors || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200">
                              <div className="flex items-center gap-1 mb-1">
                                <Timer className="w-3.5 h-3.5 text-amber-600" />
                                <p className="text-xs text-gray-600">Days Left</p>
                              </div>
                              <p className="font-bold text-amber-600 text-lg">{getDaysLeft(selectedEventOnMap.endDate)}</p>
                            </div>
                          </div>

                          {/* View Button */}
                          <Link
                              href={`/events/${selectedEventOnMap.id}`}
                              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          >
                            View Full Details
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                  ) : (
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 space-y-4"
                      >
                        {/* Header with Icon */}
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">Map Overview</h3>
                            <p className="text-xs text-gray-500">Campaign statistics</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-700 font-medium">Total Campaigns</p>
                              <Target className="w-5 h-5 text-orange-600" />
                            </div>
                            <p className="text-3xl font-bold text-orange-600">
                              {filteredEvents.filter(e => e.latitude && e.longitude).length}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">with location data</p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-700 font-medium">Total Raised</p>
                              <Coins className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-3xl font-bold text-green-600">
                              {formatCurrency(
                                  filteredEvents
                                      .filter(e => e.latitude && e.longitude)
                                      .reduce((sum, e) => sum + e.currentAmount, 0)
                              )}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">from all campaigns</p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-700 font-medium">Avg Progress</p>
                              <Flame className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-3xl font-bold text-blue-600">
                              {Math.round(
                                  filteredEvents
                                      .filter(e => e.latitude && e.longitude)
                                      .reduce(
                                          (sum, e) =>
                                              sum + (e.currentAmount / e.goalAmount) * 100,
                                          0
                                      ) /
                                      (filteredEvents.filter(e => e.latitude && e.longitude).length || 1)
                              )}%
                            </p>
                            <p className="text-xs text-gray-600 mt-1">completion rate</p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-700 font-medium">Total Supporters</p>
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-3xl font-bold text-purple-600">
                              {filteredEvents
                                  .filter(e => e.latitude && e.longitude)
                                  .reduce((sum, e) => sum + (e.donors || 0), 0)
                                  .toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">helping communities</p>
                          </div>
                        </div>

                        {/* Helpful Instruction */}
                        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <MapPin className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-1">How to use</p>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                Click on any campaign marker on the map to view detailed information and support the cause.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                  )}
                </div>
              </motion.div>
          ) : (
              <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredEvents.map((event, index) => {
                    const progress = calculateProgress(event.currentAmount, event.goalAmount);
                    const daysLeft = getDaysLeft(event.endDate);

                    return (
                        <motion.div
                            key={event.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                        >
                          <Link href={`/events/${event.id}`}>
                            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer h-full border border-gray-100 hover:shadow-2xl transition-all duration-300">
                              {/* Image with Overlay */}
                              <div className="relative h-48 overflow-hidden">
                                {event.primaryImage?.imageUrl || event.imageUrl ? (
                                    <img
                                        src={event.primaryImage?.imageUrl || event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : event.images && event.images.length > 0 ? (
                                    <img
                                        src={event.images[0].imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                                      <Star className="w-24 h-24 text-white" fill="currentColor" />
                                    </div>
                                )}

                                {/* Image Count Badge */}
                                {event.images && event.images.length > 1 && (
                                    <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                      <ImageIcon className="w-3 h-3" />
                                      {event.images.length}
                                    </div>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                              {event.category?.toUpperCase() || 'GENERAL'}
                            </span>
                                </div>

                                {/* Urgent Badge */}
                                {daysLeft <= 7 && (
                                    <div className="absolute top-4 right-4">
                              <span className={`px-3 py-1 ${getUrgencyColor(event.endDate)} text-white rounded-full text-xs font-bold`}>
                                {daysLeft === 0 ? 'ENDING TODAY' : `${daysLeft} DAYS LEFT`}
                              </span>
                                    </div>
                                )}

                                {/* Progress Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                  <div className="text-white">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold text-lg">{formatCurrency(event.currentAmount)}</span>
                                      <span className="font-bold">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-white/30 rounded-full h-2">
                                      <div
                                          className="bg-gradient-to-r from-orange-400 to-amber-400 h-2 rounded-full transition-all duration-1000"
                                          style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                  {event.title}
                                </h3>

                                {/* Location & Date */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location || 'Cambodia'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>{formatDate(event.startDate)}</span>
                                  </div>
                                </div>

                                {/* Owner Info */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                  {event.ownerAvatar ? (
                                      <img
                                          src={event.ownerAvatar}
                                          alt={event.ownerName}
                                          className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                                      />
                                  ) : (
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center text-white font-bold">
                                        {event.ownerName?.charAt(0)?.toUpperCase() || '?'}
                                      </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{event.ownerName}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                      <span className="inline-flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        {event.donorsCount || 0} supporters
                                      </span>
                                      {event.verified && (
                                          <span className="inline-flex items-center gap-1 text-green-600">
                                            <ShieldCheck className="w-4 h-4" />
                                            Verified
                                          </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
          )}

          {/* Load More / No Results */}
          <AnimatePresence>
            {filteredEvents.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                  <Search className="w-14 h-14 mb-6 text-gray-400" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm ? 'No matching campaigns found' : 'No active campaigns right now'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm ? 'Try adjusting your search terms or browse different categories.' : 'Be the first to start a campaign and make a difference!'}
                  </p>
                  <div className="flex gap-4 justify-center">
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Clear Search
                        </button>
                    )}
                    <Link
                        href="/create"
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
                    >
                      Start Your Own Campaign
                    </Link>
                  </div>
                </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Pagination */}
          {filteredEvents.length > 0 && !showMap && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
            />
          )}

          {/* Featured Charity Section */}
          {filteredEvents.length > 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-16"
              >
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 text-white">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-4">Partner with Local Charities</h3>
                      <p className="text-orange-100 mb-6">
                        Verified charities in Cambodia are ready to support your cause.
                        Get guidance, visibility, and credibility for your campaign.
                      </p>
                      <Link
                          href="/charities"
                          className="inline-flex items-center gap-2 bg-white text-orange-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Explore Charity Partners
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {['Red Cross', 'Angkor Children', 'Cambodian Children', 'Local NGOs'].map((charity, idx) => (
                          <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <Building2 className="w-6 h-6 mx-auto mb-2" />
                            <div className="font-medium">{charity}</div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
          )}
        </div>
      </div>
  );
}