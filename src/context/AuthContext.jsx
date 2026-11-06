import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('freshcart_token') || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to decode token and verify expiration
  const decodeAndVerifyToken = useCallback((rawToken) => {
    if (!rawToken) return null;
    try {
      const decoded = jwtDecode(rawToken);
      // Check expiration if exp field exists
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return null;
      }
      return decoded;
    } catch {
      return null;
    }
  }, []);

  // Logout handler
  const logout = useCallback((notify = false) => {
    localStorage.removeItem('freshcart_token');
    localStorage.removeItem('freshcart_user');
    setToken(null);
    setUser(null);
    if (notify) {
      toast('Your session has expired. Please log in again.', { icon: '🔒' });
    }
  }, []);

  // Login handler
  const login = useCallback(
    (newToken, userData = null) => {
      const decoded = decodeAndVerifyToken(newToken);
      if (!decoded) {
        toast.error('Received an invalid or expired token.');
        return false;
      }
      localStorage.setItem('freshcart_token', newToken);
      setToken(newToken);
      const combinedUser = { ...decoded, ...(userData || {}) };
      setUser(combinedUser);
      localStorage.setItem('freshcart_user', JSON.stringify(combinedUser));
      return true;
    },
    [decodeAndVerifyToken]
  );

  // Update token (e.g. after password change)
  const updateToken = useCallback(
    (newToken) => {
      if (!newToken) return;
      localStorage.setItem('freshcart_token', newToken);
      setToken(newToken);
      const decoded = decodeAndVerifyToken(newToken);
      if (decoded) {
        setUser((prev) => ({ ...prev, ...decoded }));
      }
    },
    [decodeAndVerifyToken]
  );

  // Check token on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem('freshcart_token');
    if (savedToken) {
      const decoded = decodeAndVerifyToken(savedToken);
      if (decoded) {
        const savedUserStr = localStorage.getItem('freshcart_user');
        let savedUser = {};
        if (savedUserStr) {
          try {
            savedUser = JSON.parse(savedUserStr);
          } catch {
            savedUser = {};
          }
        }
        setToken(savedToken);
        setUser({ ...decoded, ...savedUser });
      } else {
        // Expired or invalid
        logout(true);
      }
    }
    setIsLoading(false);
  }, [decodeAndVerifyToken, logout]);

  // Listen for global auth:expired event from axios interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      logout(true);
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [logout]);

  const value = {
    token,
    user,
    isLoading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    updateToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
