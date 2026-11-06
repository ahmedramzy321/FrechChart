import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { validateChangePassword } from '../../utils/validation';
import FeaturesBar from '../../components/common/FeaturesBar';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const { updateToken } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    password: '',
    rePassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError('');
    setSuccessMessage('');
    if (touched[name]) {
      const currentErrors = validateChangePassword({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validateChangePassword(formData);
    setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateChangePassword(formData);
    setErrors(validationErrors);
    setTouched({
      currentPassword: true,
      password: true,
      rePassword: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const data = await authApi.changePassword({
        currentPassword: formData.currentPassword,
        password: formData.password,
        rePassword: formData.rePassword,
      });

      if (data.message === 'success' || data.token) {
        toast.success('Your password has been changed successfully!');
        setSuccessMessage('Your password has been updated securely.');
        if (data.token) {
          updateToken(data.token);
        }
        setFormData({ currentPassword: '', password: '', rePassword: '' });
        setTouched({});
      } else {
        setApiError(data.message || 'Failed to update password.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.msg ||
        'Current password may be incorrect or request failed.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-10">
          {/* Header */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-slate-100 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Change Password
              </h1>
              <p className="text-sm text-slate-500">
                Update your account password to keep your FreshCart account secure
              </p>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-primary-50 border border-primary-200 text-primary-800 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
              <span className="font-semibold">Error:</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter current password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    touched.currentPassword && errors.currentPassword
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                />
              </div>
              {touched.currentPassword && errors.currentPassword && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    touched.password && errors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="rePassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="rePassword"
                  name="rePassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.rePassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Repeat new password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    touched.rePassword && errors.rePassword
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                />
              </div>
              {touched.rePassword && errors.rePassword && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.rePassword}</p>
              )}
            </div>

            {/* Security note */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
              <span>
                Passwords must contain lowercase, uppercase, and numeric characters.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 active:scale-[0.99] shadow-md shadow-primary-600/20 transition cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Common Interior Features Bar */}
      <FeaturesBar />
    </div>
  );
}
