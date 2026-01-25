import { useState, useEffect } from 'react';
import Link from 'next/link';
import { contactAPI } from '../lib/api';
import {
    Building2,
    Coins,
    Clock,
    Eye,
    Globe,
    Handshake,
    Info,
    Lightbulb,
    List,
    MapPin,
    MessageCircle,
    Phone,
    PlayCircle,
    Rocket,
    Search,
    Shield,
    Smartphone,
    Target,
    TrendingUp,
    User,
    Users,
    Wrench,
    X,
    Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedFaqs, setExpandedFaqs] = useState([]);
    const [showContactForm, setShowContactForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        message: '',
    });
    const [popularSearches, setPopularSearches] = useState([
        'How to start a campaign',
        'Withdrawal process',
        'Is there a fee?',
        'Account verification',
        'Donation refund',
        'Campaign rules',
    ]);

    const categories = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: Rocket,
            color: 'from-orange-500 to-amber-500',
            count: 12
        },
        {
            id: 'campaigns',
            title: 'Managing Campaigns',
            icon: Target,
            color: 'from-orange-400 to-orange-600',
            count: 18
        },
        {
            id: 'donations',
            title: 'Donations & Payments',
            icon: Coins,
            color: 'from-orange-500 to-yellow-500',
            count: 15
        },
        {
            id: 'account',
            title: 'Account Settings',
            icon: User,
            color: 'from-amber-500 to-orange-400',
            count: 8
        },
        {
            id: 'trust',
            title: 'Trust & Safety',
            icon: Shield,
            color: 'from-orange-600 to-red-500',
            count: 10
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            icon: Wrench,
            color: 'from-gray-600 to-gray-800',
            count: 7
        },
    ];

    const helpArticles = [
        {
            id: 1,
            title: "How to create your first campaign",
            category: 'getting-started',
            readTime: '5 min read',
            views: '2.4k',
            content: "Creating a campaign on SangKumFund is simple. First, click 'Start a Campaign' button. Fill in your campaign details including title, goal amount, and story. Add photos to make it compelling. Set up your bank account for withdrawals. Review and publish!"
        },
        {
            id: 2,
            title: "Withdrawal process and timeline",
            category: 'campaigns',
            readTime: '3 min read',
            views: '1.8k',
            content: "Funds are available for withdrawal 2-3 business days after donation. You can withdraw to any Cambodian bank account. Minimum withdrawal is $10. Withdrawals typically process within 24 hours."
        },
        {
            id: 3,
            title: "Understanding platform fees",
            category: 'donations',
            readTime: '4 min read',
            views: '3.1k',
            content: "SangKumFund charges a 0% platform fee. Payment processors charge 2.9% + $0.30 per transaction. Optional donor tips support our platform. No hidden fees."
        },
        {
            id: 4,
            title: "Verifying your account",
            category: 'account',
            readTime: '6 min read',
            views: '1.2k',
            content: "To verify your account, you need: 1) Valid ID (Passport or National ID), 2) Proof of address, 3) Phone number verification. Verification takes 24-48 hours."
        },
        {
            id: 5,
            title: "Campaign rules and guidelines",
            category: 'trust',
            readTime: '7 min read',
            views: '4.5k',
            content: "All campaigns must comply with local laws. Medical campaigns require documentation. Business campaigns need business registration. No hate speech or illegal activities allowed."
        },
        {
            id: 6,
            title: "Resetting your password",
            category: 'troubleshooting',
            readTime: '2 min read',
            views: '890',
            content: "Click 'Forgot Password' on login page. Enter your email. Check inbox for reset link. Create new password. Contact support if no email received."
        },
    ];

    const faqSections = [
        {
            category: 'General',
            questions: [
                {
                    q: "What is SangKumFund?",
                    a: "SangKumFund is Cambodia's leading crowdfunding platform designed specifically for Cambodian communities. We help individuals and organizations raise funds for medical expenses, education, emergencies, business ventures, and community projects."
                },
                {
                    q: "Is SangKumFund available in Khmer language?",
                    a: "Yes! Our platform is fully available in both Khmer and English. You can switch languages in your account settings or from the footer of any page."
                },
                {
                    q: "Who can use SangKumFund?",
                    a: "Any individual or organization in Cambodia can use SangKumFund. You must be at least 18 years old, have a valid Cambodian phone number, and a bank account in Cambodia."
                },
                {
                    q: "How is SangKumFund different from other platforms?",
                    a: "We're built specifically for Cambodia with local payment methods, Khmer language support, Cambodian customer service team, and understanding of local customs and needs."
                }
            ]
        },
        {
            category: 'Campaigns',
            questions: [
                {
                    q: "How do I start a campaign?",
                    a: "Click 'Start a Campaign' button, fill in your story, set a realistic goal, add photos/videos, verify your identity, and publish. Our team will review and approve within 24 hours."
                },
                {
                    q: "What can I raise money for?",
                    a: "Medical expenses, education fees, emergency relief, business startups, community projects, creative arts, memorials, and nonprofit fundraising. All campaigns must comply with our guidelines."
                },
                {
                    q: "How long can my campaign run?",
                    a: "Campaigns typically run for 30-90 days. You can extend your campaign if needed. Medical emergencies can run indefinitely until goal is reached."
                },
                {
                    q: "Can I edit my campaign after publishing?",
                    a: "Yes! You can update your story, add new photos, and adjust your goal at any time. Major changes may require re-verification."
                }
            ]
        },
        {
            category: 'Donations',
            questions: [
                {
                    q: "What payment methods are accepted?",
                    a: "We accept: 1) Bank transfers (all Cambodian banks), 2) Credit/Debit cards (Visa, Mastercard), 3) ABA Pay, 4) TrueMoney, 5) Wing, 6) Pi Pay"
                },
                {
                    q: "Are donations tax-deductible?",
                    a: "Yes, donations to verified nonprofit campaigns are tax-deductible. Donors receive official receipts via email for tax purposes."
                },
                {
                    q: "Can I donate anonymously?",
                    a: "Yes! When making a donation, you can choose to donate anonymously. Your name won't appear publicly, but the campaign organizer will know you donated."
                },
                {
                    q: "How do I get a refund?",
                    a: "Refunds are available within 7 days of donation if the campaign violates our terms. Contact support with your transaction ID."
                }
            ]
        },
        {
            category: 'Fees & Payments',
            questions: [
                {
                    q: "What are the fees?",
                    a: "SangKumFund charges 0% platform fee. Payment processors charge 2.9% + $0.30 per transaction. Withdrawals to Cambodian banks are free."
                },
                {
                    q: "When do I receive my funds?",
                    a: "Funds are available 2-3 business days after donation. You can withdraw anytime once you reach $10 minimum balance."
                },
                {
                    q: "What currencies are supported?",
                    a: "We support USD and KHR (Cambodian Riel). Donors can choose their preferred currency during checkout."
                },
                {
                    q: "Are there any hidden fees?",
                    a: "No hidden fees. The only fees are payment processor fees (2.9% + $0.30). We're transparent about all costs."
                }
            ]
        },
        {
            category: 'Safety & Security',
            questions: [
                {
                    q: "How are campaigns verified?",
                    a: "All campaigns go through a 4-step verification: 1) Identity check, 2) Documentation review, 3) Phone verification, 4) Bank account verification. Our team manually reviews each campaign."
                },
                {
                    q: "What if a campaign is fraudulent?",
                    a: "Report suspicious campaigns using the 'Report' button. Our Trust & Safety team investigates within 24 hours. We have a 100% refund policy for verified fraud cases."
                },
                {
                    q: "Is my payment information secure?",
                    a: "Yes! We use bank-level encryption (256-bit SSL), PCI DSS compliance, and never store your full card details. All transactions are secure."
                },
                {
                    q: "How do you protect donor privacy?",
                    a: "We never share donor information with third parties. Your data is protected under Cambodia's data protection laws and our strict privacy policy."
                }
            ]
        }
    ];

    const filteredArticles = helpArticles.filter(article => {
        const matchesSearch = searchQuery === '' ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory === 'all' || article.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const toggleFaq = (index) => {
        if (expandedFaqs.includes(index)) {
            setExpandedFaqs(expandedFaqs.filter(i => i !== index));
        } else {
            setExpandedFaqs([...expandedFaqs, index]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await contactAPI.sendMessage(formData.name, formData.email, formData.category, formData.message);
            alert('Message sent! Our team will respond within 24 hours.');
            setFormData({ name: '', email: '', category: '', message: '' });
            setShowContactForm(false);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again later.');
        }
    };

    const quickActions = [
        { icon: Phone, title: 'Call Us', desc: '+855 23 456 789', action: 'tel:+85523456789' },
        { icon: MessageCircle, title: 'Live Chat', desc: 'Available 24/7', action: () => setShowContactForm(true) },
        { icon: MapPin, title: 'Visit Office', desc: 'Phnom Penh', action: '/contact' },
        { icon: Smartphone, title: 'Telegram Bot', desc: '@sangkumfund_support', action: 'https://t.me/sangkumfund_support' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 py-20 px-4">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-6xl mx-auto relative text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                            <Info className="w-4 h-4" />
                            <span className="text-sm font-medium">How can we help you?</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Help Center
                        </h1>

                        <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Find answers, guides, and support for using SangKumFund in Cambodia
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for help articles, FAQs, or guides..."
                                    className="w-full pl-12 pr-6 py-4 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none text-gray-900 text-lg shadow-xl"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Popular Searches */}
                            {searchQuery === '' && (
                                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                    <span className="text-orange-200 text-sm">Popular:</span>
                                    {popularSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSearchQuery(search)}
                                            className="text-sm text-orange-100 hover:text-white px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            {[
                                { value: '24/7', label: 'Support Available', icon: Clock },
                                { value: '15 min', label: 'Avg Response Time', icon: Zap },
                                { value: '98%', label: 'Satisfaction Rate', icon: Users },
                                { value: 'Khmer/English', label: 'Languages', icon: Globe },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                                >
                                    <div className="text-2xl mb-2 flex justify-center">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-xs text-orange-200">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-12 px-4">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Need help right now?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                                onClick={() => {
                                    if (typeof action.action === 'function') {
                                        action.action();
                                    } else if (action.action.startsWith('http') || action.action.startsWith('tel')) {
                                        window.open(action.action, '_blank');
                                    } else {
                                        window.location.href = action.action;
                                    }
                                }}
                            >
                                <div className="text-3xl mb-4">
                                    <action.icon className="w-7 h-7 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                                <p className="text-gray-600 text-sm">{action.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-4 py-2 rounded-lg ${activeCategory === 'all' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setActiveCategory(category.id)}
                                className={`text-center p-4 rounded-2xl transition-all ${activeCategory === category.id ? 'shadow-xl' : 'shadow-lg hover:shadow-xl'}`}
                                style={{
                                    background: activeCategory === category.id
                                        ? `linear-gradient(135deg, var(--tw-gradient-stops))`
                                        : 'white'
                                }}
                            >
                                <div className={`text-3xl mb-3 ${activeCategory === category.id ? 'text-white' : ''}`}>
                                    <category.icon className="w-6 h-6" />
                                </div>
                                <div className={`font-semibold mb-2 ${activeCategory === category.id ? 'text-white' : 'text-gray-900'}`}>
                                    {category.title}
                                </div>
                                <div className={`text-sm ${activeCategory === category.id ? 'text-orange-100' : 'text-gray-500'}`}>
                                    {category.count} articles
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Search Results / Featured Articles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Articles'}
                        </h2>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>

                    {filteredArticles.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map((article) => (
                                <motion.div
                                    key={article.id}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer border border-gray-100 hover:border-orange-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm font-medium px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                        {categories.find(c => c.id === article.category)?.title}
                      </span>
                                            <span className="text-sm text-gray-500">{article.readTime}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {article.content}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <Eye className="w-4 h-4" />
                                                <span>{article.views} views</span>
                                            </div>
                                            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                                                Read More →
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
                            <div className="flex items-center justify-center mb-4">
                                <Search className="w-12 h-12 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                We couldn't find any articles matching your search. Try different keywords or browse by category.
                            </p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
                            >
                                Browse All Articles
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* FAQ Sections */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        {faqSections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900">{section.category}</h3>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {section.questions.map((faq, index) => {
                                        const faqIndex = sectionIndex * 10 + index;
                                        const isExpanded = expandedFaqs.includes(faqIndex);

                                        return (
                                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                                <button
                                                    onClick={() => toggleFaq(faqIndex)}
                                                    className="w-full flex items-start justify-between text-left"
                                                >
                                                    <h4 className="text-lg font-semibold text-gray-900 pr-8">
                                                        {faq.q}
                                                    </h4>
                                                    <span className="text-orange-600 text-xl ml-4 flex-shrink-0">
                            {isExpanded ? '−' : '+'}
                          </span>
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pt-4 text-gray-600">
                                                                {faq.a}
                                                                {index === 0 && sectionIndex === 0 && (
                                                                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                                                                        <p className="text-sm font-medium text-orange-800 flex items-center gap-2">
                                                                            <Lightbulb className="w-4 h-4" />
                                                                            <span>Tip: Use our mobile app for faster support and push notifications!</span>
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 mb-4">
                            Still can't find what you're looking for?
                        </p>
                        <button
                            onClick={() => setShowContactForm(true)}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
                        >
                            Contact Support Team
                        </button>
                    </div>
                </motion.div>

                {/* Guides & Resources */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Guides & Resources</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: 'Campaign Success Guide',
                                desc: 'Best practices for running successful campaigns',
                                icon: TrendingUp,
                                link: '/guides/campaign-success',
                                format: 'PDF'
                            },
                            {
                                title: 'Video Tutorials',
                                desc: 'Step-by-step video guides in Khmer',
                                icon: PlayCircle,
                                link: '/guides/videos',
                                format: 'Video'
                            },
                            {
                                title: 'Legal Documentation',
                                desc: 'Terms, privacy policy, and compliance',
                                icon: List,
                                link: '/legal',
                                format: 'Legal'
                            },
                            {
                                title: 'Partner Resources',
                                desc: 'Tools for NGOs and business partners',
                                icon: Handshake,
                                link: '/partners/resources',
                                format: 'Toolkit'
                            },
                        ].map((resource, index) => (
                            <motion.a
                                key={index}
                                href={resource.link}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                            >
                                <resource.icon className="w-9 h-9 mb-4 text-orange-600" />
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-gray-900">{resource.title}</h3>
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {resource.format}
                  </span>
                                </div>
                                <p className="text-gray-600 text-sm">{resource.desc}</p>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Contact Form Modal */}
            <AnimatePresence>
                {showContactForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Contact SangKumFund Support</h3>
                                    <button
                                        onClick={() => setShowContactForm(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 mb-2">Your Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                                placeholder="Sokha Chan"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                                placeholder="sokha@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                        >
                                            <option value="">Select an issue category</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="account">Account Problem</option>
                                            <option value="payment">Payment Issue</option>
                                            <option value="campaign">Campaign Question</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">Message *</label>
                                        <textarea
                                            required
                                            rows="6"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                            placeholder="Describe your issue in detail..."
                                        ></textarea>
                                    </div>

                                    <div className="p-4 bg-orange-50 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <Lightbulb className="w-5 h-5 text-orange-600" />
                                            <div>
                                                <p className="text-orange-800 font-medium mb-1">For faster support:</p>
                                                <ul className="text-sm text-orange-700 space-y-1">
                                                    <li>• Include screenshots if possible</li>
                                                    <li>• Mention your campaign ID if applicable</li>
                                                    <li>• Describe steps you've already tried</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowContactForm(false)}
                                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 text-center">
                                        Average response time: <span className="font-medium">15 minutes</span> during business hours<br />
                                        Emergency support available 24/7 via phone: <span className="font-medium">+855 23 456 789</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
                    <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
                        Our Cambodian support team is here for you, in your language.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <Phone className="w-8 h-8 text-white mb-4" />
                            <h3 className="font-bold text-lg mb-2">Call Us</h3>
                            <p className="text-orange-200">+855 23 456 789</p>
                            <p className="text-sm text-orange-300 mt-2">24/7 emergency line available</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <MessageCircle className="w-8 h-8 text-white mb-4" />
                            <h3 className="font-bold text-lg mb-2">Live Chat</h3>
                            <p className="text-orange-200">Chat Now</p>
                            <p className="text-sm text-orange-300 mt-2">Average wait: 2 minutes</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <Building2 className="w-8 h-8 text-white mb-4" />
                            <h3 className="font-bold text-lg mb-2">Visit Office</h3>
                            <p className="text-orange-200">Phnom Penh</p>
                            <p className="text-sm text-orange-300 mt-2">Mon-Fri, 8AM-6PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}