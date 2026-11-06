import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoriesApi } from '../api/categoriesApi';
import { productsApi } from '../api/productsApi';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import FeaturesBar from '../components/common/FeaturesBar';
import { ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react';

export default function CategoryDetails() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategoryData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Category details
      const catRes = await categoriesApi.getCategoryById(id);
      if (catRes.data) {
        setCategory(catRes.data);
      }

      // 2. Subcategories
      try {
        const subRes = await categoriesApi.getCategorySubcategories(id);
        if (subRes.data) {
          setSubcategories(subRes.data);
        }
      } catch {
        setSubcategories([]);
      }

      // 3. Category Products
      try {
        const prodRes = await productsApi.getProducts({
          'category[in]': id,
          limit: 40,
        });
        if (prodRes.data) {
          setProducts(prodRes.data);
        }
      } catch {
        setProducts([]);
      }
    } catch {
      setError('Unable to load this category. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategoryData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchCategoryData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
        <div>
          <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white py-12">
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

  if (error || !category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Category Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'This category does not exist.'}</p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Categories</span>
        </Link>
      </div>
    );
  }

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
              <Link className="hover:text-white transition-colors" to="/categories">
                Categories
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">{category.name}</span>
            </nav>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm p-1 shadow-xl ring-1 ring-white/30 shrink-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{category.name}</h1>
                <p className="text-white/80 mt-1">
                  Browse {products.length} {products.length === 1 ? 'item' : 'items'} in this category
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SUBCATEGORIES CHIPS */}
        {subcategories.length > 0 && (
          <div className="bg-white border-b border-gray-100 py-4 shadow-2xs">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-2">
                  Subcategories:
                </span>
                {subcategories.map((sub) => (
                  <span
                    key={sub._id}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition shrink-0 cursor-default"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. PRODUCTS GRID */}
        <div className="container mx-auto px-4 py-8">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-md mx-auto my-8">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">No Products In This Category</h3>
              <p className="text-xs text-gray-500 mb-5">
                Check back soon or explore other fresh categories!
              </p>
              <Link
                to="/products"
                className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
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

      {/* 4. FEATURES BAR */}
      <FeaturesBar />
    </div>
  );
}
