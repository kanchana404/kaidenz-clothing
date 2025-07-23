'use client';

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/check-session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (response.ok && data.hasUser) {
        setIsAuthenticated(true);
        await fetchCartCount();
      } else {
        setIsAuthenticated(false);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setCartCount(0);
    }
  };

  const fetchCartCount = async () => {
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
        setCartCount(data.cartCount || 0);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  const refreshCartItems = async () => {
    try {
      const response = await fetch('/api/get-cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (response.ok && data.success && data.cartData) {
        return data.cartData.items || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  };

  const addToCart = async (productId: number, quantity: number = 1, colorId: number = 1) => {
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
        // Refresh cart count and items after adding item
        await fetchCartCount();
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Failed to add to cart' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Network error' };
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated, 
    cartCount,
    checkAuth, 
    addToCart,
    fetchCartCount,
    refreshCartItems
  };
} 