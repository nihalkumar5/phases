import React from 'react';

const reviews = [
  {
    name: "Harshit R.",
    date: "12/08/2026",
    product: "FLORAL PUPPY SOFT TOY",
    text: "I absolutely loved this handmade floral puppy! The fabric print is beautiful, the stitching is excellent, and it's so soft."
  },
  {
    name: "Ahalya D.",
    date: "05/08/2026",
    product: "BLUSH BLOOM CANDLE",
    text: "They smell heavenly and the packaging is so cute. I bulk ordered and absolutely love the scents!"
  },
  {
    name: "Yuvraj P.",
    date: "28/07/2026",
    product: "MIDNIGHT ORCHID CANDLE",
    text: "I absolutely love this candle! The Midnight Orchid fragrance feels rich, calming, and sets the perfect mood for evenings."
  },
  {
    name: "Tejeshwani K.",
    date: "15/07/2026",
    product: "COFFEE LATTE CANDLE",
    text: "The fragrance is rich, warm, and smells just like a freshly made coffee latte without being too strong."
  },
  {
    name: "Ananya S.",
    date: "02/07/2026",
    product: "SOFT TOY COMBO",
    text: "Beautiful craftsmanship and quick delivery. The attention to detail in the packaging made it feel really premium."
  }
];

export default function ReviewsSection() {
  return (
    <section style={{ padding: '4rem 0', backgroundColor: '#fff', width: '100%' }}>
      {/* Header part */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 1.5rem' }}>
        <h2 style={{ 
          fontSize: '2.2rem', 
          fontFamily: 'var(--font-serif)', 
          fontWeight: 400,
          color: '#111',
          marginBottom: '1.5rem'
        }}>
          Our customer <span style={{ fontStyle: 'italic', fontWeight: 300 }}>reviews</span>
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            fontSize: '3.5rem', 
            fontFamily: 'var(--font-serif)', 
            fontWeight: 400,
            lineHeight: 1,
            color: '#111',
            marginBottom: '0.5rem'
          }}>
            4.8<span style={{ fontSize: '2rem' }}>/5</span>
          </div>
          
          <div style={{ color: '#111', fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>
            ★★★★★
          </div>
          
          <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'var(--font-sans)' }}>
            Based on 350 reviews
          </div>
        </div>
      </div>
      
      {/* Reviews Carousel */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee'
      }}
      className="hide-scroll"
      >
        {reviews.map((review, idx) => (
          <div key={idx} style={{
            flex: '0 0 85%',
            maxWidth: '400px',
            scrollSnapAlign: 'start',
            padding: '2rem 1.5rem',
            borderRight: '1px solid #eee',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px'
          }}>
            <div>
              <div style={{ color: '#111', fontSize: '1rem', letterSpacing: '1px', marginBottom: '1rem' }}>
                ★★★★★
              </div>
              <p style={{ 
                fontFamily: 'var(--font-sans)', 
                fontSize: '0.95rem', 
                color: '#333', 
                lineHeight: 1.6,
                fontWeight: 400
              }}>
                "{review.text}"
              </p>
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ 
                fontFamily: 'var(--font-sans)', 
                fontSize: '0.9rem', 
                fontWeight: 700, 
                color: '#111' 
              }}>
                {review.name}
              </span>
              <span style={{ 
                fontFamily: 'var(--font-sans)', 
                fontSize: '0.75rem', 
                color: '#888' 
              }}>
                {review.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Brand Promise Section */}
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ 
          fontSize: '1.8rem', 
          fontFamily: 'var(--font-serif)', 
          fontWeight: 400,
          color: '#111',
          marginBottom: '1.5rem'
        }}>
          Our promise: <span style={{ fontStyle: 'italic', fontWeight: 300 }}>delight in every detail.</span>
        </h3>
        <p style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: '0.9rem', 
          color: '#555', 
          lineHeight: 1.8,
          fontWeight: 400
        }}>
          More than just a candle or a soft toy, Phases Handcrafted is about creating unique experiences. 
          Every piece is carefully handmade to spark joy, comfort, and a touch of magic in your everyday life. 
          From the scent to the stitch, it's crafted with love.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
