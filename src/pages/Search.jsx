import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import { categoriesApi } from '../api/categoriesApi';
import { brandsApi } from '../api/brandsApi';
import ProductCard from '../components/products/ProductCard';
import FeaturesBar from '../components/common/FeaturesBar';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Search as SearchIcon,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  X,
  Filter,
  Heart,
  ShoppingCart,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || '';
  const initialCategories = searchParams.getAll('category');
  const initialBrands = searchParams.getAll('brand');
  const initialMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const initialMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const initialPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [selectedBrands, setSelectedBrands] = useState(initialBrands);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sortBy, setSortBy] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when URL params change (e.g. from Navbar search)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
    setActiveQuery(q);
    setSelectedCategories(searchParams.getAll('category'));
    setSelectedBrands(searchParams.getAll('brand'));
    setMinPrice(searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined);
    setMaxPrice(searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined);
    setSortBy(searchParams.get('sort') || '');
    setPage(searchParams.get('page') ? Number(searchParams.get('page')) : 1);
  }, [searchParams]);

  // Sync state back to URL
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (activeQuery.trim()) params.set('q', activeQuery.trim());
    if (sortBy) params.set('sort', sortBy);
    selectedCategories.forEach((cat) => params.append('category', cat));
    selectedBrands.forEach((brand) => params.append('brand', brand));
    if (minPrice !== undefined && minPrice !== '') params.set('minPrice', String(minPrice));
    if (maxPrice !== undefined && maxPrice !== '') params.set('maxPrice', String(maxPrice));
    if (page > 1) params.set('page', String(page));

    setSearchParams(params, { replace: true });
  }, [activeQuery, sortBy, selectedCategories, selectedBrands, minPrice, maxPrice, page, setSearchParams]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Load categories & brands
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          categoriesApi.getCategories({ limit: 50 }),
          brandsApi.getBrands({ limit: 50 }),
        ]);
        if (catsRes?.data) setCategories(catsRes.data);
        if (brandsRes?.data) setBrands(brandsRes.data);
      } catch {
        // silent fallback
      }
    };
    loadFiltersData();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const res = await productsApi.getProducts({ limit: 60 });
        if (res?.data) {
          setAllProducts(res.data);
        }
      } catch {
        // silent fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
    setPage(1);
  };

  // Category toggle
  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
    setPage(1);
  };

  // Brand toggle
  const toggleBrand = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
    setPage(1);
  };

  // Reset all filters
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setActiveQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortBy('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    activeQuery ||
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      sortBy
  );

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Text Search Filter (q)
    if (activeQuery.trim()) {
      const q = activeQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q)
      );
    }

    // 2. Categories Filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const catId = p.category?._id || p.category;
        return selectedCategories.includes(catId);
      });
    }

    // 3. Brands Filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => {
        const brandId = p.brand?._id || p.brand;
        return selectedBrands.includes(brandId);
      });
    }

    // 4. Min Price
    if (minPrice !== undefined && minPrice !== '') {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    // 5. Max Price
    if (maxPrice !== undefined && maxPrice !== '') {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // 6. Sorting
    if (sortBy === 'price') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === '-price') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === '-ratingsAverage') {
      result.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === '-title') {
      result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }

    return result;
  }, [allProducts, activeQuery, selectedCategories, selectedBrands, minPrice, maxPrice, sortBy]);

  // Pagination (12 items per page matching demo)
  const itemsPerPage = 12;
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, page]);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* Top Search & Breadcrumb Bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link to="/" className="hover:text-primary-600 transition-colors">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Search Results</span>
            </nav>

            <form onSubmit={handleSearchSubmit} className="max-w-2xl">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-base"
                />
              </div>
            </form>

            {activeQuery && (
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Search Results for &ldquo;{activeQuery}&rdquo;
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  We found {totalItems} products for you
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Search Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Aside Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-xs">
                <FilterContent
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  setPage={setPage}
                  brands={brands}
                  selectedBrands={selectedBrands}
                  toggleBrand={toggleBrand}
                  hasActiveFilters={hasActiveFilters}
                  handleClearAllFilters={handleClearAllFilters}
                />
              </div>
            </aside>

            {/* Mobile Drawer */}
            {mobileFilterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <div
                  className="fixed inset-0 bg-black/50 transition-opacity"
                  onClick={() => setMobileFilterOpen(false)}
                />
                <div className="relative ml-auto w-80 max-w-[85vw] bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                      <h2 className="text-base font-bold text-gray-900">Filter Products</h2>
                      <button
                        onClick={() => setMobileFilterOpen(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <FilterContent
                      categories={categories}
                      selectedCategories={selectedCategories}
                      toggleCategory={toggleCategory}
                      minPrice={minPrice}
                      setMinPrice={setMinPrice}
                      maxPrice={maxPrice}
                      setMaxPrice={setMaxPrice}
                      setPage={setPage}
                      brands={brands}
                      selectedBrands={selectedBrands}
                      toggleBrand={toggleBrand}
                      hasActiveFilters={hasActiveFilters}
                      handleClearAllFilters={handleClearAllFilters}
                    />
                  </div>
                  <div className="pt-6 border-t border-gray-100 mt-6">
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm"
                    >
                      Show {totalItems} Results
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Area */}
            <main className="flex-1 min-w-0">
              {/* Header Action Bar */}
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center gap-3">
                  {/* Mobile Filters Toggle */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-primary-600" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-primary-600" />
                    )}
                  </button>

                  {/* Grid / List View Toggle */}
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200 p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="List View"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs text-gray-500 hidden sm:inline">
                    Showing <strong className="text-gray-800">{paginatedProducts.length}</strong> of{' '}
                    <strong className="text-gray-800">{totalItems}</strong> items
                  </span>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="">Relevance</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-ratingsAverage">Rating: High to Low</option>
                    <option value="title">Name: A to Z</option>
                    <option value="-title">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="mb-6 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Active:</span>
                  </span>

                  {activeQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                      <span>&ldquo;{activeQuery}&rdquo;</span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveQuery('');
                        }}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategories.map((catId) => {
                    const cat = categories.find((c) => c._id === catId);
                    return (
                      <span
                        key={catId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium border border-primary-100"
                      >
                        <span>{cat?.name || 'Category'}</span>
                        <button
                          onClick={() => toggleCategory(catId)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  {selectedBrands.map((brandId) => {
                    const brand = brands.find((b) => b._id === brandId);
                    return (
                      <span
                        key={brandId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium border border-violet-100"
                      >
                        <span>{brand?.name || 'Brand'}</span>
                        <button onClick={() => toggleBrand(brandId)} className="hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  {(minPrice !== undefined || maxPrice !== undefined) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-100">
                      <span>
                        Price: {minPrice || 0} - {maxPrice ? `${maxPrice} EGP` : 'Any'}
                      </span>
                      <button
                        onClick={() => {
                          setMinPrice(undefined);
                          setMaxPrice(undefined);
                        }}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleClearAllFilters}
                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold underline ml-1 cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Product List Content */}
              {isLoading ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Searching products...</p>
                </div>
              ) : paginatedProducts.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {paginatedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paginatedProducts.map((product) => (
                        <SearchProductListItem key={product._id} product={product} />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                            page === pageNum
                              ? 'bg-primary-600 text-white shadow-xs'
                              : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Empty state matching demo */
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center my-6">
                  <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 mx-auto flex items-center justify-center mb-4">
                    <PackageOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Products Found</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                  <button
                    onClick={handleClearAllFilters}
                    className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <FeaturesBar />
    </div>
  );
}

// Dedicated List Row View for list mode
function SearchProductListItem({ product }) {
  const { addToCart, actionLoadingId: cartLoadingId } = useCart();
  const { toggleWishlist, isInWishlist, actionLoadingId: wishLoadingId } = useWishlist();

  const productId = product?._id || product?.id;
  const isWishlisted = isInWishlist(productId);
  const isAdding = cartLoadingId === productId;
  const isWishing = wishLoadingId === productId;

  const price = product?.price || 0;
  const priceAfterDiscount = product?.priceAfterDiscount;
  const hasDiscount = Boolean(priceAfterDiscount && priceAfterDiscount < price);
  const discountPercent = hasDiscount ? Math.round(((price - priceAfterDiscount) / price) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-5">
      {/* Thumbnail */}
      <Link
        to={`/products/${productId}`}
        className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center overflow-hidden"
      >
        <img
          src={product?.imageCover}
          alt={product?.title}
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase text-primary-600 tracking-wider">
            {product?.category?.name || 'Category'}
          </span>
          {discountPercent > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-bold">
              -{discountPercent}%
            </span>
          )}
        </div>

        <Link
          to={`/products/${productId}`}
          className="block font-bold text-gray-900 text-sm sm:text-base hover:text-primary-600 transition-colors line-clamp-1"
        >
          {product?.title}
        </Link>

        <p className="text-xs text-gray-500 line-clamp-2 mt-1 hidden sm:block">
          {product?.description}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-gray-800">
            {product?.ratingsAverage ?? 4.5}
          </span>
          <span className="text-[11px] text-gray-400">
            ({product?.ratingsQuantity ?? 0} reviews)
          </span>
        </div>
      </div>

      {/* Price & Action CTA */}
      <div className="sm:border-l sm:border-gray-100 sm:pl-5 flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
        <div className="text-center sm:text-right">
          <div className="text-lg sm:text-xl font-extrabold text-gray-900">
            {hasDiscount ? priceAfterDiscount : price} EGP
          </div>
          {hasDiscount && (
            <div className="text-xs text-gray-400 line-through">{price} EGP</div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => toggleWishlist(productId)}
            disabled={isWishing}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              isWishlisted
                ? 'border-red-200 bg-red-50 text-red-500'
                : 'border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
          </button>

          <button
            onClick={() => addToCart(productId)}
            disabled={isAdding}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-xs hover:bg-primary-700 active:scale-95 transition cursor-pointer disabled:opacity-75"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Sidebar Filter Component
function FilterContent({
  categories,
  selectedCategories,
  toggleCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  setPage,
  brands,
  selectedBrands,
  toggleBrand,
  hasActiveFilters,
  handleClearAllFilters,
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Categories</h3>
          {selectedCategories.length > 0 && (
            <span className="text-xs text-primary-600 font-semibold">
              {selectedCategories.length} selected
            </span>
          )}
        </div>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <label
              key={cat._id}
              className="flex items-center gap-3 cursor-pointer group py-0.5 select-none"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => toggleCategory(cat._id)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-4">Price Range</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min (EGP)</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice !== undefined ? minPrice : ''}
              onChange={(e) => {
                setMinPrice(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max (EGP)</label>
            <input
              type="number"
              placeholder="No limit"
              value={maxPrice !== undefined ? maxPrice : ''}
              onChange={(e) => {
                setMaxPrice(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        {/* Quick price pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Under 500', max: 500 },
            { label: 'Under 1K', max: 1000 },
            { label: 'Under 5K', max: 5000 },
            { label: 'Under 10K', max: 10000 },
          ].map((pill) => {
            const isActive = maxPrice === pill.max && minPrice === undefined;
            return (
              <button
                key={pill.max}
                type="button"
                onClick={() => {
                  setMinPrice(undefined);
                  setMaxPrice(isActive ? undefined : pill.max);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Brands */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Brands</h3>
          {selectedBrands.length > 0 && (
            <span className="text-xs text-primary-600 font-semibold">
              {selectedBrands.length} selected
            </span>
          )}
        </div>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {brands.slice(0, 15).map((brand) => (
            <label
              key={brand._id}
              className="flex items-center gap-3 cursor-pointer group py-0.5 select-none"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand._id)}
                onChange={() => toggleBrand(brand._id)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear All Filters button */}
      {hasActiveFilters && (
        <>
          <hr className="border-gray-100" />
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </>
      )}
    </div>
  );
}
