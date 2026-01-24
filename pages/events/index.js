import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsAPI } from '@/lib/api';
import { formatCurrency, formatDate, calculateProgress, formatTimeAgo } from '@/lib/utils';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('all');

  const categories = [
    { id: 'all', label: 'All Causes', icon: '🌍', color: 'bg-gradient-to-r from-orange-500 to-amber-500' },
    { id: 'medical', label: 'Medical', icon: '🏥', color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { id: 'education', label: 'Education', icon: '🎓', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'emergency', label: 'Emergency', icon: '🚨', color: 'bg-gradient-to-r from-red-600 to-orange-600' },
    { id: 'business', label: 'Business', icon: '💼', color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { id: 'community', label: 'Community', icon: '🤝', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'animals', label: 'Animals', icon: '🐾', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { id: 'environment', label: 'Environment', icon: '🌱', color: 'bg-gradient-to-r from-green-600 to-teal-500' },
  ];

  const sortOptions = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'newest', label: 'Newest', icon: '🆕' },
    { id: 'ending', label: 'Ending Soon', icon: '⏰' },
    { id: 'most_funded', label: 'Most Funded', icon: '💰' },
    { id: 'nearest', label: 'Nearest to You', icon: '📍' },
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
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [searchTerm, category, sortBy, selectedLocation, events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll();
      setEvents(data);
      setFilteredEvents(data.slice(0, 9));
      setHasMore(data.length > 9);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreEvents = () => {
    const nextPage = page + 1;
    const startIndex = page * 9;
    const newEvents = events.slice(startIndex, startIndex + 9);

    if (newEvents.length > 0) {
      setFilteredEvents(prev => [...prev, ...newEvents]);
      setPage(nextPage);
      setHasMore(events.length > (nextPage * 9));
    }
  };

  const filterAndSortEvents = () => {
    let filtered = [...events];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(event => event.location === selectedLocation);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'trending':
          return (b.donorsCount || 0) - (a.donorsCount || 0);
        case 'ending':
          return new Date(a.endDate) - new Date(b.endDate);
        case 'most_funded':
          return b.currentAmount - a.currentAmount;
        case 'nearest':
          // This would require location data
          return 0;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered.slice(0, page * 9));
    setHasMore(filtered.length > (page * 9));
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

  if (loading && page === 1) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <div className="text-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
            >
              🌟
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
            <div className="text-7xl mb-4">😞</div>
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
                  { value: '2.3M+', label: 'People Helped', icon: '👥' },
                  { value: '₿75K+', label: 'Raised', icon: '💰' },
                  { value: '12K+', label: 'Campaigns', icon: '🎯' },
                  { value: '98%', label: 'Success Rate', icon: '⭐' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                    >
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-orange-200">{stat.label}</div>
                    </motion.div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                      type="text"
                      placeholder="🔍 Search campaigns by name, location, or cause..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none text-gray-900 text-lg shadow-xl"
                  />
                  {searchTerm && (
                      <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-12 px-4">
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
                      className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <span className="text-xl">⚙️</span>
                    <span className="font-medium">Filters</span>
                    {showFilters ? '↑' : '↓'}
                  </button>

                  <div className="hidden lg:flex items-center gap-2 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`px-4 py-2 rounded-full transition-all ${cat.id === category ? 'text-white ' + cat.color : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          <span className="mr-2">{cat.icon}</span>
                          {cat.label}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Categories */}
                <div className="lg:hidden mt-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full transition-all ${cat.id === category ? 'text-white ' + cat.color : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          <span className="mr-1">{cat.icon}</span>
                          {cat.label}
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.icon} {option.label}
                      </option>
                  ))}
                </select>

                <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="text-xl">{showMap ? '📋' : '🗺️'}</span>
                  <span>{showMap ? 'List View' : 'Map View'}</span>
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
                            <span className="text-gray-700">✓ Verified Only</span>
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
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-700">
              <span className="font-bold text-orange-600">{filteredEvents.length}</span> campaigns found
              {searchTerm && <span> for "<span className="font-semibold">{searchTerm}</span>"</span>}
              {category !== 'all' && <span> in <span className="font-semibold">{categories.find(c => c.id === category)?.label}</span></span>}
            </div>
            <div className="text-sm text-gray-500">
              Showing {Math.min(page * 9, filteredEvents.length)} of {filteredEvents.length}
            </div>
          </div>

          {/* Events Grid or Map */}
          {showMap ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map</h3>
                  <p className="text-gray-600 mb-4">Coming soon! View campaigns on a map of Cambodia.</p>
                  <button
                      onClick={() => setShowMap(false)}
                      className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium"
                  >
                    Back to List View
                  </button>
                </div>
              </div>
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
                                {event.imageUrl ? (
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                                      <span className="text-6xl">🌟</span>
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

                                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                                  {event.description}
                                </p>

                                {/* Location & Date */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                  <div className="flex items-center gap-1">
                                    <span>📍</span>
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
                                      <span>👥 {event.donorsCount || 0} supporters</span>
                                      {event.verified && (
                                          <span className="text-green-600">✓ Verified</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Goal & Button */}
                                <div className="mt-4 flex items-center justify-between">
                                  <div>
                                    <div className="text-xs text-gray-500">Goal</div>
                                    <div className="font-bold text-gray-900">{formatCurrency(event.goalAmount)}</div>
                                  </div>
                                  <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md">
                                    Donate Now
                                  </button>
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
                  <div className="text-7xl mb-6">🔍</div>
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
            ) : hasMore && !showMap && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-12"
                >
                  <button
                      onClick={loadMoreEvents}
                      className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
                  >
                    Load More Campaigns
                  </button>
                </motion.div>
            )}
          </AnimatePresence>

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
                        <span>→</span>
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {['Red Cross', 'Angkor Children', 'Cambodian Children', 'Local NGOs'].map((charity, idx) => (
                          <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-3xl mb-2">🏛️</div>
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