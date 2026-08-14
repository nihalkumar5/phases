'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createCart, getCart as fetchCart, addToExistingCart, addMultipleLinesToCart, updateCartLines, applyDiscountToCart } from '@/lib/shopify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing cart
    const existingCartId = localStorage.getItem('shopify_cart_id');
    if (existingCartId) {
      setIsLoading(true);
      fetchCart(existingCartId).then((fetchedCart) => {
        if (fetchedCart) {
          setCart(fetchedCart);
        } else {
          localStorage.removeItem('shopify_cart_id');
        }
        setIsLoading(false);
      });
    }
  }, []);

  const addToCart = async (variantId, quantity = 1, openCartAfter = false) => {
    setIsLoading(true);
    try {
      let currentCartId = cart?.id;
      let newCart;
      
      if (!currentCartId) {
        newCart = await createCart(variantId, quantity);
        localStorage.setItem('shopify_cart_id', newCart.id);
        setCart(newCart);
      } else {
        newCart = await addToExistingCart(currentCartId, variantId, quantity);
        setCart(newCart);
      }
      
      if (openCartAfter) {
        setIsCartOpen(true);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addBundleToCart = async (lines, openCartAfter = true) => {
    setIsLoading(true);
    try {
      let currentCartId = cart?.id;
      let newCart;
      
      if (!currentCartId) {
        newCart = await createCart(lines);
        localStorage.setItem('shopify_cart_id', newCart.id);
        setCart(newCart);
      } else {
        newCart = await addMultipleLinesToCart(currentCartId, lines);
        setCart(newCart);
      }
      
      if (openCartAfter) {
        setIsCartOpen(true);
      }
    } catch (err) {
      console.error('Error adding bundle to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (variantId, quantity) => {
    try {
      setIsLoading(true);
      const currentCartId = localStorage.getItem('shopify_cart_id');
      if (!currentCartId || !cart) return;

      const lineItem = cart.lines.edges.find(e => e.node.merchandise.id === variantId);
      if (lineItem) {
        const lineId = lineItem.node.id;
        const newCart = await updateCartLines(currentCartId, [{ id: lineId, quantity }]);
        setCart(newCart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeBundle = async (bundleId) => {
    try {
      setIsLoading(true);
      const currentCartId = localStorage.getItem('shopify_cart_id');
      if (!currentCartId || !cart) return;

      const linesToDelete = cart.lines.edges
        .filter(({ node }) => node.attributes?.some(attr => attr.key === '_bundle_id' && attr.value === bundleId))
        .map(({ node }) => ({ id: node.id, quantity: 0 }));

      if (linesToDelete.length > 0) {
        const newCart = await updateCartLines(currentCartId, linesToDelete);
        setCart(newCart);
      }
    } catch (error) {
      console.error('Error removing bundle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyDiscount = async (code) => {
    try {
      setIsLoading(true);
      const currentCartId = localStorage.getItem('shopify_cart_id');
      if (!currentCartId) return false;
      
      const newCart = await applyDiscountToCart(currentCartId, [code]);
      if (newCart) {
        setCart(newCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error applying discount:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ cart, isCartOpen, isLoading, addToCart, addBundleToCart, updateQuantity, removeBundle, applyDiscount, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
