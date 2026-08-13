'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

export default function ReadyToGiftHampers({ hampers }) {
  const { addToCart, isLoading } = useCart();

  if (!hampers || hampers.length === 0) return null;

  return (
    <section style={{ padding: '5rem 1.5rem', backgroundColor: '#fff', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 400, color: '#1b2c13', marginBottom: '1rem' }}>
            Ready-to-Gift Hampers
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.5 }}>
            Don&apos;t know what to select? Buy our thoughtfully curated pre-made gift sets and hampers for instant checkout.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {hampers.map((product) => {
            const variantId = product.variants?.edges?.[0]?.node?.id || product.id;
            const price = product.priceRange.maxVariantPrice;
            const formattedPrice = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: price.currencyCode,
              maximumFractionDigits: 0
            }).format(price.amount);
            
            return (
              <div 
                key={product.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}
              >
                <Link href={`/product/${product.handle}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ width: '100%', aspectRatio: '4/5', backgroundColor: '#f9f9f9', overflow: 'hidden', position: 'relative' }}>
                    {product.images?.edges?.[0]?.node?.url ? (
                      <img 
                        src={product.images.edges[0].node.url} 
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                        No Image
                      </div>
                    )}
                  </div>
                </Link>
                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111', margin: '0 0 0.5rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4rem', lineHeight: '1.2rem' }}>
                    {product.title.split('|')[0].trim()}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1b2c13' }}>{formattedPrice}</span>
                    <button 
                      onClick={() => addToCart(variantId, 1, true)}
                      disabled={isLoading}
                      style={{
                        backgroundColor: '#1b2c13', color: '#fff', border: 'none', borderRadius: '4px',
                        padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isLoading ? 'Adding...' : 'Quick Add'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
