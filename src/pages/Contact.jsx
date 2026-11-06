import { useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  Headset,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    // Simulate support ticket submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* 1. HERO BANNER */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
              <Link className="hover:text-white transition-colors" to="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Contact & Support</span>
            </nav>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30 shrink-0">
                <Headset className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact Us</h1>
                <p className="text-white/80 mt-1">
                  We'd love to hear from you. Get in touch with our team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN CONTENT GRID */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Phone Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-500 text-sm mb-2">Mon-Fri from 8am to 6pm</p>
                    <a
                      href="tel:+18001234567"
                      className="text-primary-600 font-medium hover:underline text-sm"
                    >
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-500 text-sm mb-2">We'll respond within 24 hours</p>
                    <a
                      href="mailto:support@freshcart.com"
                      className="text-primary-600 font-medium hover:underline text-sm"
                    >
                      support@freshcart.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      123 Commerce Street
                      <br />
                      New York, NY 10001
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Monday - Friday: 8am - 6pm
                      <br />
                      Saturday: 9am - 4pm
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Follow Us Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex items-center gap-3">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                    <a
                      key={social}
                      href={`https://${social}.com`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-600 hover:text-white transition-colors capitalize text-xs font-bold"
                    >
                      {social[0].toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Send Us A Message Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Headset className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-gray-500 text-sm">
                      Fill out the form and our support team will get back to you promptly
                    </p>
                  </div>
                </div>

                {isSubmitted && (
                  <div className="mb-6 p-4 rounded-xl bg-primary-50 border border-primary-200 text-primary-800 text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
                    <span>
                      Thank you for contacting FreshCart! We have received your inquiry and will
                      reply within 24 hours.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white text-sm"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="shipping">Shipping Question</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="product">Product Information</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors cursor-pointer disabled:opacity-70 shadow-sm shadow-primary-600/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>

              {/* Quick Answers Card */}
              <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
                    <HelpCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Looking for quick answers?
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Check out our Terms and Policies for frequently asked questions about orders,
                      shipping, returns, and more.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                      <Link to="/terms" className="text-primary-600 hover:underline">
                        Terms of Service →
                      </Link>
                      <Link to="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMMON FEATURES BAR */}
      <FeaturesBar />
    </div>
  );
}
