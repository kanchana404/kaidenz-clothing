// Color mapping for common color names to CSS colors
export const colorMap: { [key: string]: string } = {
  'Red': '#ff0000',
  'Blue': '#0000ff',
  'Green': '#00ff00',
  'Yellow': '#ffff00',
  'Black': '#000000',
  'White': '#ffffff',
  'Purple': '#800080',
  'Orange': '#ffa500',
  'Pink': '#ffc0cb',
  'Brown': '#a52a2a',
  'Gray': '#808080',
  'Cyan': '#00ffff',
  'Magenta': '#ff00ff',
  'Navy': '#000080',
  'Beige': '#f5f5dc',
  'Maroon': '#800000',
  'Olive': '#808000',
  'Teal': '#008080',
  'Lime': '#00ff00',
  'Indigo': '#4b0082',
  'Violet': '#ee82ee',
  'Gold': '#ffd700',
  'Silver': '#c0c0c0',
  'Bronze': '#cd7f32',
  'Coral': '#ff7f50',
  'Salmon': '#fa8072',
  'Turquoise': '#40e0d0',
  'Lavender': '#e6e6fa',
  'Mint': '#98ff98',
  'Peach': '#ffcba4',
  'Cream': '#fffdd0',
  'Charcoal': '#36454f',
  'Burgundy': '#800020',
  'Emerald': '#50c878',
  'Ruby': '#e0115f',
  'Sapphire': '#0f52ba',
  'Amber': '#ffbf00',
  'Jade': '#00a86b',
  'Ivory': '#fffff0',
  'Khaki': '#c3b091',
  'Plum': '#8b4513',
  'Rose': '#ff007f',
  'Aqua': '#00ffff',
  'Crimson': '#dc143c',
  'Fuchsia': '#ff00ff',
  'Honey': '#fdb347',
  'Lilac': '#c8a2c8',
  'Mauve': '#e0b0ff',
  'Navy Blue': '#000080',
  'Periwinkle': '#ccccff',
  'Raspberry': '#e30b5d',
  'Seafoam': '#98ff98',
  'Tangerine': '#ffa500',
  'Wine': '#722f37',
  'Zinc': '#71797e'
};

// Function to get CSS color from color name
export function getColorValue(colorName: string): string {
  return colorMap[colorName] || '#cccccc'; // Default gray if color not found
}

// Function to check if a color name is valid
export function isValidColor(colorName: string): boolean {
  return colorName in colorMap;
}

// Function to get all available color names
export function getAvailableColors(): string[] {
  return Object.keys(colorMap);
}

// Function to get contrasting text color (black or white) for a background color
export function getContrastColor(backgroundColor: string): string {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
} 