'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function CategoryProducts({ products }) {
  const { addToCart, isLoading } = useCart();
  
  // States for filter
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');

  // Read deep-linked filters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashAndParams = () => {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const occasion = params.get('occasion');
        const budget = params.get('budget');
        
        if (category) setSelectedCategory(category);
        if (occasion) setSelectedOccasion(occasion);
        if (budget) setSelectedBudget(budget);
      };
      
      handleHashAndParams();
      // Listen for hash/query changes
      window.addEventListener('popstate', handleHashAndParams);
      return () => window.removeEventListener('popstate', handleHashAndParams);
    }
  }, []);

  // Classification Helpers
  const classifyProduct = (product) => {
    const title = product.title.toLowerCase();
    const tags = (product.tags || []).map(t => t.toLowerCase());
    const price = parseFloat(product.priceRange?.maxVariantPrice?.amount) || 0;

    // 1. Category
    let category = 'Gifts';
    if (tags.includes('candle') || title.includes('candle') || title.includes('latte') || title.includes('matcha')) {
      category = 'Candles';
    } else if (tags.includes('rakhi') || title.includes('rakhi')) {
      category = 'Rakhis';
    } else if (tags.includes('toys') || tags.includes('toy') || title.includes('toy') || title.includes('plush') || title.includes('giraffe') || title.includes('elephant') || title.includes('camel') || title.includes('frog') || title.includes('turtle') || title.includes('puppy') || title.includes('deer') || title.includes('dinosaur') || title.includes('kachua') || title.includes('haathi')) {
      category = 'Soft Toys';
    } else if (title.includes('keychain') || title.includes('bagcharm') || title.includes('charm')) {
      category = 'Keychains';
    } else if (tags.includes('hamper') || title.includes('hamper') || title.includes('bundle') || title.includes('gift set')) {
      category = 'Gift Hampers';
    }

    // 2. Occasion
    const occasions = [];
    if (title.includes('birthday') || title.includes('nursery') || title.includes('kids') || category === 'Soft Toys') {
      occasions.push('Birthday');
    }
    if (title.includes('anniversary') || title.includes('love') || title.includes('romantic') || title.includes('sweetheart') || title.includes('rose') || title.includes('heart')) {
      occasions.push('Anniversary');
      occasions.push('Romantic');
    }
    if (title.includes('rakhi') || title.includes('raksha') || tags.includes('rakhi')) {
      occasions.push('Raksha Bandhan');
    }
    if (title.includes('friendship') || title.includes('together') || title.includes('bundle')) {
      occasions.push('Friendship');
    }
    if (title.includes('traditional') || title.includes('modak') || title.includes('festive') || title.includes('rakhi') || tags.includes('rakhi')) {
      occasions.push('Festive');
    }
    if (category === 'Soft Toys' || title.includes('kids') || title.includes('nursery') || title.includes('giraffe') || title.includes('puppy')) {
      occasions.push('Kids');
    }
    
    if (occasions.length === 0) {
      occasions.push('Just Because');
    }

    // 3. Budget
    let budget = 'Premium';
    if (price < 300) budget = 'Under ₹299';
    else if (price < 500) budget = 'Under ₹499';
    else if (price < 1000) budget = 'Under ₹999';

    return { category, occasions, budget, price };
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products.filter(({ node: product }) => {
      const { category, occasions, budget } = classifyProduct(product);
      
      const matchCategory = selectedCategory === 'All' || category === selectedCategory;
      const matchOccasion = selectedOccasion === 'All' || occasions.includes(selectedOccasion);
      const matchBudget = selectedBudget === 'All' || budget === selectedBudget;

      return matchCategory && matchOccasion && matchBudget;
    });
  }, [products, selectedCategory, selectedOccasion, selectedBudget]);

  const categories = ['All', 'Candles', 'Soft Toys', 'Keychains', 'Gift Hampers', 'Rakhis'];
  const occasions = ['All', 'Birthday', 'Anniversary', 'Raksha Bandhan', 'Romantic', 'Festive', 'Kids', 'Friendship'];
  const budgets = ['All', 'Under ₹299', 'Under ₹499', 'Under ₹999', 'Premium'];

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedOccasion('All');
    setSelectedBudget('All');
  };

  return (
    <section id="products" style={{ padding: '5rem 5%', backgroundColor: '#fff', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontFamily: 'var(--font-serif)', fontWeight: 400, color: '#1b2c13', textAlign: 'center', marginBottom: '3rem' }}>
          Shop Our Collections
        </h2>

        {/* Filter Section Container */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="shop-grid-container">
          
          <style jsx>{`
            @media (min-width: 992px) {
              .shop-grid-container {
                grid-template-columns: 280px 1fr !important;
              }
              .sidebar-filters {
                position: sticky;
                top: 100px;
                height: fit-content;
              }
            }
            .filter-group-title {
              font-size: 0.75rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #777;
              margin-bottom: 0.8rem;
              border-bottom: 1px solid #eee;
              padding-bottom: 0.4rem;
            }
            .filter-list {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-bottom: 1.8rem;
            }
            @media (min-width: 992px) {
              .filter-list {
                flex-direction: column;
                align-items: flex-start;
              }
            }
            .filter-chip {
              background: none;
              border: 1px solid #e2e2e2;
              border-radius: 4px;
              padding: 0.4rem 0.8rem;
              font-size: 0.85rem;
              font-family: var(--font-sans);
              font-weight: 600;
              color: #555;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .filter-chip.active {
              background-color: #1b2c13;
              color: #fff;
              border-color: #1b2c13;
            }
            .product-card {
              display: flex;
              flex-direction: column;
              background-color: #fff;
              border-radius: 8px;
              overflow: hidden;
              position: relative;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              border: 1px solid #f0f0f0;
              height: 100%;
              text-decoration: none;
              color: inherit;
            }
            .product-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .quick-add-btn {
              background-color: rgba(255,255,255,0.95);
              color: #111;
              border: 1px solid #111;
              font-family: var(--font-sans);
              font-weight: 700;
              font-size: 0.8rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              width: 90%;
              padding: 0.8rem;
              position: absolute;
              bottom: 15px;
              left: 5%;
              cursor: pointer;
              border-radius: 4px;
              opacity: 0;
              transform: translateY(10px);
              transition: all 0.3s ease;
              z-index: 10;
            }
            .product-card:hover .quick-add-btn {
              opacity: 1;
              transform: translateY(0);
            }
            @media (max-width: 768px) {
              .quick-add-btn {
                opacity: 1 !important;
                transform: translateY(0) !important;
                position: static;
                width: 100%;
                margin-top: 1rem;
                background-color: #1b2c13;
                color: #fff;
                border-color: #1b2c13;
                padding: 0.6rem;
              }
            }
          `}</style>

          {/* SIDEBAR: Filters */}
          <div className="sidebar-filters" style={{ backgroundColor: '#faf9f5', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111', margin: 0 }}>Filters</h3>
              {(selectedCategory !== 'All' || selectedOccasion !== 'All' || selectedBudget !== 'All') && (
                <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: '#a22020', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  Clear All
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <h4 className="filter-group-title">Category</h4>
              <div className="filter-list">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h4 className="filter-group-title">Occasion</h4>
              <div className="filter-list">
                {occasions.map(occ => (
                  <button 
                    key={occ} 
                    onClick={() => setSelectedOccasion(occ)}
                    className={`filter-chip ${selectedOccasion === occ ? 'active' : ''}`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <h4 className="filter-group-title">Budget</h4>
              <div className="filter-list">
                {budgets.map(bud => (
                  <button 
                    key={bud} 
                    onClick={() => setSelectedBudget(bud)}
                    className={`filter-chip ${selectedBudget === bud ? 'active' : ''}`}
                  >
                    {bud}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* PRODUCTS GRID */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
              <span>Showing <strong>{filteredProducts.length}</strong> products</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {filteredProducts.map(({ node: product }) => {
                const variantId = product.variants?.edges?.[0]?.node?.id || product.id;
                const price = product.priceRange.maxVariantPrice;
                const formattedPrice = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: price.currencyCode,
                  maximumFractionDigits: 0
                }).format(price.amount);
                
                return (
                  <Link key={product.id} href={`/product/${product.handle}`} className="product-card">
                    
                    {/* Image Box */}
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
                      
                      {/* Desktop hover Quick Add */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(variantId, 1, true);
                        }}
                        disabled={isLoading}
                        className="quick-add-btn"
                      >
                        {isLoading ? 'Adding...' : 'Quick Add +'}
                      </button>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111', margin: '0 0 0.5rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4rem', lineHeight: '1.2rem' }}>
                        {product.title.split('|')[0].trim()}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1b2c13' }}>
                          {formattedPrice}
                        </span>
                      </div>
                      
                      {/* Mobile visible Quick Add button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(variantId, 1, true);
                        }}
                        disabled={isLoading}
                        className="mobile-only quick-add-btn"
                        style={{ display: 'none' }} /* overridden by stylesheet on mobile */
                      >
                        {isLoading ? 'Adding...' : 'Quick Add +'}
                      </button>
                    </div>

                  </Link>
                );
              })}
            </div>
            
            {filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#777', backgroundColor: '#faf9f5', borderRadius: '8px', border: '1px dashed #ddd', marginTop: '1rem' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', margin: '0 0 0.4rem 0' }}>No products match your filters</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 1rem 0' }}>Try clearing some filters to explore more handcrafted gifts.</p>
                <button onClick={resetFilters} style={{ backgroundColor: '#1b2c13', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Reset All Filters
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
