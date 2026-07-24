import { getProduct } from '@/lib/shopify';
import Header from '@/components/Header';
import AddToCartButton from '@/components/AddToCartButton';
import { notFound } from 'next/navigation';

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

  return (
    <main>
      <Header />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '6rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem', alignItems: 'start' }}>
        
        {/* Images Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
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
              currency: price.currencyCode
            }).format(price.amount)}
          </p>

          <div 
            style={{ lineHeight: 1.8, color: 'var(--text-espresso)', opacity: 0.85, fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
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
    </main>
  );
}
