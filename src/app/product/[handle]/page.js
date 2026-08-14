import { getProduct, getProducts } from '@/lib/shopify';
import Header from '@/components/Header';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);
  if (!product) return { title: 'Product Not Found | Phases Handcrafted' };
  
  return {
    title: `${product.title.split('|')[0].trim()} | Phases Handcrafted Gifting`,
    description: product.descriptionHtml ? product.descriptionHtml.replace(/<[^>]*>?/gm, '').substring(0, 150) : 'Handcrafted premium gifts & candles.',
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    return notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(p => p.node.handle !== resolvedParams.handle)
    .slice(0, 4);

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Header />
      
      {/* Top Main Product Detail Section */}
      <div style={{ paddingTop: '75px', width: '100%', overflowX: 'hidden' }}>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </div>

      {/* Brand Trust & Artisanal Craft Guarantee */}
      <section style={{ backgroundColor: '#faf9f5', borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea', padding: '3.5rem 1rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.6rem', fontFamily: 'var(--font-sans)' }}>
            ✦ The Phases Difference ✦
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 400, color: '#1b2c13', marginBottom: '2.5rem' }}>
            Why Gifting with Phases Feels Special
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '0.8rem' }}>
                🌱
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111', margin: '0 0 0.3rem 0' }}>100% Clean Soy Wax</h3>
              <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.4, margin: 0 }}>Natural botanical wax with lead-free cotton wicks.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '0.8rem' }}>
                🎁
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111', margin: '0 0 0.3rem 0' }}>Boutique Box Ready</h3>
              <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.4, margin: 0 }}>Packaged with luxury tissue and protective cushioning.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '0.8rem' }}>
                ✍️
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111', margin: '0 0 0.3rem 0' }}>Handwritten Card</h3>
              <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.4, margin: 0 }}>Add personal notes and custom cards in one click.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '0.8rem' }}>
                🚚
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111', margin: '0 0 0.3rem 0' }}>Fast Pan-India</h3>
              <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.4, margin: 0 }}>Dispatched within 24-48 hours with live tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Recommendations */}
      {relatedProducts.length > 0 && (
        <section style={{ maxWidth: '1350px', margin: '0 auto', padding: '3.5rem 1rem', fontFamily: 'var(--font-sans)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.4rem' }}>
              Handpicked Pairings
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 400, color: '#111', margin: 0 }}>
              You May Also Love
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
            {relatedProducts.map((prod) => {
              const { node } = prod;
              const image = node.images?.edges?.[0]?.node;
              const relatedPrice = node.priceRange.maxVariantPrice;
              
              return (
                <Link key={node.id} href={`/product/${node.handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ width: '100%', aspectRatio: '4/5', backgroundColor: '#f8f8f8', overflow: 'hidden' }}>
                      {image ? (
                        <img 
                          src={image.url} 
                          alt={image.altText || node.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
                      )}
                    </div>
                    <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111', margin: '0 0 0.3rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.2rem', lineHeight: '1.1rem' }}>
                        {node.title.split('|')[0].trim()}
                      </h3>
                      <p style={{ margin: 'auto 0 0 0', fontWeight: 700, fontSize: '0.9rem', color: '#1b2c13', paddingTop: '0.3rem' }}>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: relatedPrice.currencyCode,
                          maximumFractionDigits: 0
                        }).format(relatedPrice.amount)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Minimalist Dark Green Footer */}
      <footer style={{ backgroundColor: '#1b2c13', color: '#fff', padding: '3.5rem 1.5rem 2rem 1.5rem', fontFamily: 'var(--font-sans)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontStyle: 'italic', fontWeight: 300, marginBottom: '1rem', letterSpacing: '1px' }}>
              Phases Handcrafted
            </h2>
            <p style={{ color: '#ccc', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
              Handcrafted in small batches with pure botanicals and unconditional care.
            </p>
          </div>
          <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase' }}>
            <span>COPYRIGHT &copy;{new Date().getFullYear()} PHASES HANDCRAFTED</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
