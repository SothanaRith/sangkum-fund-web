import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { postsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getBySlug(slug);
      setPost(data);
    } catch (err) {
      setError('Failed to load blog post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shareOnSocial = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = post?.title || 'Check out this story';

    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (links[platform]) {
      window.open(links[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading story...</p>
          </div>
        </div>
    );
  }

  if (error || !post) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 text-xl font-medium mb-6">{error || 'Story not found'}</div>
            <button
                onClick={() => router.push('/blog')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
            >
              Back to Blog
            </button>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <button
                onClick={() => router.push('/blog')}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Stories
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
          >
            {/* Cover Image */}
            {post.coverImageUrl && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg h-96">
                  <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                  />
                </div>
            )}

            {/* Title & Meta */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                {post.authorName && (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-900">{post.authorName}</div>
                      </div>
                    </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                        <div
                            key={tag}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </div>
                    ))}
                  </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                  <p className="text-lg text-gray-600 italic border-l-4 border-orange-500 pl-4 mb-6">
                    {post.excerpt}
                  </p>
              )}
            </div>

            {/* Share Buttons */}
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share This Story
                </span>
                <div className="flex gap-2">
                  <button
                      onClick={() => shareOnSocial('twitter')}
                      className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                      title="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                      onClick={() => shareOnSocial('facebook')}
                      className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                      title="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                      onClick={() => shareOnSocial('linkedin')}
                      className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors"
                      title="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button
                      onClick={copyLink}
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      title="Copy link"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-md prose-style">
                {post.content ? (
                    post.content.split('\n').map((para, idx) => (
                        para.trim() && (
                            <p key={idx} className="text-gray-800 leading-relaxed mb-4">
                              {para}
                            </p>
                        )
                    ))
                ) : (
                    <p className="text-gray-600">No content available.</p>
                )}
              </div>
            </div>

            {/* Author Bio */}
            {post.authorName && (
                <div className="p-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl border border-orange-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">About the Author</h3>
                      <p className="text-gray-700 font-semibold">{post.authorName}</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Sharing impactful stories and updates from SangKumFund community.
                      </p>
                    </div>
                  </div>
                </div>
            )}
          </motion.div>
        </div>
      </div>
  );
}
