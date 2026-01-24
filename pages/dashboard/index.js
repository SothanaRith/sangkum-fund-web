import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { donationsAPI, eventsAPI, dashboardAPI } from '@/lib/api';
import { formatCurrency, formatDate, calculateProgress } from '@/lib/utils';
import {
  DonationTrendsChart,
  DonationsByMonthChart,
  DonationsByStatusChart,
  TopEventsChart,
  EventsPerformanceChart
} from '@/components/DashboardCharts';

export default function UserDashboard() {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    pendingDonations: 0,
    myEventsCount: 0,
  });

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  };

  const loadData = async () => {
    try {
      // Load donations
      const donationsData = await donationsAPI.getMyDonations();
      setDonations(donationsData);
      
      // Load my events
      const eventsData = await eventsAPI.getMyEvents();
      setMyEvents(eventsData);
      
      // Load analytics
      try {
        const analyticsData = await dashboardAPI.getAnalytics();
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Analytics not available:', err);
      }
      
      // Calculate stats
      const totalDonated = donationsData.reduce((sum, d) => sum + parseFloat(d.amount), 0);
      const pending = donationsData.filter(d => d.status === 'PENDING').length;
      
      setStats({
        totalDonated,
        totalDonations: donationsData.length,
        pendingDonations: pending,
        myEventsCount: eventsData.length,
      });
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return '✅';
      case 'PENDING':
        return '⏳';
      case 'FAILED':
        return '❌';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              My Dashboard
            </span>
          </h1>
          <p className="text-gray-600">Track your contributions and impact</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Donated</p>
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(stats.totalDonated)}
                </p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalDonations}
                </p>
              </div>
              <div className="text-5xl">🎁</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">My Events</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.myEventsCount}
                </p>
              </div>
              <div className="text-5xl">🎯</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pendingDonations}
                </p>
              </div>
              <div className="text-5xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-2 bg-white rounded-2xl shadow-lg p-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📈 Analytics
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'donations'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            💳 Donations
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🎯 Events
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back! 👋</h2>
              <p className="text-gray-600 mb-6">Here's a quick overview of your impact and activities</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-900">Total Impact</h3>
                    <span className="text-4xl">💚</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(stats.totalDonated)}</p>
                  <p className="text-sm text-green-700">Across {stats.totalDonations} donations</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-purple-900">Active Events</h3>
                    <span className="text-4xl">🎯</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-2">{stats.myEventsCount}</p>
                  <p className="text-sm text-purple-700">Events you've created</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
              {donations.slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(donation.status)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{donation.eventTitle}</p>
                      <p className="text-sm text-gray-500">{formatDate(donation.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{formatCurrency(donation.amount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))}
              {donations.length === 0 && (
                <p className="text-center text-gray-500 py-8">No recent activity</p>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            {analytics ? (
              <>
                {analytics.donationTrends && analytics.donationTrends.length > 0 && (
                  <DonationTrendsChart data={analytics.donationTrends} />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analytics.donationsByMonth && analytics.donationsByMonth.length > 0 && (
                    <DonationsByMonthChart data={analytics.donationsByMonth} />
                  )}

                  {analytics.donationsByStatus && analytics.donationsByStatus.length > 0 && (
                    <DonationsByStatusChart data={analytics.donationsByStatus} />
                  )}
                </div>

                {analytics.topEvents && analytics.topEvents.length > 0 && (
                  <TopEventsChart data={analytics.topEvents} />
                )}

                {analytics.eventsPerformance && analytics.eventsPerformance.length > 0 && (
                  <EventsPerformanceChart data={analytics.eventsPerformance} />
                )}

                {(!analytics.donationTrends || analytics.donationTrends.length === 0) && 
                 (!analytics.donationsByMonth || analytics.donationsByMonth.length === 0) && (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="text-7xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
                    <p className="text-gray-600">Start making donations to see your analytics!</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-7xl mb-4 animate-bounce">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Analytics...</h3>
                <p className="text-gray-600">Analyzing your donation data</p>
              </div>
            )}
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📜</span>
              Donation History
            </h2>

            {donations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-7xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
                <p className="text-gray-600 mb-6">Start making a difference today!</p>
                <Link
                  href="/events"
                  className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {donation.eventTitle || `Event #${donation.eventId}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-primary-600">
                            {formatCurrency(donation.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {donation.paymentMethod.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(donation.status)}`}>
                            <span className="mr-1">{getStatusIcon(donation.status)}</span>
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
        )}

        {/* My Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">🎯</span>
                My Events
              </h2>
              <Link
                href="/events/create"
                className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-5 py-2 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-md"
              >
                ➕ Create Event
              </Link>
            </div>

            {myEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-7xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events created yet</h3>
                <p className="text-gray-600 mb-6">Start your own fundraising campaign!</p>
                <Link
                  href="/events/create"
                  className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all"
                >
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myEvents.map((event) => {
                  const progress = calculateProgress(event.currentAmount, event.targetAmount);
                  
                  return (
                    <div key={event.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-2">
                          {event.title}
                        </h3>
                        <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
                          event.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.isActive ? '✓ Active' : '○ Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
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
                      <div className="flex justify-between text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Raised: </span>
                          <span className="font-bold text-primary-600">{formatCurrency(event.currentAmount)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Goal: </span>
                          <span className="font-bold">{formatCurrency(event.targetAmount)}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        Ends: {formatDate(event.endDate)}
                      </div>
                      
                      {/* Actions */}
                      <Link
                        href={`/events/${event.id}`}
                        className="block text-center bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
