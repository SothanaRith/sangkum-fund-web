import { motion } from 'framer-motion';
import { CheckCircle, KeyRound, Monitor, Smartphone, Loader2, Save } from 'lucide-react';

export default function SecuritySettings({
  user,
  securitySettings,
  setSecuritySettings,
  handleSaveSettings,
  twoFactorEnabled,
  handleTwoFactorToggle,
  saving
}) {
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Now';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Security Settings</h2>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <KeyRound className="w-6 h-6 text-orange-600" />
                <h3 className="font-bold text-gray-900 text-lg">Two-Factor Authentication</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  twoFactorEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Add an extra layer of security to your account. When enabled, you'll need to enter a verification code from your authenticator app.
              </p>

              {twoFactorEnabled ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-green-200">
                    <p className="text-green-700 font-medium mb-2 inline-flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      2FA is active on your account
                    </p>
                    <p className="text-sm text-gray-600">Last used: Today at 14:30</p>
                  </div>
                  <button
                    onClick={handleTwoFactorToggle}
                    disabled={saving}
                    className="px-5 py-2.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  >
                    Disable 2FA
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleTwoFactorToggle}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
                >
                  Enable Two-Factor Authentication
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Session Management</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Login Alerts</p>
                <p className="text-sm text-gray-600">Get notified of new sign-ins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.loginAlerts}
                  onChange={(e) =>
                    setSecuritySettings({ ...securitySettings, loginAlerts: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto Logout</p>
                <p className="text-sm text-gray-600">Session timeout duration</p>
              </div>
              <select
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })
                }
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value={15}>15 minutes</option>
                <option value={60}>1 hour</option>
                <option value={480}>8 hours</option>
                <option value={1440}>24 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Active Sessions</h3>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Current Device</p>
                  <p className="text-sm text-gray-500">
                    Started {user?.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Now'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                Current
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleSaveSettings('securitySettings', securitySettings)}
        disabled={saving}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg disabled:opacity-50"
      >
        <span className="inline-flex items-center gap-2">
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Security Settings'}
        </span>
      </button>
    </motion.div>
  );
}
