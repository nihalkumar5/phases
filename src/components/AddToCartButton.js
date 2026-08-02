'use client';

import { useCart } from './CartContext';

export default function AddToCartButton({ variantId, disabled, priceFormatted }) {
  const { addToCart, isLoading } = useCart();

  return (
    <button
      onClick={() => addToCart(variantId, 1, true)}
      disabled={disabled || isLoading}
      className="btn-add-to-cart-premium"
      style={{
        opacity: (disabled || isLoading) ? 0.7 : 1,
        width: '100%',
        padding: '1.2rem 1rem',
        backgroundColor: '#1b3021', // Dark green like screenshot
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
