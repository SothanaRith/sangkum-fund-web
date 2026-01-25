import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Loader2,
  ChevronRight,
  Calendar,
  User,
  Tag,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { postsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(9);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      loadPosts();
    }
  }, [searchTerm, selectedTag]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll(currentPage, pageSize, searchTerm, selectedTag, 'publishedAt', 'desc');
      setPosts(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);

      // Extract unique tags from all posts
      const tagsSet = new Set();
      (response.content || []).forEach(post => {
        if (post.tags && post.tags.length > 0) {
          post.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      setAllTags(Array.from(tagsSet).sort());
    } catch (err) {
      setError('Failed to load blog posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading stories...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 text-xl font-medium mb-6">{error}</div>
            <button
                onClick={loadPosts}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
            >
              Try Again
            </button>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 py-20 px-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">SangKumFund Stories</h1>
              <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Discover inspiring stories, impact updates, and resources from our community
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                      type="text"
                      placeholder="Search stories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none text-gray-900 text-lg shadow-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto py-12 px-4">
          {/* Tags Filter */}
          {allTags.length > 0 && (
              <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 flex flex-wrap gap-2"
              >
                <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-2 rounded-full transition-all font-medium ${
                        selectedTag === null
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  All Stories
                </button>
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-4 py-2 rounded-full transition-all font-medium flex items-center gap-1 ${
                            selectedTag === tag
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </button>
                ))}
              </motion.div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-gray-700">
              <span className="font-bold text-orange-600">{totalElements}</span> stories found
              {searchTerm && <span> for "<span className="font-semibold">{searchTerm}</span>"</span>}
              {selectedTag && <span> in <span className="font-semibold">{selectedTag}</span></span>}
            </div>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
              <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                <AnimatePresence>
                  {posts.map((post, index) => (
                      <motion.div
                          key={post.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -8 }}
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <div className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer h-full border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            {/* Cover Image */}
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500">
                              {post.coverImageUrl ? (
                                  <img
                                      src={post.coverImageUrl}
                                      alt={post.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-white/50 text-6xl">📰</div>
                                  </div>
                              )}

                              {/* Tag Badge */}
                              {post.tags && post.tags.length > 0 && (
                                  <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                                      {post.tags[0]}
                                    </span>
                                  </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                {post.title}
                              </h3>

                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {post.excerpt || post.content?.substring(0, 150)}
                              </p>

                              {/* Meta */}
                              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(post.publishedAt)}
                                </div>
                                {post.authorName && (
                                    <div className="flex items-center gap-1">
                                      <User className="w-4 h-4" />
                                      <span className="truncate">{post.authorName}</span>
                                    </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
          ) : (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
              >
                <Search className="w-14 h-14 mb-6 text-gray-400 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No stories found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search terms or browse other tags.' : 'Be the first to share your story!'}
                </p>
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Clear Search
                    </button>
                )}
              </motion.div>
          )}

          {/* Pagination */}
          {posts.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <div className="text-gray-600 font-medium">
                  Page {currentPage + 1} of {totalPages}
                </div>
                <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium disabled:opacity-50 hover:from-orange-600 hover:to-amber-600 transition-colors"
                >
                  Next
                </button>
              </div>
          )}
        </div>
      </div>
  );
}
