import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AlertTriangle,
  Bell,
  Check,
  Frown,
  Link2,
  Lock,
  Settings as SettingsIcon,
  Shield,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-react';
import { settingsAPI, userAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import ProfileSettings from '../components/ProfileSettings';
import NotificationSettings from '../components/NotificationSettings';
import PrivacySettings from '../components/PrivacySettings';
import SecuritySettings from '../components/SecuritySettings';
import IntegrationSettings from '../components/IntegrationSettings';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 60000);
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const formatJoinedDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

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
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
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
        // We don't have setSettings anymore or it's not needed, but keeping if it was there
        setNotificationSettings(settingsData.notificationSettings || notificationSettings);
        setPrivacySettings(settingsData.privacySettings || privacySettings);
        setSecuritySettings(settingsData.securitySettings || securitySettings);
        setTelegramConnected(settingsData.telegramSettings?.connected || false);
        setTwoFactorEnabled(settingsData.securitySettings?.twoFactorEnabled || false);
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
      const updatedSecurity = { ...securitySettings, twoFactorEnabled: !twoFactorEnabled };
      await settingsAPI.update({ securitySettings: updatedSecurity });
      setSecuritySettings(updatedSecurity);
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
                className="text-6xl mb-4 flex justify-center"
            >
              <SettingsIcon className="w-14 h-14 text-orange-600" />
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
                  <Image
                      src={previewUrl || `https://ui-avatars.com/api/?name=${profileData.name}&background=orange`}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full border-2 border-orange-300 object-cover"
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
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </motion.button>
                  ))}
                </nav>

                {/* Quick Stats */}
                <div className="mt-8 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Role</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${user?.role === 'ADMIN' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                        {user?.role || 'USER'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Joined</span>
                      <span className="text-sm font-medium">{user?.createdAt ? formatJoinedDate(user.createdAt) : 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Sessions</span>
                      <span className="text-sm font-medium text-green-600">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Login</span>
                      <span className="text-sm font-medium">{user?.lastLoginAt ? formatTimeAgo(user.lastLoginAt) : 'Unknown'}</span>
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
                  <ProfileSettings
                    profileData={profileData}
                    setProfileData={setProfileData}
                    previewUrl={previewUrl}
                    uploading={uploading}
                    handleAvatarUpload={handleAvatarUpload}
                    handleSaveProfile={handleSaveProfile}
                    saving={saving}
                  />
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <NotificationSettings
                    notificationSettings={notificationSettings}
                    setNotificationSettings={setNotificationSettings}
                    handleSaveSettings={handleSaveSettings}
                    saving={saving}
                  />
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <PrivacySettings
                    privacySettings={privacySettings}
                    setPrivacySettings={setPrivacySettings}
                    handleSaveSettings={handleSaveSettings}
                    saving={saving}
                  />
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <SecuritySettings
                    user={user}
                    securitySettings={securitySettings}
                    setSecuritySettings={setSecuritySettings}
                    handleSaveSettings={handleSaveSettings}
                    twoFactorEnabled={twoFactorEnabled}
                    handleTwoFactorToggle={handleTwoFactorToggle}
                    saving={saving}
                  />
                )}

                {/* Verification Tab */}
                {activeTab === 'verification' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
                      <p className="text-gray-600 mb-8">Verify your identity to unlock premium features and build trust in the community</p>

                      {/* OCR Verification Card */}
                      <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <ShieldCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">OCR Document Verification</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Verify your identity using a government-issued ID or passport
                              </p>
                            </div>
                          </div>
                          {user?.isOcrVerified && (
                              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                <Check className="w-4 h-4" />
                                <span className="text-sm font-semibold">Verified</span>
                              </div>
                          )}
                        </div>

                        {user?.isOcrVerified ? (
                            <div className="space-y-3">
                              <div className="p-3 bg-white rounded-lg">
                                <p className="text-sm text-gray-600">Verified on</p>
                                <p className="font-semibold text-gray-900">
                                  {user.ocrVerifiedAt ? new Date(user.ocrVerifiedAt).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                              <div className="p-3 bg-white rounded-lg">
                                <p className="text-sm text-gray-600">Extracted Name</p>
                                <p className="font-semibold text-gray-900">{user.ocrExtractedName || 'N/A'}</p>
                              </div>
                              <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                                ✓ Your identity has been verified and confirmed
                              </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                              <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span>Upload a clear government-issued ID</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span>Automatic OCR extraction and verification</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span>Secure and encrypted processing</span>
                                </li>
                              </ul>
                              <button
                                  onClick={() => router.push('/auth/ocr-verify')}
                                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                              >
                                <ShieldCheck className="w-5 h-5" />
                                Start Verification
                                <ArrowRight className="w-5 h-5" />
                              </button>
                            </div>
                        )}
                      </div>

                      {/* Benefits */}
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Build Trust</h4>
                          <p className="text-sm text-gray-600">Show verified badge on your profile</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Premium Access</h4>
                          <p className="text-sm text-gray-600">Unlock exclusive features and benefits</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Enhanced Security</h4>
                          <p className="text-sm text-gray-600">Additional protection for your account</p>
                        </div>
                      </div>
                    </motion.div>
                )}

                {/* Integrations Tab */}
                {activeTab === 'integrations' && (
                  <IntegrationSettings
                    telegramConnected={telegramConnected}
                    handleDisconnectTelegram={handleDisconnectTelegram}
                    handleConnectTelegram={handleConnectTelegram}
                  />
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
                        <div className="text-5xl mb-4 flex justify-center">
                          <AlertTriangle className="w-10 h-10 text-orange-600" />
                        </div>
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
                  <div className="text-5xl mb-4 flex justify-center">
                    <Frown className="w-10 h-10 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Your Account?</h3>
                  <p className="text-gray-600">
                    This will permanently delete your account and all data. You won't be able to recover it.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-700 font-medium text-sm">
                      <span className="inline-flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        This action will delete:
                      </span>
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