import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brandsApi } from '../api/brandsApi';
import FeaturesBar from '../components/common/FeaturesBar';
import { Tags, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBrands = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await brandsApi.getBrands({ limit: 50 });
      if (res.data) {
        setBrands(res.data);
      }
    } catch {
      setError('Failed to load brands. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* 1. HERO BANNER (Matching Demo) */}
        <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400 text-white">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link className="hover:text-white transition-colors" to="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Brands</span>
            </nav>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30 shrink-0">
                <Tags className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Top Brands</h1>
                <p className="text-white/80 mt-1">Shop from your favorite brands</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. BRANDS GRID (grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6) */}
        <div className="container mx-auto px-4 py-10">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4 mx-auto" />
                <p className="text-gray-500 text-sm">Loading brands...</p>
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-rose-900 mb-1">Failed to Load Brands</h3>
              <p className="text-xs text-rose-700 mb-4">{error}</p>
              <button
                onClick={fetchBrands}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {!isLoading && !error && brands.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  to={`/brands/${brand._id}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-violet-200 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 flex items-center justify-center p-3">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition text-center truncate text-xs sm:text-sm w-full">
                    {brand.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. FEATURES BAR */}
      <FeaturesBar />
    </div>
  );
}
