import { useEffect, useState } from 'react';
import Link from 'next/link';
import { charitiesAPI } from '@/lib/api';

export default function CharitiesPage() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCharities();
  }, []);

  const loadCharities = async () => {
    try {
      const data = await charitiesAPI.getAll();
      setCharities(data);
    } catch (err) {
      console.error('Failed to load charities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCharities = charities.filter((charity) =>
    charity.name.toLowerCase().includes(search.toLowerCase()) ||
    charity.description?.toLowerCase().includes(search.toLowerCase())
  );

  const verifiedCharities = filteredCharities.filter((c) => c.status === 'VERIFIED');
  const pendingCharities = filteredCharities.filter((c) => c.status === 'PENDING');

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
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            🏛️ Verified Charities
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support trusted organizations making a real difference
          </p>
        </div>

        {/* Search and CTA */}
        <div className="max-w-4xl mx-auto mb-12 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 Search charities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-lg shadow-md"
              />
            </div>
            <Link
              href="/charities/create"
              className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg text-center whitespace-nowrap"
            >
              ➕ Register Your Charity
            </Link>
          </div>
        </div>

        {/* Verified Charities */}
        {verifiedCharities.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">✓</span>
              Verified Charities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedCharities.map((charity) => (
                <Link
                  key={charity.id}
                  href={`/charities/${charity.id}`}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all card-hover animate-fadeIn"
                >
                  {/* Logo */}
                  <div className="mb-4">
                    {charity.logo ? (
                      <img
                        src={charity.logo}
                        alt={charity.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center text-4xl">
                        🏛️
                      </div>
                    )}
                  </div>

                  {/* Name with Badge */}
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                      {charity.name}
                      <span className="ml-2 text-green-500" title="Verified">✓</span>
                    </h3>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Verified Organization
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {charity.description}
                  </p>

                  {/* View Button */}
                  <div className="flex items-center text-primary-600 font-semibold">
                    <span>View Profile</span>
                    <span className="ml-2">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pending Charities (only for admins) */}
        {pendingCharities.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⏳</span>
              Pending Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingCharities.map((charity) => (
                <div
                  key={charity.id}
                  className="bg-white rounded-2xl shadow-lg p-6 opacity-60 animate-fadeIn"
                >
                  {/* Logo */}
                  <div className="mb-4">
                    {charity.logo ? (
                      <img
                        src={charity.logo}
                        alt={charity.name}
                        className="w-20 h-20 object-cover rounded-xl grayscale"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl grayscale">
                        🏛️
                      </div>
                    )}
                  </div>

                  {/* Name with Badge */}
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {charity.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      Pending Verification
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {charity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCharities.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No charities found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or register your charity</p>
            <Link
              href="/charities/create"
              className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Register Your Charity
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
