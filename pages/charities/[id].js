import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { charitiesAPI, announcementsAPI, eventsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function CharityDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [charity, setCharity] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (id) {
      loadCharityData();
    }
  }, [id]);

  const loadCharityData = async () => {
    try {
      const [charityData, announcementsData] = await Promise.all([
        charitiesAPI.getById(id),
        announcementsAPI.getByCharity(id),
      ]);
      
      setCharity(charityData);
      setAnnouncements(announcementsData);
      
      // Load related events
      if (charityData.events) {
        setEvents(charityData.events);
      }
    } catch (err) {
      console.error('Failed to load charity:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏛️</div>
          <p className="text-gray-600">Loading charity...</p>
        </div>
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Charity not found</h2>
          <Link href="/charities" className="text-primary-600 hover:underline">
            ← Back to charities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {charity.logo ? (
                <img
                  src={charity.logo}
                  alt={charity.name}
                  className="w-32 h-32 object-cover rounded-2xl shadow-md"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center text-6xl shadow-md">
                  🏛️
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                    {charity.name}
                    {charity.status === 'VERIFIED' && (
                      <span className="ml-3 text-green-500 text-3xl" title="Verified">✓</span>
                    )}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {charity.category && (
                      <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        🏷️ {charity.category}
                      </span>
                    )}
                    {charity.status === 'VERIFIED' ? (
                      <span className="inline-block px-4 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        ✓ Verified Organization
                      </span>
                    ) : (
                      <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                        ⏳ Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {charity.verifiedAt && (
                <p className="text-sm text-gray-500 mb-4">
                  Verified on {formatDate(charity.verifiedAt)}
                </p>
              )}

              {/* Quick Actions */}
              <div className="flex gap-3 mt-4">
                {/* Check if current user is the owner */}
                {typeof window !== 'undefined' && localStorage.getItem('user') && 
                 JSON.parse(localStorage.getItem('user')).id === charity.ownerId && (
                  <Link
                    href={`/charities/edit/${charity.id}`}
                    className="inline-flex items-center px-6 py-2 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                  >
                    ✏️ Edit Charity
                  </Link>
                )}
                {charity.website && (
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-2 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                  >
                    🌐 Website
                  </a>
                )}
                <button className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-md">
                  💝 Donate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 bg-white rounded-2xl shadow-lg p-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📋 About
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📢 Updates ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🎯 Campaigns ({events.length})
          </button>
        </div>

        {/* Content */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {charity.description}
              </p>

              {/* Contact Info */}
              {(charity.contactEmail || charity.contactPhone || charity.address) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {charity.contactEmail && (
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">📧</span>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <a href={`mailto:${charity.contactEmail}`} className="text-primary-600 hover:underline">
                            {charity.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}
                    {charity.contactPhone && (
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">📞</span>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <a href={`tel:${charity.contactPhone}`} className="text-primary-600 hover:underline">
                            {charity.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                    {charity.address && (
                      <div className="flex items-start md:col-span-2">
                        <span className="text-2xl mr-3">📍</span>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-700">{charity.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Updates</h2>
              </div>

              {announcements.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📢</div>
                  <p className="text-gray-600">No announcements yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{formatDate(announcement.createdAt)}</span>
                        <div className="flex gap-4">
                          <button className="text-gray-600 hover:text-red-600 transition-colors">
                            ❤️ {announcement.reactionCount || 0}
                          </button>
                          <button className="text-gray-600 hover:text-blue-600 transition-colors">
                            💬 {announcement.commentCount || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Campaigns</h2>

              {events.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-600">No active campaigns</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all card-hover"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-primary-600">
                            {((event.currentAmount / event.targetAmount) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${(event.currentAmount / event.targetAmount) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center text-primary-600 font-semibold">
                        <span>View Campaign</span>
                        <span className="ml-2">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
