import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { formatCurrency, formatDate, calculateProgress } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';
import {
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function EndingEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, success, failed
  const [sortBy, setSortBy] = useState('ending-soon'); // ending-soon, most-funded, least-funded

  useEffect(() => {
    loadEndingEvents();
  }, []);

  const loadEndingEvents = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all active events sorted by end date ascending (ending soon first)
      const response = await eventsAPI.getAll(0, 100, 'endDate', 'asc');
      
      if (response.content) {
        // Filter events that are currently active/ongoing (haven't ended yet or ending soon)
        const now = new Date();
        const endingEvents = response.content.filter((event) => {
          if (!event.endDate) return false;
          const endDate = new Date(event.endDate);
          // Show events ending within the next 30 days
          const daysUntilEnd = (endDate - now) / (1000 * 60 * 60 * 24);
          return daysUntilEnd >= 0 && daysUntilEnd <= 30;
        });

        setEvents(endingEvents);
        setFilteredEvents(endingEvents);
      }
    } catch (err) {
      setError('Failed to load ending events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...events];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => {
        const isSuccess = event.currentAmount >= event.goalAmount;
        return statusFilter === 'success' ? isSuccess : !isSuccess;
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(query) ||
          event.ownerName?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortBy === 'most-funded') {
      filtered.sort((a, b) => calculateProgress(b.currentAmount, b.goalAmount) - calculateProgress(a.currentAmount, a.goalAmount));
    } else if (sortBy === 'least-funded') {
      filtered.sort((a, b) => calculateProgress(a.currentAmount, a.goalAmount) - calculateProgress(b.currentAmount, b.goalAmount));
    }
    // Default: ending-soon (already sorted from API)

    setFilteredEvents(filtered);
  }, [events, searchQuery, statusFilter, sortBy]);

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getEventStatus = (event) => {
    const isSuccess = event.currentAmount >= event.goalAmount;
    const daysRemaining = getDaysRemaining(event.endDate);
    return { isSuccess, daysRemaining };
  };

  const getStatusColor = (event) => {
    const { isSuccess, daysRemaining } = getEventStatus(event);
    if (daysRemaining <= 0) return 'bg-gray-100';
    if (isSuccess) return 'bg-green-50 border-green-200';
    if (daysRemaining <= 3) return 'bg-red-50 border-red-200';
    if (daysRemaining <= 7) return 'bg-yellow-50 border-yellow-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getStatusBadge = (event) => {
    const { isSuccess, daysRemaining } = getEventStatus(event);
    
    if (daysRemaining <= 0) {
      return (
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-xs font-semibold">
          <Clock size={12} />
          Ended
        </div>
      );
    }
    
    if (isSuccess) {
      return (
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-200 text-green-800 text-xs font-semibold">
          <CheckCircle size={12} />
          Goal Reached
        </div>
      );
    }

    if (daysRemaining <= 3) {
      return (
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-200 text-red-800 text-xs font-semibold">
          <AlertCircle size={12} />
          Critical
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold">
        <Clock size={12} />
        {daysRemaining} days left
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading ending events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">Ending Events</h1>
          </div>
          <p className="text-gray-600">Monitor fundraisers ending within the next 30 days</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white font-medium"
            >
              <option value="all">All Status</option>
              <option value="success">Goal Reached ✓</option>
              <option value="failed">Goal Not Reached ✗</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white font-medium"
            >
              <option value="ending-soon">Ending Soon</option>
              <option value="most-funded">Most Funded</option>
              <option value="least-funded">Least Funded</option>
            </select>

            {/* Summary */}
            <div className="flex items-center gap-4 px-4 py-2 bg-orange-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-orange-600">{filteredEvents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No ending events found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const { isSuccess, daysRemaining } = getEventStatus(event);
              const progress = calculateProgress(event.currentAmount, event.goalAmount);
              const encryptedId = encryptId(event.id);

              return (
                <div
                  key={event.id}
                  className={`rounded-xl border-2 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${getStatusColor(
                    event
                  )}`}
                >
                  {/* Header */}
                  <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold line-clamp-2">{event.title}</h3>
                      {getStatusBadge(event)}
                    </div>
                    <p className="text-sm text-white/90 line-clamp-1">{event.ownerName}</p>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Category & Location */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                        {event.category || 'General'}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <MapPin size={14} />
                          {event.location}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          {formatCurrency(event.currentAmount)} / {formatCurrency(event.goalAmount)}
                        </span>
                        <span className="text-sm font-bold text-orange-600">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isSuccess
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : 'bg-gradient-to-r from-orange-400 to-amber-400'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Supporters</p>
                        <p className="text-lg font-bold text-gray-900">{event.participantCount || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Ends In</p>
                        <p className={`text-lg font-bold ${
                          daysRemaining <= 3 ? 'text-red-600' : 
                          daysRemaining <= 7 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {daysRemaining <= 0 ? 'Ended' : `${daysRemaining}d`}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/events/${encryptedId}`}
                      className="block w-full text-center py-2 px-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                      View Details
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Footer */}
        {filteredEvents.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Goal Reached</p>
              <p className="text-3xl font-bold text-green-600">
                {filteredEvents.filter(e => e.currentAmount >= e.goalAmount).length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Goal Not Reached</p>
              <p className="text-3xl font-bold text-red-600">
                {filteredEvents.filter(e => e.currentAmount < e.goalAmount).length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Average Funding</p>
              <p className="text-3xl font-bold text-orange-600">
                {(
                  filteredEvents.reduce((sum, e) => sum + calculateProgress(e.currentAmount, e.goalAmount), 0) /
                  filteredEvents.length
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
