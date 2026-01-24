import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { adminDonationsAPI } from '@/lib/admin-api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDonations() {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    checkAuth();
    loadDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [filter, searchTerm, donations]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  };

  const loadDonations = async () => {
    try {
      const data = await adminDonationsAPI.getAll();
      setDonations(data);
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    let filtered = donations;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(d => d.status === filter.toUpperCase());
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(d =>
        d.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDonations(filtered);
  };

  const handleApprove = async (id) => {
    if (!confirm('Are you sure you want to approve this donation?')) return;

    setProcessing({ ...processing, [id]: true });
    try {
      await adminDonationsAPI.approve(id);
      await loadDonations();
      alert('Donation approved successfully!');
    } catch (err) {
      alert('Failed to approve donation: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing({ ...processing, [id]: false });
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setProcessing({ ...processing, [id]: true });
    try {
      await adminDonationsAPI.reject(id, reason);
      await loadDonations();
      alert('Donation rejected successfully!');
    } catch (err) {
      alert('Failed to reject donation: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing({ ...processing, [id]: false });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading donations...</div>
        </div>
      </div>
    );
  }

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'PENDING').length,
    success: donations.filter(d => d.status === 'SUCCESS').length,
    failed: donations.filter(d => d.status === 'FAILED').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center animate-fadeIn">
          <div>
            <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-semibold mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                💳 Donation Management
              </span>
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow p-4 border border-yellow-200">
            <div className="text-sm text-yellow-700">Pending</div>
            <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
          </div>
          <div className="bg-green-50 rounded-xl shadow p-4 border border-green-200">
            <div className="text-sm text-green-700">Success</div>
            <div className="text-2xl font-bold text-green-800">{stats.success}</div>
          </div>
          <div className="bg-red-50 rounded-xl shadow p-4 border border-red-200">
            <div className="text-sm text-red-700">Failed</div>
            <div className="text-2xl font-bold text-red-800">{stats.failed}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="🔍 Search by event, donor, or transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('success')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Success
              </button>
            </div>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Donor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      #{donation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {donation.anonymous ? '🕵️ Anonymous' : donation.userName || 'User'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {donation.eventTitle || `Event #${donation.eventId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {donation.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {donation.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(donation.id)}
                            disabled={processing[donation.id]}
                            className="text-green-600 hover:text-green-800 font-semibold disabled:opacity-50"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(donation.id)}
                            disabled={processing[donation.id]}
                            className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDonations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-7xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
