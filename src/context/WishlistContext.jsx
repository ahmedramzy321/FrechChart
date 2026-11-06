import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../api/wishlistApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistData, setWishlistData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistCount(0);
      setWishlistIds(new Set());
      setWishlistData([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await wishlistApi.getWishlist();
      if (res.status === 'success') {
        const items = res.data || [];
        setWishlistData(items);
        setWishlistCount(res.count || items.length);
        const ids = new Set(items.map((item) => item._id || item.id));
        setWishlistIds(ids);
      }
    } catch {
      setWishlistCount(0);
      setWishlistIds(new Set());
      setWishlistData([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => wishlistIds.has(productId),
    [wishlistIds]
  );

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast('Please log in first to save items to your wishlist.', { icon: '❤️' });
      return false;
    }
    setActionLoadingId(productId);
    try {
      const res = await wishlistApi.addToWishlist(productId);
      if (res.status === 'success') {
        // API returns array of ids in res.data
        const updatedIds = new Set(res.data || []);
        updatedIds.add(productId);
        setWishlistIds(updatedIds);
        setWishlistCount(updatedIds.size);
        toast.success(res.message || 'Product added to your wishlist!');
        fetchWishlist(); // refresh list
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to wishlist.';
      toast.error(msg);
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return false;
    setActionLoadingId(productId);
    try {
      const res = await wishlistApi.removeFromWishlist(productId);
      if (res.status === 'success') {
        const updatedIds = new Set(res.data || []);
        updatedIds.delete(productId);
        setWishlistIds(updatedIds);
        setWishlistCount(updatedIds.size);
        setWishlistData((prev) => prev.filter((item) => (item._id || item.id) !== productId));
        toast.success(res.message || 'Product removed from wishlist');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove from wishlist.';
      toast.error(msg);
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const value = {
    wishlistCount,
    wishlistIds,
    wishlistData,
    isLoading,
    actionLoadingId,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
