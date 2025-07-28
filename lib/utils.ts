import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to fetch random products for recommendations
export async function getRandomProducts(excludeProductId?: number, count: number = 4) {
  try {
    const response = await fetch('/api/get-products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    
    if (!data.success || !data.products) {
      throw new Error('Invalid response format');
    }

    // Filter out the current product if excludeProductId is provided
    let availableProducts = data.products;
    if (excludeProductId) {
      availableProducts = data.products.filter((product: any) => product.id !== excludeProductId);
    }

    // Randomly select products
    const shuffled = availableProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, availableProducts.length));
  } catch (error) {
    console.error('Error fetching random products:', error);
    return [];
  }
}
