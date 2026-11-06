import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import GuestRoute from './components/common/GuestRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import Brands from './pages/Brands';
import BrandDetails from './pages/BrandDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Search from './pages/Search';

import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ChangePassword from './pages/auth/ChangePassword';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Browsing Routes */}
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="search" element={<Search />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/:id" element={<CategoryDetails />} />
                <Route path="brands" element={<Brands />} />
                <Route path="brands/:id" element={<BrandDetails />} />
                <Route path="contact" element={<Contact />} />
                <Route path="support" element={<Contact />} />
                <Route path="help" element={<Contact />} />
                <Route path="terms" element={<Terms />} />
                <Route path="terms-of-service" element={<Terms />} />
                <Route path="shipping" element={<Terms />} />
                <Route path="returns" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="privacy-policy" element={<Privacy />} />
                <Route path="cookies" element={<Privacy />} />

                {/* Guest-only Routes (Redirect to / if logged in) */}
                <Route
                  path="login"
                  element={
                    <GuestRoute>
                      <Login />
                    </GuestRoute>
                  }
                />
                <Route
                  path="register"
                  element={
                    <GuestRoute>
                      <Register />
                    </GuestRoute>
                  }
                />
                <Route
                  path="forgot-password"
                  element={
                    <GuestRoute>
                      <ForgotPassword />
                    </GuestRoute>
                  }
                />

                {/* Protected Routes (Guests redirected to /login) */}
                <Route
                  path="change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="allorders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
