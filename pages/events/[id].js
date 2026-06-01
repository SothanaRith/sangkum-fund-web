import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { eventsAPI, eventTimelineAPI, announcementsAPI, eventCommentsAPI, donationsAPI, userAPI } from '@/lib/api';
import { adminAnnouncementsAPI } from '@/lib/admin-api';
import { formatCurrency, formatDate, calculateProgress, formatTimeAgo } from '@/lib/utils';
import { encryptId, decryptId } from '@/lib/encryption';
import { Heart, Share2, Shield, CheckCircle, Calendar, Users, MapPin, ChevronDown, PartyPopper, Camera, Image as ImageIcon, Sparkles, MessageCircle, Megaphone, Clock, User, Edit, Copy, Link2, X, ThumbsUp, Smile, TrendingUp, Reply, Send } from 'lucide-react';
import EventChatBox from '@/components/EventChatBox';
import EventHeader from '@/components/EventHeader';
import EventDetails from '@/components/EventDetails';
import EventDonationPanel from '@/components/EventDonationPanel';

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
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [announcementComment, setAnnouncementComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const storyRef = useRef(null);
  const donationCardRef = useRef(null);

  useEffect(() => {
    if (id) {
      
      // Decrypt ID if it's encrypted, otherwise use plain ID
      try {
        const decrypted = decryptId(id);
        const actualId = decrypted || id;
        setPlainId(actualId);
      } catch (err) {
        setPlainId(id);
      }
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
      const [eventData, timelineData, announcementsResponse, commentsData, donationsData, imagesData] = await Promise.all([
        eventsAPI.getById(plainId),
        eventTimelineAPI.getByEvent(plainId).catch(() => []),
        announcementsAPI.getByEvent(plainId).catch(() => []),
        eventCommentsAPI.getByEvent(plainId).catch(() => []),
        donationsAPI.getRecentByEvent(plainId).catch(() => []),
        eventsAPI.getImages(plainId).catch(() => []),
      ]);
      setEvent(eventData);
      setTimeline(timelineData);
      // Handle both array response and wrapped response
      const announcementsData = Array.isArray(announcementsResponse) ? announcementsResponse : (announcementsResponse?.data || []);
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
        // share was cancelled by user
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

  const handleAnnouncementReaction = async (announcementId, reactionType) => {
    try {
      await announcementsAPI.addReaction(announcementId, reactionType);
      setShowReactionPicker(null);
      await loadEvent();
    } catch (err) {
      console.error('Failed to add reaction:', err);
      alert('Failed to add reaction');
    }
  };

  const handleAddAnnouncementComment = async (announcementId) => {
    if (!announcementComment.trim()) return;
    
    try {
      await announcementsAPI.addComment(announcementId, {
        content: announcementComment,
        parentId: replyingTo,
      });
      setAnnouncementComment('');
      setReplyingTo(null);
      await loadEvent();
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment');
    }
  };

  const handleCommentReaction = async (announcementId, commentId, reactionType) => {
    try {
      await announcementsAPI.addCommentReaction(announcementId, commentId, reactionType);
      setShowReactionPicker(null);
      await loadEvent();
    } catch (err) {
      console.error('Failed to add comment reaction:', err);
      alert('Failed to add reaction');
    }
  };

  const reactions = [
    { type: 'LIKE', icon: Heart, label: 'Like', color: 'text-red-500' },
    { type: 'LOVE', icon: Heart, label: 'Love', color: 'text-pink-500' },
    { type: 'SUPPORT', icon: ThumbsUp, label: 'Support', color: 'text-blue-500' },
    { type: 'CELEBRATE', icon: Sparkles, label: 'Celebrate', color: 'text-yellow-500' },
    { type: 'INSIGHTFUL', icon: TrendingUp, label: 'Insightful', color: 'text-purple-500' },
  ];

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
        <EventHeader 
          selectedImage={selectedImage}
          eventImages={eventImages}
          event={event}
          setSelectedImage={setSelectedImage}
        />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <EventDetails 
              event={event}
              currentUser={currentUser}
              isOwner={isOwner}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              participants={participants}
              loadParticipants={loadParticipants}
              loadingParticipants={loadingParticipants}
              announcements={announcements}
              comments={comments}
              storyRef={storyRef}
              uploadingImages={uploadingImages}
              handleImageUpload={handleImageUpload}
              eventImages={eventImages}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              handleDeleteImage={handleDeleteImage}
              setShowAnnouncementModal={setShowAnnouncementModal}
              showReactionPicker={showReactionPicker}
              setShowReactionPicker={setShowReactionPicker}
              reactions={reactions}
              handleAnnouncementReaction={handleAnnouncementReaction}
              activeAnnouncement={activeAnnouncement}
              setActiveAnnouncement={setActiveAnnouncement}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              announcementComment={announcementComment}
              setAnnouncementComment={setAnnouncementComment}
              handleAddAnnouncementComment={handleAddAnnouncementComment}
              handleCommentReaction={handleCommentReaction}
              newComment={newComment}
              setNewComment={setNewComment}
              handleAddComment={handleAddComment}
              submittingComment={submittingComment}
              plainId={plainId}
            />

            <EventDonationPanel 
              donationCardRef={donationCardRef}
              isSticky={isSticky}
              progress={progress}
              event={event}
              daysRemaining={daysRemaining}
              isOwner={isOwner}
              joined={joined}
              setShowJoinModal={setShowJoinModal}
              joiningEvent={joiningEvent}
              openShareModal={openShareModal}
              showShareModal={showShareModal}
              closeShareModal={closeShareModal}
              shareUrl={shareUrl}
              encodedShareUrl={encodedShareUrl}
              handleShare={handleShare}
              handleCopyLink={handleCopyLink}
              copyState={copyState}
              shareEmailHref={shareEmailHref}
              recentDonations={recentDonations}
            />
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