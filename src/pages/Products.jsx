import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import { categoriesApi } from '../api/categoriesApi';
import { brandsApi } from '../api/brandsApi';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  Package,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialSort = searchParams.get('sort') || '';
  const initialSearch = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [metadata, setMetadata] = useState({ currentPage: 1, numberOfPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Filter options from API
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch categories & brands for filter options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          categoriesApi.getCategories({ limit: 50 }),
          brandsApi.getBrands({ limit: 50 }),
        ]);
        if (catsRes.data) setCategories(catsRes.data);
        if (brandsRes.data) setBrands(brandsRes.data);
      } catch {
        // silent fallback
      }
    };
    fetchOptions();
  }, []);

  // Sync state to URL params
  const updateUrlParams = useCallback(
    (page, cat, brand, sort, q) => {
      const params = {};
      if (page > 1) params.page = page;
      if (cat) params.category = cat;
      if (brand) params.brand = brand;
      if (sort) params.sort = sort;
      if (q) params.q = q;
      setSearchParams(params);
    },
    [setSearchParams]
  );

  // Fetch products based on active filters
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const queryParams = {
      page: currentPage,
      limit: 20,
    };

    if (sortBy) queryParams.sort = sortBy;
    if (selectedCategory) queryParams['category[in]'] = selectedCategory;
    if (selectedBrand) queryParams.brand = selectedBrand;

    try {
      const res = await productsApi.getProducts(queryParams);
      if (res.data) {
        setProducts(res.data);
        if (res.metadata) {
          setMetadata(res.metadata);
        }
      }
    } catch {
      setError('Failed to load products. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortBy, selectedCategory, selectedBrand]);

  useEffect(() => {
    fetchProducts();
    updateUrlParams(currentPage, selectedCategory, selectedBrand, sortBy, searchTerm);
  }, [fetchProducts, currentPage, selectedCategory, selectedBrand, sortBy, searchTerm, updateUrlParams]);

  // Client-side search filtering on loaded products
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(term) ||
        p.category?.name?.toLowerCase().includes(term) ||
        p.brand?.name?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // Handle filter changes
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrand(brandId);
    setCurrentPage(1);
  };

  const handleSortChange = (sortVal) => {
    setSortBy(sortVal);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchTerm || selectedCategory || selectedBrand || sortBy || currentPage > 1
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* 1. HERO BANNER (Matching Demo) */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
              <Link className="hover:text-white transition-colors" to="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">All Products</span>
            </nav>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30 shrink-0">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">All Products</h1>
                <p className="text-white/80 mt-1">Explore our complete product collection</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN CONTAINER: SEARCH & FILTERS & PRODUCTS GRID */}
        <div className="container mx-auto px-4 py-8">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by title, category, or brand..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Reset Filters button */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
                >
                  <option value="">Featured / Default</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratingsAverage">Highest Rated</option>
                  <option value="-sold">Best Selling</option>
                  <option value="-createdAt">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-rose-900 mb-1">Error Loading Products</h3>
              <p className="text-xs text-rose-700 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading</span>
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-md mx-auto my-8">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">No Products Match Your Criteria</h3>
              <p className="text-xs text-gray-500 mb-5">
                Try adjusting your filters, searching for a different keyword, or resetting your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Products Grid (matching demo: grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5) */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && metadata.numberOfPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 mb-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(metadata.numberOfPages)].map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(metadata.numberOfPages, p + 1))}
                disabled={currentPage >= metadata.numberOfPages}
                className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. FEATURES BAR */}
      <FeaturesBar />
    </div>
  );
}
