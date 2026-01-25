import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Loader2,
  Eye,
  Edit,
  Star,
  Upload,
  X,
} from 'lucide-react';
import { postsAPI } from '@/lib/api';

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
  const [newTag, setNewTag] = useState('');
  const [preview, setPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    handleChange(e);
    if (!formData.slug) {
      setFormData({
        ...formData,
        title,
        slug: generateSlug(title),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Slug is required');
      return;
    }

    try {
      setLoading(true);
      await postsAPI.create(formData);
      setSuccess('Post created successfully!');
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/blog" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Create New Story</h1>
            <p className="text-gray-600 mt-2">Share inspiring news and updates with your community</p>
          </div>

          {/* Alerts */}
          {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
          )}

          {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <span className="text-green-600 font-medium">{success}</span>
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
                        rows="12"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none resize-none font-mono text-sm"
                    />
                ) : (
                    <div className="p-4 bg-gray-50 rounded-xl min-h-80 prose prose-sm max-w-none">
                      {formData.content.split('\n').map((para, idx) => (
                          para.trim() && (
                              <p key={idx} className="text-gray-800 leading-relaxed mb-4">
                                {para}
                              </p>
                          )
                      ))}
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
                      <img src={formData.coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <label className="block text-gray-700 font-semibold mb-3">Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
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
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
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
                      <div key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-2">
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-orange-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
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
                      Publish Story
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
