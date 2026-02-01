import Link from 'next/link';
import Layout from '../components/Layout';

export default function CareersPage() {
  return (
    <Layout>
      <div className="min-h-[70vh] bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Careers</h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              We’re building a platform that connects donors with meaningful causes.
              If you’re passionate about impact, we’d love to hear from you.
            </p>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-6">
              <p className="text-orange-700">
                Open roles will be posted here soon. Please check back or reach out through our contact page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
              >
                Contact Us
              </Link>
              <Link
                href="/about-us"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
