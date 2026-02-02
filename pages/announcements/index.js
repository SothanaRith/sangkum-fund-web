import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Calendar,
  Heart,
  Megaphone,
  MessageCircle,
  Plus,
  ThumbsUp,
  Send,
  Smile,
  Sparkles,
  TrendingUp,
  Reply,
  X,
  User,
} from 'lucide-react';
import { announcementsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AnnouncementsPage() {
  const router = useRouter();
  const { eventId, charityId } = router.query;
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);

  useEffect(() => {
    if (eventId || charityId) {
      loadAnnouncements();
    }
  }, [eventId, charityId]);

  const loadAnnouncements = async () => {
    try {
      const data = eventId
        ? await announcementsAPI.getByEvent(eventId)
        : await announcementsAPI.getByCharity(charityId);
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await announcementsAPI.create({
        ...newAnnouncement,
        eventId: eventId ? parseInt(eventId) : null,
        charityId: charityId ? parseInt(charityId) : null,
      });
      setNewAnnouncement({ title: '', content: '' });
      setShowCreateForm(false);
      loadAnnouncements();
    } catch (err) {
      alert('Failed to create announcement');
    }
  };

  const handleAddComment = async (announcementId) => {
    if (!newComment.trim()) return;
    
    try {
      await announcementsAPI.addComment(announcementId, {
        content: newComment,
        parentId: replyingTo,
      });
      setNewComment('');
      setReplyingTo(null);
      loadAnnouncements();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleReaction = async (announcementId, reactionType) => {
    try {
      await announcementsAPI.addReaction(announcementId, reactionType);
      setShowReactionPicker(null);
      loadAnnouncements();
    } catch (err) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Megaphone className="w-14 h-14 mb-4 animate-bounce text-purple-600 mx-auto" />
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-purple-600" />
              Announcements & Updates
            </h1>
            <p className="text-gray-600">Stay updated with the latest news</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Announcement</h2>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  required
                  placeholder="e.g., Milestone Reached!"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  required
                  rows="5"
                  placeholder="Share your update..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg animate-fadeIn">
            <Megaphone className="w-16 h-16 mb-6 text-purple-500 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No announcements yet</h3>
            <p className="text-gray-600">Be the first to share an update!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {announcement.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 gap-3">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {announcement.authorName || 'Anonymous'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>

                {/* Reactions & Comments Bar */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  {/* Reaction Button with Picker */}
                  <div className="relative">
                    <button
                      onClick={() => setShowReactionPicker(
                        showReactionPicker === announcement.id ? null : announcement.id
                      )}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <Smile className="w-5 h-5 text-gray-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 font-semibold">React</span>
                    </button>

                    {/* Reaction Picker */}
                    {showReactionPicker === announcement.id && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 flex gap-2 z-10 animate-fadeIn">
                        {reactions.map((reaction) => (
                          <button
                            key={reaction.type}
                            onClick={() => handleReaction(announcement.id, reaction.type)}
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
                  {announcement.reactions && announcement.reactions.length > 0 && (
                    <div className="flex gap-2">
                      {reactions.map((reaction) => {
                        const count = announcement.reactions?.filter(r => r.type === reaction.type).length || 0;
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
                      activeAnnouncement === announcement.id ? null : announcement.id
                    )}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors ml-auto"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-semibold">
                      {announcement.comments?.length || 0} Comments
                    </span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeAnnouncement === announcement.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
                    {/* Comments List */}
                    {announcement.comments && announcement.comments.length > 0 && (
                      <div className="space-y-4 mb-4">
                        {announcement.comments
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
                              <p className="text-gray-700">{comment.content}</p>
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
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                        className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(announcement.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(announcement.id)}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
