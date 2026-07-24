'use client';

import { useCart } from './CartContext';

export default function AddToCartButton({ variantId, disabled }) {
  const { addToCart, isLoading } = useCart();

  return (
    <button
      onClick={() => addToCart(variantId, 1)}
      disabled={disabled || isLoading}
      className="btn-add-to-cart group"
      style={{
        opacity: (disabled || isLoading) ? 0.7 : 1,
      }}
    >
      <span>{isLoading ? 'Adding to Bag...' : 'Add to Bag'}</span>
      {!isLoading && (
        <div className="btn-nested-wrapper light-nested" style={{ width: '2rem', height: '2rem' }}>
          <span>+</span>
        </div>
      )}
    </button>
  );
}
