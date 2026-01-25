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
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
    }
  };

  const loadData = async () => {
    try {
      // Load donations (first page with 10 items)
      const donationsResponse = await donationsAPI.getMyDonations(0, 10);
      const donationsData = donationsResponse.content || donationsResponse || [];
      setDonations(donationsData);

      // Load my events (first page with 10 items)
      const eventsResponse = await eventsAPI.getMyEvents(0, 10);
      const eventsData = eventsResponse.content || eventsResponse || [];
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
        return 'bg-amber-100 text-amber-800 border-amber-200';
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
            <div className="text-lg text-gray-600">Loading your dashboard...</div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  My Dashboard
                </h1>
                <p className="text-gray-600">Track your contributions and impact</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Donated</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {formatCurrency(stats.totalDonated)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Across {stats.totalDonations} donations</p>
                </div>
                <div className="text-5xl text-orange-500">💰</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn border border-gray-100" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Donations</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {stats.totalDonations}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All-time contributions</p>
                </div>
                <div className="text-5xl text-amber-500">🎁</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn border border-gray-100" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">My Campaigns</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.myEventsCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Fundraising campaigns</p>
                </div>
                <div className="text-5xl text-green-500">🎯</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fadeIn border border-gray-100" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pendingDonations}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
                </div>
                <div className="text-5xl text-yellow-500">⏳</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
            <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'overview'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              📊 Overview
            </button>
            <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'analytics'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              📈 Analytics
            </button>
            <button
                onClick={() => setActiveTab('donations')}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'donations'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              💳 Donations
            </button>
            <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'events'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              🎯 Campaigns
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back! 👋</h2>
                  <p className="text-gray-600 mb-6">Here's a quick overview of your impact and activities</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-orange-900">Total Impact</h3>
                        <span className="text-4xl text-orange-600">💚</span>
                      </div>
                      <p className="text-3xl font-bold text-orange-600 mb-2">{formatCurrency(stats.totalDonated)}</p>
                      <p className="text-sm text-orange-700">Across {stats.totalDonations} donations</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-green-900">Active Campaigns</h3>
                        <span className="text-4xl text-green-600">🎯</span>
                      </div>
                      <p className="text-3xl font-bold text-green-600 mb-2">{stats.myEventsCount}</p>
                      <p className="text-sm text-green-700">Campaigns you've created</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    <Link
                        href="/events"
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View all →
                    </Link>
                  </div>
                  {donations.slice(0, 5).map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-orange-50/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                    <span className={`text-2xl ${donation.status === 'SUCCESS' ? 'text-green-500' : donation.status === 'PENDING' ? 'text-amber-500' : 'text-red-500'}`}>
                      {getStatusIcon(donation.status)}
                    </span>
                          <div>
                            <p className="font-semibold text-gray-900">{donation.eventTitle}</p>
                            <p className="text-sm text-gray-500">{formatDate(donation.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">{formatCurrency(donation.amount)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                        </div>
                      </div>
                  ))}
                  {donations.length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-500">No recent activity</p>
                        <Link
                            href="/events"
                            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
                        >
                          Browse Campaigns
                        </Link>
                      </div>
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
                              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                <div className="text-7xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
                                <p className="text-gray-600 mb-6">Start making donations to see your analytics!</p>
                                <Link
                                    href="/events"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
                                >
                                  Browse Campaigns
                                </Link>
                              </div>
                          )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                      <div className="text-7xl mb-4 animate-bounce">📈</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Analytics...</h3>
                      <p className="text-gray-600">Analyzing your donation data</p>
                    </div>
                )}
              </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn border border-gray-100">
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
                          className="inline-block bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
                      >
                        Browse Campaigns
                      </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Campaign
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
                            <tr key={donation.id} className="hover:bg-orange-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {donation.eventTitle || `Campaign #${donation.eventId}`}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-orange-600">
                                  {formatCurrency(donation.amount)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                  {donation.paymentMethod?.replace('_', ' ') || 'Unknown'}
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

          {/* My Campaigns Tab */}
          {activeTab === 'events' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="mr-2">🎯</span>
                    My Campaigns
                  </h2>
                  <Link
                      href="/events/create"
                      className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-5 py-2 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-md flex items-center gap-2"
                  >
                    <span>➕</span>
                    <span>Create Campaign</span>
                  </Link>
                </div>

                {myEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-7xl mb-4">🚀</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns created yet</h3>
                      <p className="text-gray-600 mb-6">Start your own fundraising campaign!</p>
                      <Link
                          href="/events/create"
                          className="inline-block bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
                      >
                        Create Your First Campaign
                      </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myEvents.map((event) => {
                        const progress = calculateProgress(event.currentAmount, event.targetAmount);

                        return (
                            <div key={event.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-orange-200">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-2">
                                  {event.title}
                                </h3>
                                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
                                    event.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                          {event.isActive ? '✓ Active' : '○ Inactive'}
                        </span>
                              </div>

                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                              {/* Progress */}
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Progress</span>
                                  <span className="font-semibold text-orange-600">{progress.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
                                      style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="flex justify-between text-sm mb-4">
                                <div>
                                  <span className="text-gray-500">Raised: </span>
                                  <span className="font-bold text-orange-600">{formatCurrency(event.currentAmount)}</span>
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
                                  className="block text-center bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 py-2 rounded-lg font-semibold hover:from-orange-100 hover:to-amber-100 transition-colors border border-orange-200"
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