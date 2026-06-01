import { useState, useRef, useEffect } from 'react';
import { contactAPI } from '@/lib/api';
import {
    Building2,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Smartphone,
    Zap,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactForm({ showOfficeInfo = true, showFAQ = true, showCTA = true, onSuccess = null }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: '',
        subject: '',
        message: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const nameRef = useRef(null);
    const MESSAGE_MAX = 1000;

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = '';
        if (name === 'name') {
            if (!value.trim()) error = 'Full name is required';
        } else if (name === 'email') {
            if (!value) error = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        } else if (name === 'category') {
            if (!value) error = 'Please select a category';
        } else if (name === 'subject') {
            if (!value.trim()) error = 'Subject is required';
        } else if (name === 'message') {
            if (!value.trim()) error = 'Message is required';
            else if (value.trim().length < 10) error = 'Message must be at least 10 characters';
        }
        if (error) setFieldErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return;
        }

        setSubmitting(true);

        try {
            await contactAPI.sendMessage(
                formData.name,
                formData.email,
                formData.category,
                formData.message
            );
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                category: '',
                subject: '',
                message: '',
            });

            if (onSuccess) {
                onSuccess(formData);
            }

            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: Phone,
            title: 'Call Us',
            desc: '+855 23 456 789',
            subtext: '24/7 available',
            link: 'tel:+85523456789',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: Mail,
            title: 'Email Us',
            desc: 'support@sangkumfund.com',
            subtext: 'Response within 2 hours',
            link: 'mailto:support@sangkumfund.com',
            color: 'from-orange-400 to-orange-600'
        },
        {
            icon: MessageCircle,
            title: 'Live Chat',
            desc: 'Chat with our team',
            subtext: 'Mon-Fri, 8AM-6PM',
            link: '#chat',
            color: 'from-amber-400 to-orange-500'
        },
        {
            icon: Smartphone,
            title: 'Telegram Bot',
            desc: '@sangkumfund_support',
            subtext: 'Instant responses',
            link: 'https://t.me/sangkumfund_support',
            color: 'from-blue-400 to-cyan-500'
        },
    ];

    const offices = [
        {
            city: 'Phnom Penh',
            address: '123 Street 123, Khan Daun Penh, Phnom Penh',
            phone: '+855 23 456 789',
            email: 'phnom-penh@sangkumfund.com',
            hours: 'Mon-Fri, 8AM-6PM',
            timezone: 'Cambodia Time (ICT)'
        },
    ];

    const faqs = [
        {
            q: "What is the best way to contact support?",
            a: "For urgent issues, call us at +855 23 456 789. For general inquiries, email or use our contact form. Live chat is available during business hours."
        },
        {
            q: "What are your operating hours?",
            a: "We're available Monday-Friday, 8 AM to 6 PM Cambodia Time. Emergency support is available 24/7 via phone."
        },
        {
            q: "How quickly will I get a response?",
            a: "Email responses typically within 2 hours during business hours. Chat and phone support is instant when available."
        },
        {
            q: "Do you offer technical support?",
            a: "Yes, our technical support team can help with platform issues, payment problems, and account questions."
        },
    ];

    return (
        <>
            {/* Contact Methods Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Contact Options</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {contactMethods.map((method, index) => (
                        <motion.a
                            key={index}
                            href={method.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${method.color} mb-4`}>
                                <method.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{method.title}</h3>
                            <p className="text-sm text-orange-600 font-medium mb-2">{method.desc}</p>
                            <p className="text-xs text-gray-500">{method.subtext}</p>
                        </motion.a>
                    ))}
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={showOfficeInfo ? "md:col-span-2" : "md:col-span-3"}
                >
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-green-800">Message sent successfully!</p>
                                    <p className="text-sm text-green-700">Our team will respond within 2 hours during business hours.</p>
                                </div>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-red-800">Failed to send message</p>
                                    <p className="text-sm text-red-700">Please try again later or contact us directly.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                                    <input
                                        ref={nameRef}
                                        type="text"
                                        name="name"
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        placeholder="Sokha Chan"
                                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${fieldErrors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                                        aria-describedby={fieldErrors.name ? 'cf-name-error' : undefined}
                                    />
                                    {fieldErrors.name && (
                                        <p id="cf-name-error" className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        placeholder="sokha@example.com"
                                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${fieldErrors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                                        aria-describedby={fieldErrors.email ? 'cf-email-error' : undefined}
                                    />
                                    {fieldErrors.email && (
                                        <p id="cf-email-error" className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+855 (0) 12 345 678"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${fieldErrors.category ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                                        aria-describedby={fieldErrors.category ? 'cf-cat-error' : undefined}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="account">Account Issues</option>
                                        <option value="payment">Payment Questions</option>
                                        <option value="campaign">Campaign Help</option>
                                        <option value="partnership">Partnership Inquiry</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {fieldErrors.category && (
                                        <p id="cf-cat-error" className="mt-1 text-sm text-red-600">{fieldErrors.category}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    placeholder="What is this regarding?"
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${fieldErrors.subject ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                                    aria-describedby={fieldErrors.subject ? 'cf-subject-error' : undefined}
                                />
                                {fieldErrors.subject && (
                                    <p id="cf-subject-error" className="mt-1 text-sm text-red-600">{fieldErrors.subject}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-gray-700 font-semibold">Message *</label>
                                    <span className={`text-xs ${formData.message.length > MESSAGE_MAX * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.message.length}/{MESSAGE_MAX}
                                    </span>
                                </div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    rows="6"
                                    maxLength={MESSAGE_MAX}
                                    placeholder="Please describe your message in detail..."
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors resize-none ${fieldErrors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                                    aria-describedby={fieldErrors.message ? 'cf-message-error' : undefined}
                                ></textarea>
                                {fieldErrors.message && (
                                    <p id="cf-message-error" className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Office Info */}
                {showOfficeInfo && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Office Details */}
                        {offices.map((office, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">{office.city} Office</h3>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Address</p>
                                            <p className="text-gray-900">{office.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Phone className="w-5 h-5 text-orange-600 mt-1" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Phone</p>
                                            <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-orange-600 hover:text-orange-700 font-medium">
                                                {office.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Mail className="w-5 h-5 text-orange-600 mt-1" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Email</p>
                                            <a href={`mailto:${office.email}`} className="text-orange-600 hover:text-orange-700 font-medium">
                                                {office.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Clock className="w-5 h-5 text-orange-600 mt-1" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Business Hours</p>
                                            <p className="text-gray-900">{office.hours}</p>
                                            <p className="text-sm text-gray-500">{office.timezone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Response Times */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                            <h4 className="font-bold text-gray-900 mb-4">Response Times</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Email</span>
                                    <span className="text-sm font-semibold text-orange-600">Within 2 hours</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Chat</span>
                                    <span className="text-sm font-semibold text-orange-600">Instant</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Phone</span>
                                    <span className="text-sm font-semibold text-orange-600">During hours</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Telegram</span>
                                    <span className="text-sm font-semibold text-orange-600">Within 30 min</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* FAQ Preview */}
            {showFAQ && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                                <p className="text-gray-700 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Bottom CTA */}
            {showCTA && (
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of people already raising funds on SangKumFund.
                        </p>
                        <a
                            href="/auth/register"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Zap className="w-5 h-5" />
                            Start Your Campaign
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
