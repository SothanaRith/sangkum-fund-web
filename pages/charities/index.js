import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Handshake,
  Building2,
  FileText,
  BarChart3,
  Search,
  Plus,
  ShieldCheck,
  Clock3,
  MapPin,
  Globe2,
  ArrowRight,
  Loader2,
  HeartPulse,
  Leaf,
  GraduationCap,
  Users,
  Target,
  Briefcase,
  PawPrint,
  AlertTriangle,
  X,
  ChevronDown,
} from 'lucide-react';
import { charitiesAPI } from '@/lib/api';
import Pagination from '@/components/Pagination';

const categories = [
  { id: 'all', label: 'All Categories', icon: Building2, color: 'bg-gradient-to-r from-orange-600 to-amber-600' },
  { id: 'HEALTH', label: 'Healthcare', icon: HeartPulse, color: 'bg-red-500' },
  { id: 'EDUCATION', label: 'Education', icon: GraduationCap, color: 'bg-blue-500' },
  { id: 'ENVIRONMENT', label: 'Environment', icon: Leaf, color: 'bg-green-500' },
  { id: 'SOCIAL', label: 'Social', icon: Users, color: 'bg-purple-500' },
  { id: 'DISASTER', label: 'Disaster Relief', icon: AlertTriangle, color: 'bg-yellow-600' },
  { id: 'COMMUNITY', label: 'Community', icon: Building2, color: 'bg-indigo-500' },
  { id: 'ANIMALS', label: 'Animal Welfare', icon: PawPrint, color: 'bg-amber-600' },
];

