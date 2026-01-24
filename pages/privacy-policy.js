import { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        { id: 'introduction', title: 'Introduction' },
        { id: 'data-collection', title: 'Data Collection' },
        { id: 'data-use', title: 'How We Use Your Data' },
        { id: 'data-sharing', title: 'Data Sharing' },
        { id: 'data-security', title: 'Data Security' },
        { id: 'your-rights', title: 'Your Rights' },
        { id: 'cookies', title: 'Cookies' },
        { id: 'updates', title: 'Updates' },
        { id: 'contact', title: 'Contact Us' },
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
                            <span className="text-lg">🔒</span>
                            <span className="text-sm font-medium">Your Privacy Matters</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Privacy Policy
                        </h1>

                        <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                            We are committed to protecting your privacy and being transparent about how we collect,
                            use, and protect your information.
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
                            <p className="text-gray-600 mb-4">
                                At SangKumFund, we are committed to protecting your privacy and being transparent about
                                how we collect, use, and protect your information. This Privacy Policy explains our
                                practices regarding the collection, use, and disclosure of your information when you
                                use our platform.
                            </p>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Key Principles</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>We only collect information necessary to provide our services</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>We never sell your personal information to third parties</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>We implement strong security measures to protect your data</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>You have control over your personal information</span>
                                    </li>
                                </ul>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">Scope</h3>
                            <p className="text-gray-600 mb-4">
                                This Privacy Policy applies to all users of the SangKumFund platform, including donors,
                                campaign creators, and visitors to our website. By using our services, you agree to the
                                collection and use of information in accordance with this policy.
                            </p>
                        </div>
                    </div>
                )}

                {/* Data Collection */}
                {activeSection === 'data-collection' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We Collect</h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Information You Provide</h3>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="text-2xl mb-3">👤</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Account Information</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Name and contact details</li>
                                            <li>• Email address</li>
                                            <li>• Phone number</li>
                                            <li>• Profile information</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="text-2xl mb-3">💰</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Payment Information</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Payment method details</li>
                                            <li>• Billing address</li>
                                            <li>• Transaction history</li>
                                            <li>• Bank account information</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="text-2xl mb-3">📄</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Campaign Information</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Campaign details and story</li>
                                            <li>• Photos and videos</li>
                                            <li>• Fundraising goals</li>
                                            <li>• Updates and communications</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="text-2xl mb-3">💬</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Communication Data</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Messages to support</li>
                                            <li>• Comments on campaigns</li>
                                            <li>• Email communications</li>
                                            <li>• Feedback and reviews</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Automatically Collected Information</h3>
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">Technical Information</h4>
                                            <ul className="text-gray-600 space-y-1">
                                                <li className="flex items-center gap-2">
                                                    <span className="text-orange-500">🌐</span>
                                                    <span>IP address and device information</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-orange-500">📱</span>
                                                    <span>Browser type and version</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-orange-500">📍</span>
                                                    <span>General location data</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-orange-500">⏰</span>
                                                    <span>Time zone and language settings</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">Usage Information</h4>
                                            <ul className="text-gray-600 space-y-1">
                                                <li className="flex items-center gap-2">
                                                    <span className="text-orange-500">📊</span>
                                                    <span>Pages visited and time spent</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-orange-500">🔗</span>
                                                    <span>Referring website information</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-orange-500">🖱️</span>
                                                    <span>Click patterns and interactions</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-orange-500">📈</span>
                                                    <span>Error logs and performance data</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Information from Third Parties</h3>
                                <p className="text-gray-600 mb-4">
                                    We may receive information about you from third parties, including:
                                </p>
                                <ul className="text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500">🔒</span>
                                        <span>Social media platforms when you connect your account</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500">🤝</span>
                                        <span>Partners who help us verify campaign information</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500">📧</span>
                                        <span>Marketing partners for analytics and improvement</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* How We Use Your Data */}
                {activeSection === 'data-use' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="text-2xl">🎯</span>
                                    <span>To Provide Our Services</span>
                                </h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Process donations and manage campaigns</li>
                                    <li>• Create and maintain your account</li>
                                    <li>• Verify your identity and campaign authenticity</li>
                                    <li>• Facilitate communication between donors and campaigners</li>
                                    <li>• Provide customer support and respond to inquiries</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="text-2xl">🔒</span>
                                    <span>For Security and Fraud Prevention</span>
                                </h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Detect and prevent fraudulent activities</li>
                                    <li>• Protect the security of our platform and users</li>
                                    <li>• Verify transactions and prevent unauthorized access</li>
                                    <li>• Comply with legal obligations and regulations</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="text-2xl">📈</span>
                                    <span>To Improve Our Platform</span>
                                </h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Analyze usage patterns to enhance user experience</li>
                                    <li>• Develop new features and services</li>
                                    <li>• Personalize content and recommendations</li>
                                    <li>• Conduct research and analysis</li>
                                    <li>• Monitor platform performance and fix issues</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="text-2xl">📢</span>
                                    <span>Communication</span>
                                </h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Send important updates about our services</li>
                                    <li>• Inform you about campaign updates you follow</li>
                                    <li>• Share platform announcements and news</li>
                                    <li>• Provide transaction confirmations and receipts</li>
                                    <li>• Send marketing communications (with your consent)</li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Legal Basis for Processing</h3>
                                <p className="text-gray-700">
                                    We process your personal information based on:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div className="text-center p-4 bg-white rounded-xl border border-orange-200">
                                        <div className="text-3xl mb-2">🤝</div>
                                        <h4 className="font-bold text-gray-900">Consent</h4>
                                        <p className="text-sm text-gray-600">When you explicitly agree</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-xl border border-orange-200">
                                        <div className="text-3xl mb-2">📜</div>
                                        <h4 className="font-bold text-gray-900">Contract</h4>
                                        <p className="text-sm text-gray-600">To fulfill our services</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-xl border border-orange-200">
                                        <div className="text-3xl mb-2">⚖️</div>
                                        <h4 className="font-bold text-gray-900">Legal Obligation</h4>
                                        <p className="text-sm text-gray-600">To comply with laws</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Sharing */}
                {activeSection === 'data-sharing' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Sharing and Disclosure</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">When We Share Your Information</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span className="text-blue-500">🏦</span>
                                            <span>Payment Processors</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            We share necessary information with payment processors to complete transactions.
                                            These partners are PCI-DSS compliant and have their own privacy policies.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span className="text-green-500">🤝</span>
                                            <span>Campaign Beneficiaries</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            Campaign creators receive information about donations to their campaigns,
                                            including donor names (unless anonymous) and donation amounts.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span className="text-purple-500">⚙️</span>
                                            <span>Service Providers</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            We work with trusted partners for hosting, analytics, customer support,
                                            and marketing. They process data only on our instructions.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span className="text-red-500">⚖️</span>
                                            <span>Legal Requirements</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            We may disclose information if required by law, to protect our rights,
                                            or to prevent fraud or harm to others.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">What We Never Do</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 text-xl">❌</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900">We Never Sell Your Data</h4>
                                            <p className="text-gray-700 text-sm">
                                                We do not and will never sell your personal information to third parties.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 text-xl">❌</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900">No Unnecessary Sharing</h4>
                                            <p className="text-gray-700 text-sm">
                                                We only share information when necessary to provide our services.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 text-xl">❌</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900">No Unauthorized Access</h4>
                                            <p className="text-gray-700 text-sm">
                                                We implement strict access controls to protect your information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">International Data Transfers</h3>
                                <p className="text-gray-600 mb-4">
                                    As a Cambodian platform primarily serving Cambodian users, we store and process data
                                    within Cambodia. However, some service providers may be located outside Cambodia.
                                    In such cases, we ensure appropriate safeguards are in place.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Security */}
                {activeSection === 'data-security' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security</h2>

                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-200">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                    🔒 Our Security Measures
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-5 rounded-xl border border-orange-200">
                                        <div className="text-3xl mb-3">🔐</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Encryption</h4>
                                        <p className="text-sm text-gray-600">
                                            All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption.
                                        </p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-orange-200">
                                        <div className="text-3xl mb-3">🛡️</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Access Controls</h4>
                                        <p className="text-sm text-gray-600">
                                            Strict access controls and authentication mechanisms for all systems.
                                        </p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-orange-200">
                                        <div className="text-3xl mb-3">📊</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Regular Audits</h4>
                                        <p className="text-sm text-gray-600">
                                            Regular security audits, vulnerability assessments, and penetration testing.
                                        </p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-orange-200">
                                        <div className="text-3xl mb-3">🔄</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Backups & Recovery</h4>
                                        <p className="text-sm text-gray-600">
                                            Regular backups and disaster recovery procedures to ensure data availability.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Security</h3>
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="text-4xl">💳</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">PCI-DSS Compliant</h4>
                                        <p className="text-gray-600">
                                            We are compliant with Payment Card Industry Data Security Standards (PCI-DSS).
                                            We never store complete credit card numbers on our servers.
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                🔒 Secure Transactions
                                            </div>
                                            <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                💳 Tokenized Payments
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Role in Security</h3>
                                <p className="text-gray-600 mb-4">
                                    While we implement strong security measures, you also play a crucial role:
                                </p>
                                <ul className="text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">🔑</span>
                                        <span>Use a strong, unique password for your account</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">🚫</span>
                                        <span>Never share your login credentials with others</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">📱</span>
                                        <span>Log out from shared devices</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">🔔</span>
                                        <span>Enable two-factor authentication if available</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">📧</span>
                                        <span>Be cautious of phishing attempts</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>Data Breach Response</span>
                                </h3>
                                <p className="text-gray-700">
                                    In the unlikely event of a data breach, we have procedures in place to:
                                </p>
                                <ul className="text-gray-700 mt-2 space-y-1">
                                    <li>• Immediately contain the breach</li>
                                    <li>• Assess the impact and affected users</li>
                                    <li>• Notify affected users and authorities as required by law</li>
                                    <li>• Implement measures to prevent future breaches</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Your Rights */}
                {activeSection === 'your-rights' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>

                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Control Over Your Data</h3>
                                <p className="text-gray-700 mb-4">
                                    As a SangKumFund user, you have the following rights regarding your personal information:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                                        <div className="text-2xl mb-2">👁️</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Right to Access</h4>
                                        <p className="text-sm text-gray-600">Access the personal information we hold about you</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                                        <div className="text-2xl mb-2">✏️</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Right to Correct</h4>
                                        <p className="text-sm text-gray-600">Request correction of inaccurate information</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                                        <div className="text-2xl mb-2">🗑️</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Right to Delete</h4>
                                        <p className="text-sm text-gray-600">Request deletion of your personal information</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                                        <div className="text-2xl mb-2">⏸️</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Right to Restrict</h4>
                                        <p className="text-sm text-gray-600">Restrict processing of your information</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                                        <div className="text-2xl mb-2">📥</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Right to Portability</h4>
                                        <p className="text-sm text-gray-600">Receive your data in a portable format</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                                        <div className="text-2xl mb-2">🚫</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Right to Object</h4>
                                        <p className="text-sm text-gray-600">Object to certain processing activities</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">How to Exercise Your Rights</h3>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span>📧</span>
                                            <span>Contact Our Privacy Team</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            Email us at: <span className="font-medium">privacy@sangkumfund.org</span>
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span>⚙️</span>
                                            <span>Account Settings</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            Many privacy settings can be adjusted directly in your account settings.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span>📄</span>
                                            <span>Verification Required</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            For security reasons, we may need to verify your identity before processing requests.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Account Deletion</h3>
                                <p className="text-gray-600 mb-4">
                                    You can request account deletion at any time. Please note:
                                </p>
                                <ul className="text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">💳</span>
                                        <span>We retain certain transaction records as required by law</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">📊</span>
                                        <span>Campaign information may be preserved for transparency</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">⏳</span>
                                        <span>Deletion requests are processed within 30 days</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">📧</span>
                                        <span>You'll receive confirmation once deletion is complete</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cookies */}
                {activeSection === 'cookies' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies and Tracking Technologies</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">What Are Cookies?</h3>
                                <p className="text-gray-600 mb-4">
                                    Cookies are small text files stored on your device when you visit our website.
                                    They help us provide, protect, and improve our services.
                                </p>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                        <div className="text-2xl mb-2">🔒</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Essential Cookies</h4>
                                        <p className="text-sm text-gray-600">Required for basic site functionality</p>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                                        <div className="text-2xl mb-2">⚙️</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Preference Cookies</h4>
                                        <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                        <div className="text-2xl mb-2">📈</div>
                                        <h4 className="font-bold text-gray-900 mb-2">Analytics Cookies</h4>
                                        <p className="text-sm text-gray-600">Help us understand how you use our site</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Managing Cookies</h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span>🌐</span>
                                            <span>Browser Settings</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            Most browsers allow you to control cookies through their settings.
                                            You can usually find these controls in your browser's "Options" or "Preferences" menu.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span>⚡</span>
                                            <span>Cookie Banner</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            When you first visit our site, you'll see a cookie banner where you can manage
                                            your preferences for non-essential cookies.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span>🚫</span>
                                            <span>Opt-Out Options</span>
                                        </h4>
                                        <p className="text-gray-600">
                                            You can opt-out of certain analytics and advertising cookies while still using
                                            our essential services.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Third-Party Analytics</h3>
                                <p className="text-gray-700 mb-4">
                                    We use analytics services to understand how users interact with our platform.
                                    These services may use cookies and similar technologies.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                        <span className="font-medium text-gray-900">Google Analytics</span>
                                        <a
                                            href="https://tools.google.com/dlpage/gaoptout"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                        >
                                            Opt-out →
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                        <span className="font-medium text-gray-900">Hotjar</span>
                                        <a
                                            href="https://www.hotjar.com/legal/compliance/opt-out"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                        >
                                            Opt-out →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Updates */}
                {activeSection === 'updates' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Updates to This Policy</h2>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Policy Changes</h3>
                                <p className="text-gray-600 mb-4">
                                    We may update this Privacy Policy from time to time to reflect changes in our
                                    practices, technologies, legal requirements, or other factors.
                                </p>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">How We Notify You</h4>
                                        <ul className="text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-1">📧</span>
                                                <span>Email notifications for significant changes</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-1">🔔</span>
                                                <span>In-app notifications and banners</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-1">📱</span>
                                                <span>Updated "Last Updated" date on this page</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-1">📄</span>
                                                <span>Version history available upon request</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Reviewing Changes</h4>
                                        <p className="text-gray-600">
                                            We encourage you to periodically review this Privacy Policy to stay informed
                                            about how we protect your information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Continued Use</h3>
                                <p className="text-gray-700 mb-4">
                                    By continuing to use SangKumFund after changes to this Privacy Policy,
                                    you acknowledge and accept the updated terms.
                                </p>

                                <div className="bg-white p-4 rounded-xl border border-orange-200">
                                    <h4 className="font-bold text-gray-900 mb-2">Opt-Out Options</h4>
                                    <p className="text-gray-600 text-sm">
                                        If you disagree with significant changes to our Privacy Policy, you may:
                                    </p>
                                    <ul className="text-gray-600 text-sm mt-2 space-y-1">
                                        <li>• Adjust your privacy settings in your account</li>
                                        <li>• Contact us to discuss your concerns</li>
                                        <li>• Request deletion of your account if necessary</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Version History</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Version
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Changes
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                2.0
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                January 1, 2024
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                Major update for new features and compliance requirements
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                1.1
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                June 15, 2023
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                Minor updates and clarifications
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                1.0
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                January 1, 2023
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                Initial Privacy Policy
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact */}
                {activeSection === 'contact' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>

                        <div className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="text-4xl mb-4">📧</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
                                    <p className="text-gray-600 mb-4">
                                        For privacy-related inquiries, please email our dedicated privacy team.
                                    </p>
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                        <p className="font-bold text-gray-900">privacy@sangkumfund.org</p>
                                        <p className="text-sm text-gray-600 mt-1">Response time: 1-3 business days</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="text-4xl mb-4">📞</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
                                    <p className="text-gray-600 mb-4">
                                        For urgent privacy matters, you can call our support team.
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
                                            <p className="font-bold text-gray-900">SangKumFund Privacy Team</p>
                                            <p className="text-gray-600">Building 123, Street 456</p>
                                            <p className="text-gray-600">Sangkat Tonle Bassac, Khan Chamkarmon</p>
                                            <p className="text-gray-600">Phnom Penh, Cambodia</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Data Protection Officer</h3>
                                <p className="text-gray-700 mb-4">
                                    We have appointed a Data Protection Officer (DPO) to oversee compliance with
                                    this Privacy Policy and data protection laws.
                                </p>
                                <div className="bg-white p-4 rounded-xl border border-orange-200">
                                    <p className="font-bold text-gray-900">Mr. Sophanith SOK</p>
                                    <p className="text-sm text-gray-600">Data Protection Officer</p>
                                    <p className="text-sm text-orange-600 mt-2">dpo@sangkumfund.org</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Regulatory Authority</h3>
                                <p className="text-gray-600 mb-4">
                                    If you have concerns about how we handle your personal information,
                                    you have the right to lodge a complaint with the relevant data protection authority.
                                </p>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h4 className="font-bold text-gray-900 mb-2">Cambodia Data Protection</h4>
                                    <p className="text-gray-600">
                                        Cambodia's data protection framework is evolving. For guidance, you may contact:
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        Ministry of Posts and Telecommunications<br/>
                                        Phnom Penh, Cambodia
                                    </p>
                                </div>
                            </div>

                            <div className="text-center p-8 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl border border-orange-200">
                                <div className="text-5xl mb-4">🤝</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Thank You</h3>
                                <p className="text-gray-700 max-w-2xl mx-auto">
                                    Thank you for taking the time to read our Privacy Policy. We are committed to
                                    protecting your privacy and being transparent about our data practices.
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
                        href="/terms-of-service"
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
                    >
                        <div className="text-2xl mb-2">📜</div>
                        <h4 className="font-bold text-gray-900">Terms of Service</h4>
                        <p className="text-sm text-gray-600">Read our terms and conditions</p>
                    </Link>
                    <Link
                        href="/help-center"
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
                    >
                        <div className="text-2xl mb-2">❓</div>
                        <h4 className="font-bold text-gray-900">Help Center</h4>
                        <p className="text-sm text-gray-600">Get help with privacy questions</p>
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