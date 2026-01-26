import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { eventVerificationAPI } from '@/lib/admin-event-api';
import { CheckCircle } from 'lucide-react';

export default function EventVerification() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const data = await eventVerificationAPI.getPendingEvents();
      setEvents(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending events');
      console.error('Error fetching pending events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    if (!confirm('Are you sure you want to approve this event?')) return;

    try {
      setActionLoading(true);
      await eventVerificationAPI.approveEvent(eventId);
      alert('Event approved successfully!');
      fetchPendingEvents(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (eventId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!confirm('Are you sure you want to reject this event?')) return;

    try {
      setActionLoading(true);
      await eventVerificationAPI.rejectEvent(eventId, rejectionReason);
      alert('Event rejected');
      setSelectedEvent(null);
      setRejectionReason('');
      fetchPendingEvents(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject event');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Verification</h1>
          <p className="mt-2 text-gray-600">Review and approve events submitted by organizers</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Events Count */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            📋 {events.length} event(s) pending approval
          </p>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No events waiting for approval</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-1/3">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 md:h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                        <span className="text-white text-6xl">🎉</span>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            👤 {event.owner?.name || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            🏷️ {event.visibility}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        ⏳ Pending
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>

                    {/* Event Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Goal Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(event.goalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Start Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(event.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">End Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(event.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Charity</p>
                        <p className="font-semibold text-gray-900">{event.charity?.name || 'None'}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {selectedEvent === event.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter reason for rejection..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows="3"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReject(event.id)}
                            disabled={actionLoading || !rejectionReason.trim()}
                            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(null);
                              setRejectionReason('');
                            }}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(event.id)}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          <span>✓</span>
                          <span>{actionLoading ? 'Processing...' : 'Approve Event'}</span>
                        </button>
                        <button
                          onClick={() => setSelectedEvent(event.id)}
                          disabled={actionLoading}
                          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          <span>✕</span>
                          <span>Reject Event</span>
                        </button>
                        <button
                          onClick={() => router.push(`/events/${event.id}`)}
                          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
