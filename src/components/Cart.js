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
        backgroundColor: '#ffffff', color: '#111111',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
        transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '500', color: '#111', letterSpacing: '-0.02em', margin: 0 }}>Shopping Cart</h2>
          <button onClick={closeCart} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '2rem', color: '#666', lineHeight: 1 }}>&times;</button>
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
                <div key={node.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '100px', height: '100px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {node.merchandise.image && (
                      <img src={node.merchandise.image.url} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#111', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                      {node.merchandise.product.title.split('|')[0].trim()}
                    </h3>
                    <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Qty: {node.quantity}</p>
                    <p style={{ fontWeight: '600', fontSize: '1rem', color: '#111', margin: 0 }}>
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: node.merchandise.price.currencyCode, maximumFractionDigits: 0 }).format(node.merchandise.price.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines?.edges?.length > 0 && (
          <div style={{ padding: '2rem', borderTop: '1px solid #eaeaea', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '500', color: '#111' }}>
              <span>Subtotal</span>
              <span>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: cart.estimatedCost.totalAmount.currencyCode, maximumFractionDigits: 0 }).format(cart.estimatedCost.totalAmount.amount)}
              </span>
            </div>
            <a 
              href={cart.checkoutUrl} 
              style={{ 
                display: 'block', width: '100%', padding: '1.2rem', textAlign: 'center', textDecoration: 'none',
                backgroundColor: '#111', color: '#fff', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}
            >
              Checkout Securely
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
