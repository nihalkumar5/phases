import { getProduct, getProducts } from '@/lib/shopify';
import Header from '@/components/Header';
import AddToCartButton from '@/components/AddToCartButton';
import UpsellButton from '@/components/UpsellButton';
import ProductAccordion from '@/components/ProductAccordion';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.title} | Phases Handcrafted`,
    description: product.descriptionHtml.replace(/<[^>]*>?/gm, '').substring(0, 150)
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    return notFound();
  }

  const variant = product.variants?.edges[0]?.node;
  const isAvailable = variant?.availableForSale;
  const price = product.priceRange.maxVariantPrice;

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter(p => p.node.handle !== resolvedParams.handle).slice(0, 4);

  return (
    <main>
      <Header />
      
      {/* 
        NEW LAYOUT: 
        Desktop: 2 columns (55% / 45%). Sticky right column.
        Mobile: 1 column. Sticky bottom add-to-cart (handled via CSS later).
      */}
      <div className="pdp-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gap: '3rem', alignItems: 'start' }}>
        
        {/* Images Column */}
        <div className="pdp-images-container">
          {product.images.edges.map(({ node }, index) => (
            <div key={index} className="pdp-image-slide" style={{ backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
              <img 
                src={node.url} 
                alt={node.altText || product.title} 
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>

        {/* Details Column */}
        <div className="pdp-details" style={{ position: 'sticky', top: '2rem' }}>
          
          <div style={{ backgroundColor: '#111', color: '#fff', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'inline-block', marginBottom: '1.5rem' }}>
            BEST SELLER
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem', color: '#111' }}>
            {product.title.split('|')[0].trim()}
          </h1>
          
          <p style={{ fontSize: '1.4rem', color: '#A72B2A', fontWeight: 600, marginBottom: '2rem' }}>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: price.currencyCode,
              maximumFractionDigits: 0
            }).format(price.amount)}
          </p>

          {/* Upsell / Bundle Section */}
          {relatedProducts.length > 0 && (
            <div style={{ marginBottom: '2rem', border: '1px solid #eaeaea', padding: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555', margin: '0 0 1rem 0' }}>Complete your order with</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '50%', overflow: 'hidden' }}>
                    {relatedProducts[0].node.images.edges[0]?.node?.url && (
                      <img src={relatedProducts[0].node.images.edges[0].node.url} alt="Bundle Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: '#111' }}>{relatedProducts[0].node.title}</p>
                  </div>
                </div>
                <UpsellButton 
                  variantId={relatedProducts[0].node.variants.edges[0]?.node?.id} 
                  priceFormatted={new Intl.NumberFormat('en-IN', { style: 'currency', currency: relatedProducts[0].node.priceRange.maxVariantPrice.currencyCode, maximumFractionDigits: 0 }).format(relatedProducts[0].node.priceRange.maxVariantPrice.amount)} 
                />
              </div>
            </div>
          )}

          {/* Add to Cart Container */}
          <div className="pdp-add-to-cart-wrapper" style={{ marginBottom: '3rem' }}>
            <AddToCartButton 
              variantId={variant?.id} 
              disabled={!isAvailable}
              priceFormatted={new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: price.currencyCode,
                maximumFractionDigits: 0
              }).format(price.amount)}
            />
            {!isAvailable && (
              <p style={{ color: 'var(--accent-terra)', marginTop: '0.5rem', textAlign: 'center', fontWeight: 500, fontSize: '0.9rem' }}>
                Out of Stock
              </p>
            )}
          </div>

          {/* En Detail Accordions */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, color: '#111', marginBottom: '1.5rem' }}>
              In detail.
            </h2>
            
            <ProductAccordion title="DESCRIPTION" defaultOpen={true}>
              <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </ProductAccordion>
            
            <ProductAccordion title="DELIVERY">
              <p style={{ margin: '0 0 1rem 0' }}>We process and dispatch all orders within 24-48 hours. Standard shipping takes 3-5 business days across India.</p>
              <p style={{ margin: 0 }}>Free shipping on all orders above ₹500.</p>
            </ProductAccordion>
          </div>

          {/* Product Features Section (Safe for you) - Kept exactly as is! */}
          <div style={{ 
            marginTop: '3rem', 
            paddingTop: '2rem', 
            borderTop: '2px solid #000',
            fontFamily: 'var(--font-sans)'
          }}>
            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#000',
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}>
              Safe for you and environment
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', backgroundColor: '#eef2f9', padding: '1rem', borderRadius: '8px', border: '2px solid #000' }}>
              <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Burn Time:</div>
                <div style={{ fontSize: '1.2rem', color: '#D97706', fontWeight: 700 }}>15 Hours+</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* No Chemicals */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2v7.31"></path>
                    <path d="M14 9.3V1.99"></path>
                    <path d="M8.5 2h7"></path>
                    <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                    <path d="M5.52 16h12.96"></path>
                  </svg>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#111' }}>No Chemicals</span>
              </div>

              {/* Safe to Use */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                  </svg>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#111' }}>Safe to Use</span>
              </div>

              {/* Smoke Free */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 22c5 0 9-4 9-9 0-5-4-9-9-9s-9 4-9 9c0 5 4 9 9 9z"></path>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                  </svg>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#111' }}>Smoke Free</span>
              </div>

              {/* Made from Imported Soy and Gel Wax */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                  </svg>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#111' }}>Made from Imported Soy and Gel Wax</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Value Props Section */}
      <section style={{ backgroundColor: '#F8F6F0', padding: '5rem 1.5rem', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, color: '#111', marginBottom: '4rem' }}>
            The Perfect Bundle 🫶
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔥</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', marginBottom: '0.5rem' }}>Long-lasting Flame</h3>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.5 }}>Enjoy hours of clean, consistent burn with our premium imported wax.</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', marginBottom: '0.5rem' }}>100% Vegetal Wax</h3>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.5 }}>Made sustainably to protect both you and the environment.</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', marginBottom: '0.5rem' }}>Captivating Scents</h3>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.5 }}>Carefully curated fragrances that elevate your space.</p>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '4rem 1.5rem 4rem 1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, textAlign: 'center', marginBottom: '3rem', color: '#111' }}>
            You May Also Like
          </h2>
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {relatedProducts.map((prod, index) => {
              const { node } = prod;
              const image = node.images.edges[0]?.node;
              const relatedPrice = node.priceRange.maxVariantPrice;
              
              return (
                <div 
                  key={node.id} 
                  className="product-card group" 
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Link href={`/product/${node.handle}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                    <div className="product-image-container" style={{ aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#f9f9f9', marginBottom: '1rem' }}>
                      {image ? (
                        <img 
                          src={image.url} 
                          alt={image.altText || node.title} 
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="product-no-img">No Image</div>
                      )}
                    </div>
                    <div className="product-info" style={{ textAlign: 'center' }}>
                      <h3 className="product-title" style={{ fontSize: '1rem', fontWeight: 600, color: '#111', marginBottom: '0.5rem' }}>{node.title.split('|')[0].trim()}</h3>
                      <p className="product-price" style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem', color: '#555' }}>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: relatedPrice.currencyCode,
                          maximumFractionDigits: 0
                        }).format(relatedPrice.amount)}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Trust Badges Pre-footer */}
      <section style={{ borderTop: '1px solid #eaeaea', padding: '3rem 1.5rem', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#555' }}>Free Shipping over ₹500</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#555' }}>Premium Quality</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M16 12l-4-4-4 4M12 8v8"></path></svg>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#555' }}>Secure Payments</span>
          </div>
        </div>
      </section>

    </main>
  );
}
