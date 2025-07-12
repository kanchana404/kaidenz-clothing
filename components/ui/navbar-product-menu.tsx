"use client";
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shirt, SlidersHorizontal, Aperture, Rss, Dumbbell, ShoppingBag, Star } from "lucide-react";

// Hook for click outside detection
function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      const target = event.target;
      if (!el || !target || el.contains(target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener(mouseEvent, listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener(mouseEvent, listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, mouseEvent]);
}

// Types
interface ProductCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface NavbarProductMenuProps {
  categories?: ProductCategory[];
  className?: string;
  onCategorySelect?: (category: ProductCategory) => void;
}

// Context for managing menu state
interface MenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
}

const MenuContext = createContext<MenuContextType>({
  isOpen: false,
  setIsOpen: () => {},
  activeCategory: null,
  setActiveCategory: () => {},
});

// Animation variants
const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      duration: 0.35,
      bounce: 0.05,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    transition: {
      duration: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      duration: 0.25,
    },
  },
};

// Product Category Item Component
const ProductCategoryItem: React.FC<{
  category: ProductCategory;
  onSelect?: (category: ProductCategory) => void;
  delay?: number;
}> = ({ category, onSelect, delay = 0 }) => {
  const { setIsOpen } = useContext(MenuContext);
  const Icon = category.icon;
  const handleClick = () => {
    onSelect?.(category);
    setIsOpen(false);
  };
  return (
    <motion.div
      variants={itemVariants}
      className="group"
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      <button
        onClick={handleClick}
        className="w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-200 group border border-transparent hover:border-gray-100"
        style={{
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f6f6f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div 
          className="flex-shrink-0 p-2 rounded-md transition-all duration-200 group-hover:scale-105"
          style={{
            backgroundColor: '#f6f6f6',
            color: '#111111',
          }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 
            className="font-medium text-sm mb-1 transition-colors duration-200"
            style={{ color: '#111111' }}
          >
            {category.name}
          </h4>
          {category.description && (
            <p 
              className="text-xs leading-relaxed opacity-70"
              style={{ color: '#2f2f2f' }}
            >
              {category.description}
            </p>
          )}
        </div>
      </button>
    </motion.div>
  );
};

// Main Navbar Product Menu Component
const NavbarProductMenu: React.FC<NavbarProductMenuProps> = ({
  categories = defaultCategories,
  className,
  onCategorySelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useClickOutside(menuRef, () => {
    setIsOpen(false);
    setActiveCategory(null);
  });

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!menuRef.current?.matches(':hover') && !triggerRef.current?.matches(':hover')) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    }, 100);
  };

  return (
    <div style={{ backgroundColor: '#f6f6f6', minHeight: '100vh', padding: '2rem' }}>
      <MenuContext.Provider value={{ isOpen, setIsOpen, activeCategory, setActiveCategory }}>
        <div 
          className={`relative ${className || ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Trigger Button */}
          <button
            ref={triggerRef}
            onClick={handleTriggerClick}
            className="flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20 border border-transparent"
            style={{
              color: isOpen ? '#ffcb74' : '#111111',
              backgroundColor: isOpen ? '#111111' : 'transparent',
              borderColor: isOpen ? '#111111' : '#2f2f2f',
              focusRingColor: '#ffcb74',
            }}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-haspopup="true"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Products</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-0 mt-3 z-50 w-96 max-h-96 overflow-y-auto rounded-xl shadow-2xl backdrop-blur-sm"
                style={{
                  backgroundColor: '#f6f6f6',
                  border: '1px solid #2f2f2f',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div className="p-6">
                  <div className="mb-6">
                    <h3 
                      className="text-lg font-semibold mb-2"
                      style={{ color: '#111111' }}
                    >
                      Product Categories
                    </h3>
                    <p 
                      className="text-sm opacity-70"
                      style={{ color: '#2f2f2f' }}
                    >
                      Explore our curated collection
                    </p>
                  </div>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <ProductCategoryItem
                        key={category.id}
                        category={category}
                        onSelect={onCategorySelect}
                        delay={index * 0.04}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MenuContext.Provider>
    </div>
  );
};

// Default categories data for KAIDENZ
const defaultCategories: ProductCategory[] = [
  {
    id: "tops",
    name: "Tops",
    icon: Shirt,
    description: "T-Shirts, Crop Tops, Hoodies, Shirts, Tanks, Long Sleeves",
  },
  {
    id: "bottoms",
    name: "Bottoms",
    icon: SlidersHorizontal,
    description: "Jeans, Leggings, Joggers, Shorts, Skirts, Cargo Pants",
  },
  {
    id: "outerwear",
    name: "Outerwear",
    icon: Aperture,
    description: "Bomber Jackets, Denim Jackets, Raincoats, Overcoats",
  },
  {
    id: "dresses-jumpsuits",
    name: "Dresses & Jumpsuits",
    icon: Rss,
    description: "Floral Dresses, Mini Dresses, Jumpsuits",
  },
  {
    id: "loungewear-activewear",
    name: "Loungewear & Activewear",
    icon: Dumbbell,
    description: "Yoga Sets, Lounge Shorts, Gym Shirts",
  },
  {
    id: "seasonal-accessories",
    name: "Seasonal/Accessories",
    icon: Star,
    description: "Sweatshirts, Vests, Beanies",
  },
];

export default NavbarProductMenu;