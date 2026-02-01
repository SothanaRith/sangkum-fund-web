import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function Contact() {

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
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
                        <p className="text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
                            Have questions? We're here to help. Reach out to our team and we'll respond as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-12 px-4">
                <ContactForm />
            </div>
        </div>
    );
}
