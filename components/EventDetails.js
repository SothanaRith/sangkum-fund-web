import { User, CheckCircle, MapPin, Calendar, Megaphone, Sparkles, Image as ImageIcon, Camera, Shield, Edit, Smile, MessageCircle, Reply, X, Send, Users, Heart } from 'lucide-react';
import { formatCurrency, formatDate, formatTimeAgo } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';
import Link from 'next/link';
import EventChatBox from '@/components/EventChatBox';

export default function EventDetails({
  event,
  currentUser,
  isOwner,
  activeTab,
  setActiveTab,
  participants,
  loadParticipants,
  loadingParticipants,
  announcements,
  comments,
  storyRef,
  uploadingImages,
  handleImageUpload,
  eventImages,
  selectedImage,
  setSelectedImage,
  handleDeleteImage,
  setShowAnnouncementModal,
  showReactionPicker,
  setShowReactionPicker,
  reactions,
  handleAnnouncementReaction,
  activeAnnouncement,
  setActiveAnnouncement,
  replyingTo,
  setReplyingTo,
  announcementComment,
  setAnnouncementComment,
  handleAddAnnouncementComment,
  handleCommentReaction,
  newComment,
  setNewComment,
  handleAddComment,
  submittingComment,
  plainId
}) {
  return (
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
                        <div key={update.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4 mb-4">
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
                              <div className="prose text-gray-700 whitespace-pre-wrap mb-4">
                                {update.content}
                              </div>
                              
                              {/* Reactions Bar */}
                              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                {/* Reaction Button with Picker */}
                                <div className="relative">
                                  <button
                                    onClick={() => setShowReactionPicker(
                                      showReactionPicker === update.id ? null : update.id
                                    )}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
                                  >
                                    <Smile className="w-5 h-5 text-gray-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-gray-700 font-semibold text-sm">React</span>
                                  </button>

                                  {/* Reaction Picker */}
                                  {showReactionPicker === update.id && (
                                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 flex gap-2 z-10 animate-fadeIn">
                                      {reactions.map((reaction) => (
                                        <button
                                          key={reaction.type}
                                          onClick={() => handleAnnouncementReaction(update.id, reaction.type)}
                                          className="p-2 rounded-lg hover:bg-gray-100 transition-all hover:scale-125 group"
                                          title={reaction.label}
                                        >
                                          <reaction.icon className={`w-6 h-6 ${reaction.color}`} />
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Reaction Counts */}
                                {update.reactions && update.reactions.length > 0 && (
                                  <div className="flex gap-2">
                                    {reactions.map((reaction) => {
                                      const count = update.reactions?.filter(r => r.type === reaction.type).length || 0;
                                      if (count === 0) return null;
                                      return (
                                        <span key={reaction.type} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                                          <reaction.icon className={`w-4 h-4 ${reaction.color}`} />
                                          <span className="text-sm font-semibold text-gray-700">{count}</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => setActiveAnnouncement(
                                    activeAnnouncement === update.id ? null : update.id
                                  )}
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors ml-auto"
                                >
                                  <MessageCircle className="w-5 h-5 text-blue-500" />
                                  <span className="text-gray-700 font-semibold text-sm">
                                    {update.comments?.length || 0} Comments
                                  </span>
                                </button>
                              </div>

                              {/* Comments Section */}
                              {activeAnnouncement === update.id && (
                                <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
                                  {/* Comments List */}
                                  {update.comments && update.comments.length > 0 && (
                                    <div className="space-y-4 mb-4">
                                      {update.comments
                                        .filter(comment => !comment.parentId)
                                        .map((comment) => (
                                        <div key={comment.id} className="space-y-3">
                                          {/* Main Comment */}
                                          <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">
                                                  {comment.authorName || 'Anonymous'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                  {formatDate(comment.createdAt)}
                                                </span>
                                              </div>
                                              <button
                                                onClick={() => setReplyingTo(comment.id)}
                                                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                                              >
                                                <Reply className="w-3 h-3" />
                                                Reply
                                              </button>
                                            </div>
                                            <p className="text-gray-700 mb-3">{comment.content}</p>
                                            
                                            {/* Comment Reactions */}
                                            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                                              <div className="relative">
                                                <button
                                                  onClick={() => setShowReactionPicker(
                                                    showReactionPicker === `comment-${comment.id}` ? null : `comment-${comment.id}`
                                                  )}
                                                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 transition-colors text-xs"
                                                >
                                                  <Smile className="w-3 h-3 text-gray-500" />
                                                  React
                                                </button>
                                                
                                                {showReactionPicker === `comment-${comment.id}` && (
                                                  <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-200 p-2 flex gap-1 z-10">
                                                    {reactions.map((reaction) => (
                                                      <button
                                                        key={reaction.type}
                                                        onClick={() => {
                                                          handleCommentReaction(update.id, comment.id, reaction.type);
                                                        }}
                                                        className="p-1 rounded hover:bg-gray-100"
                                                        title={reaction.label}
                                                      >
                                                        <reaction.icon className={`w-4 h-4 ${reaction.color}`} />
                                                      </button>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                              
                                              {comment.reactions && comment.reactions.length > 0 && (
                                                <div className="flex gap-1">
                                                  {reactions.map((reaction) => {
                                                    const count = comment.reactions?.filter(r => r.type === reaction.type).length || 0;
                                                    if (count === 0) return null;
                                                    return (
                                                      <span key={reaction.type} className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded text-xs">
                                                        <reaction.icon className={`w-3 h-3 ${reaction.color}`} />
                                                        {count}
                                                      </span>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          {/* Replies */}
                                          {comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-8 space-y-3">
                                              {comment.replies.map((reply) => (
                                                <div key={reply.id} className="bg-blue-50 rounded-lg p-4 border-l-4 border-primary-500">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <Reply className="w-3 h-3 text-primary-600" />
                                                    <span className="text-sm font-semibold text-gray-900">
                                                      {reply.authorName || 'Anonymous'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                      {formatDate(reply.createdAt)}
                                                    </span>
                                                  </div>
                                                  <p className="text-gray-700">{reply.content}</p>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Reply Indicator */}
                                  {replyingTo && (
                                    <div className="mb-3 flex items-center gap-2 text-sm text-primary-600 bg-primary-50 rounded-lg px-3 py-2">
                                      <Reply className="w-4 h-4" />
                                      <span>Replying to comment</span>
                                      <button
                                        onClick={() => setReplyingTo(null)}
                                        className="ml-auto hover:text-primary-700"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}

                                  {/* Add Comment */}
                                  <div className="flex gap-3">
                                    <input
                                      type="text"
                                      value={announcementComment}
                                      onChange={(e) => setAnnouncementComment(e.target.value)}
                                      placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                                      className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleAddAnnouncementComment(update.id);
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={() => handleAddAnnouncementComment(update.id)}
                                      className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
                                    >
                                      <Send className="w-4 h-4" />
                                      Post
                                    </button>
                                  </div>
                                </div>
                              )}
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
  );
}
