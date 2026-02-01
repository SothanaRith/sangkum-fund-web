import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Megaphone,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  MessageSquare,
  Eye,
  X,
} from 'lucide-react';
import { adminAnnouncementsAPI } from '@/lib/admin-api';
import { formatDate } from '@/lib/utils';

export default function AdminAnnouncements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [actionLoading, setActionLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    eventId: '',
    charityId: '',
  });

  useEffect(() => {
    checkAuth();
    loadAnnouncements();
  }, []);

  useEffect(() => {
    if (currentPage === 0) {
      loadAnnouncements();
    }
  }, [currentPage]);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
    }
  };

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await adminAnnouncementsAPI.getAll(currentPage, pageSize);
      const announcementsArray = Array.isArray(data) ? data : (data?.content || []);
      setAnnouncements(announcementsArray);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load announcements:', err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement.id);
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        eventId: announcement.event?.id || '',
        charityId: announcement.charity?.id || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        eventId: '',
        charityId: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      eventId: '',
      charityId: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setActionLoading({ ...actionLoading, submit: true });

    try {
      if (editingId) {
        await adminAnnouncementsAPI.update(editingId, formData);
        alert('Announcement updated successfully!');
      } else {
        await adminAnnouncementsAPI.create(formData);
        alert('Announcement created successfully!');
      }
      handleCloseModal();
      await loadAnnouncements();
    } catch (err) {
      alert('Failed to save announcement: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading({ ...actionLoading, submit: false });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    setActionLoading({ ...actionLoading, [id]: true });
    try {
      await adminAnnouncementsAPI.delete(id);
      await loadAnnouncements();
      alert('Announcement deleted successfully!');
    } catch (err) {
      alert('Failed to delete announcement: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading({ ...actionLoading, [id]: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary-600" />
          <div className="text-lg text-gray-600">Loading announcements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center animate-fadeIn">
          <div>
            <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-semibold mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Megaphone className="w-9 h-9 text-primary-600" />
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Announcement Management
              </span>
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Announcement
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Announcements Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Content</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Related To</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {announcements.length > 0 ? (
                  announcements
                    .filter(
                      (announcement) =>
                        announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        announcement.content?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((announcement) => (
                      <tr key={announcement.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{announcement.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600 line-clamp-2">{announcement.content}</p>
                        </td>
                        <td className="px-6 py-4">
                          {announcement.event ? (
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              Event: {announcement.event.title}
                            </span>
                          ) : announcement.charity ? (
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              Charity: {announcement.charity.name}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">General</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{announcement.author?.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {formatDate(announcement.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(announcement)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(announcement.id)}
                              disabled={actionLoading[announcement.id]}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all disabled:opacity-50 flex items-center gap-1"
                            >
                              {actionLoading[announcement.id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg">No announcements found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage + 1}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Megaphone className="w-6 h-6" />
                {editingId ? 'Edit Announcement' : 'Create Announcement'}
              </h2>
              <button onClick={handleCloseModal} className="hover:bg-white hover:bg-opacity-20 p-1 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Announcement title..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Announcement content..."
                  rows="6"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none resize-vertical"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event ID (Optional)</label>
                  <input
                    type="number"
                    value={formData.eventId}
                    onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                    placeholder="Event ID..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Charity ID (Optional)</label>
                  <input
                    type="number"
                    value={formData.charityId}
                    onChange={(e) => setFormData({ ...formData, charityId: e.target.value })}
                    placeholder="Charity ID..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.submit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading.submit && <Loader2 className="w-5 h-5 animate-spin" />}
                  {editingId ? 'Update Announcement' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
