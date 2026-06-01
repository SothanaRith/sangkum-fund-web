import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Edit,
  Star,
  X,
  Globe,
  FileText,
} from 'lucide-react';
import { postsAPI } from '@/lib/api';

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    tags: [],
    status: 'DRAFT',
    featured: false,
  });

  useEffect(() => {
    if (id) loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setFetching(true);
      const posts = await postsAPI.getAll(0, 100);
      const post = (posts.content || []).find(p => String(p.id) === String(id));
      if (!post) {
        setError('Post not found');
        return;
      }
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        coverImageUrl: post.coverImageUrl || '',
        tags: Array.isArray(post.tags) ? post.tags : [],
        status: post.status || 'DRAFT',
        featured: post.featured || false,
      });
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const generateSlug = (title) =>
    title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug ? prev.slug : generateSlug(title),
    }));
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) return setError('Title is required');
    if (!formData.content.trim()) return setError('Content is required');
    if (!formData.slug.trim()) return setError('Slug is required');

    try {
      setLoading(true);
      await postsAPI.update(id, formData);
      setSuccess('Post updated successfully!');
      setTimeout(() => router.push('/admin/blog'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      setLoading(true);
      if (formData.status === 'PUBLISHED') {
        await postsAPI.updateStatus(id, 'DRAFT');
        setFormData(prev => ({ ...prev, status: 'DRAFT' }));
        setSuccess('Post unpublished');
      } else {
        await postsAPI.updateStatus(id, 'PUBLISHED');
        setFormData(prev => ({ ...prev, status: 'PUBLISHED' }));
        setSuccess('Post published');
      }
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Edit Story</h1>
              <p className="text-gray-600 mt-2">Update your story content and settings</p>
            </div>
            <button
              type="button"
              onClick={handlePublishToggle}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 ${
                formData.status === 'PUBLISHED'
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
                  : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
              }`}
            >
              <Globe className="w-4 h-4" />
              {formData.status === 'PUBLISHED' ? 'Unpublish' : 'Publish Now'}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="block text-gray-700 font-semibold mb-3">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter post title"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="block text-gray-700 font-semibold mb-3">Slug (URL-friendly)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="post-title"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">Preview: /blog/{formData.slug || 'post-slug'}</p>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="block text-gray-700 font-semibold mb-3">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary (optional)"
                rows="2"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-gray-700 font-semibold">Content</label>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  {preview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {preview ? 'Edit' : 'Preview'}
                </button>
              </div>
              {!preview ? (
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your story here... (supports markdown)"
                  rows="14"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none resize-none font-mono text-sm"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl min-h-80 prose prose-sm max-w-none">
                  {formData.content.split('\n').map((para, idx) =>
                    para.trim() ? (
                      <p key={idx} className="text-gray-800 leading-relaxed mb-4">{para}</p>
                    ) : null
                  )}
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="block text-gray-700 font-semibold mb-3">Cover Image URL</label>
              <input
                type="url"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
              />
              {formData.coverImageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden h-48 bg-gray-100">
                  <img
                    src={formData.coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status badge */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="block text-gray-700 font-semibold mb-3">Status</label>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                formData.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                <FileText className="w-3.5 h-3.5" />
                {formData.status}
              </div>
              <p className="text-xs text-gray-500 mt-2">Use the Publish / Unpublish button at the top to change status.</p>
            </div>

            {/* Featured */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-orange-600 rounded"
                />
                <div>
                  <span className="text-gray-700 font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Featured Story
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Appear on homepage</p>
                </div>
              </label>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="block text-gray-700 font-semibold mb-3">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag..."
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-medium transition-colors text-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-orange-900">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>

            {/* View public page */}
            {formData.status === 'PUBLISHED' && formData.slug && (
              <Link
                href={`/blog/${formData.slug}`}
                target="_blank"
                className="w-full px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                View Live Post
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
