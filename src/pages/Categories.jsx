import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../api/categoriesApi';
import FeaturesBar from '../components/common/FeaturesBar';
import { Layers, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await categoriesApi.getCategories({ limit: 50 });
      if (res.data) {
        setCategories(res.data);
      }
    } catch {
      setError('Failed to load categories. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* 1. HERO BANNER (Matching Demo) */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link className="hover:text-white transition-colors" to="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Categories</span>
            </nav>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30 shrink-0">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">All Categories</h1>
                <p className="text-white/80 mt-1">Browse our wide range of product categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CATEGORIES GRID */}
        <div className="container mx-auto px-4 py-10">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4 mx-auto" />
                <p className="text-gray-500 text-sm">Loading categories...</p>
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-rose-900 mb-1">Failed to Load Categories</h3>
              <p className="text-xs text-rose-700 mb-4">{error}</p>
              <button
                onClick={fetchCategories}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {!isLoading && !error && categories.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/categories/${cat._id}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-xs hover:shadow-xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition text-center truncate text-sm sm:text-base w-full">
                    {cat.name}
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
