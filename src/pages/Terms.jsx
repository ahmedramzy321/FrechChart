import { Link } from 'react-router-dom';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  FileText,
  AlertTriangle,
  Handshake,
  UserCheck,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Scale,
  Mail,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function Terms() {
  const articles = [
    {
      num: 'Article 1',
      title: 'Acceptance of Terms',
      icon: Handshake,
      points: [
        '1.1 By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.',
        '1.2 If you do not agree to these Terms, you must not access or use the Service.',
        '1.3 We reserve the right to update or modify these Terms at any time without prior notice. Your continued use constitutes acceptance.',
      ],
    },
    {
      num: 'Article 2',
      title: 'User Eligibility',
      icon: UserCheck,
      points: [
        '2.1 The Service is intended for users who are at least eighteen (18) years of age.',
        '2.2 By using the Service, you represent and warrant that you have the legal capacity to enter into a binding agreement.',
        '2.3 Accounts registered by automated methods or bots are unauthorized and subject to immediate termination.',
      ],
    },
    {
      num: 'Article 3',
      title: 'Account Registration',
      icon: ShieldCheck,
      points: [
        '3.1 You may be required to create an account to access certain features such as checkout, cart persistence, and order history.',
        '3.2 You agree to provide accurate, current, and complete information during registration and keep it updated.',
        '3.3 You are solely responsible for maintaining the confidentiality of your account credentials and all activities under your account.',
      ],
    },
    {
      num: 'Article 4',
      title: 'Orders and Payments',
      icon: CreditCard,
      points: [
        '4.1 All orders placed through the Service are subject to product availability and order confirmation.',
        '4.2 Prices and promotions are subject to change without notice prior to successful checkout.',
        '4.3 Payment can be made online via credit/debit card (Stripe) or via Cash on Delivery upon physical receipt.',
      ],
    },
    {
      num: 'Article 5',
      title: 'Shipping and Delivery',
      icon: Truck,
      points: [
        '5.1 Shipping times are estimates and may vary based on your governorate and order volume.',
        '5.2 Risk of loss and title for items purchased pass to you upon delivery to your specified address.',
        '5.3 FreshCart offers free standard shipping on qualifying orders exceeding 500 EGP.',
      ],
    },
    {
      num: 'Article 6',
      title: 'Returns and Refunds',
      icon: RotateCcw,
      points: [
        '6.1 Our return policy allows returns within 14 days of delivery for eligible items in accordance with Egyptian Consumer Protection law.',
        '6.2 Products must be in their original packaging, unopened, and accompanied by the original receipt.',
        '6.3 Approved refunds will be processed within 5-7 business days to your original payment method.',
      ],
    },
    {
      num: 'Article 7',
      title: 'Limitation of Liability',
      icon: Scale,
      points: [
        '7.1 To the maximum extent permitted by applicable law, FreshCart shall not be liable for any indirect, incidental, or consequential damages.',
        '7.2 In no event shall our total aggregate liability exceed the total amount paid by you for the specific order giving rise to the claim.',
      ],
    },
    {
      num: 'Article 8',
      title: 'Contact Us',
      icon: Mail,
      points: [
        'If you have any questions or concerns regarding these Terms of Service, please reach out to our legal and customer service team.',
        'Email: support@freshcart.com | Phone: +1 (800) 123-4567 | Address: 123 Commerce Street, New York, NY 10001',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex flex-col justify-between">
      <div>
        {/* HERO BANNER */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
              <Link to="/" className="hover:text-white transition-colors duration-200">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Terms of Service</span>
            </nav>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary-900/30 ring-1 ring-white/30 shrink-0">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Terms of Service
                </h1>
                <p className="text-white/80 mt-2 text-base sm:text-lg">
                  Last updated: February 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTAINER */}
        <div className="container mx-auto px-4 py-12">
          {/* Important Notice */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-3xl p-6 sm:p-8 mb-12 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-900 mb-2">Important Notice</h2>
                <p className="text-amber-800 leading-relaxed text-sm sm:text-base">
                  By accessing and using FreshCart ("the Service"), you agree to be bound by these
                  Terms of Service. Please read them carefully before making any purchases or using
                  our services.
                </p>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {articles.map((art, idx) => {
              const IconComp = art.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs hover:shadow-lg hover:border-primary-100 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {art.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{art.title}</h2>
                    <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                      {art.points.map((pt, pIdx) => (
                        <p key={pIdx}>{pt}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-xs">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/privacy"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition"
            >
              <span>View Privacy Policy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* COMMON FEATURES BAR */}
      <FeaturesBar />
    </div>
  );
}
