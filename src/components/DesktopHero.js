'use client';

import Link from 'next/link';

export default function DesktopHero() {
  return (
    <section style={{
      width: '100%',
      backgroundColor: '#f9f9f9',
      paddingBottom: '2rem'
    }}>
      {/* Main Wide Banner */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '60vh',
        minHeight: '500px',
        backgroundColor: '#e7e5df', // Soft neutral background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        overflow: 'hidden'
      }}>
        {/* Abstract shapes or background texture */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url("https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '2px', color: '#555', marginBottom: '1rem' }}>
            Exclusive Offer
          </h3>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontFamily: 'var(--font-serif)', color: '#111', lineHeight: 1.1, marginBottom: '1rem', fontStyle: 'italic' }}>
            Flat 15% OFF
          </h1>
          <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sans)', color: '#333', marginBottom: '2rem', fontWeight: 500 }}>
            on all orders above ₹499/-
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', border: '2px dashed #2e4a26', padding: '0.8rem 1.5rem', borderRadius: '4px', backgroundColor: '#fff' }}>
            <span style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 600, color: '#333', marginRight: '1rem' }}>Use Code:</span>
            <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#2e4a26', letterSpacing: '1px' }}>PHASES15</span>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, width: '45%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
           <img 
              src="https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=800&q=80" 
              alt="Candles display" 
              style={{ width: '100%', maxHeight: '80%', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }} 
            />
        </div>
      </div>

      {/* Secondary Banners */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem',
        padding: '2rem 5% 0 5%',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        {/* Banner 1 */}
        <Link href="#products" style={{ textDecoration: 'none' }}>
          <div style={{
            position: 'relative',
            backgroundColor: '#dcd7c9', // muted beige
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            padding: '2rem',
            height: '250px',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
             <div style={{ zIndex: 2, flex: 1 }}>
                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: '#111', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                  BUY 2<br/>GET 2 FREE
                </h3>
                <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-sans)', color: '#444', fontWeight: 600, letterSpacing: '0.5px' }}>
                  Pick Any 4 Products - Pay for 2
                </p>
             </div>
             <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1596433809252-260c27459eb5?auto=format&fit=crop&w=400&q=80" 
                  alt="Candles" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
             </div>
          </div>
        </Link>

        {/* Banner 2 */}
        <Link href="#products" style={{ textDecoration: 'none' }}>
          <div style={{
            position: 'relative',
            backgroundColor: '#2e4a26', // deep green
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            padding: '2rem',
            height: '250px',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
             <div style={{ zIndex: 2, flex: 1 }}>
                <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-sans)', color: '#e5e0d8', marginBottom: '0.5rem' }}>
                  Upgrade your space
                </p>
                <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: '#fff', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                  BUY ANY 5<br/>FOR ₹1299
                </h3>
             </div>
             <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1603006905393-3971af11c1d4?auto=format&fit=crop&w=400&q=80" 
                  alt="Hampers" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'screen', opacity: 0.9 }} 
                />
             </div>
          </div>
        </Link>

      </div>
    </section>
  );
}
