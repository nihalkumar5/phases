import { getProduct, getProducts } from '@/lib/shopify';
import Header from '@/components/Header';
import AddToCartButton from '@/components/AddToCartButton';
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
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem', alignItems: 'start' }}>
        
        {/* Images Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {product.images.edges.map(({ node }, index) => (
            <div key={index} className="bezel-shell" style={{ padding: '0.35rem', borderRadius: '1.25rem' }}>
              <div className="bezel-core" style={{ borderRadius: '1rem', overflow: 'hidden', backgroundColor: 'var(--bg-cream)' }}>
                <img 
                  src={node.url} 
                  alt={node.altText || product.title} 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Details Column */}
        <div style={{ position: 'sticky', top: '120px', paddingRight: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.5rem' }}>
            {product.title.split('|')[0].trim()}
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-espresso)', opacity: 0.8, fontWeight: 500, marginBottom: '3rem' }}>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: price.currencyCode,
              maximumFractionDigits: 0
            }).format(price.amount)}
          </p>

          <div 
            style={{ lineHeight: 1.8, color: 'var(--text-espresso)', opacity: 0.85, fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
          />

          <AddToCartButton 
            variantId={variant?.id} 
            disabled={!isAvailable} 
          />

          {!isAvailable && (
            <p style={{ color: 'var(--accent-terra)', marginTop: '1rem', textAlign: 'center', fontWeight: 500 }}>
              Out of Stock
            </p>
          )}
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem 8rem 2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 300, textAlign: 'center', marginBottom: '3rem', color: 'var(--text-espresso)' }}>
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
                  className="product-card glass-card group" 
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Link href={`/product/${node.handle}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                    <div className="product-image-container" style={{ aspectRatio: '4/5' }}>
                      {image ? (
                        <img 
                          src={image.url} 
                          alt={image.altText || node.title} 
                          loading="lazy"
                          className="product-img"
                        />
                      ) : (
                        <div className="product-no-img">No Image</div>
                      )}
                    </div>
                    <div className="product-info" style={{ paddingBottom: '0.5rem' }}>
                      <h3 className="product-title" style={{ fontSize: '1.1rem' }}>{node.title.split('|')[0].trim()}</h3>
                    </div>
                  </Link>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.2rem 1.2rem 1.2rem' }}>
                    <p className="product-price" style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem', color: '#111' }}>
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: relatedPrice.currencyCode,
                        maximumFractionDigits: 0
                      }).format(relatedPrice.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
