import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { settingsAPI, userAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    location: '',
    website: '',
  });

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    telegramNotifications: false,
    donationAlerts: true,
    eventUpdates: true,
    milestoneNotifications: true,
    weeklyDigest: false,
    marketingEmails: false,
    smsNotifications: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showDonations: true,
    allowAnonymous: true,
    profileVisibility: 'PUBLIC',
    showOnlineStatus: true,
    allowTagging: true,
    dataSharing: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 60, // minutes
    deviceManagement: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [userData, settingsData] = await Promise.all([
        userAPI.getProfile(),
        settingsAPI.get().catch(() => null),
      ]);

      setUser(userData);
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
      });
      setPreviewUrl(userData.avatar || null);

      if (settingsData) {
        setSettings(settingsData);
        setNotificationSettings(settingsData.notifications || notificationSettings);
        setPrivacySettings(settingsData.privacy || privacySettings);
        setSecuritySettings(settingsData.security || securitySettings);
        setTelegramConnected(!!settingsData.telegramId);
        setTwoFactorEnabled(!!settingsData.twoFactorEnabled);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile(profileData);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const response = await userAPI.uploadAvatar(file);
      setProfileData({ ...profileData, avatar: response.avatarUrl });
      showToast('Avatar uploaded successfully!', 'success');
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      showToast('Failed to upload avatar. Please try again.', 'error');
      setPreviewUrl(profileData.avatar);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async (type, updatedSettings) => {
    setSaving(true);
    try {
      await settingsAPI.update({ [type]: updatedSettings });
      showToast('Settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConnectTelegram = async () => {
    // In a real implementation, this would redirect to Telegram OAuth or show instructions
    const botUsername = 'donation_platform_bot'; // Replace with actual bot username
    const telegramUrl = `https://t.me/${botUsername}`;
    window.open(telegramUrl, '_blank');

    alert('Please follow the instructions in Telegram to complete the connection.');
  };

  const handleDisconnectTelegram = async () => {
    if (!confirm('Disconnect Telegram notifications?')) return;

    try {
      await settingsAPI.disconnectTelegram();
      setTelegramConnected(false);
      alert('Telegram disconnected successfully');
    } catch (err) {
      alert('Failed to disconnect Telegram');
    }
  };

  const handleTwoFactorToggle = async () => {
    if (twoFactorEnabled) {
      const confirm = window.confirm('Are you sure you want to disable Two-Factor Authentication?');
      if (!confirm) return;
    }

    try {
      setSaving(true);
      await settingsAPI.toggleTwoFactor(!twoFactorEnabled);
      setTwoFactorEnabled(!twoFactorEnabled);
      showToast(
          twoFactorEnabled
              ? 'Two-Factor Authentication disabled'
              : 'Two-Factor Authentication enabled',
          'success'
      );
    } catch (err) {
      showToast('Failed to update Two-Factor Authentication', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await userAPI.exportData();
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sombok-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      showToast('Data exported successfully!', 'success');
    } catch (err) {
      showToast('Failed to export data', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    // You can implement a toast notification system here
    alert(message); // Temporary
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <div className="text-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
            >
              ⚙️
            </motion.div>
            <p className="text-gray-600">Loading your settings...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and security</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{profileData.name}</p>
                  <p className="text-sm text-gray-500">{profileData.email}</p>
                </div>
                <div className="relative">
                  <img
                      src={previewUrl || `https://ui-avatars.com/api/?name=${profileData.name}&background=orange`}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-2 border-orange-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-orange-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-8">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                      <motion.button
                          key={tab.id}
                          whileHover={{ x: 4 }}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                              activeTab === tab.id
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                  : 'text-gray-700 hover:bg-orange-50'
                          }`}
                      >
                        <span className="text-xl">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </motion.button>
                  ))}
                </nav>

                {/* Quick Stats */}
                <div className="mt-8 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Joined</span>
                      <span className="text-sm font-medium">Jan 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Sessions</span>
                      <span className="text-sm font-medium text-green-600">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Login</span>
                      <span className="text-sm font-medium">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      Public Profile
                    </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div>
                          {/* Avatar Upload */}
                          <div className="mb-8">
                            <label className="block text-gray-700 font-semibold mb-4">Profile Picture</label>
                            <div className="flex flex-col items-center space-y-4">
                              <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                  {previewUrl ? (
                                      <img
                                          src={previewUrl}
                                          alt="Profile"
                                          className="w-full h-full object-cover"
                                      />
                                  ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-4xl font-bold">
                                        {profileData.name?.charAt(0)?.toUpperCase() || '?'}
                                      </div>
                                  )}
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                    </div>
                                )}
                              </div>

                              <div className="text-center">
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md cursor-pointer ${
                                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                  <span className="text-lg">{uploading ? '📤' : '📷'}</span>
                                  {uploading ? 'Uploading...' : 'Change Photo'}
                                </label>
                                <p className="text-sm text-gray-500 mt-2">
                                  JPG, PNG or GIF. Max size 5MB.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Bio */}
                          <div>
                            <label className="block text-gray-700 font-semibold mb-3">Bio</label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                rows="4"
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            />
                            <p className="text-sm text-gray-500 mt-2">Max 500 characters</p>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                            <div className="flex gap-3">
                              <select className="px-3 py-3 rounded-xl border-2 border-gray-200 bg-gray-50">
                                <option>+855</option>
                                <option>+1</option>
                              </select>
                              <input
                                  type="tel"
                                  value={profileData.phone}
                                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                  placeholder="123 456 789"
                                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location</label>
                            <input
                                type="text"
                                value={profileData.location}
                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                placeholder="Phnom Penh, Cambodia"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Website</label>
                            <input
                                type="url"
                                value={profileData.website}
                                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                placeholder="https://example.com"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg disabled:opacity-50"
                        >
                          <span>{saving ? '⏳' : '💾'}</span>
                          {saving ? 'Saving Changes...' : 'Save Profile'}
                        </button>
                      </div>
                    </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
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
                            onClick={() => handleSaveSettings('notifications', notificationSettings)}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg disabled:opacity-50"
                        >
                          {saving ? '⏳ Saving...' : '💾 Save Preferences'}
                        </button>
                      </div>
                    </motion.div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
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
                          onClick={() => handleSaveSettings({ ...settings, privacy: privacySettings })}
                          disabled={saving}
                          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                      >
                        {saving ? '💾 Saving...' : '💾 Save Privacy Settings'}
                      </button>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
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
                                <span className="text-2xl">🔐</span>
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
                                      <p className="text-green-700 font-medium mb-2">✓ 2FA is active on your account</p>
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
                                  <span>💻</span>
                                </div>
                                <div>
                                  <p className="font-medium">Chrome on Windows</p>
                                  <p className="text-sm text-gray-500">Phnom Penh, KH • Now</p>
                                </div>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            Current
                          </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span>📱</span>
                                </div>
                                <div>
                                  <p className="font-medium">Safari on iPhone</p>
                                  <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                              </div>
                              <button className="text-sm text-red-600 hover:text-red-700">
                                Revoke
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )}

                {/* Integrations Tab */}
                {activeTab === 'integrations' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Integrations</h2>

                      {/* Telegram */}
                      <div className="border border-gray-200 rounded-xl p-6 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="text-5xl">📱</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Telegram Bot</h3>
                            <p className="text-gray-600 mb-4">
                              Receive instant notifications on Telegram for donations, milestones, and updates.
                            </p>

                            {telegramConnected ? (
                                <div className="flex items-center gap-4">
                          <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                            ✓ Connected
                          </span>
                                  <button
                                      onClick={handleDisconnectTelegram}
                                      className="px-6 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                                  >
                                    Disconnect
                                  </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleConnectTelegram}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                                >
                                  Connect Telegram
                                </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Coming Soon */}
                      <div className="border border-gray-200 rounded-xl p-6 opacity-50">
                        <div className="flex items-start gap-4">
                          <div className="text-5xl grayscale">🔗</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">More Integrations</h3>
                            <p className="text-gray-600 mb-4">
                              Slack, Discord, and Webhook integrations coming soon!
                            </p>
                            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold">
                        Coming Soon
                      </span>
                          </div>
                        </div>
                      </div>
                    </div>
                )}

                {/* Danger Zone */}
                {activeTab === 'danger' && (
                    <motion.div
                        key="danger"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                      <div className="text-center mb-10">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Danger Zone</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                          These actions are irreversible. Please proceed with caution.
                        </p>
                      </div>

                      <div className="space-y-6 max-w-2xl mx-auto">
                        {/* Export Data */}
                        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg mb-2">Export Your Data</h3>
                              <p className="text-gray-600">
                                Download a copy of all your personal data including profile information, donation history, and activity.
                              </p>
                            </div>
                            <button
                                onClick={handleExportData}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md whitespace-nowrap"
                            >
                              Export Data
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">😢</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Your Account?</h3>
                  <p className="text-gray-600">
                    This will permanently delete your account and all data. You won't be able to recover it.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-700 font-medium text-sm">
                      ⚠️ This action will delete:
                    </p>
                    <ul className="text-red-600 text-sm mt-2 space-y-1">
                      <li>• Your profile information</li>
                      <li>• All your donation history</li>
                      <li>• Campaigns you created</li>
                      <li>• Your payment information</li>
                    </ul>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Type <span className="font-bold">"DELETE"</span> to confirm
                    </label>
                    <input
                        type="text"
                        placeholder="DELETE"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleDeleteAccount}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
                  >
                    Delete My Account
                  </button>
                </div>
              </motion.div>
            </div>
        )}
      </div>
  );
}