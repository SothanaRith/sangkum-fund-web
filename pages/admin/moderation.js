import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { eventsAPI, charitiesAPI, userAPI } from '@/lib/api';
import { eventModerationAPI, charityModerationAPI, userModerationAPI } from '@/lib/moderation-api';

export default function Moderation() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'users') {
        // Load users - you may need to create an admin endpoint to list all users
        setUsers([]);
      } else if (activeTab === 'events') {
        const eventsData = await eventsAPI.getAll();
        setEvents(eventsData);
      } else if (activeTab === 'charities') {
        const charitiesData = await charitiesAPI.getAll();
        setCharities(charitiesData);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockEvent = async (eventId) => {
    if (!blockReason.trim()) {
      alert('Please provide a reason for blocking');
      return;
    }

    if (!confirm('Are you sure you want to block this event?')) return;

    try {
      setActionLoading(true);
      await eventModerationAPI.blockEvent(eventId, blockReason);
      alert('Event blocked successfully');
      setSelectedItem(null);
      setBlockReason('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockEvent = async (eventId) => {
    if (!confirm('Are you sure you want to unblock this event?')) return;

    try {
      setActionLoading(true);
      await eventModerationAPI.unblockEvent(eventId);
      alert('Event unblocked successfully');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unblock event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockCharity = async (charityId) => {
    if (!blockReason.trim()) {
      alert('Please provide a reason for blocking');
      return;
    }

    if (!confirm('Are you sure you want to block this charity?')) return;

    try {
      setActionLoading(true);
      await charityModerationAPI.blockCharity(charityId, blockReason);
      alert('Charity blocked successfully');
      setSelectedItem(null);
      setBlockReason('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block charity');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockCharity = async (charityId) => {
    if (!confirm('Are you sure you want to unblock this charity?')) return;

    try {
      setActionLoading(true);
      await charityModerationAPI.unblockCharity(charityId);
      alert('Charity unblocked successfully');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unblock charity');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!blockReason.trim()) {
      alert('Please provide a reason for blocking');
      return;
    }

    if (!confirm('Are you sure you want to block this user?')) return;

    try {
      setActionLoading(true);
      await userModerationAPI.blockUser(userId, blockReason);
      alert('User blocked successfully');
      setSelectedItem(null);
      setBlockReason('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockUser = async (userId) => {
    if (!confirm('Are you sure you want to unblock this user?')) return;

    try {
      setActionLoading(true);
      await userModerationAPI.unblockUser(userId);
      alert('User unblocked successfully');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unblock user');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
          <p className="mt-2 text-gray-600">Block or unblock users, events, and charities that violate policies</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {['users', 'events', 'charities'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-600">No events found</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow p-6 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'BLOCKED'
                                ? 'bg-red-100 text-red-800'
                                : event.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                          <div className="text-sm text-gray-500">
                            Owner: {event.ownerName} | ID: {event.id}
                          </div>
                        </div>

                        <div className="ml-4">
                          {event.status === 'BLOCKED' ? (
                            <button
                              onClick={() => handleUnblockEvent(event.id)}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              Unblock
                            </button>
                          ) : selectedItem === `event-${event.id}` ? (
                            <div className="space-y-2">
                              <textarea
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                placeholder="Reason for blocking..."
                                className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows="2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleBlockEvent(event.id)}
                                  disabled={actionLoading}
                                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(null);
                                    setBlockReason('');
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedItem(`event-${event.id}`)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              🚫 Block
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Charities Tab */}
            {activeTab === 'charities' && (
              <div className="space-y-4">
                {charities.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-600">No charities found</p>
                  </div>
                ) : (
                  charities.map((charity) => (
                    <div
                      key={charity.id}
                      className="bg-white rounded-lg shadow p-6 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{charity.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              charity.status === 'BLOCKED'
                                ? 'bg-red-100 text-red-800'
                                : charity.status === 'VERIFIED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {charity.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2 line-clamp-2">{charity.description}</p>
                          <div className="text-sm text-gray-500">
                            Registration: {charity.registrationNumber} | ID: {charity.id}
                          </div>
                        </div>

                        <div className="ml-4">
                          {charity.status === 'BLOCKED' ? (
                            <button
                              onClick={() => handleUnblockCharity(charity.id)}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              Unblock
                            </button>
                          ) : selectedItem === `charity-${charity.id}` ? (
                            <div className="space-y-2">
                              <textarea
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                placeholder="Reason for blocking..."
                                className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows="2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleBlockCharity(charity.id)}
                                  disabled={actionLoading}
                                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(null);
                                    setBlockReason('');
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedItem(`charity-${charity.id}`)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              🚫 Block
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">User management feature coming soon</p>
                <p className="text-sm text-gray-500 mt-2">You'll need to create an admin endpoint to list users</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
