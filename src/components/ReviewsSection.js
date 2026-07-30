import React from 'react';

const reviews = [
  {
    name: "Harshit",
    product: "Handcrafted Floral Puppy Soft Toy",
    text: "I absolutely loved this handmade floral puppy! The fabric print is beautiful, the stitching is excellent, and it's so soft.",
    image: "https://images.unsplash.com/photo-1590236025287-99e7b2829026?w=400&q=80"
  },
  {
    name: "Ahalya Devi",
    product: "Blush Bloom Candle",
    text: "I bulk ordered Daisy and Sun & Moon candles, and received 3 rose candles as well! They smell heavenly and the packaging is so cute.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80"
  },
  {
    name: "Yuvraj Kumar Pandit",
    product: "Midnight Orchid Soy Candle",
    text: "I absolutely love this candle! The Midnight Orchid fragrance feels rich, calming, and sets the perfect mood for evenings.",
    image: "https://images.unsplash.com/photo-1605814571933-2895690b2014?w=400&q=80"
  },
  {
    name: "Tejeshwani",
    product: "Phases Handcrafted",
    text: "I recently received this candle and absolutely loved it. The fragrance is rich, warm, and smells just like a freshly made coffee latte without being too strong. It arrived well-packaged, looks amazing in my room.",
    image: null
  }
];

export default function ReviewsSection() {
  return (
    <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-cream)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-espresso)' }}>Customers Are Saying</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', color: '#111' }}>
              {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-espresso)' }}>5.00</span>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>(7)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: '#059669', marginLeft: '0.5rem', fontWeight: '500' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Verified
            </span>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {reviews.map((review, index) => (
            <div key={index} style={{ 
              backgroundColor: '#fff', 
              borderRadius: '1rem', 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {review.image && (
                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                  <img src={review.image} alt={review.product} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ 
                  color: '#be185d', 
                  fontStyle: 'italic', 
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  flex: 1
                }}>
                  "{review.text}"
                </p>
                <div style={{ display: 'flex', color: '#047857', marginBottom: '0.5rem', letterSpacing: '2px' }}>
                  ★★★★★
                </div>
                <div style={{ fontWeight: '600', color: '#be185d', fontSize: '1rem', marginBottom: '0.2rem' }}>
                  {review.name}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {review.product}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
