'use client';

import { useCart } from './CartContext';
import { useEffect, useState, useMemo } from 'react';
import UpsellButton from './UpsellButton';

export default function Cart() {
  const { cart, isCartOpen, closeCart, isLoading, updateQuantity, removeBundle } = useCart();
  const [upsells, setUpsells] = useState([]);

  useEffect(() => {
    if (isCartOpen && upsells.length === 0) {
      import('@/lib/shopify').then(mod => {
        mod.getProducts().then(products => {
          setUpsells(products || []);
        }).catch(err => console.error(err));
      });
    }
  }, [isCartOpen, upsells.length]);

  // Grouping logic
  const { groupedBundles, standalones } = useMemo(() => {
    if (!cart || !cart.lines?.edges) return { groupedBundles: [], standalones: [] };
    
    const bundlesMap = {};
    const standalonesList = [];
    
    cart.lines.edges.forEach((edge) => {
      const node = edge.node;
      const bundleIdAttr = node.attributes?.find(attr => attr.key === '_bundle_id');
      
      if (bundleIdAttr && bundleIdAttr.value) {
        const bId = bundleIdAttr.value;
        if (!bundlesMap[bId]) {
          const bName = node.attributes.find(attr => attr.key === '_bundle_name')?.value || 'Custom Gift Box';
          const bRecipient = node.attributes.find(attr => attr.key === '_bundle_recipient')?.value || '';
          const bMsg = node.attributes.find(attr => attr.key === '_bundle_message')?.value || '';
          const bCard = node.attributes.find(attr => attr.key === '_bundle_card')?.value || '';
          const bPack = node.attributes.find(attr => attr.key === '_bundle_packaging')?.value || '';
          
          bundlesMap[bId] = {
            id: bId,
            name: bName,
            recipient: bRecipient,
            message: bMsg,
            card: bCard,
            packaging: bPack,
            items: [],
            total: 0
          };
        }
        
        bundlesMap[bId].items.push(node);
        bundlesMap[bId].total += parseFloat(node.merchandise.price.amount) * node.quantity;
      } else {
        standalonesList.push(node);
      }
    });
    
    return { 
      groupedBundles: Object.values(bundlesMap), 
      standalones: standalonesList 
    };
  }, [cart]);

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
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, visibility: isCartOpen ? 'visible' : 'hidden', transition: 'visibility 0.4s' }}>
      {/* Overlay */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
          opacity: isCartOpen ? 1 : 0, transition: 'opacity 0.4s' 
        }} 
        onClick={closeCart}
      />
      
      {/* Premium Drawer */}
      <div 
        className="cart-drawer"
        style={{ 
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', 
          backgroundColor: '#fafafa', color: '#111111',
          display: 'flex', flexDirection: 'column',
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'var(--font-sans)'
        }}
      >
        
        {/* Header */}
        <div style={{ 
          padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' 
        }}>
          <button onClick={closeCart} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#111', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Cart</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.85rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span style={{ backgroundColor: '#e0e0e0', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
              {cart?.lines?.edges?.reduce((acc, line) => acc + line.node.quantity, 0) || 0}
            </span>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {cart && cart.lines?.edges?.length > 0 && (() => {
          const cartTotal = cart.lines.edges.reduce((total, { node }) => {
            return total + (parseFloat(node.merchandise.price.amount) * node.quantity);
          }, 0);
          
          const threshold = 500;
          const remaining = Math.max(0, threshold - cartTotal);
          const progressPercent = Math.min(100, (cartTotal / threshold) * 100);
          
          return (
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 500, margin: '0 0 0.8rem 0', color: '#333' }}>
                {remaining > 0 ? (
                  <>You are <strong>₹{remaining.toFixed(0)}</strong> away from free shipping</>
                ) : (
                  <strong>You have unlocked free shipping! ✨</strong>
                )}
              </p>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#2e4a26', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          );
        })()}

        {/* Items Scroll container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#fff' }}>
          {isLoading && !cart ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading cart...</p>
          ) : !cart || !cart.lines?.edges?.length ? (
            <div style={{ textAlign: 'center', color: '#666', marginTop: '3rem' }}>
              Your cart is empty.
            </div>
          ) : (
            <>
              {/* 1. Grouped Custom Bundles */}
              {groupedBundles.map((bundle) => (
                <div 
                  key={bundle.id} 
                  style={{ 
                    border: '1.5px solid #1b2c13', 
                    borderRadius: '8px', 
                    padding: '1.2rem',
                    backgroundColor: '#fafaf9',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e5e5e0', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1b2c13', fontWeight: 700, backgroundColor: '#e2eae0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        Gift Box
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111', margin: '0.3rem 0 0 0' }}>{bundle.name}</h4>
                    </div>
                    <button 
                      onClick={() => removeBundle(bundle.id)}
                      style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#a22020', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Delete Box
                    </button>
                  </div>

                  {/* Bundle Items mini list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {bundle.items.map((node) => (
                      <div key={node.id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '45px', backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid #eaeaea', flexShrink: 0 }}>
                          {node.merchandise.image && (
                            <img src={node.merchandise.image.url} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111', margin: 0 }}>
                            {node.merchandise.product.title.split('|')[0].trim()}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.1rem 0 0 0' }}>
                            Qty: {node.quantity} • ₹{node.merchandise.price.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Personalized details summary */}
                  {(bundle.recipient || bundle.message || bundle.packaging !== 'basic') && (
                    <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px dotted #dcdcd5', fontSize: '0.78rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {bundle.recipient && (
                        <div>👤 <strong>For:</strong> {bundle.recipient}</div>
                      )}
                      {bundle.message && (
                        <div style={{ fontStyle: 'italic', color: '#666' }}>✉️ &ldquo;{bundle.message}&rdquo;</div>
                      )}
                      {bundle.packaging && bundle.packaging !== 'basic' && (
                        <div>🎁 <strong>Box style:</strong> {bundle.packaging.toUpperCase()} wrap</div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* 2. Standalone Products */}
              {standalones.map((node) => (
                <div key={node.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #f5f5f5', paddingBottom: '1.5rem' }}>
                  <div style={{ width: '80px', height: '90px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                    {node.merchandise.image && (
                      <img src={node.merchandise.image.url} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111', margin: '0 0 0.2rem 0' }}>
                          {node.merchandise.product.title.split('|')[0].trim()}
                        </h3>
                        {node.merchandise.title !== 'Default Title' && (
                          <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>{node.merchandise.title}</p>
                        )}
                      </div>
                      <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111', margin: 0 }}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: node.merchandise.price.currencyCode, maximumFractionDigits: 0 }).format(node.merchandise.price.amount)}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.8rem' }}>
                      <div style={{ border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0.1rem 0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#666', marginRight: '0.3rem' }}>Qty</span>
                        <select 
                          value={node.quantity} 
                          onChange={(e) => updateQuantity(node.merchandise.id, parseInt(e.target.value))} 
                          style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', outline: 'none' }}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <button 
                        onClick={() => updateQuantity(node.merchandise.id, 0)}
                        style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#999', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Addons / Upsell Section */}
              {upsells.length > 0 && (() => {
                const cartHandles = cart.lines.edges.map(line => line.node.merchandise.product.handle);
                // Highlight gifting specific products like keychains or small toys if not in cart
                const availableUpsells = upsells
                  .filter(p => !cartHandles.includes(p.node.handle))
                  .filter(p => {
                    const title = p.node.title.toLowerCase();
                    return title.includes('keychain') || title.includes('bagcharm') || title.includes('pack') || title.includes('mini') || title.includes('card');
                  })
                  .slice(0, 3);
                
                if (availableUpsells.length === 0) return null;

                return (
                  <div style={{ marginTop: '1rem', backgroundColor: '#f9f8f4', border: '1px solid #ebd', padding: '1.2rem', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1b2c13', margin: '0 0 1rem 0' }}>💡 Complete your gift with</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {availableUpsells.map((upsell) => {
                        const variant = upsell.node.variants.edges[0]?.node;
                        const price = upsell.node.priceRange.maxVariantPrice;
                        const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: price.currencyCode, maximumFractionDigits: 0 }).format(price.amount);
                        
                        return (
                          <div key={upsell.node.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
                              <div style={{ width: '45px', height: '45px', backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid #eee', flexShrink: 0 }}>
                                {upsell.node.images.edges[0]?.node?.url && (
                                  <img src={upsell.node.images.edges[0].node.url} alt={upsell.node.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                              </div>
                              <div style={{ paddingRight: '0.5rem' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: '0 0 0.1rem 0', color: '#111', lineHeight: 1.2 }}>{upsell.node.title.split('|')[0].trim()}</p>
                                <span style={{ fontSize: '0.75rem', color: '#666' }}>{formattedPrice}</span>
                              </div>
                            </div>
                            <div style={{ flexShrink: 0 }}>
                              <UpsellButton variantId={variant?.id} priceFormatted="Add" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines?.edges?.length > 0 && (
          <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderTop: '1px solid #eee', boxShadow: '0 -4px 12px rgba(0,0,0,0.03)' }}>
            <a 
              href={(() => {
                try {
                  const url = new URL(cart.checkoutUrl);
                  url.hostname = 'phases-handcrafted.myshopify.com';
                  return url.toString();
                } catch (e) {
                  return cart.checkoutUrl;
                }
              })()}
              style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '100%', padding: '1.2rem', textDecoration: 'none', borderRadius: '4px',
                backgroundColor: '#1b2c13', color: '#fff', fontSize: '0.95rem', fontWeight: '600'
              }}
            >
              <span style={{ letterSpacing: '0.05em' }}>CHECKOUT</span>
              <span>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: cart.estimatedCost.totalAmount.currencyCode, maximumFractionDigits: 0 }).format(cart.estimatedCost.totalAmount.amount)}
              </span>
            </a>
            <p style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', marginTop: '0.8rem', marginBottom: 0 }}>
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
