'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    basePrice: number;
    imageUrls: string[];
    description?: string;
    qty?: number;
    category?: string;
  };
  user: {
    id: number;
  };
}

interface WishlistContextType {
  wishlistCount: number;
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  fetchWishlistData: () => Promise<void>;
  addToWishlist: (productId: number) => Promise<{ success: boolean; error?: string }>;
  removeFromWishlist: (wishlistItemId: number) => Promise<{ success: boolean; error?: string }>;
  isProductInWishlist: (productId: number) => boolean;
  getWishlistItemId: (productId: number) => number | null;
  clearWishlistData: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlistData = useCallback(async () => {
    console.log('WishlistContext: fetchWishlistData called');
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('WishlistContext: API response status:', response.status);
      const data = await response.json();
      console.log('WishlistContext: API response data:', data);
      
      if (response.ok && data.success) {
        setWishlistItems(data.wishlistItems || []);
        setWishlistCount(data.count || 0);
        console.log('WishlistContext: Set wishlist items:', data.wishlistItems || []);
        console.log('WishlistContext: Wishlist count:', data.count || 0);
      } else {
        setWishlistItems([]);
        setWishlistCount(0);
        console.log('WishlistContext: API call failed, clearing wishlist');
      }
    } catch (error) {
      console.error('WishlistContext: Error fetching wishlist data:', error);
      setWishlistItems([]);
      setWishlistCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(async (productId: number) => {
    try {
      const response = await fetch('/api/add-to-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Refresh wishlist data after adding item
        await fetchWishlistData();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to add to wishlist' };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: 'Network error' };
    }
  }, [fetchWishlistData]);

  const removeFromWishlist = useCallback(async (wishlistItemId: number) => {
    try {
      const response = await fetch('/api/remove-from-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          wishlistItemId
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Refresh wishlist data after removing item
        await fetchWishlistData();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to remove from wishlist' };
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: 'Network error' };
    }
  }, [fetchWishlistData]);

  // Helper functions
  const isProductInWishlist = useCallback((productId: number) => {
    return wishlistItems.some(item => item.product.id === productId);
  }, [wishlistItems]);

  const getWishlistItemId = useCallback((productId: number) => {
    const item = wishlistItems.find(item => item.product.id === productId);
    return item ? item.id : null;
  }, [wishlistItems]);

  const clearWishlistData = useCallback(() => {
    setWishlistItems([]);
    setWishlistCount(0);
    console.log('WishlistContext: Cleared wishlist data.');
  }, []);

  // Load wishlist data on mount
  useEffect(() => {
    console.log('WishlistContext: useEffect triggered, calling fetchWishlistData');
    fetchWishlistData();
  }, [fetchWishlistData]);

  const value: WishlistContextType = {
    wishlistCount,
    wishlistItems,
    isLoading,
    fetchWishlistData,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
    getWishlistItemId,
    clearWishlistData,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}; 