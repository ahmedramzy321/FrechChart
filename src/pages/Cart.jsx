import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Skeleton from '../components/common/Skeleton';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  PackageOpen,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Loader2,
  Lock,
} from 'lucide-react';

export default function Cart() {
  const {
    cartData,
    cartCount,
    isLoading,
    actionLoadingId,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      setIsClearing(true);
      await clearCart();
      setIsClearing(false);
    }
  };

  const handleDecreaseQuantity = async (productId, currentCount) => {
    if (currentCount <= 1) {
      if (window.confirm('Do you want to remove this item from your cart?')) {
        await removeItem(productId);
      }
      return;
    }
    await updateQuantity(productId, currentCount - 1);
  };

  const handleIncreaseQuantity = async (productId, currentCount) => {
    await updateQuantity(productId, currentCount + 1);
  };

  const items = cartData?.products || [];
  const totalPrice = cartData?.totalCartPrice || 0;
  const freeShippingThreshold = 500;
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const amountNeeded = Math.max(0, freeShippingThreshold - totalPrice);
  const progressPercent = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100));

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* Loading State */}
        {isLoading && (
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-3/4 h-5" />
                      <Skeleton className="w-1/4 h-4" />
                      <Skeleton className="w-1/3 h-6" />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Skeleton className="w-full h-80 rounded-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Empty State (Matching Demo) */}
        {!isLoading && items.length === 0 && (
          <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto shadow-inner">
                  <PackageOpen className="w-16 h-16 text-gray-300" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                Looks like you haven't added anything to your cart yet.
                <br />
                Start exploring our fresh products!
              </p>

              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 px-8 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98] cursor-pointer"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Active Cart with Items */}
        {!isLoading && items.length > 0 && (
          <div className="container mx-auto px-4 py-8">
            {/* Cart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  You have <span className="font-semibold text-primary-600">{cartCount}</span> {cartCount === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>

              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                {isClearing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Clear Cart</span>
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 shadow-xs">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                <span className="flex items-center gap-2 text-gray-700">
                  <Truck className="w-4 h-4 text-primary-600" />
                  {isFreeShipping ? (
                    <span className="text-primary-600 font-bold">
                      🎉 You unlocked FREE Shipping!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-primary-600">{amountNeeded} EGP</strong> more for <strong className="text-gray-900">FREE shipping</strong>
                    </span>
                  )}
                </span>
                <span className="text-gray-500 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Main Content: Products List + Order Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Products List (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const product = typeof item.product === 'object' && item.product ? item.product : {};
                  const productId =
                    (typeof item.product === 'object' && item.product
                      ? item.product._id || item.product.id
                      : item.product) || item._id;
                  const itemLoading = actionLoadingId === productId;

                  return (
                    <div
                      key={item._id || productId}
                      className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center gap-4 transition hover:border-gray-200"
                    >
                      {/* Image */}
                      <Link
                        to={`/products/${productId}`}
                        className="w-24 h-24 rounded-xl bg-gray-50 p-2 shrink-0 flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={product?.imageCover || '/placeholder.png'}
                          alt={product?.title || 'Product'}
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        {product?.category?.name && (
                          <p className="text-xs text-gray-400 mb-1">{product.category.name}</p>
                        )}
                        <Link
                          to={`/products/${productId}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 transition text-sm sm:text-base line-clamp-1 mb-1 block"
                        >
                          {product?.title || 'Cart Item'}
                        </Link>
                        <p className="text-sm font-bold text-primary-600">
                          {item.price} EGP
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                          <button
                            onClick={() => handleDecreaseQuantity(productId, item.count)}
                            disabled={itemLoading}
                            className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-gray-800">
                            {itemLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-primary-600" />
                            ) : (
                              item.count
                            )}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(productId, item.count)}
                            disabled={itemLoading}
                            className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove item button */}
                        <button
                          onClick={() => removeItem(productId)}
                          disabled={itemLoading}
                          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary (1 col) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                  {/* Summary Header */}
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-5 text-white">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      <span>Order Summary</span>
                    </h2>
                    <p className="text-primary-100 text-xs mt-1">
                      {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">{totalPrice} EGP</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      {isFreeShipping ? (
                        <span className="font-bold text-primary-600">FREE</span>
                      ) : (
                        <span className="font-semibold text-gray-900">50 EGP</span>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                      <span className="text-base font-bold text-gray-900">Total Price</span>
                      <span className="text-2xl font-extrabold text-primary-600">
                        {totalPrice + (isFreeShipping ? 0 : 50)} EGP
                      </span>
                    </div>

                    <Link
                      to="/checkout"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 transition shadow-lg shadow-primary-600/25 active:scale-[0.98] cursor-pointer mt-4"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Secure Checkout</span>
                    </Link>

                    {/* Guarantees */}
                    <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-primary-600" />
                        <span>Fast Delivery</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 justify-center pt-1">
                        <RotateCcw className="w-4 h-4 text-blue-500" />
                        <span>14-Day Easy Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Bar */}
      <FeaturesBar />
    </div>
  );
}
