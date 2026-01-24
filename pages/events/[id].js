import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { eventsAPI, eventTimelineAPI, announcementsAPI, eventCommentsAPI, donationsAPI } from '@/lib/api';
import { formatCurrency, formatDate, calculateProgress, timeAgo } from '@/lib/utils';
import { Heart, Share2, Shield, CheckCircle, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
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

  const loadEvent = async () => {
    try {
      const [eventData, timelineData, announcementsData, commentsData, donationsData] = await Promise.all([
        eventsAPI.getById(id),
        eventTimelineAPI.getByEvent(id).catch(() => []),
        announcementsAPI.getByEvent(id).catch(() => []),
        eventCommentsAPI.getByEvent(id).catch(() => []),
        donationsAPI.getRecentByEvent(id).catch(() => []),
      ]);
      setEvent(eventData);
      setTimeline(timelineData);
      setAnnouncements(announcementsData);
      setComments(commentsData);
      setRecentDonations(donationsData.slice(0, 5));
    } catch (err) {
      setError('Failed to load fundraiser details');
      console.error(err);
    } finally {
      setLoading(false);
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

  const progress = calculateProgress(event.currentAmount, event.goalAmount);
  const daysRemaining = event.endDate
      ? Math.ceil((new Date(event.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

  return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative">
          {event.imageUrl ? (
              <div className="h-[60vh] md:h-[70vh] relative">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
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
                        <div className="text-2xl">👤</div>
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
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm px-4 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                    Contact
                  </button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                  {['story', 'updates', 'support'].map((tab) => (
                      <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-3 px-1 border-b-2 font-medium text-sm ${
                              activeTab === tab
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        {tab === 'story' && 'The Story'}
                        {tab === 'updates' && `Updates (${announcements.length})`}
                        {tab === 'support' && `Words of Support (${comments.length})`}
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
                              <span className="text-xl">✨</span> The Impact
                            </h3>
                            <p className="text-emerald-800">{event.impact}</p>
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
                            <div className="text-4xl mb-4">📝</div>
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
                                        <span className="text-primary-600">📢</span>
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
                                          <span>💬</span>
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
                          <span className="text-lg">⏰</span>
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
                          {recentDonations.map((donation) => (
                              <div key={donation.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {donation.donorAvatar ? (
                                      <img
                                          src={donation.donorAvatar}
                                          alt={donation.donorName}
                                          className="w-8 h-8 rounded-full object-cover"
                                      />
                                  ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                                        {donation.donorName.charAt(0)}
                                      </div>
                                  )}
                                  <span className="text-sm text-gray-700">{donation.donorName}</span>
                                </div>
                                <div className="text-sm font-medium text-primary-600">
                                  {formatCurrency(donation.amount)}
                                </div>
                              </div>
                          ))}
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
                              // onClick={handleJoinEvent}
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