'use client';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function BestSellersCarousel({ products }) {
  const { addToCart, isLoading } = useCart();

  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: '3rem 0', backgroundColor: '#fff' }}>
      <h2 style={{ 
        textAlign: 'center', 
        fontSize: '2.2rem', 
        fontFamily: 'var(--font-serif)', 
        fontWeight: 400,
        marginBottom: '2rem',
        color: '#111'
      }}>
        Our Best <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Sellers</span> 💫
      </h2>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '1.5rem',
        padding: '0 1.5rem',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none' 
      }}
      className="hide-scroll"
      >
        {products.map((product, idx) => {
          const { node } = product;
          const image = node.images.edges[0]?.node;
          const price = node.priceRange.maxVariantPrice;
          const variantId = node.variants?.edges?.[0]?.node?.id || node.id;
          
          return (
            <div key={node.id} style={{
              flex: '0 0 75%', // Card width on mobile
              maxWidth: '350px',
              scrollSnapAlign: 'start',
              position: 'relative'
            }}>
              <Link href={`/product/${node.handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '4/5', 
                  backgroundColor: '#f9f9f9', 
                  overflow: 'hidden' 
                }}>
                  {image ? (
                    <img 
                      src={image.url} 
                      alt={image.altText || node.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                  )}

                  {/* Quick Add Overlay */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(variantId, 1, true);
                    }}
                    disabled={isLoading}
                    style={{
                      position: 'absolute', bottom: '15px', left: '5%', width: '90%',
                      backgroundColor: 'rgba(255,255,255,0.95)', color: '#111', border: '1px solid #111',
                      padding: '0.6rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                      cursor: 'pointer', borderRadius: '4px', zIndex: 10,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                    }}
                  >
                    {isLoading ? 'Adding...' : 'Quick Add +'}
                  </button>
                  
                  {/* Badges Overlay */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '10px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '5px',
                    zIndex: 2
                  }}>
                    {node.tags && node.tags.length > 0 ? (
                      node.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} style={{ 
                          backgroundColor: i === 0 ? '#000' : '#1b2c13', 
                          color: '#fff', 
                          padding: '4px 8px', 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          width: 'fit-content'
                        }}>
                          {tag}
                        </span>
                      ))
                    ) : (
                      <>
                        {idx === 0 && (
                          <span style={{ backgroundColor: '#000', color: '#fff', padding: '4px 8px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', width: 'fit-content' }}>
                            BEST SELLER
                          </span>
                        )}
                        <span style={{ backgroundColor: '#1b2c13', color: '#fff', padding: '4px 8px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', width: 'fit-content' }}>
                          HANDCRAFTED
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div style={{ padding: '1rem 0' }}>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontFamily: 'var(--font-sans)', 
                    fontWeight: 600, 
                    marginBottom: '0.3rem',
                    color: '#000'
                  }}>
                    {node.title.split(/[-|]/)[0].trim()}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#555', 
                    fontFamily: 'var(--font-sans)'
                  }}>
                    From {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: price.currencyCode,
                      maximumFractionDigits: 0
                    }).format(price.amount).replace('₹', '₹ ')}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
