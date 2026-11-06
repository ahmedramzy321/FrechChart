import { useState } from 'react';
import { Mail, ArrowRight, Leaf, Truck, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to FreshCart updates!');
    setEmail('');
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-[2.5rem] border border-emerald-100/50 shadow-2xl shadow-emerald-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative grid lg:grid-cols-5 gap-8 p-8 lg:p-14">
              {/* Left Column: Newsletter Subscription */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                      Newsletter
                    </h3>
                    <p className="text-xs text-gray-500">50,000+ subscribers</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
                    Get the Freshest Updates{' '}
                    <span className="text-emerald-600">Delivered Free</span>
                  </h2>
                  <p className="text-gray-500 mt-3 text-lg">
                    Weekly recipes, seasonal offers &amp; exclusive member perks.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs border border-emerald-100 px-4 py-2.5 rounded-full shadow-xs">
                    <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Fresh Picks Weekly</span>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs border border-emerald-100 px-4 py-2.5 rounded-full shadow-xs">
                    <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Free Delivery Codes</span>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs border border-emerald-100 px-4 py-2.5 rounded-full shadow-xs">
                    <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Members-Only Deals</span>
                  </div>
                </div>

                <form onSubmit={handleSubscribe} className="pt-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-5 pr-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-base shadow-xs"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] cursor-pointer shrink-0"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 pl-1">
                    ✨ Unsubscribe anytime. No spam, ever.
                  </p>
                </form>
              </div>

              {/* Right Column: Mobile App Card */}
              <div className="lg:col-span-2 lg:border-l lg:border-emerald-100 lg:pl-8">
                <div className="h-full flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative space-y-5">
                      <div className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/30">
                        📱 MOBILE APP
                      </div>
                      <h3 className="text-2xl font-bold leading-tight">Shop Faster on Our App</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Get app-exclusive deals &amp; 15% off your first order.
                      </p>

                      <div className="flex flex-col gap-3 pt-2">
                        {/* Apple Store */}
                        <a
                          href="#"
                          className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/10 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
                        >
                          <svg className="w-6 h-6 fill-currentColor shrink-0" viewBox="0 0 384 512">
                            <path d="M319.1 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8 .9-115.1 44.5-115.1 133.2 0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.5 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                          </svg>
                          <div className="text-left">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                              Download on
                            </div>
                            <div className="text-sm font-semibold -mt-0.5">App Store</div>
                          </div>
                        </a>

                        {/* Google Play */}
                        <a
                          href="#"
                          className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/10 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
                        >
                          <svg className="w-6 h-6 fill-currentColor shrink-0" viewBox="0 0 448 512">
                            <path d="M293.6 234.3L72.9 13 353.7 174.2 293.6 234.3zM15.3 0C2.3 6.8-6.4 19.2-6.4 35.3l0 441.3c0 16.1 8.7 28.5 21.7 35.3L271.9 255.9 15.3 0zM440.5 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM72.9 499L353.7 337.8 293.6 277.7 72.9 499z" />
                          </svg>
                          <div className="text-left">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                              Get it on
                            </div>
                            <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                          </div>
                        </a>
                      </div>

                      <div className="flex items-center gap-2 pt-2 text-sm">
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="text-gray-400">4.9 • 100K+ downloads</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
