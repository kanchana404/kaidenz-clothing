'use client'

import React from 'react';
import { getColorValue } from '@/lib/color-utils';

interface Color {
  colorId: number;
  colorName: string;
}

interface ColorDotsProps {
  colors: Color[];
  className?: string;
}

const ColorDots: React.FC<ColorDotsProps> = ({ colors, className = '' }) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-muted-foreground">Colors:</span>
      <div className="flex gap-1">
        {colors.map((color) => {
          const cssColor = getColorValue(color.colorName);
          return (
            <div
              key={color.colorId}
              className="w-4 h-4 rounded-full border border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: cssColor }}
              title={color.colorName}
            />
          );
        })}
      </div>
      {colors.length > 3 && (
        <span className="text-xs text-muted-foreground">+{colors.length - 3} more</span>
      )}
    </div>
  );
};

export default ColorDots; 