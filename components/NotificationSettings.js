import { motion } from 'framer-motion';
import { Loader2, Save } from 'lucide-react';

export default function NotificationSettings({
  notificationSettings,
  setNotificationSettings,
  handleSaveSettings,
  saving
}) {
  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Notification Preferences</h2>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Email Notifications</h3>
              <p className="text-gray-600 text-sm">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 pl-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificationSettings.donationAlerts}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    donationAlerts: e.target.checked,
                  })
                }
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700">Donation Alerts</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificationSettings.milestoneNotifications}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    milestoneNotifications: e.target.checked,
                  })
                }
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700">Milestones</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificationSettings.eventUpdates}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    eventUpdates: e.target.checked,
                  })
                }
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700">Event Updates</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificationSettings.weeklyDigest}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    weeklyDigest: e.target.checked,
                  })
                }
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700">Weekly Digest</span>
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Push Notifications</h3>
              <p className="text-gray-600 text-sm">Browser and mobile notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    pushNotifications: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">SMS Notifications</h3>
              <p className="text-gray-600 text-sm">Receive text messages for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    smsNotifications: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
        <button
          onClick={() => handleSaveSettings('notificationSettings', notificationSettings)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-2">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Preferences'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
