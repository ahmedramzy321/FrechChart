import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Skeleton from '../components/common/Skeleton';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  Heart,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Loader2,
  Check,
} from 'lucide-react';

export default function Wishlist() {
  const {
    wishlistData,
    wishlistCount,
    isLoading,
    actionLoadingId: wishLoadingId,
    removeFromWishlist,
    fetchWishlist,
  } = useWishlist();

  const { addToCart, actionLoadingId: cartLoadingId } = useCart();
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    setAddedIds((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* Loading State */}
        {isLoading && (
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <Skeleton className="w-full aspect-square rounded-xl mb-3" />
                  <Skeleton className="w-20 h-3 mb-2" />
                  <Skeleton className="w-3/4 h-5 mb-3" />
                  <Skeleton className="w-full h-10 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State (Matching Demo) */}
        {!isLoading && wishlistData.length === 0 && (
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-sm mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Heart className="w-9 h-9 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Browse products and save your favorites here. Sign in to sync your wishlist across devices.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                >
                  <span>Browse Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Active Wishlist Items */}
        {!isLoading && wishlistData.length > 0 && (
          <div className="container mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  My Wishlist
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  You have <span className="font-semibold text-primary-600">{wishlistCount}</span> {wishlistCount === 1 ? 'item' : 'items'} saved
                </p>
              </div>

              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1.5 transition"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Wishlist Items List */}
            <div className="space-y-4">
              {wishlistData.map((product) => {
                const isAdding = cartLoadingId === product._id;
                const isRemoving = wishLoadingId === product._id;
                const isAdded = addedIds[product._id];

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center gap-4 hover:border-gray-200 transition"
                  >
                    {/* Thumbnail */}
                    <Link
                      to={`/products/${product._id}`}
                      className="w-24 h-24 rounded-xl bg-gray-50 p-2 shrink-0 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={product.imageCover}
                        alt={product.title}
                        className="w-full h-full object-contain hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
                      <Link
                        to={`/products/${product._id}`}
                        className="font-semibold text-gray-900 hover:text-primary-600 transition text-sm sm:text-base line-clamp-1 mb-1 block"
                      >
                        {product.title}
                      </Link>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-base font-bold text-primary-600">
                          {product.priceAfterDiscount || product.price} EGP
                        </span>
                        {product.priceAfterDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.price} EGP
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={isAdding}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer shadow-xs ${
                          isAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                      >
                        {isAdding ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isAdded ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        disabled={isRemoving}
                        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        {isRemoving ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Features Bar */}
      <FeaturesBar />
    </div>
  );
}
