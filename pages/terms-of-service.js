import { useState } from 'react';
import Link from 'next/link';

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        { id: 'introduction', title: 'Introduction' },
        { id: 'acceptance', title: 'Acceptance of Terms' },
        { id: 'eligibility', title: 'Eligibility' },
        { id: 'accounts', title: 'User Accounts' },
        { id: 'campaigns', title: 'Campaign Rules' },
        { id: 'donations', title: 'Donations & Payments' },
        { id: 'prohibited', title: 'Prohibited Conduct' },
        { id: 'intellectual', title: 'Intellectual Property' },
        { id: 'liability', title: 'Liability' },
        { id: 'termination', title: 'Termination' },
        { id: 'governing', title: 'Governing Law' },
        { id: 'contact', title: 'Contact' },
    ];

    const lastUpdated = "January 1, 2024";
    const effectiveDate = "January 1, 2024";

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 pt-24 pb-32 px-4">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                            <span className="text-lg">⚖️</span>
                            <span className="text-sm font-medium">Legal Terms</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Terms of Service
                        </h1>

                        <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Please read these terms carefully before using SangKumFund's crowdfunding platform
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="text-sm text-orange-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                📅 Last Updated: {lastUpdated}
                            </div>
                            <div className="text-sm text-orange-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                ⚖️ Effective: {effectiveDate}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex overflow-x-auto py-4 gap-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`px-5 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                                    activeSection === section.id
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto py-12 px-4">
                {/* Introduction */}
                {activeSection === 'introduction' && (
                    <div className="animate-fadeIn">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to SangKumFund</h2>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">📋 Quick Summary</h3>
                                <p className="text-gray-700">
                                    SangKumFund is a crowdfunding platform that connects donors with individuals and organizations
                                    seeking funding for various causes in Cambodia. By using our platform, you agree to these Terms.
                                </p>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">About These Terms</h3>
                            <p className="text-gray-600 mb-4">
                                These Terms of Service ("Terms") govern your access to and use of the SangKumFund platform,
                                including our website, mobile applications, and services (collectively, the "Platform").
                                Please read these Terms carefully before using our Platform.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-3xl mb-3">👤</div>
                                    <h4 className="font-bold text-gray-900 mb-2">For Users</h4>
                                    <p className="text-sm text-gray-600">
                                        These terms apply to all users, including donors, campaign creators, and visitors.
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-3xl mb-3">📜</div>
                                    <h4 className="font-bold text-gray-900 mb-2">Legal Agreement</h4>
                                    <p className="text-sm text-gray-600">
                                        By using our Platform, you agree to these Terms and our Privacy Policy.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>Important Note</span>
                                </h3>
                                <p className="text-gray-700">
                                    These Terms contain important information about your legal rights, remedies, and obligations.
                                    They include limitations on our liability, your indemnification obligations, and a dispute
                                    resolution clause that requires arbitration for most disputes.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Acceptance of Terms */}
                {activeSection === 'acceptance' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Acceptance of Terms</h2>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">By Using Our Platform</h3>
                                <p className="text-gray-600 mb-4">
                                    By accessing or using the SangKumFund Platform, you acknowledge that you have read,
                                    understood, and agree to be bound by these Terms. If you do not agree to these Terms,
                                    you must not access or use the Platform.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Creating an Account</h4>
                                        <p className="text-sm text-gray-600">
                                            By creating an account, you expressly accept these Terms.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Making a Donation</h4>
                                        <p className="text-sm text-gray-600">
                                            Each donation constitutes acceptance of these Terms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Updates to Terms</h3>
                                <p className="text-gray-600 mb-4">
                                    We reserve the right to modify these Terms at any time. When we make changes, we will:
                                </p>

                                <ul className="text-gray-600 space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-orange-600 text-sm">1</span>
                                        </div>
                                        <span>Post the updated Terms on this page with a new "Last Updated" date</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-orange-600 text-sm">2</span>
                                        </div>
                                        <span>Notify users of significant changes via email or in-app notifications</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-orange-600 text-sm">3</span>
                                        </div>
                                        <span>Your continued use after changes constitutes acceptance of the new Terms</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Policies</h3>
                                <p className="text-gray-700 mb-4">
                                    These Terms incorporate by reference the following additional policies:
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🔒</span>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Privacy Policy</h4>
                                                <p className="text-sm text-gray-600">How we collect, use, and protect your data</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/privacy"
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                        >
                                            View →
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">💰</span>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Fees Policy</h4>
                                                <p className="text-sm text-gray-600">Information about platform and payment fees</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/fees"
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                        >
                                            View →
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🎯</span>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Campaign Guidelines</h4>
                                                <p className="text-sm text-gray-600">Rules for creating and running campaigns</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/campaign-guidelines"
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                        >
                                            View →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Eligibility */}
                {activeSection === 'eligibility' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Eligibility Requirements</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Age Requirements</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                        <div className="text-3xl mb-3">👤</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Donors</h4>
                                        <p className="text-gray-600">
                                            Must be at least <strong>18 years old</strong> to make donations.
                                            Donors under 18 must have parent/guardian permission.
                                        </p>
                                    </div>
                                    <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                                        <div className="text-3xl mb-3">🎯</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Campaign Creators</h4>
                                        <p className="text-gray-600">
                                            Must be at least <strong>18 years old</strong> to create campaigns.
                                            Special rules apply for educational campaigns.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Geographic Restrictions</h3>
                                <p className="text-gray-600 mb-4">
                                    SangKumFund is primarily focused on serving communities within Cambodia.
                                    However, we welcome support from around the world.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <span className="text-2xl text-green-500">✓</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Cambodian Residents</h4>
                                            <p className="text-gray-600 text-sm">
                                                Full access to all platform features. Can create campaigns, donate,
                                                and receive funds in Cambodian bank accounts.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <span className="text-2xl text-blue-500">✓</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900">International Donors</h4>
                                            <p className="text-gray-600 text-sm">
                                                Can donate to Cambodian campaigns using international payment methods.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <span className="text-2xl text-amber-500">⚠️</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Restricted Regions</h4>
                                            <p className="text-gray-600 text-sm">
                                                Users from countries under international sanctions may be restricted
                                                from using certain platform features.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Requirements</h3>
                                <p className="text-gray-700 mb-4">
                                    To ensure trust and security on our platform, certain activities require verification:
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-orange-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                                Activity
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                                Verification Required
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                                Documents
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                Create a Campaign
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                Yes - Identity & Phone
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                National ID/Passport, Phone Verification
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                Receive Funds
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                Yes - Bank Account
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                Bank Account Proof, Address Verification
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                Donate Large Amounts
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                Above $1,000
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                Additional Identity Verification
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                Charity/Organization Account
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                Full Verification
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                Registration Certificate, Tax Documents
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Accounts */}
                {activeSection === 'accounts' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">User Accounts</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Account Creation</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Accurate Information</h4>
                                        <p className="text-gray-600">
                                            You must provide accurate, current, and complete information during registration
                                            and keep your account information updated.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">One Account Per Person</h4>
                                        <p className="text-gray-600">
                                            Each individual may maintain only one account unless expressly permitted by SangKumFund.
                                            Organizations may create separate accounts for different projects.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Account Security</h4>
                                        <p className="text-gray-600">
                                            You are responsible for maintaining the confidentiality of your login credentials
                                            and for all activities that occur under your account.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Account Responsibilities</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                                        <div className="text-3xl mb-3 text-red-500">🚫</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Prohibited Actions</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Sharing account credentials</li>
                                            <li>• Creating fake accounts</li>
                                            <li>• Impersonating others</li>
                                            <li>• Using bots or automation</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                                        <div className="text-3xl mb-3 text-green-500">✅</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Required Actions</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Keep contact information current</li>
                                            <li>• Report unauthorized access</li>
                                            <li>• Verify identity when requested</li>
                                            <li>• Comply with platform rules</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Inactive Accounts</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-600">⚠️</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Account Dormancy</h4>
                                            <p className="text-gray-700">
                                                Accounts inactive for more than 12 months may be deactivated.
                                                We will notify you via email before deactivation.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="text-red-600">🗑️</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Account Deletion</h4>
                                            <p className="text-gray-700">
                                                You may request account deletion at any time. Note that some information
                                                may be retained as required by law or for platform integrity.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Campaign Rules */}
                {activeSection === 'campaigns' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Campaign Rules</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Allowed Campaign Types</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                        <div className="text-3xl mb-3">❤️</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Medical & Emergency</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Medical treatment costs</li>
                                            <li>• Emergency surgeries</li>
                                            <li>• Healthcare expenses</li>
                                            <li>• Disaster relief</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                                        <div className="text-3xl mb-3">🎓</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Education</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• School fees & supplies</li>
                                            <li>• Educational projects</li>
                                            <li>• Scholarship funds</li>
                                            <li>• School infrastructure</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                        <div className="text-3xl mb-3">🤝</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Community Projects</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Community development</li>
                                            <li>• Environmental projects</li>
                                            <li>• Cultural preservation</li>
                                            <li>• Social enterprises</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                                        <div className="text-3xl mb-3">💼</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Business & Creative</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Small business startups</li>
                                            <li>• Creative arts projects</li>
                                            <li>• Product development</li>
                                            <li>• Innovation funding</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Campaign Requirements</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Honest Representation</h4>
                                        <p className="text-gray-600">
                                            Campaigns must accurately represent the purpose of funds,
                                            the intended use of donations, and the timeline for completion.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Documentation</h4>
                                        <p className="text-gray-600">
                                            Medical campaigns require supporting documentation.
                                            Business campaigns need business plans. All campaigns must provide
                                            regular updates to donors.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Fund Use</h4>
                                        <p className="text-gray-600">
                                            Funds must be used for the stated purpose. Campaign creators
                                            are responsible for providing evidence of fund use upon request.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Prohibited Campaigns</h3>
                                <p className="text-gray-700 mb-4">
                                    The following types of campaigns are strictly prohibited:
                                </p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-xl border border-red-200">
                                        <div className="text-xl mb-2">🚫</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Illegal Activities</h4>
                                        <ul className="text-sm text-gray-600">
                                            <li>• Gambling or lottery</li>
                                            <li>• Illegal substances</li>
                                            <li>• Weapons or violence</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl border border-red-200">
                                        <div className="text-xl mb-2">🚫</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Harmful Content</h4>
                                        <ul className="text-sm text-gray-600">
                                            <li>• Hate speech or discrimination</li>
                                            <li>• Harassment or bullying</li>
                                            <li>• Adult content</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl border border-red-200">
                                        <div className="text-xl mb-2">🚫</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Financial Schemes</h4>
                                        <ul className="text-sm text-gray-600">
                                            <li>• Pyramid schemes</li>
                                            <li>• Investment opportunities</li>
                                            <li>• Debt repayment</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl border border-red-200">
                                        <div className="text-xl mb-2">🚫</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Misrepresentation</h4>
                                        <ul className="text-sm text-gray-600">
                                            <li>• Fake emergencies</li>
                                            <li>• Impersonation</li>
                                            <li>• False documentation</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Donations & Payments */}
                {activeSection === 'donations' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Donations & Payments</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Terms</h3>

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-5 bg-white rounded-xl border border-gray-200">
                                            <div className="text-3xl mb-3">💳</div>
                                            <h4 className="font-bold text-gray-900 mb-2">Payment Methods</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                <li>• Credit/Debit Cards</li>
                                                <li>• Bank Transfers</li>
                                                <li>• Mobile Payments</li>
                                                <li>• Digital Wallets</li>
                                            </ul>
                                        </div>
                                        <div className="p-5 bg-white rounded-xl border border-gray-200">
                                            <div className="text-3xl mb-3">💰</div>
                                            <h4 className="font-bold text-gray-900 mb-2">Currencies</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                <li>• USD (United States Dollar)</li>
                                                <li>• KHR (Cambodian Riel)</li>
                                                <li>• Other major currencies</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Donation Authorization</h4>
                                        <p className="text-gray-600">
                                            By making a donation, you authorize SangKumFund to charge your payment method
                                            for the specified amount. All donations are final and non-refundable, except
                                            in cases of fraud or violation of our Terms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Fees & Processing</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Platform Fees</h4>
                                        <p className="text-gray-600">
                                            <strong>SangKumFund charges 0% platform fees.</strong> We operate on an optional
                                            tip model where donors can choose to support our platform.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Payment Processing Fees</h4>
                                        <p className="text-gray-600">
                                            Payment processors (banks, credit card companies) charge fees for their services.
                                            These fees are typically 2.9% + $0.30 per transaction and are deducted before
                                            funds reach the campaign.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Withdrawal Processing</h4>
                                        <p className="text-gray-600">
                                            Funds are available for withdrawal 2-3 business days after donation.
                                            Withdrawals to Cambodian bank accounts are processed within 24 hours.
                                            Minimum withdrawal amount is $10 or equivalent.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Tax Deductibility</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-green-600">✓</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Verified Charities</h4>
                                            <p className="text-gray-700">
                                                Donations to verified nonprofit organizations registered in Cambodia
                                                are typically tax-deductible. Official receipts are provided via email.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-600">⚠️</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Personal Campaigns</h4>
                                            <p className="text-gray-700">
                                                Donations to personal campaigns (medical, education, emergencies)
                                                may not be tax-deductible. Please consult with a tax professional.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Prohibited Conduct */}
                {activeSection === 'prohibited' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Prohibited Conduct</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">General Prohibitions</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Illegal Activities</h4>
                                        <p className="text-gray-600">
                                            You may not use the Platform for any illegal purpose or in violation
                                            of any laws, regulations, or rules applicable in Cambodia or your jurisdiction.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Fraud & Deception</h4>
                                        <p className="text-gray-600">
                                            You may not engage in fraudulent, deceptive, or misleading conduct,
                                            including creating fake campaigns, misusing funds, or providing false information.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Harassment</h4>
                                        <p className="text-gray-600">
                                            You may not harass, abuse, threaten, or intimidate other users,
                                            campaign creators, or SangKumFund staff.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Abuse</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-5 bg-white rounded-xl border border-red-200">
                                        <div className="text-3xl mb-3">🤖</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Automation & Bots</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Using bots to create accounts</li>
                                            <li>• Automated donations</li>
                                            <li>• Scraping platform data</li>
                                            <li>• Spamming comments</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 bg-white rounded-xl border border-red-200">
                                        <div className="text-3xl mb-3">🔗</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Link Spamming</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Posting affiliate links</li>
                                            <li>• Malicious URL sharing</li>
                                            <li>• Unauthorized advertising</li>
                                            <li>• Phishing attempts</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Consequences of Violations</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-600">⚠️</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Warning & Correction</h4>
                                            <p className="text-gray-700">
                                                Minor violations may result in warnings and requests to correct behavior.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-orange-600">⏸️</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Suspension</h4>
                                            <p className="text-gray-700">
                                                Serious violations may result in temporary suspension of account privileges.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="text-red-600">🚫</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Termination</h4>
                                            <p className="text-gray-700">
                                                Severe or repeated violations may result in permanent account termination.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <span className="text-purple-600">⚖️</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Legal Action</h4>
                                            <p className="text-gray-700">
                                                Illegal activities may be reported to law enforcement authorities.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Intellectual Property */}
                {activeSection === 'intellectual' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Intellectual Property</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Ownership</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <h4 className="font-bold text-gray-900 mb-2">SangKumFund Property</h4>
                                        <p className="text-gray-600">
                                            The SangKumFund Platform, including its design, features, logos, trademarks,
                                            and content (except user-generated content) are owned by SangKumFund and
                                            protected by intellectual property laws.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Limited License</h4>
                                        <p className="text-gray-600">
                                            We grant you a limited, non-exclusive, non-transferable, revocable license
                                            to access and use the Platform for its intended purposes, subject to these Terms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">User Content</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Your Content</h4>
                                        <p className="text-gray-600">
                                            You retain ownership of the content you create and share on SangKumFund,
                                            including campaign descriptions, photos, videos, and updates.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <h4 className="font-bold text-gray-900 mb-2">License to SangKumFund</h4>
                                        <p className="text-gray-600">
                                            By posting content on our Platform, you grant SangKumFund a worldwide,
                                            non-exclusive, royalty-free license to use, display, and distribute your
                                            content in connection with operating and promoting the Platform.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Content Standards</h4>
                                        <p className="text-gray-600">
                                            You are responsible for ensuring your content does not infringe on others'
                                            intellectual property rights, including copyrights, trademarks, or patents.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Copyright Infringement</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="text-red-600">🚫</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">DMCA Compliance</h4>
                                            <p className="text-gray-700">
                                                We respect intellectual property rights and respond to valid
                                                DMCA takedown notices. If you believe your work has been copied
                                                in a way that constitutes copyright infringement, contact us.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-600">📧</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Infringement Reports</h4>
                                            <p className="text-gray-700">
                                                Send copyright infringement notices to:
                                                <span className="font-medium"> copyright@sangkumfund.org</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Liability */}
                {activeSection === 'liability' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitations of Liability</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Platform "As Is"</h4>
                                        <p className="text-gray-600">
                                            The SangKumFund Platform is provided on an "as is" and "as available" basis
                                            without warranties of any kind, either express or implied.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">No Guarantees</h4>
                                        <p className="text-gray-600">
                                            We do not guarantee that the Platform will be uninterrupted, secure,
                                            or error-free, or that any defects will be corrected.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Limitation of Liability</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Indirect Damages</h4>
                                        <p className="text-gray-600">
                                            To the maximum extent permitted by law, SangKumFund shall not be liable
                                            for any indirect, incidental, special, consequential, or punitive damages,
                                            or any loss of profits or revenues.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Total Liability</h4>
                                        <p className="text-gray-600">
                                            In no event shall SangKumFund's total liability exceed the greater of
                                            $100 USD or the amount you have paid to SangKumFund in the past 12 months.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">User Responsibility</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-600">🔍</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Due Diligence</h4>
                                            <p className="text-gray-700">
                                                Donors are responsible for conducting their own due diligence before
                                                contributing to campaigns. We verify campaigns but do not guarantee outcomes.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-600">💼</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Campaign Risks</h4>
                                            <p className="text-gray-700">
                                                Campaign creators are responsible for delivering on campaign promises
                                                and using funds appropriately. We are not responsible for campaign outcomes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Termination */}
                {activeSection === 'termination' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Termination</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Termination Rights</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                                        <div className="text-3xl mb-3">👤</div>
                                        <h4 className="font-bold text-gray-900 mb-2">User Termination</h4>
                                        <p className="text-sm text-gray-600">
                                            You may terminate your account at any time by requesting deletion
                                            through your account settings or contacting support.
                                        </p>
                                    </div>
                                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                                        <div className="text-3xl mb-3">🏢</div>
                                        <h4 className="font-bold text-gray-900 mb-2">SangKumFund Termination</h4>
                                        <p className="text-sm text-gray-600">
                                            We may suspend or terminate your access to the Platform at our discretion,
                                            with or without notice, for violation of these Terms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Effects of Termination</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Account Access</h4>
                                        <p className="text-gray-600">
                                            Upon termination, your right to access and use the Platform will immediately cease.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Content Retention</h4>
                                        <p className="text-gray-600">
                                            Some content may be retained as required by law or for platform integrity,
                                            but will no longer be publicly accessible.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Outstanding Obligations</h4>
                                        <p className="text-gray-600">
                                            Termination does not relieve you of obligations incurred prior to termination,
                                            including payment obligations or commitments to donors.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Appeals Process</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600">📧</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Appeal Submission</h4>
                                            <p className="text-gray-700">
                                                If you believe your account was terminated in error, you may submit an appeal
                                                to <span className="font-medium">appeals@sangkumfund.org</span> within 30 days.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-green-600">⏳</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Review Process</h4>
                                            <p className="text-gray-700">
                                                Appeals are reviewed within 14 business days. We will notify you of
                                                the decision via email.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Governing Law */}
                {activeSection === 'governing' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Governing Law & Dispute Resolution</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Applicable Law</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Cambodian Law</h4>
                                        <p className="text-gray-600">
                                            These Terms and any disputes arising from them shall be governed by
                                            and construed in accordance with the laws of the Kingdom of Cambodia,
                                            without regard to its conflict of law provisions.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Jurisdiction</h4>
                                        <p className="text-gray-600">
                                            Any legal action or proceeding relating to these Terms shall be brought
                                            exclusively in the courts of Phnom Penh, Cambodia.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Dispute Resolution</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Informal Resolution</h4>
                                        <p className="text-gray-600">
                                            Before initiating formal proceedings, we encourage you to contact us
                                            to attempt to resolve the dispute informally.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Arbitration Agreement</h4>
                                        <p className="text-gray-600">
                                            Most disputes will be resolved through binding arbitration in Phnom Penh,
                                            Cambodia, rather than in court. Arbitration is more informal than a lawsuit.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Class Action Waiver</h4>
                                        <p className="text-gray-600">
                                            You agree to resolve disputes on an individual basis and waive any right
                                            to participate in class actions or consolidated arbitrations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Exceptions</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="text-red-600">⚖️</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Intellectual Property Disputes</h4>
                                            <p className="text-gray-700">
                                                Claims of infringement or misappropriation of intellectual property rights
                                                may be brought in court.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="text-red-600">🚫</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Injunctive Relief</h4>
                                            <p className="text-gray-700">
                                                Either party may seek injunctive relief in court to prevent irreparable harm.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact */}
                {activeSection === 'contact' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>

                        <div className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="text-4xl mb-4">📧</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">General Inquiries</h3>
                                    <p className="text-gray-600 mb-4">
                                        For questions about these Terms or other platform matters.
                                    </p>
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                        <p className="font-bold text-gray-900">legal@sangkumfund.org</p>
                                        <p className="text-sm text-gray-600 mt-1">Response time: 3-5 business days</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="text-4xl mb-4">📞</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Support Team</h3>
                                    <p className="text-gray-600 mb-4">
                                        For technical issues or account-related questions.
                                    </p>
                                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                        <p className="font-bold text-gray-900">+855 23 456 789</p>
                                        <p className="text-sm text-gray-600 mt-1">Mon-Fri, 9AM-6PM (Cambodia Time)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Mailing Address</h3>
                                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl mt-1">🏢</span>
                                        <div>
                                            <p className="font-bold text-gray-900">SangKumFund Legal Department</p>
                                            <p className="text-gray-600">Building 123, Street 456</p>
                                            <p className="text-gray-600">Sangkat Tonle Bassac, Khan Chamkarmon</p>
                                            <p className="text-gray-600">Phnom Penh, Cambodia</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Service of Process</h3>
                                <p className="text-gray-700 mb-4">
                                    Legal documents and service of process should be sent to:
                                </p>
                                <div className="bg-white p-4 rounded-xl border border-orange-200">
                                    <p className="font-bold text-gray-900">Mr. Sophanith SOK</p>
                                    <p className="text-sm text-gray-600">Legal Representative</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        SangKumFund<br/>
                                        Building 123, Street 456<br/>
                                        Sangkat Tonle Bassac, Khan Chamkarmon<br/>
                                        Phnom Penh, Cambodia
                                    </p>
                                </div>
                            </div>

                            <div className="text-center p-8 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl border border-orange-200">
                                <div className="text-5xl mb-4">📜</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Thank You</h3>
                                <p className="text-gray-700 max-w-2xl mx-auto">
                                    Thank you for taking the time to read our Terms of Service.
                                    We are committed to maintaining a safe, transparent, and trustworthy
                                    platform for all users.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="max-w-5xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/privacy"
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
                    >
                        <div className="text-2xl mb-2">🔒</div>
                        <h4 className="font-bold text-gray-900">Privacy Policy</h4>
                        <p className="text-sm text-gray-600">How we protect your data</p>
                    </Link>
                    <Link
                        href="/help-center"
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
                    >
                        <div className="text-2xl mb-2">❓</div>
                        <h4 className="font-bold text-gray-900">Help Center</h4>
                        <p className="text-sm text-gray-600">Get help with platform questions</p>
                    </Link>
                    <Link
                        href="/contact"
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
                    >
                        <div className="text-2xl mb-2">📞</div>
                        <h4 className="font-bold text-gray-900">Contact Us</h4>
                        <p className="text-sm text-gray-600">Get in touch with our team</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}