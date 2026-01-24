import { useEffect, useState } from 'react';
import { notificationsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const notificationIcons = {
  DONATION: '💰',
  EVENT: '🎯',
  ANNOUNCEMENT: '📢',
  MILESTONE: '🏆',
  VERIFICATION: '✓',
  SYSTEM: '⚙️',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

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
      alert('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      alert('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?')) return;
    
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔔</div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">
              🔔 Notifications
            </h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
            >
              ✓ Mark All Read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl shadow-lg p-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'read'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="text-8xl mb-6">
              {filter === 'unread' ? '🎉' : '📭'}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filter === 'unread' ? 'All caught up!' : 'No notifications'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread'
                ? "You're all up to date"
                : 'No notifications to display'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl animate-fadeIn ${
                  !notification.isRead ? 'border-l-4 border-primary-600' : ''
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      !notification.isRead
                        ? 'bg-gradient-to-br from-primary-100 to-purple-100'
                        : 'bg-gray-100'
                    }`}>
                      {notificationIcons[notification.type] || '🔔'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-lg font-bold ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>

                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="px-4 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-200 transition-colors"
                          >
                            ✓ Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="px-4 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
