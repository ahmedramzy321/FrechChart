import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import Skeleton from '../components/common/Skeleton';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  Package,
  Calendar,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const { fetchCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract user ID from decoded JWT
  const userId = user?.id || user?._id || user?.userId;

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await ordersApi.getUserOrders(userId);
      // Route Misr API returns array directly or inside data
      const orderList = Array.isArray(data) ? data : data?.data || [];
      // Sort newest first
      const sorted = [...orderList].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch {
      setError('Could not retrieve your orders. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
    // Also refresh cart status in case returning from Stripe checkout
    fetchCart();
  }, [fetchOrders, fetchCart]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                My Orders
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              {orders.length > 0
                ? `Showing your ${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`
                : 'Track past purchases, delivery status, and order receipts'}
            </p>
          </div>

          {orders.length > 0 && (
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 transition"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <Skeleton className="w-48 h-6" />
                  <Skeleton className="w-24 h-6" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="w-full h-16 rounded-xl" />
                  <Skeleton className="w-full h-16 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-rose-900 mb-1">Failed to Load Orders</h3>
            <p className="text-xs text-rose-700 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 text-slate-400 mx-auto flex items-center justify-center mb-5 shadow-xs">
              <Package className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
              You haven’t placed any orders yet. Fill your cart with fresh items and place your first order today!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md shadow-primary-600/20 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderId = order.id || order._id;
              const items = order.cartItems || [];
              const isCash = order.paymentMethodType === 'cash';

              return (
                <div
                  key={orderId}
                  className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden hover:shadow-md transition"
                >
                  {/* Header bar */}
                  <div className="p-6 bg-slate-50/60 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                        #{orderId.slice(-6).toUpperCase()}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Payment Method Badge */}
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {isCash ? (
                          <>
                            <Banknote className="w-3.5 h-3.5 text-primary-600" />
                            <span>Cash on Delivery</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                            <span>Paid Online (Stripe)</span>
                          </>
                        )}
                      </span>

                      {/* Paid Status */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isPaid
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.isPaid ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Payment Pending</span>
                          </>
                        )}
                      </span>

                      {/* Delivery Status */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isDelivered
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{order.isDelivered ? 'Delivered' : 'In Transit / Processing'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body info & shipping address */}
                  <div className="p-6 space-y-6">
                    {/* Shipping Address info */}
                    {order.shippingAddress && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">Delivering to: </span>
                            <span>
                              {order.shippingAddress.details}, {order.shippingAddress.city}
                            </span>
                          </div>
                        </div>

                        {order.shippingAddress.phone && (
                          <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{order.shippingAddress.phone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Ordered items list */}
                    <div className="divide-y divide-slate-100">
                      {items.map((item) => {
                        const prod = item.product;
                        const prodId = prod?._id || prod?.id;
                        const lineTotal = item.price * item.count;

                        return (
                          <div
                            key={item._id}
                            className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                                <img
                                  src={prod?.imageCover}
                                  alt={prod?.title}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <Link
                                  to={`/products/${prodId}`}
                                  className="text-sm font-semibold text-slate-800 hover:text-primary-600 transition truncate block"
                                >
                                  {prod?.title || 'Ordered Item'}
                                </Link>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Quantity: <span className="font-bold text-slate-700">{item.count}</span> × {item.price} EGP
                                </p>
                              </div>
                            </div>

                            <span className="text-sm font-bold text-slate-900 shrink-0">
                              {lineTotal} EGP
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Total Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Total items: <span className="font-semibold text-slate-700">{items.length}</span>
                      </span>

                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-500">Total Paid:</span>
                        <span className="text-xl font-extrabold text-primary-700">
                          {order.totalOrderPrice} EGP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Common Interior Features Bar */}
      <FeaturesBar />
    </div>
  );
}
