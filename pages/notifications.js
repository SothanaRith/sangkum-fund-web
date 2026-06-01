import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Coins,
  Inbox,
  Megaphone,
  RefreshCw,
  Rocket,
  Settings,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { notificationsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { NotificationRowSkeleton } from '@/components/Skeleton';
import Toast from '@/components/Toast';

const notificationIcons = {
  DONATION: Coins,
  EVENT: Target,
  ANNOUNCEMENT: Megaphone,
  MILESTONE: Trophy,
  VERIFICATION: BadgeCheck,
  SYSTEM: Settings,
  CAMPAIGN: Rocket,
  COMMUNITY: Users,
  SUCCESS: Sparkles,
  REMINDER: Clock,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [toast, setToast] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to mark as read' });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to mark all as read' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete notification' });
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 animate-fadeIn">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <Bell className="w-8 h-8 text-orange-600" />
                  {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-gradient-to-r from-orange-600 to-amber-600 rounded-full min-w-[20px] min-h-[20px]">
                    {unreadCount}
                  </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
              </div>
              <p className="text-gray-600">
                {unreadCount > 0 ? (
                    <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 animate-pulse"></span>
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </span>
                ) : (
                    <span className="text-green-600 inline-flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      All caught up!
                    </span>
                )}
              </p>
            </div>
            {unreadCount > 0 && (
                <button
                    onClick={handleMarkAllAsRead}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="inline-flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Mark All Read
                  </span>
                </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 bg-white rounded-2xl shadow-lg p-2 animate-fadeIn border border-orange-100" style={{ animationDelay: '0.1s' }}>
            <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    filter === 'all'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              All ({notifications.length})
            </button>
            <button
                onClick={() => setFilter('unread')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    filter === 'unread'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              Unread ({unreadCount})
            </button>
            <button
                onClick={() => setFilter('read')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    filter === 'read'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>

          {/* Quick Actions */}
          {unreadCount > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Quick actions</p>
                      <p className="text-sm text-gray-600">Manage your notifications efficiently</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                        onClick={handleMarkAllAsRead}
                        className="px-4 py-2 bg-white text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-colors border border-orange-200"
                    >
                      Mark all as read
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-medium hover:from-orange-700 hover:to-amber-700 transition-all"
                    >
                      View unread only
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Notifications List */}
          {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <NotificationRowSkeleton key={i} />
                ))}
              </div>
          ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg animate-fadeIn border border-gray-100" style={{ animationDelay: '0.2s' }}>
                <div className="relative inline-block mb-6">
                  <div className="flex items-center justify-center">
                    {filter === 'unread' ? (
                      <CheckCircle className="w-16 h-16 text-orange-500" />
                    ) : (
                      <Inbox className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm px-3 py-1 rounded-full">
                    {filter === 'unread' ? 'All done!' : 'Empty'}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {filter === 'unread'
                      ? "You've read all your notifications. New updates will appear here."
                      : 'When you receive notifications, they will appear here.'}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                      onClick={() => setFilter('all')}
                      className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
                  >
                    View All Notifications
                  </button>
                  <button
                      onClick={loadNotifications}
                      className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </span>
                  </button>
                </div>
              </div>
          ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification, index) => (
                    <div
                        key={notification.id}
                        className={`bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl animate-fadeIn border border-gray-100 hover:border-orange-200 ${
                            !notification.isRead ? 'border-l-4 border-gradient-to-b from-orange-600 to-amber-600' : ''
                        }`}
                        style={{
                          animationDelay: `${index * 0.05}s`,
                          borderLeftColor: !notification.isRead ? '#ea580c' : 'transparent',
                          borderLeftWidth: !notification.isRead ? '4px' : '1px'
                        }}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                              !notification.isRead
                                  ? 'bg-gradient-to-br from-orange-100 to-amber-100'
                                  : 'bg-gray-100'
                          }`}>
                            <div className={`${!notification.isRead ? 'text-orange-600' : 'text-gray-500'}`}>
                              {(() => {
                                const Icon = notificationIcons[notification.type] || Bell;
                                return <Icon className="w-6 h-6" />;
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-lg font-bold truncate ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                                <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 text-xs font-semibold rounded-full whitespace-nowrap">
                          NEW
                        </span>
                            )}
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4 hidden sm:inline" />
                          {formatDate(notification.createdAt)}
                        </span>
                              {notification.category && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {notification.category}
                          </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {!notification.isRead && (
                                  <button
                                      onClick={() => handleMarkAsRead(notification.id)}
                                      className="px-4 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-lg text-sm font-semibold hover:from-orange-100 hover:to-amber-100 transition-colors border border-orange-200"
                                  >
                                    <span className="inline-flex items-center gap-2">
                                      <Check className="w-4 h-4" />
                                      Mark Read
                                    </span>
                                  </button>
                              )}
                              {confirmDeleteId === notification.id ? (
                                <div className="flex gap-1 items-center bg-white border border-red-200 rounded-lg px-2">
                                  <button
                                      onClick={() => handleDelete(notification.id)}
                                      className="px-2 py-1 text-red-600 text-sm font-semibold hover:bg-red-50 rounded"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-2 py-1 text-gray-600 text-sm font-semibold hover:bg-gray-50 rounded"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                    onClick={() => setConfirmDeleteId(notification.id)}
                                    className="px-4 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors border border-red-200"
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
  );
}