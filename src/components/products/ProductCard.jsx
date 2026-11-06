import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, RotateCw, Eye, Plus, Check, Loader2, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, actionLoadingId: cartLoadingId } = useCart();
  const { toggleWishlist, isInWishlist, actionLoadingId: wishLoadingId } = useWishlist();

  const [isSuccess, setIsSuccess] = useState(false);

  const productId = product?._id || product?.id;
  const isWishlisted = isInWishlist(productId);
  const isAddingToCart = cartLoadingId === productId;
  const isTogglingWishlist = wishLoadingId === productId;

  const price = product?.price || 0;
  const priceAfterDiscount = product?.priceAfterDiscount;
  const hasDiscount = Boolean(priceAfterDiscount && priceAfterDiscount < price);
  const discountPercent = hasDiscount ? Math.round(((price - priceAfterDiscount) / price) * 100) : 0;

  const ratingsAverage = product?.ratingsAverage ?? 4.5;
  const ratingsQuantity = product?.ratingsQuantity ?? 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAddingToCart || isSuccess) return;

    await addToCart(productId);
    setIsSuccess(true);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setIsSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <div
      id="product-card"
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
    >
      {/* Top Image area & Floating buttons */}
      <div className="relative">
        <Link to={`/products/${productId}`} className="block overflow-hidden">
          <img
            className="w-full h-60 object-contain bg-white p-3 group-hover:scale-105 transition-transform duration-300"
            src={product?.imageCover}
            alt={product?.title || 'Product'}
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold shadow-xs">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Floating Actions on Top Right */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(productId);
            }}
            disabled={isTogglingWishlist}
            className={`bg-white h-8 w-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer ${
              isWishlisted
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-600 hover:text-red-500'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isTogglingWishlist ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-500" />
            ) : (
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isWishlisted ? 'fill-red-500 text-red-500 scale-110' : ''
                }`}
              />
            )}
          </button>

          {/* Rotate/Refresh Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 shadow-sm transition cursor-pointer"
            title="Compare / Rotate"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Quick View / Details Link */}
          <Link
            to={`/products/${productId}`}
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 shadow-sm transition"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1 font-medium">
            {product?.category?.name || 'General'}
          </div>

          <h3 className="font-medium mb-1 cursor-pointer" title={product?.title}>
            <Link
              to={`/products/${productId}`}
              className="line-clamp-2 text-gray-800 hover:text-primary-600 transition"
            >
              {product?.title}
            </Link>
          </h3>
        </div>

        <div className="pt-2">
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-amber-400 mr-2">
              <div className="text-yellow-400 flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(ratingsAverage)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {ratingsAverage} ({ratingsQuantity})
            </span>
          </div>

          {/* Price & Add to Cart button */}
          <div className="flex items-center justify-between pt-1">
            <div>
              {hasDiscount ? (
                <div>
                  <span className="text-lg font-bold text-primary-600">
                    {priceAfterDiscount} EGP
                  </span>
                  <span className="text-sm text-gray-400 line-through ml-2">
                    {price} EGP
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-800">
                  {price} EGP
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition cursor-pointer shadow-sm ${
                isSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              } disabled:opacity-70`}
              title="Add to cart"
            >
              {isAddingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
