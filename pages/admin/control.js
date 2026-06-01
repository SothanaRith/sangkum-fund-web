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

import SystemStatsPanel from '@/components/SystemStatsPanel';
import EventApprovalTable from '@/components/EventApprovalTable';
import UserManagementTable from '@/components/UserManagementTable';

export default function AdminControl() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newsFilter, setNewsFilter] = useState('all');
  
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
      const [eventsRes, donationsRes, usersRes, notificationsRes, blogRes, statsRes] = await Promise.all([
        apiClient.get('/api/admin/events').catch(() => ({ data: [] })),
        apiClient.get('/api/admin/donations').catch(() => ({ data: [] })),
        apiClient.get('/api/admin/users').catch(() => ({ data: [] })),
        adminAPI.notifications.getAll(0, 20).catch(() => ({ content: [] })),
        adminAPI.blog.getAll(0, 20).catch(() => ({ content: [] })),
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
      const notificationsData = notificationsRes?.content || [];
      const blogData = blogRes?.content || [];

      setEvents(eventsData);
      setDonations(donationsData);
      setUsers(usersData);
      setNotifications(notificationsData);
      setNews(blogData);

      // Calculate stats (fallback to computed values if API doesn't provide totals)
      const totalAmount = donationsData.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      const pendingEvents = eventsData.filter(e => e.status === 'PENDING').length;
      const activeUsers = usersData.filter(u => u.isActive).length;
      const unreadNotifications = notificationsData.filter(n => !n.read).length;

      const apiTotals = statsRes?.data?.totals || {};
      setStats({
        totalEvents: apiTotals.totalEvents ?? eventsData.length,
        pendingEvents: apiTotals.pendingEvents ?? pendingEvents,
        totalDonations: apiTotals.totalDonations ?? donationsData.length,
        totalAmount: apiTotals.totalAmount ?? totalAmount,
        totalUsers: apiTotals.totalUsers ?? usersData.length,
        activeUsers: apiTotals.activeUsers ?? activeUsers,
        notifications: unreadNotifications,
        newsItems: blogData.length,
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

  const handleEventAction = async (eventId, action, reason = '') => {
    try {
      if (action === 'approve') {
        await apiClient.post(`/api/admin/events/${eventId}/approve`);
        alert('Event approved successfully!');
      } else if (action === 'reject') {
        await apiClient.post(`/api/admin/events/${eventId}/reject`, { reason: reason || 'Event does not meet guidelines' });
        alert('Event rejected!');
      } else if (action === 'delete') {
        await apiClient.delete(`/api/admin/events/${eventId}`);
        alert('Event deleted!');
      }
      loadData();
    } catch (err) {
      console.error('Action failed:', err);
      alert('Failed to perform action: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'activate') {
        await adminAPI.users.activate(userId);
        alert('User activated successfully!');
      } else if (action === 'deactivate') {
        await adminAPI.users.deactivate(userId);
        alert('User deactivated successfully!');
      } else if (action === 'block') {
        await adminAPI.users.block(userId);
        alert('User blocked successfully!');
      } else if (action === 'unblock') {
        await adminAPI.users.unblock(userId);
        alert('User unblocked successfully!');
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this user?')) {
          await apiClient.delete(`/api/admin/users/${userId}`);
          alert('User deleted successfully!');
        }
      }
      loadData();
    } catch (err) {
      console.error('Action failed:', err);
      alert('Failed to perform action: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleNotificationAction = async (action, notificationId = null) => {
    try {
      if (action === 'read' && notificationId) {
        await adminAPI.notifications.markAsRead(notificationId);
      } else if (action === 'dismiss' && notificationId) {
        await adminAPI.notifications.dismiss(notificationId);
      } else if (action === 'mark-all-read') {
        await adminAPI.notifications.markAllAsRead();
      }
      loadData();
    } catch (err) {
      console.error('Notification action failed:', err);
    }
  };

  const handleBlogAction = async (articleId, action) => {
    try {
      if (action === 'delete') {
        if (confirm('Are you sure you want to delete this article?')) {
          await adminAPI.blog.delete(articleId);
          alert('Article deleted successfully!');
          loadData();
        }
      } else if (action === 'publish') {
        await adminAPI.blog.publish(articleId);
        alert('Article published successfully!');
        loadData();
      } else if (action === 'unpublish') {
        await adminAPI.blog.unpublish(articleId);
        alert('Article unpublished successfully!');
        loadData();
      }
    } catch (err) {
      console.error('Blog action failed:', err);
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
          <div className="relative mb-8">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-8 h-8 text-orange-600 animate-pulse" />
            </div>
          </div>
          <div className="text-xl text-gray-700 font-bold mb-2">Loading Admin Control Center</div>
          <div className="text-sm text-gray-500">Please wait while we fetch your data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                Admin Control Center
              </h1>
              <p className="text-gray-600 mt-2 font-medium">Comprehensive platform management dashboard</p>
              {lastUpdated && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-500">Live · Last updated {new Date(lastUpdated).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-md transition-all duration-200 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-orange-100 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full shadow-sm">
                {stats.pendingEvents} pending
              </span>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">{stats.totalEvents}</div>
            <div className="text-sm text-gray-600 font-medium">Total Events</div>
            <div className="mt-3 pt-3 border-t border-orange-100">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>Campaign tracking</span>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-green-100 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">{formatCurrency(stats.totalAmount)}</div>
            <div className="text-sm text-gray-600 font-medium">{stats.totalDonations} Donations</div>
            <div className="mt-3 pt-3 border-t border-green-100">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>Revenue growth</span>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-blue-100 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full shadow-sm">
                {stats.activeUsers} active
              </span>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600 font-medium">Total Users</div>
            <div className="mt-3 pt-3 border-t border-blue-100">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>User engagement</span>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-purple-100 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">{stats.notifications}</div>
            <div className="text-sm text-gray-600 font-medium">Pending Alerts</div>
            <div className="mt-3 pt-3 border-t border-purple-100">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>Requires attention</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 p-2 border border-gray-100">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-600'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${
                  activeTab === tab.id ? 'animate-pulse' : ''
                }`} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                    activeTab === tab.id ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none bg-white font-medium cursor-pointer hover:border-orange-300 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all font-semibold shadow-sm hover:shadow-md">
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
            <SystemStatsPanel
              stats={stats}
              health={health}
              events={events}
              donations={donations}
              users={users}
            />
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="p-6">
              <EventApprovalTable
                events={events}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                handleEventAction={handleEventAction}
              />
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by donor name, event, or transaction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              {/* Donation List */}
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
                    {donations.filter(d => {
                      const matchesSearch = !searchTerm || 
                        d.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = filterStatus === 'all' || 
                        d.status?.toLowerCase() === filterStatus.toLowerCase();
                      return matchesSearch && matchesStatus;
                    }).map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{donation.userName || 'Anonymous'}</div>
                              <div className="text-sm text-gray-500 truncate">{donation.userEmail || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 truncate">{donation.eventTitle}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(donation.amount)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            donation.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                            donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(donation.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              const statusEmoji = donation.status === 'SUCCESS' ? '✅' : 
                                                 donation.status === 'PENDING' ? '⏳' : '❌';
                              alert(`Donation Details\n\nDonor: ${donation.userName || 'Anonymous'}\nEmail: ${donation.userEmail || 'N/A'}\nEvent: ${donation.eventTitle}\nAmount: ${formatCurrency(donation.amount)}\nStatus: ${statusEmoji} ${donation.status}\nDate: ${formatDate(donation.createdAt)}\nTransaction: ${donation.transactionRef || 'N/A'}`);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* No donations message */}
              {donations.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No donations found</p>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="p-6">
              <UserManagementTable
                users={users}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                setSearchTerm={setSearchTerm}
                handleUserAction={handleUserAction}
              />
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {/* Filter Section */}
              <div className="flex gap-4 flex-wrap mb-4">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Notifications
                </button>
                <button
                  onClick={() => setFilterStatus('unread')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'unread'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🔔 Pending ({notifications.filter(n => !n.read).length})
                </button>
                <button
                  onClick={() => setFilterStatus('system')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'system'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📬 System
                </button>
                <button
                  onClick={() => handleNotificationAction('mark-all-read')}
                  disabled={notifications.filter(n => !n.read).length === 0}
                  className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50 font-medium"
                >
                  ✓ Mark All Read
                </button>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {notifications
                  .filter(notif => {
                    if (filterStatus === 'unread') return !notif.read;
                    if (filterStatus === 'system') return notif.type === 'SYSTEM';
                    return true;
                  })
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all border-l-4 ${
                        notification.read
                          ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          : 'bg-orange-50 border-orange-500 hover:bg-orange-100'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-lg flex-shrink-0 ${
                          notification.type === 'SYSTEM'
                            ? 'bg-blue-100'
                            : notification.type === 'EVENT'
                            ? 'bg-purple-100'
                            : notification.type === 'DONATION'
                            ? 'bg-green-100'
                            : notification.type === 'SECURITY'
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        {notification.type === 'SYSTEM' ? (
                          <AlertTriangle className="w-5 h-5 text-blue-600" />
                        ) : notification.type === 'EVENT' ? (
                          <Calendar className="w-5 h-5 text-purple-600" />
                        ) : notification.type === 'DONATION' ? (
                          <DollarSign className="w-5 h-5 text-green-600" />
                        ) : notification.type === 'SECURITY' ? (
                          <Shield className="w-5 h-5 text-red-600" />
                        ) : (
                          <Bell className="w-5 h-5 text-gray-600" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500">
                                ⏰ {timeAgo(notification.createdAt)}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                notification.type === 'SYSTEM'
                                  ? 'bg-blue-100 text-blue-700'
                                  : notification.type === 'EVENT'
                                  ? 'bg-purple-100 text-purple-700'
                                  : notification.type === 'DONATION'
                                  ? 'bg-green-100 text-green-700'
                                  : notification.type === 'SECURITY'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {notification.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {notification.actionUrl && notification.actionLabel && (
                            <button className="px-3 py-1.5 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-1">
                              <ChevronRight className="w-3 h-3" />
                              {notification.actionLabel}
                            </button>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => handleNotificationAction('read', notification.id)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-lg hover:bg-blue-100 transition-colors font-medium"
                            >
                              ✓ Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => handleNotificationAction('dismiss', notification.id)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            ✕ Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {notifications.filter(n => {
                  if (filterStatus === 'unread') return !n.read;
                  if (filterStatus === 'system') return n.type === 'SYSTEM';
                  return true;
                }).length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium">No notifications</p>
                    <p className="text-sm">All caught up!</p>
                  </div>
                )}
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

              {/* Filter Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setNewsFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    newsFilter === 'all'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Articles ({news.length})
                </button>
                <button
                  onClick={() => setNewsFilter('published')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    newsFilter === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Published ({news.filter(a => a.status === 'PUBLISHED').length})
                </button>
                <button
                  onClick={() => setNewsFilter('drafts')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    newsFilter === 'drafts'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Drafts ({news.filter(a => a.status === 'DRAFT').length})
                </button>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.filter(article => {
                  if (newsFilter === 'published') return article.status === 'PUBLISHED';
                  if (newsFilter === 'drafts') return article.status === 'DRAFT';
                  return true;
                }).map((article) => (
                  <div key={article.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    {article.coverImageUrl && (
                      <img
                        src={article.coverImageUrl}
                        alt={article.title}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    {!article.coverImageUrl && (
                      <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-orange-300 opacity-50" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            article.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {article.status === 'PUBLISHED' ? '✓ Published' : '⊘ Draft'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {article.excerpt || 'No description available'}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/blog/edit/${article.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        {article.status === 'PUBLISHED' && (
                          <button
                            onClick={() => handleBlogAction(article.id, 'unpublish')}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            Unpublish
                          </button>
                        )}
                        {article.status === 'DRAFT' && (
                          <button
                            onClick={() => handleBlogAction(article.id, 'publish')}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleBlogAction(article.id, 'delete')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {news.filter(article => {
                if (newsFilter === 'published') return article.status === 'PUBLISHED';
                if (newsFilter === 'drafts') return article.status === 'DRAFT';
                return true;
              }).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">No articles found</p>
                  <p className="text-sm">
                    {newsFilter === 'published' && 'No published articles yet.'}
                    {newsFilter === 'drafts' && 'No draft articles yet.'}
                    {newsFilter === 'all' && 'Create your first article to get started.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
