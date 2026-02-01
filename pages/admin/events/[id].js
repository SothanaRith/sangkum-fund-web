import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';

export default function AdminEventDetailPlaceholder() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <div className="min-h-[70vh] bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Admin Event Details</h1>
              <Link
                href="/admin/events"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300"
              >
                Back to Events
              </Link>
            </div>
            <p className="text-gray-600 mb-6">
              This page is reserved for admin event details and moderation tools.
            </p>
            {id && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-500">Event ID</div>
                <div className="text-lg font-semibold text-gray-900">{id}</div>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {id && (
                <Link
                  href={`/events/${id}`}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
                >
                  View Public Event
                </Link>
              )}
              <Link
                href="/admin/events/verification"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300"
              >
                Verification Queue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
