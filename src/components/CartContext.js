'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createCart, getCart as fetchCart, addToExistingCart, updateCartLines } from '@/lib/shopify';

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
      // For simplicity in this example, we always create a new cart line if one doesn't exist,
      // but ideally you'd update lines if the cart already exists.
      // Since Shopify Cart API requires cart lines update/add mutations, we'll simplify 
      // by just creating a new cart if none exists.
      
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

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ cart, isCartOpen, isLoading, addToCart, updateQuantity, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
