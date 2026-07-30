'use client';

import { useCart } from './CartContext';

export default function AddToCartButton({ variantId, disabled }) {
  const { addToCart, isLoading } = useCart();

  return (
    <button
      onClick={() => addToCart(variantId, 1)}
      disabled={disabled || isLoading}
      className="btn-add-to-cart-flat"
      style={{
        opacity: (disabled || isLoading) ? 0.7 : 1,
        width: '100%',
        padding: '0.8rem 1rem',
        backgroundColor: 'transparent',
        border: '1px solid #ccc',
        color: '#111',
        fontSize: '0.85rem',
        fontWeight: '500',
        textTransform: 'none',
        cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {isLoading ? 'Adding to Cart...' : 'Add To Cart'}
    </button>
  );
}
