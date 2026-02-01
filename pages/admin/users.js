import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Users,
  Search,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Shield,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { adminUsersAPI } from '@/lib/admin-api';
import { formatDate } from '@/lib/utils';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [actionLoading, setActionLoading] = useState({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    checkAuth();
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchUsers();
    } else if (currentPage === 0) {
      loadUsers();
    }
  }, [currentPage, sortBy, sortDir]);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUsersAPI.getAll(currentPage, pageSize, sortBy, sortDir);
      const usersArray = Array.isArray(data) ? data : (data?.content || []);
      setUsers(usersArray);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    try {
      setSearching(true);
      const data = await adminUsersAPI.search(searchTerm, currentPage, pageSize);
      const usersArray = Array.isArray(data) ? data : (data?.content || []);
      setUsers(usersArray);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleActivate = async (id) => {
    setActionLoading({ ...actionLoading, [id]: true });
    try {
      await adminUsersAPI.activate(id);
      await loadUsers();
      alert('User activated successfully!');
    } catch (err) {
      alert('Failed to activate user: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading({ ...actionLoading, [id]: false });
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;

    setActionLoading({ ...actionLoading, [id]: true });
    try {
      await adminUsersAPI.deactivate(id);
      await loadUsers();
      alert('User deactivated successfully!');
    } catch (err) {
      alert('Failed to deactivate user: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading({ ...actionLoading, [id]: false });
    }
  };

  const handleBlock = async (id) => {
    if (!confirm('Are you sure you want to block this user?')) return;

    setActionLoading({ ...actionLoading, [id]: true });
    try {
      await adminUsersAPI.block(id);
      await loadUsers();
      alert('User blocked successfully!');
    } catch (err) {
      alert('Failed to block user: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading({ ...actionLoading, [id]: false });
    }
  };

  const handleUnblock = async (id) => {
    setActionLoading({ ...actionLoading, [id]: true });
    try {
      await adminUsersAPI.unblock(id);
      await loadUsers();
      alert('User unblocked successfully!');
    } catch (err) {
      alert('Failed to unblock user: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading({ ...actionLoading, [id]: false });
    }
  };

  const getStatusBadge = (user) => {
    if (user.isBlocked) {
      return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">Blocked</span>;
    }
    if (!user.isActive) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Inactive</span>;
    }
    return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Active</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary-600" />
          <div className="text-lg text-gray-600">Loading users...</div>
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
              <Users className="w-9 h-9 text-primary-600" />
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                User Management
              </span>
            </h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                  if (e.target.value.trim()) {
                    searchUsers();
                  } else {
                    loadUsers();
                  }
                }}
                className="w-full pl-12 pr-6 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              />
              {searching && <Loader2 className="w-5 h-5 animate-spin text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Verification</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">#ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="w-4 h-4 text-gray-500" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="w-4 h-4 text-gray-500" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(user)}</td>
                      <td className="px-6 py-4">
                        {user.isOcrVerified ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Not Verified</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {user.isActive && !user.isBlocked ? (
                            <>
                              <button
                                onClick={() => handleDeactivate(user.id)}
                                disabled={actionLoading[user.id]}
                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-all disabled:opacity-50 flex items-center gap-2"
                              >
                                {actionLoading[user.id] && <Loader2 className="w-4 h-4 animate-spin" />}
                                Deactivate
                              </button>
                              <button
                                onClick={() => handleBlock(user.id)}
                                disabled={actionLoading[user.id]}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all disabled:opacity-50 flex items-center gap-2"
                              >
                                {actionLoading[user.id] && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Lock className="w-4 h-4" />
                                Block
                              </button>
                            </>
                          ) : (
                            <>
                              {!user.isActive && (
                                <button
                                  onClick={() => handleActivate(user.id)}
                                  disabled={actionLoading[user.id]}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                  {actionLoading[user.id] && <Loader2 className="w-4 h-4 animate-spin" />}
                                  <CheckCircle className="w-4 h-4" />
                                  Activate
                                </button>
                              )}
                              {user.isBlocked && (
                                <button
                                  onClick={() => handleUnblock(user.id)}
                                  disabled={actionLoading[user.id]}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                  {actionLoading[user.id] && <Loader2 className="w-4 h-4 animate-spin" />}
                                  <Unlock className="w-4 h-4" />
                                  Unblock
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg">No users found</p>
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

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">User Management</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Activate or deactivate user accounts</li>
                <li>• Block suspicious or violating users</li>
                <li>• View user verification status</li>
                <li>• Search users by name, email, or phone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
