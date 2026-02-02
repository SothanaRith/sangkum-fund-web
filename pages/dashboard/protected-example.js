import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { isEventOwner } from '@/lib/routeProtection';

/**
 * Protected Dashboard Page
 * Only accessible to authenticated users
 * Demonstrates proper route protection implementation
 */
export default function Dashboard() {
  const router = useRouter();
  // Require user to be authenticated ('user' role or any logged-in user)
  const { isLoading, isAuthorized, user, error } = useProtectedRoute('user', true);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Only load dashboard data after auth is verified
  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadDashboardData();
    }
  }, [isLoading, isAuthorized, user]);

  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      const response = await apiClient.get('/api/user/dashboard');
      setDashboardData(response.data);
      setDataError(null);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setDataError('Failed to load dashboard data');
    } finally {
      setDataLoading(false);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show error if auth failed (though useProtectedRoute will auto-redirect)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error || 'You must be logged in to access this page'}</p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Auth verified, show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Welcome back, {user?.fullName || user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your account</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/events/create"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-600"
          >
            <div className="text-3xl mb-2">🎉</div>
            <h3 className="font-bold text-gray-900 mb-1">Create Event</h3>
            <p className="text-sm text-gray-600">Start a new fundraising event</p>
          </Link>

          <Link
            href="/dashboard/my-events"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-green-600"
          >
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-bold text-gray-900 mb-1">My Events</h3>
            <p className="text-sm text-gray-600">Manage your events and community</p>
          </Link>

          <Link
            href="/dashboard/my-donations"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-purple-600"
          >
            <div className="text-3xl mb-2">❤️</div>
            <h3 className="font-bold text-gray-900 mb-1">Donations</h3>
            <p className="text-sm text-gray-600">View your donation history</p>
          </Link>
        </div>

        {/* Main Content */}
        {dataLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        ) : dataError ? (
          <div className="bg-white rounded-lg shadow p-8 border-l-4 border-red-600">
            <h3 className="font-bold text-red-600 mb-2">Error</h3>
            <p className="text-gray-600">{dataError}</p>
            <button
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : dashboardData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Stats */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Your Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {dashboardData.totalEvents || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Active Events</p>
                    <p className="text-3xl font-bold text-green-600">
                      {dashboardData.activeEvents || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <p className="text-sm text-gray-600">Total Donations</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {dashboardData.totalDonations || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                    <p className="text-sm text-gray-600">Amount Raised</p>
                    <p className="text-3xl font-bold text-pink-600">
                      ${dashboardData.amountRaised?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Card */}
            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Account</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p className="font-semibold text-green-600">✅ Active</p>
                  </div>
                  <Link
                    href="/settings"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Manage Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No dashboard data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
