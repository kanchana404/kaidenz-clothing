import { NextRequest, NextResponse } from 'next/server';

// This would typically come from your database
// For now, we'll use a static mapping that you can update
const PRODUCT_MAPPING: { [key: string]: number } = {
  // Add your Stripe product ID to database product ID mappings here
  // Example mappings:
  // 'prod_ABC123DEF456': 1,  // Premium Jacket
  // 'prod_XYZ789GHI012': 2,  // Classic White T-Shirt
  // 'prod_MNO345PQR678': 3,  // Denim Jeans
  // 'prod_STU901VWX234': 4,  // Running Shoes
  
  // Default mapping for testing - replace with your actual mappings
  'default': 1
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      mappings: PRODUCT_MAPPING
    });
  } catch (error) {
    console.error('Error getting product mappings:', error);
    return NextResponse.json(
      { error: 'Failed to get product mappings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stripeProductId, dbProductId } = body;
    
    if (!stripeProductId || !dbProductId) {
      return NextResponse.json(
        { error: 'stripeProductId and dbProductId are required' },
        { status: 400 }
      );
    }
    
    // In a real application, you would save this to your database
    // For now, we'll just return success
    console.log(`Mapping added: ${stripeProductId} -> ${dbProductId}`);
    
    return NextResponse.json({
      success: true,
      message: 'Product mapping added successfully'
    });
  } catch (error) {
    console.error('Error adding product mapping:', error);
    return NextResponse.json(
      { error: 'Failed to add product mapping' },
      { status: 500 }
    );
  }
}

// Helper function to get database product ID
export function getProductDbId(stripeProductId: string): number {
  // Check if we have a mapping for this Stripe product ID
  if (PRODUCT_MAPPING[stripeProductId]) {
    return PRODUCT_MAPPING[stripeProductId];
  }
  
  // If no mapping found, return default
  console.warn(`No database product ID mapping found for Stripe product: ${stripeProductId}`);
  return PRODUCT_MAPPING['default'] || 1;
} 