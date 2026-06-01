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
import {
  CheckCircle, Clock, XCircle, HelpCircle, BarChart3,
  TrendingUp, TrendingDown, Download, Calendar, DollarSign, Target, CreditCard, AlertTriangle, SlidersHorizontal,
} from 'lucide-react';
import { DashboardStatSkeleton, ChartSkeleton, Skeleton } from '@/components/Skeleton';

export default function UserDashboard() {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    pendingDonations: 0,
    myEventsCount: 0,
  });

  useEffect(() => {
    checkAuth();
    loadDonationsAndEvents();
  }, []);

  useEffect(() => {
    loadAnalytics(dateRange);
  }, [dateRange]);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
    } else {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    }
  };

  const loadDonationsAndEvents = async () => {
    try {
      const [donationsResponse, eventsResponse] = await Promise.all([
        donationsAPI.getMyDonations(0, 50),
        eventsAPI.getMyEvents(0, 10),
      ]);
      const donationsData = donationsResponse.content || donationsResponse || [];
      const eventsData = eventsResponse.content || eventsResponse || [];
      setDonations(donationsData);
      setMyEvents(eventsData);
      const totalDonated = donationsData.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      const pending = donationsData.filter(d => d.status === 'PENDING').length;
      setStats({
        totalDonated,
        totalDonations: donationsData.length,
        pendingDonations: pending,
        myEventsCount: eventsData.length,
      });
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load your dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (range = 'all') => {
    setAnalyticsLoading(true);
    try {
      const analyticsData = await dashboardAPI.getAnalytics(range);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Analytics not available:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Derive this-month vs last-month trend from donationsByMonth
  const computeTrends = (analyticsData) => {
    if (!analyticsData?.donationsByMonth?.length) return null;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const thisMonthKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}`;
    const months = analyticsData.donationsByMonth;
    const cur = months.find(m => String(m.month).startsWith(thisMonthKey)) || { total: 0, count: 0 };
    const last = months.find(m => String(m.month).startsWith(prevMonthKey)) || { total: 0, count: 0 };
    return {
      thisMonthTotal: parseFloat(cur.total) || 0,
      amountTrend: last.total > 0
        ? ((parseFloat(cur.total) - parseFloat(last.total)) / parseFloat(last.total)) * 100
        : parseFloat(cur.total) > 0 ? 100 : 0,
      countTrend: last.count > 0
        ? ((cur.count - last.count) / last.count) * 100
        : cur.count > 0 ? 100 : 0,
    };
  };

  const exportCSV = () => {
    const headers = ['Campaign', 'Amount (USD)', 'Payment Method', 'Status', 'Date'];
    const rows = donations.map(d => [
      d.eventTitle || `Campaign #${d.eventId}`,
      parseFloat(d.amount).toFixed(2),
      d.paymentMethod?.replace(/_/g, ' ') || 'Unknown',
      d.status,
      formatDate(d.createdAt),
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    const className = "w-5 h-5";
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className={className + " text-green-500"} />;
      case 'PENDING':
        return <Clock className={className + " text-yellow-500"} />;
      case 'FAILED':
        return <XCircle className={className + " text-red-500"} />;
      default:
        return <HelpCircle className={className + " text-gray-500"} />;
    }
  };

  if (error && donations.length === 0 && myEvents.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-white">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-gray-800" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Couldn't load your dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
                onClick={loadData}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 animate-fadeIn flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                )}
                {user?.role && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                    {user.role}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
                  My Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, <span className="font-semibold">{user?.name || 'User'}</span>! Track your contributions and impact.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold shadow-md hover:from-amber-700 hover:to-amber-800 transition-all flex items-center gap-2 text-sm self-start sm:self-auto"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Go to Admin Page
                </Link>
              )}
              {/* Date Range Filter */}
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm self-start sm:self-auto">
                <Calendar className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'all', label: 'All Time' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setDateRange(value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    dateRange === value
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          {(() => {
            const trends = computeTrends(analytics);
            const kpiCards = [
              {
                label: 'Total Donated',
                value: formatCurrency(stats.totalDonated),
                sub: `${stats.totalDonations} donation${stats.totalDonations !== 1 ? 's' : ''} total`,
                icon: <DollarSign className="w-6 h-6 inline-block" />,
                iconColor: 'text-orange-500',
                trend: trends?.amountTrend,
              },
              {
                label: 'This Month',
                value: formatCurrency(trends?.thisMonthTotal ?? 0),
                sub: 'vs previous month',
                icon: <Calendar className="w-6 h-6 inline-block" />,
                iconColor: 'text-blue-500',
                trend: trends?.amountTrend,
              },
              {
                label: 'My Campaigns',
                value: stats.myEventsCount,
                sub: 'fundraising campaigns',
                icon: <Target className="w-6 h-6 inline-block" />,
                iconColor: 'text-green-500',
                trend: null,
              },
              {
                label: 'Pending',
                value: stats.pendingDonations,
                sub: 'awaiting confirmation',
                icon: '⏳',
                iconColor: 'text-amber-500',
                trend: null,
              },
            ];

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {loading ? (
                  <>
                    <DashboardStatSkeleton />
                    <DashboardStatSkeleton />
                    <DashboardStatSkeleton />
                    <DashboardStatSkeleton />
                  </>
                ) : kpiCards.map((card, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm font-medium text-gray-500">{card.label}</p>
                      <span className={`text-2xl ${card.iconColor}`}>{card.icon}</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">{card.sub}</p>
                      {card.trend != null && (
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          card.trend >= 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {card.trend >= 0
                            ? <TrendingUp className="w-3 h-3" />
                            : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(card.trend).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

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
              <BarChart3 className="w-4 h-4 inline-block mr-1 align-middle" /> Overview
            </button>
            <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'analytics'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              <TrendingUp className="w-4 h-4 inline-block mr-1 align-middle" /> Analytics
            </button>
            <button
                onClick={() => setActiveTab('donations')}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'donations'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              <CreditCard className="w-4 h-4 inline-block mr-1 align-middle" /> Donations
            </button>
            <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'events'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              <Target className="w-4 h-4 inline-block mr-1 align-middle" /> Campaigns
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
                        <Target className="w-8 h-8 text-green-600 inline-block" />
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
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-8 h-8 rounded" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div className="space-y-1.5 text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                          <Skeleton className="h-4 w-20 rounded-full ml-auto" />
                        </div>
                      </div>
                    ))
                  ) : donations.slice(0, 5).map((donation) => (
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
                  {!loading && donations.length === 0 && (
                      <div className="text-center py-10">
                        <svg className="w-20 h-20 mx-auto mb-4 opacity-50" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="8" y="16" width="64" height="48" rx="6" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.5"/>
                          <path d="M8 28l32 20 32-20" stroke="#fb923c" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                        <p className="text-gray-500 font-medium mb-4">No recent activity</p>
                        <Link
                            href="/events"
                            className="inline-block px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl text-sm font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
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
                {analyticsLoading ? (
                    <>
                      <ChartSkeleton />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartSkeleton />
                        <ChartSkeleton />
                      </div>
                      <ChartSkeleton />
                      <ChartSkeleton />
                    </>
                ) : analytics ? (
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
                                <svg className="w-28 h-28 mx-auto mb-6 opacity-60" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="12" y="60" width="16" height="32" rx="3" fill="#fed7aa"/>
                                  <rect x="36" y="44" width="16" height="48" rx="3" fill="#fdba74"/>
                                  <rect x="60" y="28" width="16" height="64" rx="3" fill="#fb923c"/>
                                  <rect x="84" y="16" width="16" height="76" rx="3" fill="#f97316"/>
                                  <path d="M8 94h96" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round"/>
                                  <circle cx="60" cy="36" r="18" fill="white" stroke="#e5e7eb" strokeWidth="2"/>
                                  <path d="M55 36h10M60 31v10" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
                                <p className="text-gray-500 mb-6 text-sm">Start making donations to see your analytics!</p>
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
                      <TrendingUp className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics unavailable</h3>
                      <p className="text-gray-600 mb-6">Could not load analytics data. Make some donations first or try again later.</p>
                      <button
                          onClick={() => loadAnalytics(dateRange)}
                          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
                      >
                        Retry
                      </button>
                    </div>
                )}
              </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span>📜</span>
                    Donation History
                  </h2>
                  {donations.length > 0 && (
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium text-sm border border-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  )}
                </div>

                {donations.length === 0 ? (
                    <div className="text-center py-16">
                      <svg className="w-28 h-28 mx-auto mb-6 opacity-60" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="16" y="24" width="80" height="68" rx="8" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2"/>
                        <path d="M30 44h52M30 56h36M30 68h24" stroke="#fdba74" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="80" cy="72" r="16" fill="#fff7ed" stroke="#fb923c" strokeWidth="2"/>
                        <path d="M80 66v6l4 4" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
                      <p className="text-gray-500 mb-6 text-sm">Start making a difference today!</p>
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
                    <Target className="w-5 h-5 inline-block mr-2 align-middle text-gray-900" />
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
                    <div className="text-center py-16">
                      <svg className="w-28 h-28 mx-auto mb-6 opacity-60" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="56" cy="56" r="40" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2"/>
                        <path d="M56 36v20l12 12" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M40 28l-8-8M72 28l8-8M56 20v-8" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                      <p className="text-gray-500 mb-6 text-sm">Start your own fundraising campaign!</p>
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