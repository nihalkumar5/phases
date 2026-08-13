'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CategoryProducts({ products }) {
  const [activeTab, setActiveTab] = useState('Best Sellers');

  const tabs = ['Best Sellers', 'Candles', 'Toys', 'Hampers', 'All'];

  // Helper to categorize product
  const getProductCategories = (product) => {
    const cats = ['All'];
    const tags = product.tags || [];
    const title = product.title.toLowerCase();

    if (tags.includes('Hamper') || title.includes('hamper')) cats.push('Hampers');
    if (tags.includes('Toys') || title.includes('toy') || title.includes('plush')) cats.push('Toys');
    // If not a toy or hamper, or explicitly says candle, it's a candle
    if (title.includes('candle') || (!cats.includes('Hampers') && !cats.includes('Toys'))) cats.push('Candles');
    
    // Just mock best sellers as first 4 items for now
    return cats;
  };

  let filteredProducts = products;
  
  if (activeTab === 'Best Sellers') {
    filteredProducts = products.slice(0, 4); // Just take first 4 as best sellers
  } else {
    filteredProducts = products.filter(p => getProductCategories(p.node).includes(activeTab));
  }

  return (
    <section id="products" style={{
      padding: '4rem 5%',
      backgroundColor: '#fff',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
          fontFamily: 'var(--font-serif)', 
          fontWeight: 400, 
          color: '#111',
          marginBottom: '2rem'
        }}>
          Explore the Phases range of products
        </h2>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.8rem 2rem',
                backgroundColor: activeTab === tab ? '#1b2c13' : '#fff',
                color: activeTab === tab ? '#fff' : '#111',
                border: '1px solid #111',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {filteredProducts.map(({ node: product }) => {
          const price = product.priceRange.maxVariantPrice;
          const formattedPrice = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: price.currencyCode,
            maximumFractionDigits: 0
          }).format(price.amount);
          
          return (
            <Link key={product.id} href={`/product/${product.handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '4/5',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  {product.images?.edges?.[0]?.node?.url ? (
                    <img 
                      src={product.images.edges[0].node.url} 
                      alt={product.images.edges[0].node.altText || product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      No Image
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {product.title}
                </h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#333' }}>
                  {formattedPrice}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', fontSize: '1.1rem' }}>
          No products found in this category.
        </div>
      )}
    </section>
  );
}
