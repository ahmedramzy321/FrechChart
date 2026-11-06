import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brandsApi } from '../api/brandsApi';
import { productsApi } from '../api/productsApi';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import FeaturesBar from '../components/common/FeaturesBar';
import { ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react';

export default function BrandDetails() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBrandData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Fetch brand
      const brandRes = await brandsApi.getBrandById(id);
      if (brandRes.data) {
        setBrand(brandRes.data);
      }

      // 2. Fetch products by brand
      try {
        const prodRes = await productsApi.getProducts({
          brand: id,
          limit: 40,
        });
        if (prodRes.data) {
          setProducts(prodRes.data);
        }
      } catch {
        setProducts([]);
      }
    } catch {
      setError('Unable to load brand information. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrandData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchBrandData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
        <div>
          <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse mb-4" />
              <div className="h-10 w-72 bg-white/30 rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
        <FeaturesBar />
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Brand Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'This brand does not exist.'}</p>
        <Link
          to="/brands"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Brands</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* 1. HERO BANNER */}
        <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400 text-white">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
              <Link className="hover:text-white transition-colors" to="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <Link className="hover:text-white transition-colors" to="/brands">
                Brands
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">{brand.name}</span>
            </nav>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm p-2 shadow-xl ring-1 ring-white/30 shrink-0 flex items-center justify-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{brand.name}</h1>
                <p className="text-white/80 mt-1">
                  Discover {products.length} {products.length === 1 ? 'product' : 'products'} from this brand
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PRODUCTS GRID */}
        <div className="container mx-auto px-4 py-8">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-md mx-auto my-8">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">No Products From This Brand</h3>
              <p className="text-xs text-gray-500 mb-5">
                Check back soon or explore other top brands!
              </p>
              <Link
                to="/products"
                className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
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
