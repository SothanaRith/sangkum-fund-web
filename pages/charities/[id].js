import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { charitiesAPI, announcementsAPI, eventsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Share2, Copy, Mail, AlertCircle, Building2, CheckCircle, Clock, Heart, Users, Calendar, MapPin, User, Image as ImageIcon, Camera, X } from 'lucide-react';

export default function CharityDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [charity, setCharity] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [relatedCharities, setRelatedCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [charityImages, setCharityImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const storyRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadCharityData();
      setShareUrl(`${window.location.origin}/charities/${id}`);
    }
  }, [id]);

  const loadRelatedCharities = async (category) => {
    setLoadingRelated(true);
    try {
      const allCharities = await charitiesAPI.getAll();
      let related = allCharities.filter(c => c.id !== id && c.category === category);
      
      // Fallback: if no charities in same category, show any other charities
      if (related.length === 0) {
        related = allCharities.filter(c => c.id !== id);
      }
      
      setRelatedCharities(related.slice(0, 3));
    } catch (err) {
      console.error('Failed to load related charities:', err);
    } finally {
      setLoadingRelated(false);
    }
  };

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

      // Load related charities
      if (charityData.category) {
        loadRelatedCharities(charityData.category);
      }

      // Set default image from logo or use placeholder
      if (charityData.logo) {
        setCharityImages([{ id: 1, imageUrl: charityData.logo, isPrimary: true }]);
        setSelectedImage({ id: 1, imageUrl: charityData.logo, isPrimary: true });
      }
    } catch (err) {
      console.error('Failed to load charity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Charity link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: charity.name,
          text: charity.description,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-3 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary-100 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading charity details...</p>
        </div>
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Charity not found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the charity you're looking for.</p>
          <Link href="/charities" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            ← Browse all charities
          </Link>
        </div>
      </div>
    );
  }

  const encodedShareUrl = shareUrl ? encodeURIComponent(shareUrl) : '';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image Gallery */}
      <div className="relative">
        {(selectedImage || charity.logo) ? (
          <div className="h-[60vh] md:h-[70vh] relative">
            <img
              src={selectedImage?.imageUrl || charity.logo}
              alt={charity.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
            
            {/* Image Thumbnails */}
            {charityImages.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {charityImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage?.id === img.id 
                        ? 'border-white scale-110' 
                        : 'border-white/50 hover:border-white'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[60vh] md:h-[70vh] bg-gradient-to-br from-primary-50 to-emerald-50 flex items-center justify-center">
            <div className="text-center">
              <Building2 className="w-24 h-24 text-primary-200 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Support this charity</p>
            </div>
          </div>
        )}

        {/* Back Navigation */}
        <div className="absolute top-4 left-4">
          <Link
            href="/charities"
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors shadow-sm"
          >
            ← Back to charities
          </Link>
        </div>

        {/* Category Tag */}
        {charity.category && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              {charity.category}
            </span>
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {charity.name}
              </h1>
              <p className="text-white/90 text-lg mb-6 max-w-xl">
                {charity.description.substring(0, 150)}...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Story & Updates */}
          <div className="lg:col-span-2 space-y-8" ref={storyRef}>
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-white rounded-2xl shadow-lg p-2 border-2 border-primary-100 animate-fadeIn">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📋 About
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📢 Updates ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-md'
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
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-primary-600">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {charity.description}
                  </p>
                </div>

              {/* Contact Info */}
              {(charity.contactEmail || charity.contactPhone || charity.address) && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-emerald-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {charity.contactEmail && (
                      <div className="flex items-start p-4 bg-primary-50 rounded-xl">
                        <Mail className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">Email</p>
                          <a href={`mailto:${charity.contactEmail}`} className="text-primary-600 hover:text-primary-700 font-medium">
                            {charity.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}
                    {charity.contactPhone && (
                      <div className="flex items-start p-4 bg-emerald-50 rounded-xl">
                        <span className="text-2xl mr-4">📞</span>
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">Phone</p>
                          <a href={`tel:${charity.contactPhone}`} className="text-emerald-600 hover:text-emerald-700 font-medium">
                            {charity.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                    {charity.address && (
                      <div className="flex items-start p-4 bg-primary-50 rounded-xl md:col-span-2">
                        <span className="text-2xl mr-4">📍</span>
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">Address</p>
                          <p className="text-gray-700 font-medium">{charity.address}</p>
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

          {/* Right Column - Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-primary-100 sticky top-8 space-y-4">
              {/* Status Badge */}
              <div>
                {charity.status === 'VERIFIED' ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Verified Organization</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">Pending Verification</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                {typeof window !== 'undefined' && localStorage.getItem('user') && 
                 JSON.parse(localStorage.getItem('user')).id === charity.ownerId && (
                  <Link
                    href={`/charities/edit/${charity.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                  >
                    ✏️ Edit Charity
                  </Link>
                )}
                {charity.website && (
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                  >
                    🌐 Visit Website
                  </a>
                )}
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-emerald-700 transition-all shadow-md">
                  💝 Donate
                </button>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Campaigns</span>
                  <span className="font-bold text-primary-600">{events.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Updates</span>
                  <span className="font-bold text-primary-600">{announcements.length}</span>
                </div>
                {charity.verifiedAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Verified</span>
                    <span className="font-bold text-green-600">{formatDate(charity.verifiedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Share This Charity</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Native Share */}
              {navigator.share && (
                <button
                  onClick={() => {
                    handleShare();
                    setShowShareModal(false);
                  }}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" /> Share
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" /> Copy Link
              </button>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <span>f</span> Facebook
              </a>

              {/* WhatsApp Share */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(charity.name + ' - ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span> WhatsApp
              </a>

              {/* Email Share */}
              <a
                href={`mailto:?subject=${encodeURIComponent(charity.name)}&body=${encodeURIComponent(charity.description + '\n\nLearn more: ' + shareUrl)}`}
                className="w-full px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" /> Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Related Charities */}
      {relatedCharities.length > 0 && (
        <div className="container mx-auto px-4 max-w-6xl mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Charities</h2>
            
            {loadingRelated ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCharities.map((relCharity) => (
                  <Link
                    key={relCharity.id}
                    href={`/charities/${relCharity.id}`}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-primary-300 group"
                  >
                    <div className="flex items-center mb-4">
                      {relCharity.logo ? (
                        <img
                          src={relCharity.logo}
                          alt={relCharity.name}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-emerald-100 rounded-lg flex items-center justify-center mr-4">
                          <Building2 className="w-8 h-8 text-primary-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {relCharity.name}
                        </h3>
                        {relCharity.status === 'VERIFIED' && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" /> Verified
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{relCharity.description}</p>
                    <div className="flex items-center text-primary-600 font-semibold text-sm">
                      <span>View Charity</span>
                      <span className="ml-2">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
