import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { platformFeedbackAPI } from '@/lib/api';

const STAR_COUNT = 5;

export default function FeedbackPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/auth/login?redirect=/feedback');
      return;
    }
    loadHistory();
  }, [router]);

  const loadHistory = async () => {
    try {
      const data = await platformFeedbackAPI.getMy();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setHistory([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!rating) {
      setError('Please select a rating.');
      return;
    }

    setLoading(true);
    try {
      const response = await platformFeedbackAPI.submit({ rating, comment });
      setSuccess('Thanks for your feedback!');
      setComment('');
      setRating(0);
      setHistory((prev) => [response, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Rate SangKumFund</h1>
            <p className="mt-2 text-gray-600">Share your experience and help us improve.</p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 border border-red-200">
              <div className="text-sm text-red-800 font-medium">{error}</div>
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-xl bg-green-50 p-4 border border-green-200">
              <div className="text-sm text-green-800 font-medium">{success}</div>
            </div>
          )}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⭐ Your rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                {Array.from({ length: STAR_COUNT }).map((_, index) => {
                  const value = index + 1;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRating(value)}
                      className={`text-3xl transition-transform ${
                        rating >= value ? 'text-amber-500' : 'text-gray-300'
                      } hover:scale-110`}
                      aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">💬 Comment</label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you loved or what we can improve"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your recent feedback</h2>
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-amber-500">
                      {'★'.repeat(item.rating)}{'☆'.repeat(STAR_COUNT - item.rating)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {item.comment && (
                    <p className="mt-2 text-sm text-gray-700">{item.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
