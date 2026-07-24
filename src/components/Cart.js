'use client';

import { useCart } from './CartContext';
import { useEffect } from 'react';

export default function Cart() {
  const { cart, isCartOpen, closeCart, isLoading } = useCart();

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999 }}>
      {/* Overlay */}
      <div 
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} 
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div style={{ 
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: '400px', 
        backgroundColor: 'var(--background)', color: 'var(--foreground)',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
        transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Your Cart</h2>
          <button onClick={closeCart} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--muted)' }}>&times;</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {isLoading && !cart ? (
            <p>Loading cart...</p>
          ) : !cart || !cart.lines?.edges?.length ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '2rem' }}>
              Your cart is empty.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.lines.edges.map(({ node }) => (
                <div key={node.id} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#f5f5f7', borderRadius: '8px', overflow: 'hidden' }}>
                    {node.merchandise.image && (
                      <img src={node.merchandise.image.url} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>{node.merchandise.product.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Qty: {node.quantity}</p>
                    <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: node.merchandise.price.currencyCode }).format(node.merchandise.price.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines?.edges?.length > 0 && (
          <div style={{ padding: '2rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
              <span>Subtotal</span>
              <span>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: cart.estimatedCost.totalAmount.currencyCode }).format(cart.estimatedCost.totalAmount.amount)}
              </span>
            </div>
            <a 
              href={cart.checkoutUrl} 
              className="button-accent"
              style={{ display: 'block', width: '100%', padding: '1rem', textAlign: 'center', textDecoration: 'none' }}
            >
              Checkout securely
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
