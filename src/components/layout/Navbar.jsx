import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productsApi } from '../../api/productsApi';
import {
  Truck,
  Gift,
  Phone,
  Mail,
  User,
  Heart,
  ShoppingCart,
  Search,
  ChevronDown,
  Headset,
  Menu,
  X,
  Package,
  KeyRound,
  LogOut,
  MapPin,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const userMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search autocomplete debounced
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productsApi.getProducts({ limit: 40 });
        if (res?.data) {
          const term = searchQuery.toLowerCase().trim();
          const matches = res.data
            .filter(
              (p) =>
                p.title?.toLowerCase().includes(term) ||
                p.category?.name?.toLowerCase().includes(term) ||
                p.brand?.name?.toLowerCase().includes(term)
            )
            .slice(0, 5);
          setSuggestions(matches);
          setShowSuggestions(true);
        }
      } catch {
        // silent fallback
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileDrawerOpen(false);
    }
  };

  const handleSelectSuggestion = (productId) => {
    setShowSuggestions(false);
    navigate(`/products/${productId}`);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileDrawerOpen(false);
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="hidden lg:block text-sm border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-10">
            {/* Left perks */}
            <div className="flex items-center gap-6 text-gray-500 text-xs">
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-primary-600" />
                <span>Free Shipping on Orders 500 EGP</span>
              </span>
              <span className="flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-primary-600" />
                <span>New Arrivals Daily</span>
              </span>
            </div>

            {/* Right contact & quick auth */}
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-4 text-gray-500">
                <a
                  href="tel:+18001234567"
                  className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                >
                  <Phone className="w-3 h-3 text-primary-600" />
                  <span>+1 (800) 123-4567</span>
                </a>
                <a
                  href="mailto:support@freshcart.com"
                  className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                >
                  <Mail className="w-3 h-3 text-primary-600" />
                  <span>support@freshcart.com</span>
                </a>
              </div>

              <span className="w-px h-4 bg-gray-200" />

              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <span className="text-gray-700 font-medium">
                    Hello, <span className="text-primary-600 font-bold">{user?.name || 'Customer'}</span>
                  </span>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/register"
                      className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-white shadow-xs">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4 lg:gap-8">
            {/* Logo */}
            <Link to="/" className="shrink-0 flex items-center">
              <img
                src="/freshcart-logo.svg"
                alt="FreshCart"
                className="h-7 lg:h-8 w-auto"
              />
            </Link>

            {/* Search Input Bar (Desktop) with Live Autocomplete */}
            <div ref={searchContainerRef} className="hidden lg:flex flex-1 max-w-2xl relative">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="Search for products, brands and more..."
                    className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer"
                    title="Search"
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Product Suggestions
                  </div>
                  <div className="divide-y divide-gray-50">
                    {suggestions.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => handleSelectSuggestion(item._id)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.imageCover}
                            alt=""
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500">
                            <span>{item.category?.name}</span>
                            <span>•</span>
                            <span className="font-bold text-gray-900">{item.price} EGP</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                  <div className="pt-1.5 px-3 border-t border-gray-100 mt-1">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full py-2 text-center text-xs font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition cursor-pointer"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                Shop
              </NavLink>

              {/* Categories Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <Link
                  to="/categories"
                  className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 font-medium transition-colors py-2"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </Link>

                <div
                  className={`absolute top-full left-0 pt-1 transition-all duration-200 z-50 ${
                    categoriesDropdownOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-1'
                  }`}
                >
                  <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-[210px]">
                    <Link
                      to="/categories"
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors font-medium border-b border-gray-50"
                    >
                      All Categories
                    </Link>
                    <Link
                      to="/products?category=6439d58a0049ad0b52b9003f"
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      Electronics
                    </Link>
                    <Link
                      to="/products?category=6439d5b90049ad0b52b90048"
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      Women's Fashion
                    </Link>
                    <Link
                      to="/products?category=6439d2d167d9aa4ca970649f"
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      Men's Fashion
                    </Link>
                    <Link
                      to="/products?category=6439d40367d9aa4ca97064a8"
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      Beauty & Health
                    </Link>
                  </div>
                </div>
              </div>

              <NavLink
                to="/brands"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                Brands
              </NavLink>

              {isAuthenticated && (
                <NavLink
                  to="/allorders"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${
                      isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                    }`
                  }
                >
                  Orders
                </NavLink>
              )}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* 24/7 Support Pill (Desktop) */}
              <Link
                to="/contact"
                className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-85 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <Headset className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-xs">
                  <div className="text-gray-400">Support</div>
                  <div className="font-semibold text-gray-700">24/7 Help</div>
                </div>
              </Link>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group text-gray-600 hover:text-primary-600"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group text-gray-600 hover:text-primary-600"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Account Menu / Auth */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 ml-1"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 mr-1" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/allorders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/checkout"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Saved Addresses</span>
                        </Link>
                        <Link
                          to="/change-password"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>Change Password</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="xl:hidden p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition"
                title="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MOBILE SLIDE-OUT DRAWER */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 xl:hidden transition-opacity duration-300 ${
          mobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileDrawerOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 overflow-y-auto ${
            mobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <img src="/freshcart-logo.svg" alt="FreshCart" className="h-7 w-auto" />
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="p-4">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/brands"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Brands
              </Link>
              {isAuthenticated && (
                <Link
                  to="/allorders"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  My Orders
                </Link>
              )}
            </div>
          </nav>

          <div className="mx-4 border-t border-gray-100" />

          {/* Cart & Wishlist */}
          <div className="p-4 space-y-1">
            <Link
              to="/wishlist"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-medium text-gray-700">Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium text-gray-700">Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary-600 text-white text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="mx-4 border-t border-gray-100" />

          {/* Auth section in drawer */}
          <div className="p-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="font-bold text-gray-800">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block w-full py-3 text-center rounded-xl font-semibold text-sm border border-gray-200 text-gray-800 hover:bg-gray-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block w-full py-3 text-center rounded-xl font-semibold text-sm bg-primary-600 text-white hover:bg-primary-700 transition"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Support Box */}
            <Link
              to="/contact"
              onClick={() => setMobileDrawerOpen(false)}
              className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:bg-primary-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Headset className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-700">Need Help?</div>
                <div className="text-xs text-primary-600 font-medium">Contact Support</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
