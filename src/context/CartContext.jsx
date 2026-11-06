import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartData, setCartData] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null); // for per-product spinners

  // Fetch cart details
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      setCartData(null);
      setCartId(null);
      return;
    }
    try {
      setIsLoading(true);
      const res = await cartApi.getCart();
      if (res.status === 'success') {
        setCartCount(res.numOfCartItems || 0);
        setCartData(res.data);
        setCartId(res.cartId || res.data?._id || null);
      }
    } catch (err) {
      // 404 or empty cart from API
      if (err.response?.status === 404) {
        setCartCount(0);
        setCartData(null);
        setCartId(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add to cart with feedback
  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      toast('Please log in first to add items to your cart.', { icon: '🛒' });
      return false;
    }
    setActionLoadingId(productId);
    try {
      const res = await cartApi.addToCart(productId);
      if (res.status === 'success') {
        setCartCount(res.numOfCartItems);
        setCartId(res.cartId || res.data?._id || cartId);
        // Refresh fully populated cart from server
        await fetchCart();
        toast.success(res.message || 'Product added to your cart successfully!');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add product to cart.';
      toast.error(msg);
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, count) => {
    if (!productId || count < 1) return false;
    setActionLoadingId(productId);
    try {
      const res = await cartApi.updateQuantity(productId, count);
      if (res.status === 'success') {
        setCartCount(res.numOfCartItems || 0);
        // Optimistically update count in local state
        setCartData((prev) => {
          if (!prev) return null;
          const updatedProducts = (prev.products || []).map((item) => {
            const pId =
              typeof item.product === 'object' && item.product
                ? item.product._id || item.product.id
                : item.product;
            if (pId === productId || item._id === productId) {
              return { ...item, count };
            }
            return item;
          });
          return {
            ...prev,
            products: updatedProducts,
            totalCartPrice: res.data?.totalCartPrice ?? prev.totalCartPrice,
          };
        });
        // Sync full populated cart in background
        fetchCart();
        toast.success('Quantity updated');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update item quantity.';
      toast.error(msg);
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  // Remove single item
  const removeItem = async (productId) => {
    if (!productId) return false;
    setActionLoadingId(productId);
    try {
      const res = await cartApi.removeItem(productId);
      if (res.status === 'success') {
        setCartCount(res.numOfCartItems || 0);
        // Optimistically remove from state immediately
        setCartData((prev) => {
          if (!prev) return null;
          const updatedProducts = (prev.products || []).filter((item) => {
            const pId =
              typeof item.product === 'object' && item.product
                ? item.product._id || item.product.id
                : item.product;
            return pId !== productId && item._id !== productId;
          });
          return {
            ...prev,
            products: updatedProducts,
            totalCartPrice: res.data?.totalCartPrice ?? prev.totalCartPrice,
          };
        });
        // Sync full populated cart in background
        fetchCart();
        toast.success('Product removed from cart');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item.';
      toast.error(msg);
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setIsLoading(true);
    try {
      const res = await cartApi.clearCart();
      if (res.message === 'success' || res.status === 'success') {
        setCartCount(0);
        setCartData(null);
        toast.success('Cart cleared');
        return true;
      }
      return false;
    } catch {
      toast.error('Failed to clear cart.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartCount,
    cartData,
    cartId,
    isLoading,
    actionLoadingId,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
