import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { isValidEmail, isStrongPassword } from '../../utils/validation';
import FeaturesBar from '../../components/common/FeaturesBar';
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Headset,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // STEP 1: Send Reset Code
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!email.trim()) {
      setErrors({ email: 'Email address is required' });
      return;
    }
    if (!isValidEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const data = await authApi.forgotPassword(email.trim());
      if (
        data.statusMsg === 'success' ||
        data.message?.toLowerCase().includes('success') ||
        data.message
      ) {
        toast.success(data.message || 'Reset code sent to your email!');
        setStep(2);
      } else {
        setApiError(data.message || 'Failed to send reset code.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Could not send reset code. Please verify the email address.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: Verify Reset Code
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!resetCode.trim()) {
      setErrors({ resetCode: 'Please enter the 6-digit reset code' });
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const data = await authApi.verifyResetCode(resetCode.trim());
      if (data.status === 'Success' || data.statusMsg === 'success' || data.message) {
        toast.success('Reset code verified successfully!');
        setStep(3);
      } else {
        setApiError(data.message || 'Invalid or expired reset code.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Invalid or expired reset code. Please try again.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 3: Reset Password
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setApiError('');
    const formErrors = {};

    if (!newPassword) {
      formErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      formErrors.newPassword = 'Password must be at least 6 characters';
    } else if (!isStrongPassword(newPassword)) {
      formErrors.newPassword = 'Password must contain uppercase, lowercase, and a number';
    }

    if (!confirmPassword) {
      formErrors.confirmPassword = 'Password confirmation is required';
    } else if (confirmPassword !== newPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const data = await authApi.resetPassword({
        email: email.trim(),
        newPassword,
      });

      if (data.token || data.message) {
        toast.success('Password reset successfully! Please sign in with your new password.');
        navigate('/login', { replace: true });
      } else {
        setApiError('Unable to reset password. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. Please try again.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="container py-12 lg:py-16 mx-auto px-4" id="forgot-password-section">
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
                <div className="flex items-center justify-center space-x-2 text-primary-600">
                  <span className="h-2 w-2 rounded-full bg-primary-600" />
                  <span className="text-sm font-semibold tracking-wide">
                    Account Security & Recovery
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Quick and Safe Password Recovery
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Follow the three simple steps to verify your identity and restore access to your
                  FreshCart account securely.
                </p>
                <div className="flex justify-center gap-6 pt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary-600" />
                    <span>Instant Email OTP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>256-bit Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Headset className="w-4 h-4 text-primary-600" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Password Recovery Card */}
          <div className="w-full max-w-md mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
            {/* Header with FreshCart Logo */}
            <div className="text-center space-y-4 mb-6">
              <Link to="/" className="inline-block">
                <img
                  src="/freshcart-logo.svg"
                  alt="FreshCart"
                  className="h-10 mx-auto object-contain"
                />
              </Link>

              {/* Stepper pills */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                          step === s
                            ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                            : step > s
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                      </div>
                      {s < 3 && (
                        <div
                          className={`h-1 w-16 sm:w-20 mx-1 rounded-full ${
                            step > s ? 'bg-primary-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {step === 1 && 'Reset Password'}
                  {step === 2 && 'Verify Reset Code'}
                  {step === 3 && 'Create New Password'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {step === 1 && 'Enter your email to receive a password reset verification code.'}
                  {step === 2 && `Enter the 6-digit verification code sent to ${email}`}
                  {step === 3 && 'Choose a secure new password for your FreshCart account.'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {apiError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                <span className="font-semibold">Error:</span>
                <span>{apiError}</span>
              </div>
            )}

            {/* STEP 1: Email Form */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({});
                      }}
                      placeholder="name@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 active:scale-[0.99] shadow-md shadow-primary-600/20 transition cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending reset code...</span>
                    </>
                  ) : (
                    <span>Send Reset Code</span>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Code Verification Form */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="reset-code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <input
                      id="reset-code"
                      type="text"
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => {
                        setResetCode(e.target.value);
                        setErrors({});
                      }}
                      placeholder="Enter 6-digit code"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm tracking-widest transition focus:outline-none focus:ring-2 ${
                        errors.resetCode
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.resetCode && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.resetCode}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 active:scale-[0.99] shadow-md shadow-primary-600/20 transition cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying code...</span>
                    </>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-xs text-gray-500 hover:text-gray-800 transition py-1 text-center"
                >
                  Change email address
                </button>
              </form>
            )}

            {/* STEP 3: Create New Password Form */}
            {step === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, newPassword: '' }));
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-11 py-3 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.newPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirm-new-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="confirm-new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-11 py-3 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 active:scale-[0.99] shadow-md shadow-primary-600/20 transition cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <span>Reset Password & Sign In</span>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login link */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Common Interior Features Bar */}
      <FeaturesBar />
    </div>
  );
}
