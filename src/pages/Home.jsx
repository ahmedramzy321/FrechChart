import { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';
import MainSlider from '../components/home/MainSlider';
import BenefitsSection from '../components/home/BenefitsSection';
import CategoriesSlider from '../components/home/CategoriesSlider';
import PromoBanners from '../components/home/PromoBanners';
import NewsletterSection from '../components/home/NewsletterSection';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeaturedProducts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await productsApi.getProducts({ limit: 20 });
      if (res.data) {
        setProducts(res.data);
      }
    } catch {
      setError('Could not fetch featured products. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Main Hero Slider */}
      <MainSlider />

      {/* 2. Section 1: Value Benefits */}
      <BenefitsSection />

      {/* 3. Section 2: Shop By Category */}
      <CategoriesSlider />

      {/* 4. Section 3: Promotional Banners (Deal of the Day + New Arrivals) */}
      <PromoBanners />

      {/* 5. Section 4: Featured Products */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 my-8">
            <div className="h-8 w-1.5 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full" />
            <h2 className="text-3xl font-bold text-gray-800">
              Featured <span className="text-primary-600">Products</span>
            </h2>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto my-8">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-rose-900 mb-1">Failed to Load Products</h3>
              <p className="text-xs text-rose-700 mb-4">{error}</p>
              <button
                onClick={fetchFeaturedProducts}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading</span>
              </button>
            </div>
          )}

          {/* Products Grid (matching demo: grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5) */}
          {!isLoading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Section 5: Newsletter & Mobile App Download */}
      <NewsletterSection />
    </div>
  );
}
