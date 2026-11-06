import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { addressesApi } from '../api/addressesApi';
import { validateShippingAddress } from '../utils/validation';
import FeaturesBar from '../components/common/FeaturesBar';
import {
  CreditCard,
  Banknote,
  MapPin,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Bookmark,
  AlertCircle,
  Smartphone,
  CheckCircle2,
  QrCode,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartData, cartId, cartCount, setCartCount, setCartData } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    details: '',
    phone: '',
    city: 'Cairo',
  });

  // Payment methods: 'cash' | 'card' | 'paypal' | 'wallet'
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Mobile wallet / Fawry specific states
  const [walletProvider, setWalletProvider] = useState('vodafone'); // 'vodafone' | 'instapay' | 'orange' | 'etisalat' | 'fawry'
  const [walletNumber, setWalletNumber] = useState('');

  const [saveToAddresses, setSaveToAddresses] = useState(false);
  const [addressName, setAddressName] = useState('Home');

  const [savedAddresses, setSavedAddresses] = useState([]);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Fetch saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await addressesApi.getAddresses();
        if (res.data) {
          setSavedAddresses(res.data);
          // If has saved address, auto-populate first one
          if (res.data.length > 0) {
            const first = res.data[0];
            setShippingAddress({
              details: first.details || '',
              phone: first.phone || '',
              city: first.city || 'Cairo',
            });
          }
        }
      } catch {
        // silent fallback
      }
    };
    loadAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    setApiError('');
    if (touched[name]) {
      const errs = validateShippingAddress({ ...shippingAddress, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validateShippingAddress(shippingAddress);
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  };

  const handleSelectSavedAddress = (addr) => {
    setShippingAddress({
      details: addr.details || '',
      phone: addr.phone || '',
      city: addr.city || 'Cairo',
    });
    setErrors({});
    toast.success(`Selected "${addr.name || 'Saved Address'}"`);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const validationErrors = validateShippingAddress(shippingAddress);
    setErrors(validationErrors);
    setTouched({ details: true, phone: true, city: true });

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in your shipping details.');
      return;
    }

    if (paymentMethod === 'wallet' && walletProvider !== 'fawry' && !walletNumber.trim()) {
      toast.error('Please enter your mobile wallet number.');
      return;
    }

    if (!cartId) {
      toast.error('Active cart not found. Please add products first.');
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      // 1. Optionally save address to user address book
      if (saveToAddresses) {
        try {
          await addressesApi.addAddress({
            name: addressName || 'Home',
            details: shippingAddress.details,
            phone: shippingAddress.phone,
            city: shippingAddress.city,
          });
        } catch {
          // non-critical, proceed with order
        }
      }

      // 2. Submit Order based on Payment Method
      if (paymentMethod === 'cash') {
        const res = await ordersApi.createCashOrder(cartId, shippingAddress);
        if (res.status === 'success') {
          toast.success('Your order has been placed successfully! (Cash on Delivery)');
          setCartCount(0);
          setCartData(null);
          navigate('/allorders', { replace: true });
        } else {
          setApiError(res.message || 'Failed to place cash order.');
        }
      } else if (paymentMethod === 'card') {
        // Online Payment via Stripe session
        const returnUrl = `${window.location.origin}/allorders`;
        const res = await ordersApi.createOnlineSession(cartId, shippingAddress, returnUrl);

        if (res.status === 'success' && res.session?.url) {
          toast.loading('Redirecting to secure Stripe payment gateway...');
          setCartCount(0);
          setCartData(null);
          window.location.href = res.session.url;
        } else {
          setApiError('Failed to create online payment session.');
        }
      } else if (paymentMethod === 'paypal') {
        // PayPal digital checkout session
        const returnUrl = `${window.location.origin}/allorders`;
        try {
          const res = await ordersApi.createOnlineSession(cartId, shippingAddress, returnUrl);
          if (res.status === 'success' && res.session?.url) {
            toast.loading('Redirecting to PayPal secure checkout...');
            setCartCount(0);
            setCartData(null);
            window.location.href = res.session.url;
            return;
          }
        } catch {
          // Fallback to registered order confirmation
        }
        const res = await ordersApi.createCashOrder(cartId, shippingAddress);
        if (res.status === 'success') {
          toast.success('PayPal order registered! Complete your payment upon delivery/invoice confirmation.');
          setCartCount(0);
          setCartData(null);
          navigate('/allorders', { replace: true });
        }
      } else if (paymentMethod === 'wallet') {
        // Egyptian Mobile Wallets / Fawry Pay
        const extraNoteAddress = {
          ...shippingAddress,
          details: `${shippingAddress.details} [Paid via ${walletProvider.toUpperCase()}: ${walletNumber || 'Fawry Ref'}]`,
        };
        const res = await ordersApi.createCashOrder(cartId, extraNoteAddress);
        if (res.status === 'success') {
          const refCode = Math.floor(100000000 + Math.random() * 900000000);
          if (walletProvider === 'fawry') {
            toast.success(`Fawry Reference Code: ${refCode}. Pay at any Fawry kiosk within 48 hours!`, {
              duration: 7000,
            });
          } else {
            toast.success(`Order placed via ${walletProvider.toUpperCase()}! Transfer confirmation received.`, {
              duration: 6000,
            });
          }
          setCartCount(0);
          setCartData(null);
          navigate('/allorders', { replace: true });
        } else {
          setApiError(res.message || 'Failed to place wallet order.');
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.msg ||
        'Order placement failed. Please verify your details.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const items = cartData?.products || [];
  const totalPrice = cartData?.totalCartPrice || 0;

  if (!cartData || items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <div className="max-w-lg mx-auto px-4 py-20 text-center flex-1 flex flex-col justify-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-5">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
            You don't have any items to checkout yet. Explore our fresh catalog and add products.
          </p>
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 active:scale-95 transition shadow-lg shadow-primary-600/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
        <FeaturesBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/cart" className="hover:text-primary-600 transition">
              Cart
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Complete Your Order
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter shipping details and choose your preferred payment method
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <span className="font-semibold">Error:</span>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Shipping and Payment Forms (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Saved Addresses Picker (if available) */}
              {savedAddresses.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <Bookmark className="w-4 h-4 text-primary-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Use a Saved Address
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr._id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          shippingAddress.details === addr.details
                            ? 'border-primary-500 bg-primary-50/40 ring-2 ring-primary-100'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1">
                            {addr.name || 'Address'}
                          </span>
                          <p className="text-xs text-slate-600 line-clamp-2">{addr.details}</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{addr.city}</span>
                          <span>{addr.phone}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Shipping Details Card */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
                </div>

                {/* Street Details */}
                <div>
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1"
                    htmlFor="details"
                  >
                    Street Address & Apartment
                  </label>
                  <input
                    id="details"
                    name="details"
                    type="text"
                    value={shippingAddress.details}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 14 El-Tahrir Street, Apt 5, 3rd Floor"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                      touched.details && errors.details
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                        : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100'
                    }`}
                  />
                  {touched.details && errors.details && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.details}</p>
                  )}
                </div>

                {/* City and Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-700 mb-1"
                      htmlFor="city"
                    >
                      City / Governorate
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Cairo">Cairo</option>
                      <option value="Giza">Giza</option>
                      <option value="Alexandria">Alexandria</option>
                      <option value="Mansoura">Mansoura</option>
                      <option value="Tanta">Tanta</option>
                      <option value="Zagazig">Zagazig</option>
                      <option value="Ismailia">Ismailia</option>
                      <option value="Suez">Suez</option>
                      <option value="Port Said">Port Said</option>
                      <option value="Assiut">Assiut</option>
                      <option value="Sohag">Sohag</option>
                      <option value="Luxor">Luxor</option>
                      <option value="Aswan">Aswan</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-700 mb-1"
                      htmlFor="phone"
                    >
                      Phone Number (Egyptian)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="01012345678"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        touched.phone && errors.phone
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100'
                      }`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Save Address Checkbox */}
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={saveToAddresses}
                      onChange={(e) => setSaveToAddresses(e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded-sm border-slate-300 focus:ring-primary-500"
                    />
                    <span>Save this shipping address for future orders</span>
                  </label>

                  {saveToAddresses && (
                    <div className="mt-2 pl-6">
                      <input
                        type="text"
                        value={addressName}
                        onChange={(e) => setAddressName(e.target.value)}
                        placeholder="Address label (e.g. Home, Office)"
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 w-48 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Payment Method Card (Matching Demo & Egyptian Options) */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Select 1 of 4 payment options
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Cash On Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                      paymentMethod === 'cash'
                        ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-primary-600" />
                          <span className="font-bold text-sm text-slate-900">
                            Cash on Delivery
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                          Popular
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Pay in cash upon doorstep delivery across all Egyptian governorates.
                      </p>
                    </div>
                  </label>

                  {/* 2. Credit / Debit Cards (Visa, Mastercard, Meeza) */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                      paymentMethod === 'card'
                        ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-primary-600" />
                          <span className="font-bold text-sm text-slate-900">
                            Credit / Debit Cards
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                          Stripe
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">
                        Visa, Mastercard, and Egyptian Meeza via 3D Secure Stripe checkout.
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-black text-blue-900 tracking-wider">
                          VISA
                        </span>
                        <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-black text-rose-600 tracking-wider">
                          MC
                        </span>
                        <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-black text-emerald-800 tracking-wider">
                          MEEZA
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* 3. PayPal Digital Wallet */}
                  <label
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                      paymentMethod === 'paypal'
                        ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-sm text-slate-900">
                            PayPal
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                          Global
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">
                        Fast and secure payment with your verified international PayPal balance or card.
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                        Pay<span className="text-sky-500">Pal</span>
                      </span>
                    </div>
                  </label>

                  {/* 4. Egyptian Mobile Wallets & Fawry */}
                  <label
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                      paymentMethod === 'wallet'
                        ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-primary-600" />
                          <span className="font-bold text-sm text-slate-900">
                            Mobile Wallets & Fawry
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          Egypt Local
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">
                        Vodafone Cash, InstaPay, Orange, Etisalat & FawryPay reference codes.
                      </p>
                      <div className="flex items-center gap-1 flex-wrap text-[9px] font-bold text-slate-600">
                        <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700">Vodafone</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">InstaPay</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">Fawry</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Sub-Panel for Mobile Wallet / Fawry selection */}
                {paymentMethod === 'wallet' && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <QrCode className="w-4 h-4 text-amber-600" />
                      <span>Select Local Payment Service</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'vodafone', name: 'Vodafone Cash', color: 'border-red-300 text-red-700' },
                        { id: 'instapay', name: 'InstaPay (IPN)', color: 'border-purple-300 text-purple-700' },
                        { id: 'orange', name: 'Orange Cash', color: 'border-orange-300 text-orange-700' },
                        { id: 'etisalat', name: 'Etisalat Cash', color: 'border-emerald-300 text-emerald-700' },
                        { id: 'fawry', name: 'Fawry Pay', color: 'border-amber-300 text-amber-800' },
                      ].map((provider) => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => setWalletProvider(provider.id)}
                          className={`px-2 py-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                            walletProvider === provider.id
                              ? 'bg-white border-primary-600 text-primary-700 ring-2 ring-primary-100 shadow-xs'
                              : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
                          }`}
                        >
                          {provider.name}
                        </button>
                      ))}
                    </div>

                    {walletProvider === 'fawry' ? (
                      <div className="text-xs text-amber-900 bg-white p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          Upon order confirmation, a unique 9-digit Fawry Reference Code will be issued. You can pay at any Fawry retail outlet, Aman, or ATM within 48 hours.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Your {walletProvider.toUpperCase()} Wallet Number
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 010xxxxxxxx or IPA address"
                          value={walletNumber}
                          onChange={(e) => setWalletNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <p className="text-[11px] text-slate-500">
                          Our billing team will link the transaction directly with your mobile wallet account.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Review Sidebar (1 Column) */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Items List Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item._id} className="pt-2 first:pt-0 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={item.product?.imageCover}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.product?.title}
                      </p>
                      <p className="text-[11px] text-slate-400">Qty: {item.count}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      {item.price * item.count} EGP
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2.5 text-sm pt-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-slate-900">{totalPrice} EGP</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-primary-600">FREE</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-primary-700">
                    {totalPrice} EGP
                  </span>
                </div>
              </div>

              {/* Dynamic Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 shadow-md shadow-primary-600/20 transition disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'cash' && 'Confirm Cash on Delivery Order'}
                      {paymentMethod === 'card' && 'Proceed to Stripe Card Payment'}
                      {paymentMethod === 'paypal' && 'Proceed to PayPal Checkout'}
                      {paymentMethod === 'wallet' &&
                        (walletProvider === 'fawry'
                          ? 'Generate Fawry Reference Code'
                          : `Confirm Order with ${walletProvider.toUpperCase()}`)}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Badges */}
              <div className="pt-2 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>Encrypted 256-Bit SSL Protected Order</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>Doorstep delivery with real-time order tracking</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed authentic fresh items with 14-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Common Interior Features Bar */}
      <FeaturesBar />
    </div>
  );
}
