import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Navigation / View State: 'home', 'shop', 'product-detail', 'cart', 'checkout'
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Cart State (Persisted in localStorage when available)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('veltrix_cart');
      return saved ? JSON.parse(saved) : [
        {
          product: PRODUCTS[0], // AirPods Pro 2
          quantity: 1,
          selectedColor: PRODUCTS[0].colors[0]
        },
        {
          product: PRODUCTS[4], // USB-C Fast Charging Cable 100W
          quantity: 2,
          selectedColor: PRODUCTS[4].colors[0]
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('veltrix_wishlist');
      return saved ? JSON.parse(saved) : ['airpods-pro-2', 'apple-watch-ultra-edition'];
    } catch {
      return ['airpods-pro-2'];
    }
  });

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'VELTRIX10', discountPercent: 10 }
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notification state
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('veltrix_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('veltrix_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [wishlist]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product, quantity = 1, selectedColor = null) => {
    const color = selectedColor || product.colors[0];
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: color }];
      }
    });

    addToast(`Added ${quantity}x "${product.name}" to cart`, 'success');
  };

  const updateQuantity = (productId, colorName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, colorName);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor.name === colorName
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, colorName) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId && i.selectedColor.name === colorName);
      if (item) {
        addToast(`Removed "${item.product.name}" from cart`, 'info');
      }
      return prev.filter((i) => !(i.product.id === productId && i.selectedColor.name === colorName));
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const prod = PRODUCTS.find((p) => p.id === productId);
      const prodName = prod ? prod.name : 'Product';
      if (exists) {
        addToast(`Removed "${prodName}" from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast(`Saved "${prodName}" to wishlist`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'VELTRIX10') {
      setAppliedPromo({ code: clean, discountPercent: 10, label: '10% Off Everything' });
      addToast('Promo code VELTRIX10 applied! 10% discount added.', 'success');
      return { success: true, message: '10% discount applied!' };
    } else if (clean === 'FREESHIP') {
      setAppliedPromo({ code: clean, freeShipping: true, label: 'Free Express Shipping' });
      addToast('Promo code FREESHIP applied! Free shipping unlocked.', 'success');
      return { success: true, message: 'Free shipping promo applied!' };
    } else if (clean === 'TECH20') {
      setAppliedPromo({ code: clean, discountPercent: 20, label: '20% VIP Access' });
      addToast('Promo code TECH20 applied! 20% discount unlocked.', 'success');
      return { success: true, message: 'VIP 20% discount applied!' };
    } else {
      addToast('Invalid promo code. Try "VELTRIX10" or "FREESHIP"', 'error');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast('Promo code removed', 'info');
  };

  // Calculations
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedPromo?.discountPercent) {
    discountAmount = (subtotal * appliedPromo.discountPercent) / 100;
  }

  // Free shipping threshold: 300 DH or if promo FREESHIP applies
  const shippingThreshold = 300.00;
  const isFreeShipping = subtotal >= shippingThreshold || appliedPromo?.freeShipping;
  const standardShippingCost = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 25.00);
  
  const estimatedTax = 0; // Moroccan pricing is all-inclusive (TTC)
  const finalTotal = Math.max(0, subtotal - discountAmount + standardShippingCost + (cart.length > 0 ? estimatedTax : 0));

  // Navigation helpers
  const navigateTo = (view, product = null, category = null) => {
    if (product) setSelectedProduct(product);
    if (category) setActiveCategoryFilter(category);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateTo,
        selectedProduct,
        setSelectedProduct,
        activeCategoryFilter,
        setActiveCategoryFilter,
        // Cart
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        subtotal,
        discountAmount,
        standardShippingCost,
        shippingThreshold,
        isFreeShipping,
        estimatedTax,
        finalTotal,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        // Wishlist
        wishlist,
        toggleWishlist,
        isWishlisted,
        // Drawers / Modals
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        isContactOpen,
        setIsContactOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isFaqOpen,
        setIsFaqOpen,
        isAboutOpen,
        setIsAboutOpen,
        isAccountOpen,
        setIsAccountOpen,
        // Search
        searchQuery,
        setSearchQuery,
        // Toasts
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
