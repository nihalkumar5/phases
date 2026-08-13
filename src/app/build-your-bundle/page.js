import { getProducts } from '@/lib/shopify';
import Header from '@/components/Header';
import BundleBuilderClient from './BundleBuilderClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Make Your Own Gift Box | Phases Handcrafted',
  description: 'Customize your own personal gift hamper. Select from our premium candles, soft toys, keychains, and rakhis, add a personal touch, and get it delivered in premium packaging.',
};

export default async function BuildYourBundlePage() {
  const rawProducts = await getProducts();
  
  // Transform and normalize Shopify products
  const products = rawProducts.map(({ node }) => {
    const title = node.title;
    const handle = node.handle;
    const id = node.variants.edges[0]?.node.id || node.id;
    const price = parseFloat(node.priceRange.maxVariantPrice.amount);
    const image = node.images.edges[0]?.node.url || '/placeholder.png';
    const tags = node.tags || [];
    
    // Dynamic classification based on title and tags
    let category = 'Gifts';
    const lowerTitle = title.toLowerCase();
    const tagSet = new Set(tags.map(t => t.toLowerCase()));
    
    if (tagSet.has('candle') || lowerTitle.includes('candle') || lowerTitle.includes('latte') || lowerTitle.includes('matcha')) {
      category = 'Candles';
    } else if (tagSet.has('rakhi') || lowerTitle.includes('rakhi')) {
      category = 'Rakhis';
    } else if (tagSet.has('toys') || tagSet.has('toy') || lowerTitle.includes('toy') || lowerTitle.includes('plush') || lowerTitle.includes('giraffe') || lowerTitle.includes('elephant') || lowerTitle.includes('camel') || lowerTitle.includes('frog') || lowerTitle.includes('turtle') || lowerTitle.includes('puppy') || lowerTitle.includes('deer') || lowerTitle.includes('dinosaur') || lowerTitle.includes('kachua') || lowerTitle.includes('haathi') || lowerTitle.includes('girrafe')) {
      category = 'Soft Toys';
    } else if (lowerTitle.includes('keychain') || lowerTitle.includes('bagcharm') || lowerTitle.includes('charm')) {
      category = 'Keychains';
    } else if (tagSet.has('hamper') || lowerTitle.includes('hamper') || lowerTitle.includes('bundle') || lowerTitle.includes('gift set')) {
      category = 'Hampers'; // Pre-packaged, we might exclude these from builder or put in a separate tab
    }
    
    return {
      id,
      title,
      handle,
      price,
      image,
      category,
      available: node.variants.edges[0]?.node.availableForSale ?? true
    };
  }).filter(p => p.category !== 'Hampers'); // Filter out pre-made hampers from custom builder

  return (
    <main style={{ backgroundColor: '#faf9f5', minHeight: '100vh', paddingBottom: '5rem' }}>
      <Header theme="light" />
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 400, color: '#1b2c13', marginBottom: '0.8rem' }}>
            Make Your Own Gift Box
          </h1>
          <p style={{ color: '#555', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
            Pick your box size, select your favorite handcrafted products, add a personalized message, and we will pack it with love.
          </p>
        </div>

        {/* Client Component for interactive flow */}
        <BundleBuilderClient products={products} />
        
      </div>
    </main>
  );
}
