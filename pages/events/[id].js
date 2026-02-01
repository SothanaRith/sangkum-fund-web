import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { eventsAPI, eventTimelineAPI, announcementsAPI, eventCommentsAPI, donationsAPI, userAPI } from '@/lib/api';
import { adminAnnouncementsAPI } from '@/lib/admin-api';
import { formatCurrency, formatDate, calculateProgress, formatTimeAgo } from '@/lib/utils';
import { encryptId, decryptId } from '@/lib/encryption';
import { Heart, Share2, Shield, CheckCircle, Calendar, Users, MapPin, ChevronDown, PartyPopper, Camera, Image as ImageIcon, Sparkles, MessageCircle, Megaphone, Clock, User, Edit, Copy, Link2, X } from 'lucide-react';
import EventChatBox from '@/components/EventChatBox';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [plainId, setPlainId] = useState(null);
  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('story');
  const [joined, setJoined] = useState(false);
  const [joiningEvent, setJoiningEvent] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [recentDonations, setRecentDonations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedImages, setRelatedImages] = useState({});
  const [eventImages, setEventImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copyState, setCopyState] = useState('idle');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
  });
  const [submittingAnnouncement, setSubmittingAnnouncement] = useState(false);
  const storyRef = useRef(null);
  const donationCardRef = useRef(null);

  useEffect(() => {
    if (id) {
      // Decrypt ID if it's encrypted
      const decrypted = decryptId(id);
      const actualId = decrypted || id;
      setPlainId(actualId);
    }
    const handleScroll = () => {
      if (storyRef.current && donationCardRef.current) {
        const storyBottom = storyRef.current.getBoundingClientRect().bottom;
        const donationTop = donationCardRef.current.getBoundingClientRect().top;
        setIsSticky(donationTop <= 100 && storyBottom > window.innerHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  useEffect(() => {
    if (plainId) {
      loadEvent();
    }
  }, [plainId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && plainId && event) {
      // Create share URL with encrypted ID
      const encryptedId = encryptId(plainId);
      const baseUrl = window.location.origin;
      const shareUrlWithEncryption = `${baseUrl}/events/${encryptedId}`;
      setShareUrl(shareUrlWithEncryption);
    }
  }, [plainId, event]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const profile = await userAPI.getProfile();
        setCurrentUser(profile);
      } catch (err) {
        // Not logged in or token invalid; hide owner-only actions
        setCurrentUser(null);
      }
    };

    loadCurrentUser();
  }, []);

  const loadEvent = async () => {
    if (!plainId) return;
    
    setRelatedEvents([]);
    try {
      const [eventData, timelineData, announcementsData, commentsData, donationsData, imagesData] = await Promise.all([
        eventsAPI.getById(plainId),
        eventTimelineAPI.getByEvent(plainId).catch(() => []),
        announcementsAPI.getByEvent(plainId).catch(() => []),
        eventCommentsAPI.getByEvent(plainId).catch(() => []),
        donationsAPI.getRecentByEvent(plainId).catch(() => []),
        eventsAPI.getImages(plainId).catch(() => []),
      ]);
      setEvent(eventData);
      setTimeline(timelineData);
      setAnnouncements(announcementsData);
      setComments(commentsData);
      setRecentDonations(donationsData.slice(0, 5));
      setEventImages(imagesData);
      loadRelatedEvents(eventData);
      
      // Record view
      eventsAPI.recordView(plainId).catch(err => console.error('Failed to record view:', err));
      
      if (imagesData.length > 0) {
        const primary = imagesData.find(img => img.isPrimary);
        setSelectedImage(primary || imagesData[0]);
      } else if (!selectedImage && eventData.imageUrl) {
        // If no uploaded images but has imageUrl, create a temporary image object
        setSelectedImage({ imageUrl: eventData.imageUrl, isPrimary: true });
      }
    } catch (err) {
      setError('Failed to load fundraiser details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    try {
      setLoadingParticipants(true);
      const data = await eventsAPI.getParticipants(id);
      setParticipants(data);
    } catch (err) {
      console.error('Failed to load participants:', err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleCopyLink = async () => {
    const urlToCopy = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (!urlToCopy) return;

    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link. Please copy it manually:\n' + urlToCopy);
    }
  };

  const handleShare = async () => {
    const urlToShare = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (!urlToShare) return;

    const shareData = {
      title: event?.title || 'Support this fundraiser',
      text: event?.shortDescription || 'Help make a difference today',
      url: urlToShare,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Share cancelled');
      }
    }

    await handleCopyLink();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await eventCommentsAPI.create(id, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      alert('Please fill in all announcement fields');
      return;
    }

    try {
      setSubmittingAnnouncement(true);
      await adminAnnouncementsAPI.create({
        title: announcementForm.title,
        content: announcementForm.content,
        eventId: event.id,
      });
      alert('Announcement created successfully!');
      setAnnouncementForm({ title: '', content: '' });
      setShowAnnouncementModal(false);
      await loadEvent();
    } catch (err) {
      console.error('Failed to create announcement:', err);
      alert('Failed to create announcement: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingAnnouncement(false);
    }
  };

  const handleJoinEvent = async (joinType = 'free') => {
    try {
      setJoiningEvent(true);
      await eventsAPI.joinEvent(id, { joinType });
      setJoined(true);
      setShowJoinModal(false);
      
      if (joinType === 'free') {
        alert('You are now supporting this fundraiser!');
      } else if (joinType === 'donation') {
        alert('Great! Please make a donation to join.');
        window.location.href = `/donate/${id}`;
      } else if (joinType === 'paid') {
        alert('Processing payment...');
        // Redirect to payment page
        window.location.href = `/donate/${id}?type=paid`;
      }
      
      loadEvent();
    } catch (err) {
      console.error('Failed to join event:', err);
      if (err.response?.status === 401) {
        alert('Please login to support this fundraiser');
      } else {
        alert('Failed to join event. Please try again.');
      }
    } finally {
      setJoiningEvent(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImages(true);
      const result = await eventsAPI.uploadImages(id, files);
      alert(`${result.images.length} image(s) uploaded successfully!`);
      
      const imagesData = await eventsAPI.getImages(id);
      setEventImages(imagesData);
      
      if (!selectedImage && imagesData.length > 0) {
        setSelectedImage(imagesData[0]);
      }
    } catch (err) {
      console.error('Failed to upload images:', err);
      alert(err.response?.data?.error || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await eventsAPI.deleteImage(id, imageId);
      const updatedImages = eventImages.filter(img => img.id !== imageId);
      setEventImages(updatedImages);
      
      if (selectedImage?.id === imageId) {
        setSelectedImage(updatedImages[0] || null);
      }
      
      alert('Image deleted successfully');
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Failed to delete image');
    }
  };

  const loadRelatedEvents = async (currentEvent) => {
    const base = currentEvent || event;
    if (!base) return;

    try {
      setLoadingRelated(true);
      const response = await eventsAPI.getAll(0, 12, 'createdAt', 'desc');
      const list = response.content || response || [];
      const normalizedCategory = (base.category || '').toLowerCase();
      const filteredByCategory = list.filter((item) =>
          item.id !== base.id && normalizedCategory && (item.category || '').toLowerCase() === normalizedCategory
      );
      const fallbackList = list.filter((item) => item.id !== base.id);
      const candidates = (filteredByCategory.length > 0 ? filteredByCategory : fallbackList).slice(0, 3);
      setRelatedEvents(candidates);

      // Fetch primary image for each related event (best-effort)
      const imageFetches = await Promise.all(
        candidates.map(async (ev) => {
          try {
            const imgs = await eventsAPI.getImages(ev.id);
            const primary = Array.isArray(imgs) ? imgs.find((img) => img.isPrimary) : null;
            const first = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : null;
            const url = primary?.imageUrl || first?.imageUrl || ev.imageUrl || null;
            return { id: ev.id, url };
          } catch {
            return { id: ev.id, url: ev.imageUrl || null };
          }
        })
      );
      const imgMap = imageFetches.reduce((acc, cur) => {
        if (cur.url) acc[cur.id] = cur.url;
        return acc;
      }, {});
      setRelatedImages(imgMap);
    } catch (err) {
      console.error('Failed to load related events:', err);
    } finally {
      setLoadingRelated(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-3 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 font-medium">Loading fundraiser details...</p>
          </div>
        </div>
    );
  }

  if (error || !event) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-6 text-gray-300">💔</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Fundraiser not found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the fundraiser you're looking for.</p>
            <Link
                href="/events"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              ← Browse all fundraisers
            </Link>
          </div>
        </div>
    );
  }

  const isOwner = currentUser && event && currentUser.id === event.ownerId;

  const progress = calculateProgress(event.currentAmount, event.goalAmount);
  const daysRemaining = event.endDate
      ? Math.ceil((new Date(event.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;
  const encodedShareUrl = shareUrl ? encodeURIComponent(shareUrl) : '';
  const shareEmailHref = shareUrl
      ? `mailto:?subject=${encodeURIComponent(event?.title || 'Support this fundraiser')}&body=${encodeURIComponent((event?.shortDescription || 'Join me in supporting this fundraiser.') + '\n\n' + shareUrl)}`
      : '';
  const closeShareModal = () => setShowShareModal(false);
  const openShareModal = () => setShowShareModal(true);

  return (
      <div className="min-h-screen bg-white">
        {/* Hero Section with Image Gallery */}
        <div className="relative">
          {(selectedImage || eventImages.length > 0 || event.imageUrl) ? (
              <div className="h-[60vh] md:h-[70vh] relative">
                <img
                    src={selectedImage?.imageUrl || eventImages[0]?.imageUrl || event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
                
                {/* Image Thumbnails */}
                {eventImages.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                    {eventImages.map((img) => (
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
              <div className="h-[60vh] md:h-[70vh] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-4">🙏</div>
                  <p className="text-lg text-gray-600">Support this cause</p>
                </div>
              </div>
          )}

          {/* Back Navigation */}
          <div className="absolute top-4 left-4">
            <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors shadow-sm"
            >
              ← Back to fundraisers
            </Link>
          </div>

          {/* Category Tag */}
          {event.category && (
              <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              {event.category}
            </span>
              </div>
          )}

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                  {event.title}
                </h1>
                <p className="text-white/90 text-lg mb-6 max-w-xl">
                  {event.shortDescription || 'Help make a difference today'}
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
              {/* Organizer Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  {event.ownerAvatar ? (
                      <img
                          src={event.ownerAvatar}
                          alt={event.ownerName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-orange-100"
                      />
                  ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border-2 border-orange-100">
                        <User className="w-8 h-8 text-orange-600" />
                      </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{event.ownerName}</h3>
                      {event.ownerVerified && (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Fundraiser organizer</p>
                    {event.ownerRelation && (
                        <p className="text-gray-700 mb-3">{event.ownerRelation}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {event.location && (
                          <span className="flex items-center gap-1">
                        <MapPin size={14} />
                            {event.location}
                      </span>
                      )}
                      <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Joined {formatDate(event.createdAt, { month: 'short', year: 'numeric' })}
                    </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isOwner && (
                      <>
                        <Link
                          href={`/events/edit/${encryptId(event.id)}`}
                          className="text-orange-600 hover:text-orange-700 font-medium text-sm px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          ✏️ Edit Event
                        </Link>
                        <button
                          onClick={() => setShowAnnouncementModal(true)}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm px-4 py-2 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-1"
                        >
                          <Megaphone className="w-4 h-4" />
                          Announce
                        </button>
                      </>
                    )}
                    <button className="text-orange-600 hover:text-orange-700 font-medium text-sm px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                  {['story', 'updates', 'support', 'chat', 'participants'].map((tab) => (
                      <button
                          key={tab}
                          onClick={() => {
                            setActiveTab(tab);
                            if (tab === 'participants' && participants.length === 0) {
                              loadParticipants();
                            }
                          }}
                          className={`py-3 px-1 border-b-2 font-medium text-sm ${
                              activeTab === tab
                                  ? 'border-orange-500 text-orange-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        {tab === 'story' && 'The Story'}
                        {tab === 'updates' && `Updates (${announcements.length})`}
                        {tab === 'support' && `Words of Support (${comments.length})`}
                        {tab === 'chat' && '💬 Community Chat'}
                        {tab === 'participants' && `Participants (${event.participantCount || 0})`}
                      </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {/* Story Tab */}
                {activeTab === 'story' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this fundraiser</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                          {event.description.split('\n').map((paragraph, idx) => (
                              <p key={idx} className="mb-4 leading-relaxed">
                                {paragraph}
                              </p>
                          ))}
                        </div>
                      </div>

                      {event.impact && (
                          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                            <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                              <Sparkles className="w-5 h-5" /> The Impact
                            </h3>
                            <p className="text-amber-800">{event.impact}</p>
                          </div>
                      )}

                      {/* Image Gallery Management - Only for event owner */}
                      {typeof window !== 'undefined' && localStorage.getItem('user') && 
                       JSON.parse(localStorage.getItem('user')).id === event.ownerId && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <ImageIcon className="w-5 h-5" /> Event Gallery
                            </h3>
                            <label className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium disabled:opacity-50">
                              {uploadingImages ? (
                                <span className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                  Uploading...
                                </span>
                              ) : (
                                '+ Add Images'
                              )}
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImages}
                                className="hidden"
                              />
                            </label>
                          </div>
                          
                          {eventImages.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {eventImages.map((img) => (
                                <div key={img.id} className="relative group">
                                  <img
                                    src={img.imageUrl}
                                    alt="Event"
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  {img.isPrimary && (
                                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                      Primary
                                    </div>
                                  )}
                                  <button
                                    onClick={() => handleDeleteImage(img.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Camera className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">No images uploaded yet</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Location Map */}
                      {event.location && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-orange-600" size={20} />
                            Event Location
                          </h3>
                          <div className="space-y-3">
                            <p className="text-gray-700">{event.location}</p>
                            {event.latitude && event.longitude && (
                              <>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-4 h-4" /> Coordinates: {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
                                </p>
                                {/* Map embed */}
                                <div className="rounded-lg overflow-hidden border border-gray-200">
                                  <iframe
                                    width="100%"
                                    height="300"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.longitude - 0.01},${event.latitude - 0.01},${event.longitude + 0.01},${event.latitude + 0.01}&layer=mapnik&marker=${event.latitude},${event.longitude}`}
                                    allowFullScreen
                                  />
                                  <div className="bg-gray-50 px-4 py-2 text-center">
                                    <a
                                      href={`https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}#map=15/${event.latitude}/${event.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-orange-600 hover:text-orange-700"
                                    >
                                      View Larger Map →
                                    </a>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Trust Assurance */}
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Shield className="text-orange-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Your donation is protected</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              We guarantee that 100% of your donation goes directly to this cause.
                              Our platform uses secure payment processing and provides regular updates
                              on how funds are being used.
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">Secure payments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">No platform fees</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">Regular updates</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">Donor protection</span>
                          </div>
                        </div>
                      </div>
                    </div>
                )}

                {/* Updates Tab */}
                {activeTab === 'updates' && (
                    <div className="space-y-6 animate-fadeIn">
                      {announcements.length === 0 ? (
                          <div className="text-center py-12">
                            <Edit className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">No updates yet</p>
                            <p className="text-gray-500 text-sm mt-2">The organizer will post updates here</p>
                          </div>
                      ) : (
                          <div className="space-y-6">
                            {announcements.map((update) => (
                                <div key={update.id} className="pb-6 border-b border-gray-100 last:border-0">
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Megaphone className="w-5 h-5 text-orange-600" />
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">{event.ownerName}</span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-sm text-gray-500">{formatTimeAgo(update.createdAt)}</span>
                                      </div>
                                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{update.title}</h4>
                                      <div className="prose text-gray-700 whitespace-pre-wrap mb-3">
                                        {update.content}
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <button className="flex items-center gap-1 hover:text-orange-600">
                                          <Heart size={14} />
                                          <span>{update.reactionCount || 0}</span>
                                        </button>
                                        <button className="flex items-center gap-1 hover:text-orange-600">
                                          <MessageCircle size={14} />
                                          <span>{update.commentCount || 0}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>
                )}

                {/* Support Tab */}
                {activeTab === 'support' && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Comment Form */}
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Share your support</h3>
                        <form onSubmit={handleAddComment} className="space-y-4">
                      <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Leave a message of encouragement..."
                          rows="3"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-50 focus:outline-none resize-none bg-white"
                      />
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Your message will be public
                            </div>
                            <button
                                type="submit"
                                disabled={submittingComment || !newComment.trim()}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {submittingComment ? 'Posting...' : 'Post message'}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-4">
                        {comments.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="text-4xl mb-4">💭</div>
                              <p className="text-gray-600">No messages yet</p>
                              <p className="text-gray-500 text-sm mt-2">Be the first to show your support</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="pb-4 border-b border-gray-100 last:border-0">
                                  <div className="flex items-start gap-3">
                                    {comment.userAvatar ? (
                                        <img
                                            src={comment.userAvatar}
                                            alt={comment.userName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-medium">
                                          {comment.userName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{comment.userName}</span>
                                        {comment.donationAmount && (
                                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                    Donated {formatCurrency(comment.donationAmount)}
                                  </span>
                                        )}
                                      </div>
                                      <p className="text-gray-700 mb-1">{comment.content}</p>
                                      <span className="text-xs text-gray-500 mb-2">
                                        {formatDate(comment.createdAt, {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                            ))
                        )}
                      </div>
                    </div>
                )}
              </div>

              {/* Community Chat Tab */}
              {activeTab === 'chat' && (
                <div className="animate-fadeIn">
                  <EventChatBox 
                    eventId={plainId} 
                    currentUser={currentUser}
                    isEventOwner={isOwner}
                  />
                </div>
              )}

              {/* Participants Tab */}
              {activeTab === 'participants' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Participants ({participants.length})
                      </h2>
                    </div>

                    {loadingParticipants ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : participants.length === 0 ? (
                        <div className="bg-gray-50 rounded-2xl p-8 text-center">
                          <Users className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-500 mb-2">No participants yet</p>
                          <p className="text-gray-400 text-sm">Be the first to join this fundraiser!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                          {participants.map((participant) => (
                              <div
                                  key={participant.userId}
                                  className="bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-200 hover:shadow-md transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  {participant.userAvatar ? (
                                      <img
                                          src={participant.userAvatar}
                                          alt={participant.userName}
                                          className="w-12 h-12 rounded-full object-cover"
                                      />
                                  ) : (
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 font-medium text-lg">
                                        {participant.userName.charAt(0).toUpperCase()}
                                      </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-gray-900">{participant.userName}</span>
                                      {participant.donationCount > 0 && (
                                          <span className="inline-flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                            <Heart className="w-3 h-3 mr-1 fill-current" />
                                            Donor
                                          </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                      <span>Joined {formatTimeAgo(participant.joinedAt)}</span>
                                      {participant.totalDonated > 0 && (
                                          <>
                                            <span>•</span>
                                            <span className="font-medium text-orange-600">
                                              {formatCurrency(participant.totalDonated)} donated
                                            </span>
                                          </>
                                      )}
                                    </div>
                                  </div>
                                  {participant.donationCount > 1 && (
                                      <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">
                                          {participant.donationCount}
                                        </div>
                                        <div className="text-xs text-gray-500">donations</div>
                                      </div>
                                  )}
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
              )}
            </div>

            {/* Right Column - Donation Card (Sticky) */}
            <div className="lg:col-span-1">
              <div
                  ref={donationCardRef}
                  className={`lg:sticky lg:top-8 ${isSticky ? 'lg:animate-slideUp' : ''}`}
              >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Fundraising progress</h3>
                      <span className="text-orange-600 font-bold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                          className="bg-gradient-to-r from-orange-400 to-amber-400 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Raised: {formatCurrency(event.currentAmount)}</span>
                      <span>Goal: {formatCurrency(event.goalAmount)}</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{event.viewsCount || 0}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{event.participantCount || 0}</div>
                      <div className="text-xs text-gray-500">Supporters</div>
                    </div>
                  </div>

                  {/* Urgency Indicator */}
                  {daysRemaining > 0 && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-amber-800 mb-1">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">{daysRemaining} days left</span>
                        </div>
                        <p className="text-amber-700 text-sm">
                          This fundraiser ends soon. Your support can help reach the goal.
                        </p>
                      </div>
                  )}

                  {/* Donation CTA */}
                  <div className="space-y-3">
                    {!isOwner && !joined ? (
                      <button
                        onClick={() => setShowJoinModal(true)}
                        disabled={joiningEvent}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {joiningEvent ? 'Joining...' : '✓ Join Event'}
                      </button>
                    ) : joined && !isOwner ? (
                      <div className="w-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-center py-4 px-6 rounded-xl font-bold text-lg border-2 border-green-300 flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        Already a supporter!
                      </div>
                    ) : null}
                    {!isOwner && (
                      <Link
                          href={`/donate/${encryptId(event.id)}`}
                          className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        Donate now
                      </Link>
                    )}
                  </div>

                  {/* Share Section */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <Share2 size={18} className="text-orange-600" />
                      <span>Share this fundraiser</span>
                    </div>

                    <button
                        onClick={openShareModal}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-800 hover:border-orange-200 hover:text-orange-700 transition-colors"
                    >
                      <Share2 size={16} />
                      Quick share
                    </button>
                  </div>

                  {showShareModal && (
                    <div
                        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
                        onClick={closeShareModal}
                    >
                      <div
                          className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4"
                          onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-900 font-semibold">
                            <Share2 size={18} className="text-orange-600" />
                            <span>Share this fundraiser</span>
                          </div>
                          <button
                              onClick={closeShareModal}
                              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                              aria-label="Close share dialog"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
                          <Link2 size={16} className="text-orange-600" />
                          <span className="truncate">{shareUrl || 'Link will appear here once loaded'}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                              onClick={handleShare}
                              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                          >
                            <Share2 size={16} />
                            Native share
                          </button>
                          <button
                              onClick={handleCopyLink}
                              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-800 hover:border-orange-200 hover:text-orange-700 transition-colors"
                          >
                            <Copy size={16} />
                            {copyState === 'copied' ? 'Copied' : 'Copy link'}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                          <a
                              href={encodedShareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}` : '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-orange-200 hover:text-orange-700 transition-colors"
                          >
                            Share on Facebook
                          </a>
                          <a
                              href={encodedShareUrl ? `https://wa.me/?text=${encodedShareUrl}` : '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-orange-200 hover:text-orange-700 transition-colors"
                          >
                            Share on WhatsApp
                          </a>
                          <a
                              href={shareEmailHref || '#'}
                              className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-orange-200 hover:text-orange-700 transition-colors"
                          >
                            Share via Email
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Donors */}
                  {recentDonations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Recent supporters</h4>
                        <div className="space-y-3">
                          {recentDonations.map((donation) => {
                            const displayName = donation.donorName || (donation.isAnonymous ? 'Anonymous' : 'Supporter');
                            const initial = displayName.charAt(0);
                            return (
                              <div key={donation.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {donation.donorAvatar ? (
                                    <img
                                      src={donation.donorAvatar}
                                      alt={displayName}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                                      {initial}
                                    </div>
                                  )}
                                  <span className="text-sm text-gray-700">{displayName}</span>
                                </div>
                                <div className="text-sm font-medium text-orange-600">
                                  {formatCurrency(donation.amount)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                  )}

                  {/* Participants */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={18} />
                        <span>{event.participantCount || 0} supporters</span>
                      </div>
                      {joined ? (
                          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={14} />
                        You're supporting
                      </span>
                      ) : (
                          <button
                              onClick={() => setShowJoinModal(true)}
                              disabled={joiningEvent}
                              className="text-orange-600 hover:text-orange-700 font-medium text-sm px-3 py-1 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                          >
                            {joiningEvent ? 'Joining...' : 'Support fundraiser'}
                          </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Trust Info */}
                <div className="mt-4 bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <Shield className="text-gray-600" size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Trust & Safety</h4>
                      <p className="text-sm text-gray-600">
                        Your donation is protected by our platform guarantee.
                        Funds are delivered directly to the organizer and beneficiary.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-gray-700">Secure payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-gray-700">Verified identity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Fundraisers (Bottom) */}
        {(loadingRelated || relatedEvents.length > 0) && (
            <div className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Other ways to help</h2>
                  <Link href="/events" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    View all fundraisers →
                  </Link>
                </div>

                {loadingRelated ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : relatedEvents.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
                      No related fundraisers yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedEvents.slice(0, 3).map((related) => {
                        const imgSrc = relatedImages[related.id] || related.imageUrl || null;
                        return (
                          <Link
                            key={related.id}
                            href={`/events/${related.id}`}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-200 transition-all duration-200 hover:shadow-lg group"
                          >
                            <div className="h-40 relative">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={related.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="p-5">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600">
                                {related.title}
                              </h3>
                              <div className="flex justify-between text-sm text-gray-600 mb-3">
                                <span>Goal: {formatCurrency(related.goalAmount)}</span>
                                <span>{calculateProgress(related.currentAmount, related.goalAmount)}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div
                                  className="bg-orange-400 h-1.5 rounded-full"
                                  style={{ width: `${calculateProgress(related.currentAmount, related.goalAmount)}%` }}
                                />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                )}
              </div>
            </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setShowJoinModal(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">How would you like to join?</h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">Choose how you'd like to support this fundraiser:</p>

              <div className="space-y-3">
                {/* Free Join Option */}
                <button
                  onClick={() => handleJoinEvent('free')}
                  disabled={joiningEvent}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Free Join</h4>
                      <p className="text-sm text-gray-600">Support the cause without any cost</p>
                    </div>
                  </div>
                </button>

                {/* Donation Join Option */}
                <button
                  onClick={() => handleJoinEvent('donation')}
                  disabled={joiningEvent}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                        <Heart className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Join with Donation</h4>
                      <p className="text-sm text-gray-600">Make a donation to join and support</p>
                    </div>
                  </div>
                </button>

                {/* Paid Join Option */}
                <button
                  onClick={() => handleJoinEvent('paid')}
                  disabled={joiningEvent}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100">
                        <span className="text-lg font-bold text-purple-600">$</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Pay to Join</h4>
                      <p className="text-sm text-gray-600">Pay an entry fee to join the event</p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowJoinModal(false)}
                className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Announcement Modal */}
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Megaphone className="w-6 h-6" />
                  Create Announcement
                </h2>
                <button onClick={() => setShowAnnouncementModal(false)} className="hover:bg-white hover:bg-opacity-20 p-1 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Announcement Title *</label>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    placeholder="Enter announcement title..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    placeholder="Write your announcement message..."
                    rows="6"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-vertical"
                    required
                  />
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-800">
                    <strong>Note:</strong> This announcement will be visible to all supporters of this fundraiser in the Updates section.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAnnouncement}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingAnnouncement && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                    Post Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}