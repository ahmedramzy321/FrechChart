import { Link } from 'react-router-dom';
import FeaturesBar from '../components/common/FeaturesBar';
import { ShoppingCart, Home, ArrowLeft, Apple, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Floating background fruits decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] text-primary-200 text-4xl animate-float">
            <Apple className="w-10 h-10 opacity-60" />
          </div>
          <div className="absolute top-[20%] right-[10%] text-primary-200 text-3xl animate-float-delayed">
            <Sparkles className="w-8 h-8 opacity-60" />
          </div>
          <div className="absolute bottom-[25%] left-[8%] text-primary-200 text-3xl animate-float-slow">
            <Apple className="w-8 h-8 opacity-50" />
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Centered 404 Card */}
        <div className="relative z-10 max-w-xl w-full text-center">
          {/* Illustration with Cart & 404 Badge */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 w-64 h-52 sm:w-72 sm:h-60 bg-primary-100/50 rounded-[32px] blur-2xl" />
              <div className="relative w-64 h-52 sm:w-72 sm:h-60">
                <div className="absolute inset-x-0 top-4 mx-auto w-52 h-40 sm:w-60 sm:h-44 bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-primary-100/40" />
                  <ShoppingCart className="relative w-16 h-16 sm:w-20 sm:h-20 text-primary-400/80" />
                </div>
                <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full bg-white shadow-lg" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/40">
                      <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        404
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-400" />
                  <div className="w-8 h-4 border-b-[3px] border-primary-400 rounded-b-full" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Heading & Text */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Oops! Nothing Here
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
              Looks like this page went out of stock! Don't worry, there's plenty more fresh content to explore.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white py-4 px-8 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Go to Homepage</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 py-4 px-8 rounded-2xl font-bold text-base transition-all duration-300 shadow-xs hover:shadow-md border border-gray-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>

      <FeaturesBar />
    </div>
  );
}
