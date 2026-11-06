import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brandsApi } from '../../api/brandsApi';
import Skeleton from '../common/Skeleton';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

export default function BrandsSection() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBrands = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await brandsApi.getBrands({ limit: 12 });
      if (res.data) {
        setBrands(res.data);
      }
    } catch {
      setError('Could not load brands.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  if (error) {
    return (
      <div className="mb-14 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="text-sm text-amber-800 font-medium">{error}</p>
        <button
          onClick={fetchBrands}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Popular Brands
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Top global and local brands trusted by millions
          </p>
        </div>

        <Link
          to="/brands"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
        >
          <span>View all brands</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-xl mb-2" />
              <Skeleton className="w-16 h-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              to={`/brands/${brand._id}`}
              className="group p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 hover:shadow-lg transition flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden mb-2 flex items-center justify-center p-2">
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition duration-300"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600 transition truncate max-w-full">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
