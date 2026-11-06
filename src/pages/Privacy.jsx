import { Link } from 'react-router-dom';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  ShieldCheck,
  Database,
  UserCheck,
  Lock,
  Share2,
  CheckCircle2,
  Cookie,
  Clock,
  Mail,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function Privacy() {
  const articles = [
    {
      num: 'Article 1',
      title: 'Information We Collect',
      icon: Database,
      points: [
        '1.1 Personal Data: Name, email address, Egyptian phone number, and delivery shipping addresses.',
        '1.2 Payment Data: Credit and debit card credentials processed directly and securely through PCI-DSS compliant gateways (Stripe).',
        '1.3 Technical Data: IP address, device type, browser specifications, and browsing interaction metrics.',
      ],
    },
    {
      num: 'Article 2',
      title: 'How We Use Your Information',
      icon: UserCheck,
      points: [
        '2.1 To process, verify, package, and deliver your orders accurately to your doorstep.',
        '2.2 To send instant order receipts, delivery tracking notifications, and SMS/email updates.',
        '2.3 To provide dedicated 24/7 customer support and resolve order inquiries.',
        '2.4 To protect against fraudulent activities and ensure platform integrity.',
      ],
    },
    {
      num: 'Article 3',
      title: 'Data Protection',
      icon: Lock,
      points: [
        '3.1 We implement 256-bit SSL/TLS encryption across all communications and transactions.',
        '3.2 Sensitive payment details are tokenized and never stored on FreshCart servers.',
        '3.3 Access to user database records is restricted under strict least-privilege protocols.',
      ],
    },
    {
      num: 'Article 4',
      title: 'Information Sharing',
      icon: Share2,
      points: [
        '4.1 We strictly do NOT sell, rent, or trade your personal information to any third parties.',
        '4.2 We share necessary shipping details only with authorized delivery courier partners.',
        '4.3 Information may be disclosed solely when required by Egyptian law or legal summons.',
      ],
    },
    {
      num: 'Article 5',
      title: 'Your Rights',
      icon: CheckCircle2,
      points: [
        '5.1 Access: You may request a complete copy of the personal information stored in your profile.',
        '5.2 Rectification: You have the right to edit and update your account details at any time.',
        '5.3 Erasure: You may request the deletion and anonymization of your account and data.',
        '5.4 Portability: You may request an export of your order history and account activity.',
      ],
    },
    {
      num: 'Article 6',
      title: 'Cookies',
      icon: Cookie,
      points: [
        '6.1 We utilize essential session cookies to remember your cart items and login session.',
        '6.2 You can adjust cookie preferences through your individual browser security settings.',
        '6.3 Disabling essential cookies will impact your ability to checkout or stay signed in.',
      ],
    },
    {
      num: 'Article 7',
      title: 'Data Retention',
      icon: Clock,
      points: [
        '7.1 We retain order and purchase records only for the duration required by applicable financial and tax laws.',
        '7.2 Inactive account credentials and cached data are archived safely according to industry data privacy guidelines.',
      ],
    },
    {
      num: 'Article 8',
      title: 'Contact Us',
      icon: Mail,
      points: [
        'For questions regarding your privacy rights or to submit a data management request, please contact our Data Protection Officer.',
        'Email: privacy@freshcart.com | Support: support@freshcart.com | Phone: +1 (800) 123-4567',
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
              <span className="text-white font-medium">Privacy Policy</span>
            </nav>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary-900/30 ring-1 ring-white/30 shrink-0">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Privacy Policy
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
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-3xl p-6 sm:p-8 mb-12 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/25">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-emerald-950 mb-2">Your Privacy Matters</h2>
                <p className="text-emerald-800 leading-relaxed text-sm sm:text-base">
                  At FreshCart, we are committed to protecting your privacy and personal data. This
                  Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you visit our website or make purchases.
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
              to="/terms"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition"
            >
              <span>View Terms of Service</span>
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
