import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { adminEventsAPI } from '@/lib/admin-api';
import { formatCurrency, formatDate, calculateProgress } from '@/lib/utils';

export default function AdminEvents() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    checkAuth();
    loadEvents();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
    }
  };

  const loadEvents = async () => {
    try {
      const data = await adminEventsAPI.getAll();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await adminEventsAPI.delete(id);
      await loadEvents();
      alert('Event deleted successfully!');
    } catch (err) {
      alert('Failed to delete event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminEventsAPI.toggleStatus(id);
      await loadEvents();
    } catch (err) {
      alert('Failed to toggle status: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'active' && event.isActive) ||
                         (filter === 'inactive' && !event.isActive);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center animate-fadeIn">
          <div>
            <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-semibold mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                📋 Event Management
              </span>
            </h1>
          </div>
          <Link
            href="/admin/events/new"
            className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg"
          >
            ➕ Create Event
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'inactive' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event, index) => {
            const progress = calculateProgress(event.currentAmount, event.targetAmount);
            
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                    <span className="text-7xl">🌟</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
                      {event.title}
                    </h3>
                    <button
                      onClick={() => handleToggleStatus(event.id)}
                      className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        event.isActive
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {event.isActive ? '✓ Active' : '○ Inactive'}
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-primary-600">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between mb-4 bg-gray-50 p-3 rounded-xl">
                    <div>
                      <div className="text-xs text-gray-500">Raised</div>
                      <div className="font-bold text-primary-600">{formatCurrency(event.currentAmount)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Goal</div>
                      <div className="font-bold text-gray-900">{formatCurrency(event.targetAmount)}</div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-sm text-gray-600 mb-4">
                    <div>📅 {formatDate(event.startDate)} - {formatDate(event.endDate)}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="flex-1 text-center bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      ✏️ Edit
                    </Link>
                    <Link
                      href={`/events/${event.id}`}
                      target="_blank"
                      className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      👁️ View
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-4 bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Create your first event to get started'}
            </p>
            <Link
              href="/admin/events/new"
              className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all"
            >
              ➕ Create Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
