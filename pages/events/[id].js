import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { eventsAPI, eventTimelineAPI, announcementsAPI, eventCommentsAPI, donationsAPI, userAPI } from '@/lib/api';
import { formatCurrency, formatDate, calculateProgress, timeAgo } from '@/lib/utils';
import { Heart, Share2, Shield, CheckCircle, Calendar, Users, MapPin, ChevronDown, PartyPopper, Camera, Image as ImageIcon, Sparkles, MessageCircle, Megaphone, Clock, User, Edit } from 'lucide-react';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
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
  const [eventImages, setEventImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const storyRef = useRef(null);
  const donationCardRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadEvent();
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
    try {
      const [eventData, timelineData, announcementsData, commentsData, donationsData, imagesData] = await Promise.all([
        eventsAPI.getById(id),
        eventTimelineAPI.getByEvent(id).catch(() => []),
        announcementsAPI.getByEvent(id).catch(() => []),
        eventCommentsAPI.getByEvent(id).catch(() => []),
        donationsAPI.getRecentByEvent(id).catch(() => []),
        eventsAPI.getImages(id).catch(() => []),
      ]);
      setEvent(eventData);
      setTimeline(timelineData);
      setAnnouncements(announcementsData);
      setComments(commentsData);
      setRecentDonations(donationsData.slice(0, 5));
      setEventImages(imagesData);
      
      // Set selected image to primary or first image
      if (imagesData.length > 0) {
        const primary = imagesData.find(img => img.isPrimary);
        setSelectedImage(primary || imagesData[0]);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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

  const handleJoinEvent = async () => {
    try {
      setJoiningEvent(true);
      await eventsAPI.joinEvent(id);
      setJoined(true);
      alert('You are now supporting this fundraiser!');
      // Reload event to get updated participant count
      loadEvent();
    } catch (err) {
      console.error('Failed to join event:', err);
      if (err.response?.status === 401) {
        alert('Please login to support this fundraiser');
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImages(true);
      const result = await eventsAPI.uploadImages(id, files);
      alert(`${result.images.length} image(s) uploaded successfully!`);
      
      // Reload images
      const imagesData = await eventsAPI.getImages(id);
      setEventImages(imagesData);
      
      // Set first uploaded image as selected if no image selected
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
      
      // Update selected image if deleted
      if (selectedImage?.id === imageId) {
        setSelectedImage(updatedImages[0] || null);
      }
      
      alert('Image deleted successfully');
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Failed to delete image');
    }
  };

      } else {
        alert('Failed to join event. Please try again.');
      }
    } finally {
      setJoiningEvent(false);
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
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
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

  return (
      <div className="min-h-screen bg-white">
        {/* Hero Section with Image Gallery */}
        <div className="relative">
          {(selectedImage || event.imageUrl) ? (
              <div className="h-[60vh] md:h-[70vh] relative">
                <img
                    src={selectedImage?.imageUrl || event.imageUrl}
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
              <div className="h-[60vh] md:h-[70vh] bg-gradient-to-br from-primary-50 to-emerald-50 flex items-center justify-center">
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
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
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
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
                      />
                  ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center border-2 border-primary-100">
                        <User className="w-8 h-8 text-primary-600" />
                      </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{event.ownerName}</h3>
                      {event.ownerVerified && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
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
                      <Link
                        href={`/events/edit/${event.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm px-4 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        ✏️ Edit Event
                      </Link>
                    )}
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm px-4 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                  {['story', 'updates', 'support', 'participants'].map((tab) => (
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
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        {tab === 'story' && 'The Story'}
                        {tab === 'updates' && `Updates (${announcements.length})`}
                        {tab === 'support' && `Words of Support (${comments.length})`}
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
                          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h3 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                              <Sparkles className="w-5 h-5" /> The Impact
                            </h3>
                            <p className="text-emerald-800">{event.impact}</p>
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
                            <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50">
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
                                    <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
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
                            <MapPin className="text-primary-600" size={20} />
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
                                      className="text-sm text-primary-600 hover:text-primary-700"
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
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <Shield className="text-primary-600" size={20} />
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
                                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                        <Megaphone className="w-5 h-5 text-primary-600" />
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">{event.ownerName}</span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-sm text-gray-500">{timeAgo(update.createdAt)}</span>
                                      </div>
                                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{update.title}</h4>
                                      <div className="prose text-gray-700 whitespace-pre-wrap mb-3">
                                        {update.content}
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <button className="flex items-center gap-1 hover:text-primary-600">
                                          <Heart size={14} />
                                          <span>{update.reactionCount || 0}</span>
                                        </button>
                                        <button className="flex items-center gap-1 hover:text-primary-600">
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-50 focus:outline-none resize-none bg-white"
                      />
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Your message will be public
                            </div>
                            <button
                                type="submit"
                                disabled={submittingComment || !newComment.trim()}
                                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
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
                                  className="bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-200 hover:shadow-md transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  {participant.userAvatar ? (
                                      <img
                                          src={participant.userAvatar}
                                          alt={participant.userName}
                                          className="w-12 h-12 rounded-full object-cover"
                                      />
                                  ) : (
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 font-medium text-lg">
                                        {participant.userName.charAt(0).toUpperCase()}
                                      </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-gray-900">{participant.userName}</span>
                                      {participant.donationCount > 0 && (
                                          <span className="inline-flex items-center text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                                            <Heart className="w-3 h-3 mr-1 fill-current" />
                                            Donor
                                          </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                      <span>Joined {timeAgo(participant.joinedAt)}</span>
                                      {participant.totalDonated > 0 && (
                                          <>
                                            <span>•</span>
                                            <span className="font-medium text-primary-600">
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
                      <span className="text-primary-600 font-bold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                          className="bg-gradient-to-r from-primary-400 to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Raised: {formatCurrency(event.currentAmount)}</span>
                      <span>Goal: {formatCurrency(event.goalAmount)}</span>
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
                    <Link
                        href={`/donate/${event.id}`}
                        className="block w-full bg-gradient-to-r from-primary-500 to-emerald-500 text-white text-center py-4 px-6 rounded-xl font-bold text-lg hover:from-primary-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      Donate now
                    </Link>
                    <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 size={18} />
                      Share fundraiser
                    </button>
                  </div>

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
                                <div className="text-sm font-medium text-primary-600">
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
                              onClick={handleJoinEvent}
                              disabled={joiningEvent}
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm px-3 py-1 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
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
        {event.relatedEvents && event.relatedEvents.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Other ways to help</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {event.relatedEvents.slice(0, 3).map((related) => (
                      <Link
                          key={related.id}
                          href={`/events/${related.id}`}
                          className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg group"
                      >
                        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:opacity-90 transition-opacity"></div>
                        <div className="p-5">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600">
                            {related.title}
                          </h3>
                          <div className="flex justify-between text-sm text-gray-600 mb-3">
                            <span>Goal: {formatCurrency(related.goalAmount)}</span>
                            <span>{calculateProgress(related.currentAmount, related.goalAmount)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className="bg-primary-400 h-1.5 rounded-full"
                                style={{ width: `${calculateProgress(related.currentAmount, related.goalAmount)}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                  ))}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}