export default function CharitiesPage() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all'); // all, verified, pending
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [pageSize] = useState(9);

  useEffect(() => {
    loadCharities();
  }, [currentPage, activeFilter, category]);

  useEffect(() => {
    // When search changes, reset to page 0
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      loadCharities();
    }
  }, [search]);

  const loadCharities = async () => {
    try {
      setLoading(true);
      const status = activeFilter === 'verified' ? 'verified' : 
                     activeFilter === 'pending' ? 'pending' : null;
      
      const categoryParam = category !== 'all' ? category : null;
      
      const response = await charitiesAPI.getAll(currentPage, pageSize, 'createdAt', 'desc', status, categoryParam);
      
      // Handle pagination response
      const content = response.content || [];
      setCharities(content);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      setHasNext(response.hasNext || false);
      setHasPrevious(response.hasPrevious || false);
    } catch (err) {
      console.error('Failed to load charities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCharities = charities.filter((charity) => {
    const matchesSearch = charity.name.toLowerCase().includes(search.toLowerCase()) ||
        charity.description?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-white">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
            <p className="text-gray-600">Loading charities...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-4">
                <Handshake className="w-4 h-4 text-orange-700" />
                <span className="text-sm font-medium text-orange-800">Trusted Partners</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Partner Charities
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support verified organizations making real impact in Cambodia
            </p>
          </div>

          {/* Stats */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-orange-600" />
                    </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{totalElements}</div>
                    <div className="text-sm text-gray-600">
                      {activeFilter === 'all' ? 'Total Organizations' : 
                       activeFilter === 'verified' ? 'Verified Partners' : 'Pending Review'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{charities.length}</div>
                    <div className="text-sm text-gray-600">On This Page</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{totalPages}</div>
                    <div className="text-sm text-gray-600">Total Pages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="max-w-6xl mx-auto mb-12 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg shadow-md bg-white"
                />
              </div>
              <Link
                  href="/charities/create"
                  className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl text-center whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Register Your Organization</span>
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-white rounded-2xl shadow-lg p-2 max-w-md mb-6">
              <button
                  onClick={() => { setActiveFilter('all'); setCurrentPage(0); }}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeFilter === 'all'
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
              >
                All
              </button>
              <button
                  onClick={() => { setActiveFilter('verified'); setCurrentPage(0); }}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeFilter === 'verified'
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
              >
                Verified
              </button>
              <button
                  onClick={() => { setActiveFilter('pending'); setCurrentPage(0); }}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeFilter === 'pending'
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
              >
                Pending
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-gray-700">Filter by Category:</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 font-medium flex items-center gap-2 text-sm ${
                        cat.id === category
                          ? `${cat.color} text-white shadow-lg scale-105`
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:inline">{cat.label}</span>
                      <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Charities Grid */}
          {filteredCharities.length > 0 ? (
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCharities.map((charity, index) => (
                      <Link
                          key={charity.id}
                          href={`/charities/${charity.id}`}
                          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all card-hover animate-fadeIn border border-gray-100 hover:border-orange-200 group"
                          style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {/* Logo */}
                        <div className="mb-4 relative">
                          {charity.logo ? (
                              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-100 group-hover:border-orange-200">
                                <img
                                    src={charity.logo}
                                    alt={charity.name}
                                    className="w-full h-full object-cover"
                                />
                              </div>
                          ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-amber-200 transition-all">
                              <Handshake className="w-8 h-8 text-orange-700" />
                            </div>
                          )}
                          <div className="absolute top-0 right-0">
                            {charity.status === 'VERIFIED' ? (
                                <div className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                  <ShieldCheck className="w-4 h-4" />
                                  <span>Verified</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                                  <Clock3 className="w-4 h-4" />
                                  <span>Pending</span>
                                </div>
                            )}
                          </div>
                        </div>

                        {/* Name */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {charity.name}
                        </h3>

                        {/* Category */}
                        {charity.category && (
                            <div className="mb-2">
                              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                {charity.category}
                              </span>
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {charity.description || 'No description provided'}
                        </p>

                        {/* Impact Metrics */}
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">
                              {charity.beneficiariesCount || 0}
                            </div>
                            <div className="text-xs text-gray-600">Beneficiaries</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-amber-600">
                              {charity.volunteersCount || 0}
                            </div>
                            <div className="text-xs text-gray-600">Volunteers</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-500">
                              {charity.yearsActive || 0}
                            </div>
                            <div className="text-xs text-gray-600">Years Active</div>
                          </div>
                        </div>

                        {/* Rating and Reviews */}
                        {charity.ratingScore && charity.ratingScore > 0 && (
                            <div className="flex items-center gap-3 mb-4 p-2 bg-yellow-50 rounded-lg">
                              <div className="flex text-yellow-400 text-sm">
                                {'★'.repeat(Math.floor(charity.ratingScore))}
                                {'☆'.repeat(5 - Math.floor(charity.ratingScore))}
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {charity.ratingScore.toFixed(1)} ({charity.reviewCount || 0})
                              </span>
                            </div>
                        )}

                        {/* Location */}
                        {charity.location && (
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                              <MapPin className="w-4 h-4" />
                              <span>{charity.location}</span>
                            </div>
                        )}

                        {/* Tags */}
                        {charity.tags && charity.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {charity.tags.slice(0, 3).map((tag, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                          {tag}
                        </span>
                              ))}
                              {charity.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg">
                          +{charity.tags.length - 3} more
                        </span>
                              )}
                            </div>
                        )}

                        {/* Social Links */}
                        {(charity.facebookUrl || charity.instagramUrl || charity.twitterUrl) && (
                            <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
                              {charity.facebookUrl && (
                                  <a 
                                    href={charity.facebookUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                                    <span className="text-xs font-bold">f</span>
                                  </a>
                              )}
                              {charity.instagramUrl && (
                                  <a 
                                    href={charity.instagramUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors">
                                    <span className="text-xs font-bold">@</span>
                                  </a>
                              )}
                              {charity.twitterUrl && (
                                  <a 
                                    href={charity.twitterUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 hover:bg-sky-100 transition-colors">
                                    <span className="text-xs font-bold">𝕏</span>
                                  </a>
                              )}
                            </div>
                        )}

                        {/* CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-orange-100">
                          <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700">
                            <span>View Profile</span>
                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                          {charity.website && (
                              <a
                                  href={charity.website}
                                  onClick={(e) => e.stopPropagation()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-orange-600"
                                  title="Visit website"
                              >
                                <Globe2 className="w-4 h-4" />
                              </a>
                          )}
                        </div>
                      </Link>
                  ))}
                </div>

                {/* Verification Info */}
                {activeFilter === 'all' && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-600">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">Verification Process</h3>
                          <p className="text-gray-700 text-sm mb-3">
                            All organizations go through a rigorous verification process to ensure transparency and trust.
                            Verified charities have been vetted for legal compliance, financial transparency, and impact reporting.
                          </p>
                          <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white text-orange-700 text-xs font-medium rounded-full border border-orange-200">
                        Legal Registration
                      </span>
                            <span className="px-3 py-1 bg-white text-orange-700 text-xs font-medium rounded-full border border-orange-200">
                        Financial Audit
                      </span>
                            <span className="px-3 py-1 bg-white text-orange-700 text-xs font-medium rounded-full border border-orange-200">
                        Impact Reports
                      </span>
                            <span className="px-3 py-1 bg-white text-orange-700 text-xs font-medium rounded-full border border-orange-200">
                        Local References
                      </span>
                          </div>
                        </div>
                      </div>
                    </div>
                )}
              </div>
          ) : (
              /* Empty State */
              <div className="text-center py-16 animate-fadeIn max-w-2xl mx-auto">
                <div className="relative inline-block mb-6">
                    <div className="p-6 rounded-full bg-orange-50 inline-flex">
                      <Search className="w-12 h-12 text-orange-600" />
                    </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm px-3 py-1 rounded-full">
                    No results
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No organizations found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {search
                      ? `No organizations match "${search}". Try a different search term.`
                      : category !== 'all'
                      ? `No organizations found in this category. Try a different category.`
                      : 'No organizations are currently registered. Be the first to register!'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                      href="/charities/create"
                      className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Register Your Organization
                  </Link>
                  {search && (
                      <button
                          onClick={() => setSearch('')}
                          className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all border border-gray-200"
                      >
                        Clear Search
                      </button>
                  )}
                </div>
              </div>
          )}

          {/* Pagination */}
          {filteredCharities.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
              />
            </div>
          )}
        </div>
      </div>
  );
}