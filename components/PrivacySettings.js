import { Loader2, Save } from 'lucide-react';

export default function PrivacySettings({
  privacySettings,
  setPrivacySettings,
  handleSaveSettings,
  saving
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">Show my donations publicly</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.showDonations}
                onChange={(e) =>
                  setPrivacySettings({ ...privacySettings, showDonations: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600">Your donations will be visible on event pages</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">Allow anonymous donations</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.allowAnonymous}
                onChange={(e) =>
                  setPrivacySettings({ ...privacySettings, allowAnonymous: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600">Option to donate anonymously</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-3">Profile Visibility</label>
          <select
            value={privacySettings.profileVisibility}
            onChange={(e) =>
              setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
          >
            <option value="PUBLIC">Public - Anyone can view</option>
            <option value="PRIVATE">Private - Only you</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => handleSaveSettings('privacy', privacySettings)}
        disabled={saving}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
      >
        <span className="inline-flex items-center gap-2">
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Privacy Settings'}
        </span>
      </button>
    </div>
  );
}
