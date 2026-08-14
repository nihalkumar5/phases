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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
      window.addEventListener('popstate', handleHashAndParams);
      return () => window.removeEventListener('popstate', handleHashAndParams);
    }
  }, []);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

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

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + 
                            (selectedOccasion !== 'All' ? 1 : 0) + 
                            (selectedBudget !== 'All' ? 1 : 0);

  return (
    <section id="products" style={{ padding: '2rem 5% 5rem 5%', backgroundColor: '#fff', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontFamily: 'var(--font-serif)', fontWeight: 400, color: '#1b2c13', textAlign: 'center', marginBottom: '2rem' }}>
          Shop Our Collections
        </h1>

        {/* MOBILE: Clean Category Pills + Filter Button */}
        <div className="mobile-filter-bar">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="mobile-filter-btn"
            aria-label="Open Filters"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>

          {/* Horizontal scrollable categories */}
          <div className="category-scroll-container hide-scroll">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Tags Row on Mobile when filters applied */}
        {activeFilterCount > 0 && (
          <div className="mobile-active-tags">
            {selectedCategory !== 'All' && (
              <span className="active-tag">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} aria-label="Remove category filter">✕</button>
              </span>
            )}
            {selectedOccasion !== 'All' && (
              <span className="active-tag">
                {selectedOccasion}
                <button onClick={() => setSelectedOccasion('All')} aria-label="Remove occasion filter">✕</button>
              </span>
            )}
            {selectedBudget !== 'All' && (
              <span className="active-tag">
                {selectedBudget}
                <button onClick={() => setSelectedBudget('All')} aria-label="Remove budget filter">✕</button>
              </span>
            )}
            <button onClick={resetFilters} className="clear-all-inline-btn">
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid Container */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="shop-grid-container">

          {/* DESKTOP SIDEBAR: Filters */}
          <div className="sidebar-filters" style={{ backgroundColor: '#faf9f5', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111', margin: 0 }}>Filters</h3>
              {activeFilterCount > 0 && (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', fontSize: '0.85rem', color: '#666' }}>
              <span>Showing <strong>{filteredProducts.length}</strong> products</span>
            </div>

            <div className="responsive-product-grid">
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
                        className="quick-add-btn desktop-quick-add"
                      >
                        {isLoading ? 'Adding...' : 'Quick Add +'}
                      </button>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111', margin: '0 0 0.4rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4rem', lineHeight: '1.2rem' }}>
                        {product.title.split('|')[0].trim()}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.3rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1b2c13' }}>
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
                        className="quick-add-btn"
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

      {/* MOBILE BOTTOM SHEET MODAL FOR ALL FILTERS */}
      {isMobileFilterOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
          }}
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.2rem 1.5rem',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>
                  Filter Products
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#777' }}>
                  {filteredProducts.length} items found
                </span>
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                style={{
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Category Options */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', margin: '0 0 0.8rem 0' }}>
                  Category
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: selectedCategory === cat ? '1px solid #1b2c13' : '1px solid #e0e0e0',
                        backgroundColor: selectedCategory === cat ? '#1b2c13' : '#fff',
                        color: selectedCategory === cat ? '#fff' : '#444',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion Options */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', margin: '0 0 0.8rem 0' }}>
                  Shop by Occasion
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {occasions.map(occ => (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: selectedOccasion === occ ? '1px solid #1b2c13' : '1px solid #e0e0e0',
                        backgroundColor: selectedOccasion === occ ? '#1b2c13' : '#fff',
                        color: selectedOccasion === occ ? '#fff' : '#444',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Options */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', margin: '0 0 0.8rem 0' }}>
                  Shop by Budget
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {budgets.map(bud => (
                    <button
                      key={bud}
                      onClick={() => setSelectedBudget(bud)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: selectedBudget === bud ? '1px solid #1b2c13' : '1px solid #e0e0e0',
                        backgroundColor: selectedBudget === bud ? '#1b2c13' : '#fff',
                        color: selectedBudget === bud ? '#fff' : '#444',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {bud}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid #eee',
              backgroundColor: '#fafafa',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <button
                onClick={resetFilters}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  color: '#444',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                style={{
                  flex: 2,
                  padding: '0.85rem',
                  backgroundColor: '#1b2c13',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Apply ({filteredProducts.length})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SINGLE UNIFIED STYLED-JSX BLOCK */}
      <style jsx>{`
        /* Mobile Category & Filter Bar */
        .mobile-filter-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
          width: 100%;
        }
        .mobile-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: #f6f5f0;
          border: 1px solid #1b2c13;
          color: #1b2c13;
          padding: 0.55rem 0.9rem;
          border-radius: 20px;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .filter-badge {
          background-color: #1b2c13;
          color: #fff;
          font-size: 0.65rem;
          border-radius: 50%;
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }
        .category-scroll-container {
          display: flex;
          gap: 0.45rem;
          overflow-x: auto;
          padding: 0.2rem 0;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          width: 100%;
        }
        .category-pill {
          flex-shrink: 0;
          scroll-snap-align: start;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          padding: 0.45rem 0.9rem;
          font-size: 0.82rem;
          font-family: var(--font-sans);
          font-weight: 600;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .category-pill.active {
          background-color: #1b2c13;
          color: #fff;
          border-color: #1b2c13;
        }
        .mobile-active-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: center;
          margin-bottom: 1.2rem;
        }
        .active-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background-color: #1b2c13;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
        }
        .active-tag button {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 0.75rem;
          padding: 0;
          line-height: 1;
        }
        .clear-all-inline-btn {
          background: none;
          border: none;
          color: #a22020;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
        }

        /* Product Grid */
        .responsive-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.9rem;
        }

        /* Responsive rules for Desktop vs Mobile */
        @media (max-width: 991px) {
          .sidebar-filters {
            display: none !important;
          }
        }
        @media (min-width: 600px) {
          .responsive-product-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
            gap: 1.5rem !important;
          }
        }
        @media (min-width: 992px) {
          .mobile-filter-bar, .mobile-active-tags {
            display: none !important;
          }
          .shop-grid-container {
            grid-template-columns: 280px 1fr !important;
          }
          .sidebar-filters {
            position: sticky;
            top: 100px;
            height: fit-content;
            display: block !important;
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
            margin-top: 0.8rem;
            background-color: #1b2c13;
            color: #fff;
            border-color: #1b2c13;
            padding: 0.55rem;
            font-size: 0.78rem;
          }
        }

        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  );
}
