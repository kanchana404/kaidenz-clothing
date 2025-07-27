'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    basePrice: number;
    imageUrls: string[];
  };
  color: {
    id: number;
    name: string;
  };
  qty: number;
}

interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  cartTotalPrice: number;
  isLoading: boolean;
  isUpdating: boolean;
  fetchCartData: () => Promise<void>;
  addToCart: (productId: number, quantity?: number, colorId?: number) => Promise<{ success: boolean; error?: string }>;
  updateCartItem: (itemId: number, quantity: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (itemId: number) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCartData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        const items = data.cartData?.items || [];
        setCartItems(items);
        setCartCount(data.cartCount || 0);
        
        // Calculate total price
        const total = items.reduce((sum: number, item: CartItem) => {
          return sum + (item.product.basePrice * item.qty);
        }, 0);
        setCartTotalPrice(total);
      } else {
        setCartItems([]);
        setCartCount(0);
        setCartTotalPrice(0);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setCartItems([]);
      setCartCount(0);
      setCartTotalPrice(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId: number, quantity: number = 1, colorId: number = 1) => {
    try {
      const response = await fetch('/api/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          quantity,
          colorId
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Since the API doesn't return cart data, we need to refresh to get the updated cart
        await fetchCartData();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to add to cart' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Network error' };
    }
  }, [fetchCartData]);

  const updateCartItem = useCallback(async (itemId: number, quantity: number) => {
    setIsUpdating(true);
    try {
      // Optimistically update the cart state
      setCartItems(prevItems => {
        const updatedItems = prevItems.map(item => 
          item.id === itemId ? { ...item, qty: quantity } : item
        );
        
        // Update cart count and total price
        const newCount = updatedItems.reduce((sum, item) => sum + item.qty, 0);
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.basePrice * item.qty), 0);
        
        setCartCount(newCount);
        setCartTotalPrice(newTotal);
        
        return updatedItems;
      });

      const response = await fetch('/api/update-cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cartItemId: itemId,
          quantity: quantity
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Keep the optimistic update since the operation succeeded
        return { success: true };
      } else {
        // Revert optimistic update on failure
        await fetchCartData();
        return { success: false, error: data.error || 'Failed to update cart' };
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      // Revert optimistic update on error
      await fetchCartData();
      return { success: false, error: 'Network error' };
    } finally {
      setIsUpdating(false);
    }
  }, [fetchCartData]);

  const removeFromCart = useCallback(async (itemId: number) => {
    setIsUpdating(true);
    try {
      // Optimistically remove the item
      setCartItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.id !== itemId);
        const newCount = updatedItems.reduce((sum, item) => sum + item.qty, 0);
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.basePrice * item.qty), 0);
        
        setCartCount(newCount);
        setCartTotalPrice(newTotal);
        
        return updatedItems;
      });

      const response = await fetch('/api/delete-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cartItemId: itemId
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Keep the optimistic update since the operation succeeded
        return { success: true };
      } else {
        // Revert optimistic update on failure
        await fetchCartData();
        return { success: false, error: data.error || 'Failed to remove from cart' };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Revert optimistic update on error
      await fetchCartData();
      return { success: false, error: 'Network error' };
    } finally {
      setIsUpdating(false);
    }
  }, [fetchCartData]);

  const clearCart = useCallback(async () => {
    try {
      const response = await fetch('/api/clear-cart-after-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setCartItems([]);
        setCartCount(0);
        setCartTotalPrice(0);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to clear cart' };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  // Check authentication and fetch cart data on mount only
  useEffect(() => {
    const checkAuthAndFetchCart = async () => {
      try {
        const authResponse = await fetch('/api/check-session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const authData = await authResponse.json();
        
        if (authResponse.ok && authData.hasUser) {
          await fetchCartData();
        } else {
          setCartItems([]);
          setCartCount(0);
          setCartTotalPrice(0);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setCartItems([]);
        setCartCount(0);
        setCartTotalPrice(0);
      }
    };

    checkAuthAndFetchCart();
  }, [fetchCartData]);

  const value: CartContextType = {
    cartCount,
    cartItems,
    cartTotalPrice,
    isLoading,
    isUpdating,
    fetchCartData,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 