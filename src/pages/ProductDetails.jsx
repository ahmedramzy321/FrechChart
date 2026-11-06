import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/products/ProductCard';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, updateQuantity, actionLoadingId: cartLoadingId } = useCart();
  const { toggleWishlist, isInWishlist, actionLoadingId: wishLoadingId } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const productId = product?._id || product?.id;
  const isWishlisted = isInWishlist(productId);
  const isAddingToCart = cartLoadingId === productId;
  const isTogglingWishlist = wishLoadingId === productId;

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await productsApi.getProductById(id);
        if (res.data) {
          const item = res.data;
          setProduct(item);
          setSelectedImage(item.imageCover || item.images?.[0] || '');
          setQuantity(1);

          // Fetch related products in same category
          if (item.category?._id) {
            try {
              const relRes = await productsApi.getProducts({
                'category[in]': item.category._id,
                limit: 6,
              });
              if (relRes.data) {
                setRelatedProducts(relRes.data.filter((p) => p._id !== id));
              }
            } catch {
              // silent
            }
          }
        }
      } catch {
        setError('Could not load product details. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCartWithQuantity = async () => {
    if (!product || isAddingToCart) return;
    const ok = await addToCart(productId);
    if (ok && quantity > 1) {
      await updateQuantity(productId, quantity);
    }
    setIsAddedSuccess(true);
    setTimeout(() => setIsAddedSuccess(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
              <div className="lg:w-1/2">
                <div className="bg-gray-200 rounded-2xl h-96 w-full mb-4" />
                <div className="flex gap-3">
                  <div className="bg-gray-200 rounded-xl h-20 w-20" />
                  <div className="bg-gray-200 rounded-xl h-20 w-20" />
                  <div className="bg-gray-200 rounded-xl h-20 w-20" />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-4">
                <div className="bg-gray-200 h-6 w-28 rounded-full" />
                <div className="bg-gray-200 h-10 w-3/4 rounded-xl" />
                <div className="bg-gray-200 h-5 w-1/3 rounded-md" />
                <div className="bg-gray-200 h-8 w-1/4 rounded-md" />
                <div className="bg-gray-200 h-24 w-full rounded-xl" />
                <div className="bg-gray-200 h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </section>
        <FeaturesBar />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'This product does not exist or has been removed.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const price = product.price || 0;
  const priceAfterDiscount = product.priceAfterDiscount;
  const hasDiscount = Boolean(priceAfterDiscount && priceAfterDiscount < price);
  const discountPercent = hasDiscount ? Math.round(((price - priceAfterDiscount) / price) * 100) : 0;
  const allImages = [product.imageCover, ...(product.images || [])].filter(Boolean);
  const uniqueImages = [...new Set(allImages)];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-100 py-3.5 shadow-2xs">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap">
              <Link to="/" className="hover:text-primary-600 transition">
                Home
              </Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary-600 transition">
                Shop
              </Link>
              {product.category && (
                <>
                  <span>/</span>
                  <Link
                    to={`/categories/${product.category._id}`}
                    className="hover:text-primary-600 transition"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Details Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-10 bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs">
              {/* Left Column: Image Gallery */}
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl border border-gray-100 bg-white p-4 h-[380px] sm:h-[450px] flex items-center justify-center overflow-hidden mb-4">
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain transition-all duration-300"
                  />
                  {discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                      -{discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Thumbnails row */}
                {uniqueImages.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {uniqueImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-20 rounded-xl p-1.5 border-2 transition overflow-hidden bg-white shrink-0 cursor-pointer ${
                          selectedImage === img
                            ? 'border-primary-600 shadow-sm'
                            : 'border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Product Info & Actions */}
              <div className="lg:w-1/2 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.category && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                        {product.category.name}
                      </span>
                    )}
                    {product.brand && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                        {product.brand.name}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>In Stock</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                    {product.title}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(product.ratingsAverage || 4.5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {product.ratingsAverage ?? '4.5'}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({product.ratingsQuantity || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="pt-2 flex items-baseline gap-3">
                    {hasDiscount ? (
                      <>
                        <span className="text-3xl font-extrabold text-primary-600">
                          {priceAfterDiscount} EGP
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          {price} EGP
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-gray-900">
                        {price} EGP
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="pt-2 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 mb-1.5">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions: Quantity + Add to Cart + Wishlist */}
                <div className="pt-6 mt-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center gap-4">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-base font-bold text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={handleAddToCartWithQuantity}
                      disabled={isAddingToCart}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-base transition shadow-lg shadow-primary-600/20 active:scale-[0.98] cursor-pointer ${
                        isAddedSuccess
                          ? 'bg-green-600 text-white'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      {isAddingToCart ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isAddedSuccess ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <span>Add to Cart ({quantity * (priceAfterDiscount || price)} EGP)</span>
                        </>
                      )}
                    </button>

                    {/* Wishlist toggle button */}
                    <button
                      onClick={() => toggleWishlist(productId)}
                      disabled={isTogglingWishlist}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center transition shadow-xs cursor-pointer ${
                        isWishlisted
                          ? 'border-red-200 bg-red-50 text-red-500'
                          : 'border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200'
                      }`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {isTogglingWishlist ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                      )}
                    </button>
                  </div>

                  {/* Guaranteed Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary-600" />
                      <span>Free Shipping over 500 EGP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>100% Authentic Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-blue-500" />
                      <span>14-Day Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Related <span className="text-emerald-600">Products</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {relatedProducts.slice(0, 5).map((rel) => (
                    <ProductCard key={rel._id} product={rel} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Features Bar */}
      <FeaturesBar />
    </div>
  );
}
