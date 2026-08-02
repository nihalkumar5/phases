'use client';

import { useCart } from './CartContext';

export default function AddToCartButton({ variantId, disabled, priceFormatted }) {
  const { cart, addToCart, updateQuantity, isLoading } = useCart();
  
  // Find if it's already in the cart
  const cartLine = cart?.lines?.edges?.find(e => e.node.merchandise.id === variantId);
  const quantity = cartLine ? cartLine.node.quantity : 0;

  const handleAdd = () => {
    addToCart(variantId, 1, false);
  };

  const increment = () => {
    updateQuantity(variantId, quantity + 1);
  };

  const decrement = () => {
    updateQuantity(variantId, quantity - 1);
  };

  if (quantity > 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1b3021',
        color: '#fff',
        padding: '0',
        width: '100%',
        height: '3.5rem',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        <button onClick={decrement} disabled={isLoading} style={{ flex: 1, height: '100%', background: 'none', border: 'none', color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1.5rem', opacity: isLoading ? 0.7 : 1 }}>-</button>
        <span style={{ flex: 1, textAlign: 'center' }}>{quantity}</span>
        <button onClick={increment} disabled={isLoading} style={{ flex: 1, height: '100%', background: 'none', border: 'none', color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1.5rem', opacity: isLoading ? 0.7 : 1 }}>+</button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled || isLoading}
      className="btn-add-to-cart-premium"
      style={{
        opacity: (disabled || isLoading) ? 0.7 : 1,
        width: '100%',
        height: '3.5rem',
        backgroundColor: '#1b3021',
        border: 'none',
        borderRadius: '0',
        color: '#fff',
        fontSize: '1.05rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      {isLoading ? 'Adding...' : 'ADD TO CART'} {priceFormatted && ` / ${priceFormatted}`}
    </button>
  );
}
