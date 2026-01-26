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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-white">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-t-orange-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading charity details...</p>
        </div>
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-white px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Charity not found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the charity you're looking for.</p>
          <Link href="/charities" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium">
            ← Browse all charities
          </Link>
        </div>
      </div>
    );
  }

  const encodedShareUrl = shareUrl ? encodeURIComponent(shareUrl) : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white">
      {/* Hero Section with Image Gallery */}
      <div className="relative">
        {(selectedImage || charity.logo) ? (
          <div className="h-[60vh] md:h-[70vh] relative">
            <img
              src={selectedImage?.imageUrl || charity.logo}
              alt={charity.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Image Thumbnails */}
            {charityImages.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {charityImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage?.id === img.id 
                        ? 'border-orange-400 scale-110 shadow-lg' 
                        : 'border-white/50 hover:border-orange-300'
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
          <div className="h-[60vh] md:h-[70vh] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
            <div className="text-center">
              <Building2 className="w-24 h-24 text-orange-300 mx-auto mb-4" />
              <p className="text-lg text-orange-800 font-semibold">Support this charity</p>
            </div>
          </div>
        )}

        {/* Back Navigation */}
        <div className="absolute top-4 left-4">
          <Link
            href="/charities"
            className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-all shadow-md hover:shadow-lg"
          >
            ← Back to charities
          </Link>
        </div>

        {/* Category & Status Badge */}
        <div className="absolute top-4 right-4 flex gap-2">
          {charity.category && (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-md">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              {charity.category}
            </span>
          )}
          {charity.status === 'VERIFIED' && (
            <span className="inline-flex items-center gap-1 bg-green-100/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-green-700 shadow-md">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {charity.name}
              </h1>
              <p className="text-white/95 text-lg mb-6 max-w-xl leading-relaxed">
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
        {/* Impact Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">{charity.beneficiariesCount || 0}</div>
            <div className="text-sm text-orange-700 font-medium">People Helped</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
            <div className="text-3xl font-bold text-amber-600 mb-2">{charity.volunteersCount || 0}</div>
            <div className="text-sm text-amber-700 font-medium">Active Volunteers</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="text-3xl font-bold text-orange-500 mb-2">{charity.yearsActive || 0}+</div>
            <div className="text-sm text-orange-700 font-medium">Years Active</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
            <div className="text-3xl font-bold text-amber-600 mb-2">${charity.totalDonations || 0}</div>
            <div className="text-sm text-amber-700 font-medium">Total Donations</div>
          </div>
        </div>

        {/* Rating Section */}
        {charity.ratingScore && charity.ratingScore > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Community Rating</h3>
              <div className="flex items-center gap-2">
                <div className="text-4xl font-bold text-orange-600">{charity.ratingScore.toFixed(1)}</div>
                <div className="text-sm text-gray-600">out of 5</div>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {'★'.repeat(Math.floor(charity.ratingScore)).split('').map((_, i) => (
                <span key={i} className="text-3xl text-orange-400">★</span>
              ))}
              {'☆'.repeat(5 - Math.floor(charity.ratingScore)).split('').map((_, i) => (
                <span key={i + Math.floor(charity.ratingScore)} className="text-3xl text-orange-200">☆</span>
              ))}
            </div>
            <div className="text-sm text-gray-600">Based on {charity.reviewCount || 0} reviews from donors</div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-white rounded-2xl shadow-lg p-2 border-2 border-orange-200 animate-fadeIn">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            📋 About
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            📢 Updates ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-orange-50'
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
                <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-600">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {charity.description}
                  </p>
                </div>

                {/* Mission Statement */}
                {charity.missionStatement && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200">
                    <h3 className="text-xl font-bold text-orange-900 mb-3">Our Mission</h3>
                    <p className="text-orange-800 text-lg leading-relaxed italic">"{charity.missionStatement}"</p>
                  </div>
                )}

                {/* Achievements */}
                {charity.achievements && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-600">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Our Achievements</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{charity.achievements}</p>
                  </div>
                )}

              {/* Contact Info */}
              {(charity.contactEmail || charity.contactPhone || charity.address) && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {charity.contactEmail && (
                      <div className="flex items-start p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <Mail className="w-6 h-6 text-orange-600 mr-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-orange-700 font-semibold">Email</p>
                          <a href={`mailto:${charity.contactEmail}`} className="text-orange-600 hover:text-orange-700 font-medium break-all">
                            {charity.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}
                    {charity.contactPhone && (
                      <div className="flex items-start p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="text-2xl mr-4">📞</span>
                        <div>
                          <p className="text-sm text-amber-700 font-semibold">Phone</p>
                          <a href={`tel:${charity.contactPhone}`} className="text-amber-600 hover:text-amber-700 font-medium">
                            {charity.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                    {charity.address && (
                      <div className="flex items-start p-4 bg-orange-50 rounded-xl border border-orange-200 md:col-span-2">
                        <MapPin className="w-6 h-6 text-orange-600 mr-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-orange-700 font-semibold">Address</p>
                          <p className="text-gray-700 font-medium">{charity.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(charity.facebookUrl || charity.instagramUrl || charity.twitterUrl || charity.website) && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {charity.website && (
                      <a href={charity.website} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center justify-center p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors">
                        <span className="text-3xl">🌐</span>
                      </a>
                    )}
                    {charity.facebookUrl && (
                      <a href={charity.facebookUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
                        <span className="text-3xl">f</span>
                      </a>
                    )}
                    {charity.instagramUrl && (
                      <a href={charity.instagramUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center justify-center p-4 bg-pink-50 rounded-xl border border-pink-200 hover:bg-pink-100 transition-colors">
                        <span className="text-3xl">📷</span>
                      </a>
                    )}
                    {charity.twitterUrl && (
                      <a href={charity.twitterUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center justify-center p-4 bg-sky-50 rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors">
                        <span className="text-3xl">𝕏</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="bg-gradient-to-b from-white to-orange-50 rounded-2xl shadow-lg p-8 border border-orange-200">
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-orange-200">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Recent Updates</h2>
              </div>

              {announcements.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <MessageCircle className="w-16 h-16 text-orange-500" />
                  </div>
                  <p className="text-gray-600 font-medium">No announcements yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all">
                      <h3 className="text-xl font-bold text-orange-900 mb-2">{announcement.title}</h3>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{announcement.content}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-600 font-medium">{formatDate(announcement.createdAt)}</span>
                        <div className="flex gap-4">
                          <button className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 px-3 py-1 rounded-lg transition-colors font-semibold">
                            ❤️ {announcement.reactionCount || 0}
                          </button>
                          <button className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 px-3 py-1 rounded-lg transition-colors font-semibold">
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
            <div className="bg-gradient-to-b from-white to-orange-50 rounded-2xl shadow-lg p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-6">Active Campaigns</h2>

              {events.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Target className="w-16 h-16 text-orange-500" />
                  </div>
                  <p className="text-gray-600 font-medium">No active campaigns</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 hover:shadow-xl hover:border-orange-300 transition-all transform hover:scale-105"
                    >
                      <h3 className="text-xl font-bold text-orange-900 mb-2">{event.title}</h3>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-orange-700 font-medium">Progress</span>
                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                            {((event.currentAmount / event.targetAmount) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-orange-600 to-amber-600 h-3 rounded-full transition-all"
                            style={{ width: `${(event.currentAmount / event.targetAmount) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center text-orange-600 font-bold hover:text-orange-700">
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
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-2xl p-6 border-2 border-orange-200 sticky top-8 space-y-4">
              {/* Status Badge */}
              <div>
                {charity.status === 'VERIFIED' ? (
                  <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Verified Organization</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">Pending Verification</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{events.length}</div>
                  <div className="text-xs text-orange-700 font-medium">Campaigns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{announcements.length}</div>
                  <div className="text-xs text-amber-700 font-medium">Updates</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                {typeof window !== 'undefined' && localStorage.getItem('user') && 
                 JSON.parse(localStorage.getItem('user')).id === charity.ownerId && (
                  <Link
                    href={`/charities/edit/${charity.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all"
                  >
                    ✏️ Edit Charity
                  </Link>
                )}
                {charity.website && (
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all"
                  >
                    🌐 Visit Website
                  </a>
                )}
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl text-lg">
                  💝 Donate Now
                </button>
              </div>

              {/* Verification Info */}
              {charity.verifiedAt && (
                <div className="pt-4 border-t border-orange-200">
                  <p className="text-xs text-gray-500 text-center">
                    ✓ Verified on {formatDate(charity.verifiedAt)}
                  </p>
                </div>
              )}

              {/* Trust Badge */}
              <div className="p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border-2 border-orange-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🛡️</span>
                  <span className="font-bold text-orange-900">Trusted Organization</span>
                </div>
                <p className="text-xs text-orange-800">
                  This charity has been verified and meets our transparency standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-white to-orange-50 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fadeIn border border-orange-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share This Charity</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
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
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Share2 className="w-5 h-5" /> Share
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-2 border-orange-300 rounded-xl font-semibold hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
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
