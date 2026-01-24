import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function AboutUs() {
    const [activeSection, setActiveSection] = useState('story');

    const teamMembers = [
        {
            name: 'Sophanith SOK',
            role: 'Founder & CEO',
            image: '/team/sophanith.jpg',
            bio: 'Former NGO director with 10+ years in community development across Cambodia.',
            social: { twitter: '#', linkedin: '#' }
        },
        {
            name: 'Chanbormey YIN',
            role: 'Head of Partnerships',
            image: '/team/chanbormey.jpg',
            bio: 'Previously led corporate social responsibility programs for major Cambodian companies.',
            social: { twitter: '#', linkedin: '#' }
        },
        {
            name: 'Bunthan NOU',
            role: 'Tech Lead',
            image: '/team/bunthan.jpg',
            bio: 'Software engineer passionate about building technology that serves local communities.',
            social: { twitter: '#', linkedin: '#' }
        },
        {
            name: 'Sreyneang KIM',
            role: 'Community Manager',
            image: '/team/sreyneang.jpg',
            bio: 'Social worker experienced in grassroots organizing and community support.',
            social: { twitter: '#', linkedin: '#' }
        },
    ];

    const values = [
        {
            icon: '🤝',
            title: 'Community First',
            description: 'Every decision we make prioritizes the well-being of Cambodian communities.'
        },
        {
            icon: '🔒',
            title: 'Trust & Transparency',
            description: 'Complete transparency in how funds are collected, managed, and distributed.'
        },
        {
            icon: '💝',
            title: 'Compassionate Support',
            description: 'We provide personalized guidance to every fundraiser creator and donor.'
        },
        {
            icon: '🌱',
            title: 'Sustainable Impact',
            description: 'Focusing on long-term solutions that create lasting positive change.'
        },
        {
            icon: '🎯',
            title: 'Local Relevance',
            description: 'Built specifically for Cambodian cultural context and needs.'
        },
        {
            icon: '⚡',
            title: 'Innovation',
            description: 'Leveraging technology to make giving accessible and effective.'
        }
    ];

    const milestones = [
        { year: '2022', title: 'Journey Begins', description: 'Founded in Phnom Penh with a vision to democratize giving' },
        { year: '2023', title: 'First Campaigns', description: 'Successfully funded 50+ local community projects' },
        { year: '2024', title: 'Nationwide Launch', description: 'Expanded to all 25 provinces of Cambodia' },
        { year: '2024', title: 'Partnership Growth', description: 'Collaborated with 100+ local NGOs and businesses' },
        { year: '2025', title: 'Impact Milestone', description: 'Surpassed $1 million raised for Cambodian causes' },
    ];

    const impactStats = [
        { number: '2,500+', label: 'Campaigns Funded', icon: '🎯' },
        { number: '₿150K+', label: 'Total Raised', icon: '💰' },
        { number: '75,000+', label: 'Donors', icon: '👥' },
        { number: '24', label: 'Provinces Reached', icon: '📍' },
        { number: '100+', label: 'Partner Organizations', icon: '🤝' },
        { number: '98%', label: 'Success Rate', icon: '⭐' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 pt-24 pb-32 px-4">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center text-white"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                            <span className="text-lg">🇰🇭</span>
                            <span className="text-sm font-medium">Made in Cambodia</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Building a More Compassionate<br />
                            <span className="text-orange-200">Cambodia Together</span>
                        </h1>

                        <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                            SangKumFund is Cambodia's trusted crowdfunding platform, connecting generous hearts with communities in need.
                            We're revolutionizing how Cambodians support each other, one campaign at a time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/charities"
                                className="px-8 py-4 bg-white text-orange-700 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-xl"
                            >
                                Start a Campaign
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                            >
                                Join Our Team
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Navigation */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex overflow-x-auto py-4 gap-2">
                        {['story', 'mission', 'team', 'values', 'impact', 'contact'].map((section) => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                                    activeSection === section
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                                {section === 'story' && 'Our Story'}
                                {section === 'mission' && 'Mission & Vision'}
                                {section === 'team' && 'Our Team'}
                                {section === 'values' && 'Our Values'}
                                {section === 'impact' && 'Our Impact'}
                                {section === 'contact' && 'Contact Us'}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto py-16 px-4">
                {/* Our Story Section */}
                {activeSection === 'story' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-16"
                    >
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                    How <span className="text-orange-600">SangKumFund</span> Came to Life
                                </h2>
                                <div className="space-y-4 text-gray-600 leading-relaxed">
                                    <p>
                                        In 2022, our founder witnessed a heartbreaking situation: a family in a rural Cambodian village
                                        struggling to raise funds for their child's emergency medical treatment. Despite the community's
                                        willingness to help, there was no simple, transparent way to collect and manage donations.
                                    </p>
                                    <p>
                                        This experience sparked an idea - what if there was a platform specifically designed for Cambodians,
                                        by Cambodians? A platform that understood local customs, trusted relationships, and the unique
                                        challenges of fundraising in our communities.
                                    </p>
                                    <p>
                                        <span className="font-bold text-orange-700">SangKumFund</span> (meaning "Community Fund" in Khmer) was born from this vision.
                                        Just as a community comes together in times of need, our platform creates a unified space for Cambodians
                                        to support and uplift each other.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-8xl mb-6">🤝</div>
                                        <p className="text-xl font-bold text-gray-900 mb-2">SangKumFund</p>
                                        <p className="text-gray-600">/sɑːŋkʊmfʌnd/ • Compound Noun</p>
                                        <p className="text-gray-600 mt-2">"SangKum" means Community in Khmer - a collective fund for community support and growth</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Journey</h3>
                            <div className="relative">
                                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-500"></div>

                                <div className="space-y-12">
                                    {milestones.map((milestone, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                        >
                                            <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                                                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg max-w-md">
                                                    <div className="text-2xl font-bold text-orange-600 mb-2">{milestone.year}</div>
                                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h4>
                                                    <p className="text-gray-600">{milestone.description}</p>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 border-4 border-white"></div>
                                            </div>

                                            <div className="flex-1"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Mission & Vision */}
                {activeSection === 'mission' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-16"
                    >
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8">
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4">🎯</div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed text-center">
                                    To empower every Cambodian to create positive change in their community
                                    by making fundraising accessible, transparent, and effective through
                                    technology built with local understanding.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8">
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4">🔮</div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed text-center">
                                    A Cambodia where no one faces hardship alone, where communities
                                    are strengthened through mutual support, and where giving is as
                                    natural as breathing—seamlessly integrated into our digital lives.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes SangKumFund Different</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: 'Local First Approach',
                                        description: 'Built specifically for Cambodian cultural context, payment methods, and social dynamics.',
                                        icon: '🇰🇭'
                                    },
                                    {
                                        title: 'Zero Platform Fees',
                                        description: 'We never take a percentage of donations. Our revenue comes from optional tips.',
                                        icon: '💝'
                                    },
                                    {
                                        title: 'Khmer Language Focus',
                                        description: 'Fully translated platform with local support teams who speak your language.',
                                        icon: '📱'
                                    },
                                    {
                                        title: 'Community Verification',
                                        description: 'Multi-layer verification system involving local leaders and partner NGOs.',
                                        icon: '✅'
                                    },
                                    {
                                        title: 'Offline Support',
                                        description: 'Help centers and workshops in communities with limited internet access.',
                                        icon: '🏘️'
                                    },
                                    {
                                        title: 'Cultural Sensitivity',
                                        description: 'Guidance that respects local customs, religious practices, and social norms.',
                                        icon: '🙏'
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="text-center p-6">
                                        <div className="text-4xl mb-4">{item.icon}</div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Our Team */}
                {activeSection === 'team' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Family</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Passionate Cambodians dedicated to building a platform that serves our communities
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="group">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                        <div className="p-6">
                                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-4xl font-bold">
                                                {member.image ? (
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    member.name.charAt(0)
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{member.name}</h3>
                                            <p className="text-orange-600 font-semibold text-center mb-4">{member.role}</p>
                                            <p className="text-gray-600 text-center text-sm mb-6">{member.bio}</p>

                                            <div className="flex justify-center gap-4">
                                                <a href={member.social.twitter} className="text-gray-400 hover:text-orange-500">
                                                    𝕏
                                                </a>
                                                <a href={member.social.linkedin} className="text-gray-400 hover:text-orange-500">
                                                    in
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Mission</h3>
                                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    We're always looking for passionate Cambodians who want to make a difference.
                                    Whether you're a developer, community organizer, or just someone who cares about our country.
                                </p>
                                <Link
                                    href="/careers"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
                                >
                                    View Open Positions
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Our Values */}
                {activeSection === 'values' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Guiding Principles</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                The values that shape every decision we make at SangKumFund
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group border border-gray-100"
                                >
                                    <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-12 text-white">
                            <div className="max-w-3xl mx-auto text-center">
                                <div className="text-6xl mb-6">🇰🇭</div>
                                <h3 className="text-3xl font-bold mb-6">Built for Cambodia, By Cambodians</h3>
                                <p className="text-xl text-orange-100 leading-relaxed mb-8">
                                    We believe in the power of our people. Every feature, every policy, and every partnership
                                    is designed with Cambodian values, needs, and aspirations at heart. This is more than a
                                    platform—it's our contribution to the Cambodia we believe in.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Our Impact */}
                {activeSection === 'impact' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-16"
                    >
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Difference We've Made</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Real numbers, real stories, real impact across Cambodia
                            </p>
                        </div>

                        {/* Impact Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {impactStats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl mb-4">{stat.icon}</div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Success Stories */}
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Success Stories</h3>
                            <div className="grid lg:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: "Rural School Renovation",
                                        location: "Kampong Thom Province",
                                        description: "Raised $25,000 to rebuild classrooms for 300 students",
                                        icon: "🏫"
                                    },
                                    {
                                        title: "Emergency Medical Fund",
                                        location: "Battambang",
                                        description: "Community came together to save a child's life",
                                        icon: "🏥"
                                    },
                                    {
                                        title: "Women's Entrepreneurship",
                                        location: "Siem Reap",
                                        description: "Supported 50 women to start small businesses",
                                        icon: "💼"
                                    },
                                ].map((story, index) => (
                                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                                        <div className="text-5xl mb-4">{story.icon}</div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h4>
                                        <div className="flex items-center gap-2 text-gray-500 mb-3">
                                            <span>📍</span>
                                            <span>{story.location}</span>
                                        </div>
                                        <p className="text-gray-600">{story.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Community Says</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    {
                                        quote: "SangKumFund helped our village rebuild after the floods. We couldn't have done it without the support from people across Cambodia.",
                                        author: "Mr. Vannak, Community Leader",
                                        location: "Takeo Province"
                                    },
                                    {
                                        quote: "As a donor, I love how transparent SangKumFund is. I can see exactly where my money goes and the impact it creates.",
                                        author: "Ms. Sophea, Regular Donor",
                                        location: "Phnom Penh"
                                    },
                                ].map((testimonial, index) => (
                                    <div key={index} className="bg-white rounded-xl p-6">
                                        <div className="text-3xl mb-4">"</div>
                                        <p className="text-gray-700 text-lg mb-6 italic">{testimonial.quote}</p>
                                        <div>
                                            <p className="font-bold text-gray-900">{testimonial.author}</p>
                                            <p className="text-gray-500 text-sm">{testimonial.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Contact Us */}
                {activeSection === 'contact' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-16"
                    >
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We'd love to hear from you. Whether you have questions, need support, or want to partner with us.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            <div>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">📍</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Office</h3>
                                            <p className="text-gray-600">
                                                Building 123, Street 456<br />
                                                Sangkat Tonle Bassac, Khan Chamkarmon<br />
                                                Phnom Penh, Cambodia
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">📞</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Numbers</h3>
                                            <p className="text-gray-600">
                                                General Inquiries: (+855) 23 456 789<br />
                                                Support Hotline: (+855) 23 456 790<br />
                                                Emergency: (+855) 12 345 678
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">📧</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                                            <p className="text-gray-600">
                                                General: hello@sangkumfund.org<br />
                                                Support: support@sangkumfund.org<br />
                                                Partnerships: partners@sangkumfund.org
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">⏰</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Hours</h3>
                                            <p className="text-gray-600">
                                                Monday - Friday: 8:00 AM - 6:00 PM<br />
                                                Saturday: 9:00 AM - 4:00 PM<br />
                                                Sunday: Emergency support only
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <a href="#" className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                                        <span className="text-xl">f</span>
                                    </a>
                                    <a href="#" className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                                        <span className="text-xl">𝕏</span>
                                    </a>
                                    <a href="#" className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                                        <span className="text-xl">in</span>
                                    </a>
                                    <a href="#" className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                                        <span className="text-xl">📷</span>
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                                placeholder="Sokha"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                                placeholder="Chan"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                            placeholder="sokha@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                            placeholder="+855 12 345 678"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">Message</label>
                                        <textarea
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Final CTA */}
            <section className="bg-gradient-to-r from-orange-600 to-amber-600 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
                    <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of Cambodians who are creating positive change in their communities through SangKumFund.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/charities"
                            className="px-8 py-4 bg-white text-orange-700 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all"
                        >
                            Start Your Campaign
                        </Link>
                        <Link
                            href="/events"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                        >
                            Support a Cause
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}