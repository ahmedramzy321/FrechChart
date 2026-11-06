import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { validateLogin } from '../../utils/validation';
import FeaturesBar from '../../components/common/FeaturesBar';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Truck,
  ShieldCheck,
  Headset,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError('');
    if (touched[name]) {
      const currentErrors = validateLogin({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validateLogin(formData);
    setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const data = await authApi.signIn({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (data.message === 'success' || data.token) {
        toast.success(`Welcome back, ${data.user?.name || 'Shopper'}!`);
        login(data.token, data.user);
        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath, { replace: true });
      } else {
        setApiError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.msg ||
        'Invalid email or password. Please try again.';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="container py-12 lg:py-16 mx-auto px-4" id="login-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column: Visual Brand Illustration (Matching Demo) */}
          <div className="hidden lg:block">
            <div className="text-center space-y-6">
              <img
                className="w-full h-96 object-cover rounded-2xl shadow-lg border border-gray-100"
                src="/auth-hero.png"
                alt="FreshCart illustration"
              />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  FreshCart - Your One-Stop Shop for Fresh Products
                </h2>
                <p className="text-base text-gray-600 max-w-lg mx-auto">
                  Join thousands of happy customers who trust FreshCart for their daily grocery and lifestyle needs
                </p>
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary-600" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Headset className="w-4 h-4 text-primary-600" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="w-full max-w-lg mx-auto lg:max-w-none">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-3xl font-black text-primary-600 tracking-tight">
                    Fresh<span className="text-gray-800">Cart</span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h1>
                <p className="text-sm text-gray-500">Sign in to continue your fresh shopping experience</p>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() => toast('Google Sign-In demo mode')}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer text-sm font-medium text-gray-700"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast('Facebook Sign-In demo mode')}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer text-sm font-medium text-gray-700"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-gray-400 font-semibold uppercase tracking-wider">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {apiError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                    {apiError}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl text-sm transition focus:outline-none ${
                        touched.email && errors.email
                          ? 'border-red-300 focus:border-red-500 bg-red-50/20'
                          : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                      }`}
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition"
                    >
                      Verify via Gmail code / Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-11 py-3 border-2 rounded-xl text-sm transition focus:outline-none ${
                        touched.password && errors.password
                          ? 'border-red-300 focus:border-red-500 bg-red-50/20'
                          : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                      }`}
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 transition shadow-lg shadow-primary-600/25 active:scale-[0.98] cursor-pointer disabled:opacity-70 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign up prompt */}
              <div className="text-center mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-primary-600 hover:text-primary-700 transition"
                  >
                    Sign Up Now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturesBar />
    </div>
  );
}
