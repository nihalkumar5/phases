'use client';

import { useState } from 'react';
import { useCart } from './CartContext';

export default function UpsellButton({ variantId, priceFormatted, style }) {
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    setQuantity(1);
    addToCart(variantId, 1, false); // false = don't open cart
  };

  const increment = () => {
    const newQ = quantity + 1;
    setQuantity(newQ);
    addToCart(variantId, newQ, false);
  };

  const decrement = () => {
    const newQ = Math.max(0, quantity - 1);
    setQuantity(newQ);
    if (newQ > 0) {
      addToCart(variantId, newQ, false);
    }
  };

  if (quantity > 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#eaeaea', borderRadius: '4px', overflow: 'hidden', ...style }}>
        <button onClick={decrement} disabled={isLoading} style={{ border: 'none', background: 'transparent', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: 600 }}>-</button>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{isLoading ? '...' : quantity}</span>
        <button onClick={increment} disabled={isLoading} style={{ border: 'none', background: 'transparent', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: 600 }}>+</button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleAdd}
      disabled={isLoading || !variantId}
      style={{ 
        backgroundColor: '#eaeaea', 
        border: 'none', 
        padding: '0.4rem 0.8rem', 
        fontSize: '0.75rem', 
        fontWeight: 600, 
        cursor: (isLoading || !variantId) ? 'not-allowed' : 'pointer', 
        color: '#111',
        opacity: (isLoading || !variantId) ? 0.7 : 1,
        borderRadius: '4px',
        ...style 
      }}
    >
      {isLoading ? 'ADDING...' : `ADD / ${priceFormatted}`}
    </button>
  );
}
