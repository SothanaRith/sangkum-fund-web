import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { adminAPI } from '@/lib/admin-api';
import { formatDate } from '@/lib/utils';

export default function AdminCharitiesPage() {
  const router = useRouter();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, verified, rejected

  useEffect(() => {
    loadCharities();
  }, []);

  const loadCharities = async () => {
    try {
      const data = await adminAPI.charities.getAll();
      setCharities(data);
    } catch (err) {
      console.error('Failed to load charities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (charityId) => {
    if (!confirm('Verify this charity organization?')) return;
    
    try {
      await adminAPI.charities.verify(charityId);
      await loadCharities();
      alert('Charity verified successfully!');
    } catch (err) {
      alert('Failed to verify charity');
    }
  };

  const handleReject = async (charityId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
      await adminAPI.charities.reject(charityId, reason);
      await loadCharities();
      alert('Charity application rejected');
    } catch (err) {
      alert('Failed to reject charity');
    }
  };

  const filteredCharities = charities.filter((charity) => {
    if (filter === 'pending') return charity.status === 'PENDING';
    if (filter === 'verified') return charity.status === 'VERIFIED';
    if (filter === 'rejected') return charity.status === 'REJECTED';
    return true;
  });

  const pendingCount = charities.filter((c) => c.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏛️</div>
          <p className="text-gray-600">Loading charities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">
              🏛️ Charity Verification
            </h1>
            <p className="text-gray-600">
              {pendingCount > 0
                ? `${pendingCount} charities pending verification`
                : 'All caught up!'}
            </p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            ← Back to Admin
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 bg-white rounded-2xl shadow-lg p-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All ({charities.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'verified'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Verified ({charities.filter((c) => c.status === 'VERIFIED').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'rejected'
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rejected ({charities.filter((c) => c.status === 'REJECTED').length})
          </button>
        </div>

        {/* Charities List */}
        {filteredCharities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="text-8xl mb-6">
              {filter === 'pending' ? '🎉' : '📭'}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filter === 'pending' ? 'All verified!' : 'No charities found'}
            </h3>
            <p className="text-gray-600">
              {filter === 'pending'
                ? 'No charities pending verification'
                : 'No charities match this filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCharities.map((charity, index) => (
              <div
                key={charity.id}
                className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {charity.logo ? (
                      <img
                        src={charity.logo}
                        alt={charity.name}
                        className="w-24 h-24 object-cover rounded-2xl shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center text-5xl shadow-md">
                        🏛️
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {charity.name}
                        </h3>
                        <div className="flex gap-2 mb-2">
                          {charity.status === 'PENDING' && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                              ⏳ Pending Review
                            </span>
                          )}
                          {charity.status === 'VERIFIED' && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                              ✓ Verified
                            </span>
                          )}
                          {charity.status === 'REJECTED' && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                              ✕ Rejected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Applied: {formatDate(charity.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {charity.description}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                      {charity.registrationNumber && (
                        <div>
                          <span className="text-sm text-gray-500">Registration Number</span>
                          <p className="font-semibold text-gray-900">{charity.registrationNumber}</p>
                        </div>
                      )}
                      {charity.contactEmail && (
                        <div>
                          <span className="text-sm text-gray-500">Contact Email</span>
                          <p className="font-semibold text-gray-900">{charity.contactEmail}</p>
                        </div>
                      )}
                      {charity.contactPhone && (
                        <div>
                          <span className="text-sm text-gray-500">Contact Phone</span>
                          <p className="font-semibold text-gray-900">{charity.contactPhone}</p>
                        </div>
                      )}
                      {charity.website && (
                        <div>
                          <span className="text-sm text-gray-500">Website</span>
                          <a
                            href={charity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary-600 hover:underline"
                          >
                            {charity.website}
                          </a>
                        </div>
                      )}
                      {charity.address && (
                        <div className="md:col-span-2">
                          <span className="text-sm text-gray-500">Address</span>
                          <p className="font-semibold text-gray-900">{charity.address}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {charity.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerify(charity.id)}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md"
                        >
                          ✓ Verify Charity
                        </button>
                        <button
                          onClick={() => handleReject(charity.id)}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-md"
                        >
                          ✕ Reject Application
                        </button>
                      </div>
                    )}

                    {charity.status === 'VERIFIED' && charity.verifiedAt && (
                      <div className="text-sm text-green-600 font-semibold">
                        ✓ Verified on {formatDate(charity.verifiedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
