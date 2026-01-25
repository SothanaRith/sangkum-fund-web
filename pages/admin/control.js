import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { adminAPI } from '@/lib/admin-api';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Bell,
  Users,
  Newspaper,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Shield,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';

export default function AdminControl() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Data states
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingEvents: 0,
    totalDonations: 0,
    totalAmount: 0,
    totalUsers: 0,
    activeUsers: 0,
    notifications: 0,
    newsItems: 0,
  });
  const [health, setHealth] = useState({
    apiResponseTime: 95,
    dbLoad: 62,
    storageUsage: 78,
    activeSessions: 88,
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    checkAuth();
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [eventsRes, donationsRes, usersRes, statsRes] = await Promise.all([
        apiClient.get('/api/admin/events').catch(() => ({ data: [] })),
        apiClient.get('/api/admin/donations').catch(() => ({ data: [] })),
        apiClient.get('/api/admin/users').catch(() => ({ data: [] })),
        adminAPI.stats.getDashboard().catch(() => ({
          data: {
            totals: {},
            health: {},
          },
        })),
      ]);

      const eventsData = Array.isArray(eventsRes.data) ? eventsRes.data : [];
      const donationsData = Array.isArray(donationsRes.data) ? donationsRes.data : [];
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];

      setEvents(eventsData);
      setDonations(donationsData);
      setUsers(usersData);

      // Calculate stats (fallback to computed values if API doesn't provide totals)
      const totalAmount = donationsData.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      const pendingEvents = eventsData.filter(e => e.status === 'PENDING').length;
      const activeUsers = usersData.filter(u => u.isActive).length;

      const apiTotals = statsRes?.data?.totals || {};
      setStats({
        totalEvents: apiTotals.totalEvents ?? eventsData.length,
        pendingEvents: apiTotals.pendingEvents ?? pendingEvents,
        totalDonations: apiTotals.totalDonations ?? donationsData.length,
        totalAmount: apiTotals.totalAmount ?? totalAmount,
        totalUsers: apiTotals.totalUsers ?? usersData.length,
        activeUsers: apiTotals.activeUsers ?? activeUsers,
        notifications: apiTotals.notifications ?? 12,
        newsItems: apiTotals.newsItems ?? 8,
      });

      const apiHealth = statsRes?.data?.health || {};
      setHealth({
        apiResponseTime: apiHealth.apiResponseTime ?? 95,
        dbLoad: apiHealth.dbLoad ?? 62,
        storageUsage: apiHealth.storageUsage ?? 78,
        activeSessions: apiHealth.activeSessions ?? 88,
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventAction = async (eventId, action) => {
    try {
      if (action === 'approve') {
        await apiClient.put(`/api/admin/events/${eventId}/approve`);
        alert('Event approved successfully!');
      } else if (action === 'reject') {
        await apiClient.put(`/api/admin/events/${eventId}/reject`);
        alert('Event rejected!');
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this event?')) {
          await apiClient.delete(`/api/admin/events/${eventId}`);
          alert('Event deleted!');
        }
      }
      loadData();
    } catch (err) {
      console.error('Action failed:', err);
      alert('Failed to perform action');
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'activate') {
        await apiClient.put(`/api/admin/users/${userId}/activate`);
        alert('User activated!');
      } else if (action === 'deactivate') {
        await apiClient.put(`/api/admin/users/${userId}/deactivate`);
        alert('User deactivated!');
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this user?')) {
          await apiClient.delete(`/api/admin/users/${userId}`);
          alert('User deleted!');
        }
      }
      loadData();
    } catch (err) {
      console.error('Action failed:', err);
      alert('Failed to perform action');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar, count: stats.pendingEvents },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: stats.notifications },
    { id: 'news', label: 'News', icon: Newspaper },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
          <div className="text-lg text-gray-600 font-medium">Loading admin control...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-600" />
                Admin Control Center
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor platform activities</p>
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-1">Last updated {new Date(lastUpdated).toLocaleTimeString()}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all shadow-md"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                {stats.pendingEvents} pending
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalEvents}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(stats.totalAmount)}</div>
            <div className="text-sm text-gray-600">{stats.totalDonations} Donations</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stats.activeUsers} active
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.notifications}</div>
            <div className="text-sm text-gray-600">Pending Notifications</div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-md mb-6 p-2 border border-gray-100">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {[
                      ...events.slice(0,5).map(e => ({
                        title: 'New event submitted',
                        detail: e.title,
                        time: e.createdAt,
                      })),
                      ...donations.slice(0,5).map(d => ({
                        title: 'New donation received',
                        detail: `${d.donorName || 'Anonymous'} → ${d.eventTitle}`,
                        time: d.createdAt,
                      })),
                      ...users.slice(0,5).map(u => ({
                        title: 'New user registered',
                        detail: u.username || u.email,
                        time: u.createdAt,
                      })),
                    ]
                      .sort((a,b) => new Date(b.time) - new Date(a.time))
                      .slice(0,6)
                      .map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-600">{item.detail}</div>
                            <div className="text-xs text-gray-500 mt-1">{item.time ? timeAgo(item.time) : 'Just now'}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* System Health */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-green-600" />
                    System Health
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'API Response Time', value: health.apiResponseTime, className: 'bg-green-500' },
                      { label: 'Database Load', value: health.dbLoad, className: 'bg-blue-500' },
                      { label: 'Storage Usage', value: health.storageUsage, className: 'bg-orange-500' },
                      { label: 'Active Sessions', value: health.activeSessions, className: 'bg-purple-500' },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{metric.label}</span>
                          <span className="font-medium text-gray-900">{metric.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${metric.className}`}
                            style={{ width: `${metric.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Organizer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.filter(e => 
                    !searchTerm || 
                    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500">{event.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{event.ownerName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          event.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(event.currentAmount)} / {formatCurrency(event.goalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/events/${event.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {event.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleEventAction(event.id, 'approve')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEventAction(event.id, 'reject')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEventAction(event.id, 'delete')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{donation.donorName || 'Anonymous'}</div>
                            <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{donation.eventTitle}</td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(donation.amount)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          donation.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                          donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(donation.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.filter(u => 
                    !searchTerm || 
                    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4 text-green-500" />
                          <span>Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Bell className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">New Event Awaiting Approval</div>
                          <div className="text-sm text-gray-600 mt-1">
                            "Help Build School in Siem Reap" requires your review
                          </div>
                          <div className="text-xs text-gray-500 mt-2">{i} hours ago</div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Tab */}
          {activeTab === 'news' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage News Articles</h2>
                <Link
                  href="/admin/blog/new"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all"
                >
                  <Newspaper className="w-4 h-4" />
                  Create Article
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-200"></div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          Published
                        </span>
                        <span className="text-xs text-gray-500">{i} days ago</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Community Success Story: Building Hope in Cambodia
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Discover how local communities are making a difference...
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
