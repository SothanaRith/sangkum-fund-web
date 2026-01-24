import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalDonations: 0,
    totalAmount: 0,
    pendingDonations: 0,
    successfulDonations: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    // In production, check if user is admin
  };

  const loadDashboardData = async () => {
    try {
      // Load events
      const eventsRes = await apiClient.get('/api/admin/events');
      const eventsData = eventsRes.data;
      setEvents(eventsData.slice(0, 5)); // Top 5 events

      // Load donations
      const donationsRes = await apiClient.get('/api/admin/donations');
      const donationsData = donationsRes.data;
      setRecentDonations(donationsData.slice(0, 10)); // Recent 10

      // Calculate stats
      const totalAmount = donationsData.reduce((sum, d) => sum + parseFloat(d.amount), 0);
      const pending = donationsData.filter(d => d.status === 'PENDING').length;
      const successful = donationsData.filter(d => d.status === 'SUCCESS').length;

      setStats({
        totalEvents: eventsData.length,
        activeEvents: eventsData.filter(e => e.isActive).length,
        totalDonations: donationsData.length,
        totalAmount,
        pendingDonations: pending,
        successfulDonations: successful,
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading admin dashboard...</div>
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
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                🎛️ Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-600">Manage events, donations, and monitor activity</p>
          </div>
          <Link
            href="/admin/events/new"
            className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            ➕ Create Event
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Events</p>
                <p className="text-4xl font-bold">{stats.totalEvents}</p>
                <p className="text-blue-100 text-xs mt-1">{stats.activeEvents} active</p>
              </div>
              <div className="text-5xl opacity-80">🎯</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Raised</p>
                <p className="text-4xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                <p className="text-green-100 text-xs mt-1">{stats.totalDonations} donations</p>
              </div>
              <div className="text-5xl opacity-80">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Successful</p>
                <p className="text-4xl font-bold">{stats.successfulDonations}</p>
                <p className="text-purple-100 text-xs mt-1">Completed donations</p>
              </div>
              <div className="text-5xl opacity-80">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm mb-1">Pending</p>
                <p className="text-4xl font-bold">{stats.pendingDonations}</p>
                <p className="text-yellow-100 text-xs mt-1">Awaiting verification</p>
              </div>
              <div className="text-5xl opacity-80">⏳</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/events"
            className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn group"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Manage Events
                </h3>
                <p className="text-sm text-gray-600">Create, edit, and delete events</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/donations"
            className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn group"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">💳</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Review Donations
                </h3>
                <p className="text-sm text-gray-600">Approve and manage donations</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/charities"
            className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn group"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🏛️</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Verify Charities
                </h3>
                <p className="text-sm text-gray-600">Review charity applications</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn group"
            style={{ animationDelay: '0.7s' }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">👥</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Manage Users
                </h3>
                <p className="text-sm text-gray-600">View and manage user accounts</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">📊</span>
              Recent Donations
            </h2>
            <Link
              href="/admin/donations"
              className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>

          {recentDonations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No donations yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Donor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donation.anonymous ? '🕵️ Anonymous' : donation.userName || 'User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {donation.eventTitle || `Event #${donation.eventId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600">
                        {formatCurrency(donation.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {donation.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          donation.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                          donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(donation.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">🏆</span>
              Top Events
            </h2>
            <Link
              href="/admin/events"
              className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
            >
              Manage All →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No events created yet</div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>💰 {formatCurrency(event.currentAmount)} raised</span>
                      <span>🎯 Goal: {formatCurrency(event.targetAmount)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
