import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  Star,
  Search,
} from 'lucide-react';
import { postsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      // Load both published and draft posts (admin view)
      const response = await postsAPI.getAll(currentPage, pageSize);
      setPosts(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = posts;

    if (filter !== 'all') {
      filtered = filtered.filter(p => p.status.toLowerCase() === filter.toLowerCase());
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        setDeleting(id);
        await postsAPI.delete(id);
        setPosts(posts.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete post');
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading posts...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-gray-600 mt-2">Manage all stories and news posts</p>
              </div>
              <Link
                  href="/admin/blog/new"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                New Story
              </Link>
            </div>
          </div>

          {/* Alerts */}
          {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
          )}

          {/* Search & Filter */}
          <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'PUBLISHED', 'DRAFT'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === f
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {f === 'all' ? 'All' : f}
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts Table */}
          {filteredPosts.length > 0 ? (
              <motion.div
                  layout
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Published</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Featured</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <AnimatePresence>
                        {filteredPosts.map((post) => (
                            <motion.tr
                                key={post.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                                  <p className="text-sm text-gray-600">{post.slug}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    post.status === 'PUBLISHED'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {post.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                              </td>
                              <td className="px-6 py-4">
                                {post.featured ? (
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                ) : (
                                    <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Link
                                      href={`/blog/${post.slug}`}
                                      target="_blank"
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="View"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </Link>
                                  <Link
                                      href={`/admin/blog/${post.id}/edit`}
                                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                      title="Edit"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </Link>
                                  <button
                                      onClick={() => handleDelete(post.id)}
                                      disabled={deleting === post.id}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                      title="Delete"
                                  >
                                    {deleting === post.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
          ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <AlertCircle className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== 'all' ? 'Try adjusting your filters.' : 'Start by creating your first story.'}
                </p>
                {!searchTerm && filter === 'all' && (
                    <Link
                        href="/admin/blog/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Create First Story
                    </Link>
                )}
              </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
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
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-medium disabled:opacity-50 hover:from-orange-700 hover:to-amber-700 transition-colors"
                >
                  Next
                </button>
              </div>
          )}
        </div>
      </div>
  );
}
