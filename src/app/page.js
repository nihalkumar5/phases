import { getProducts } from '@/lib/shopify';
import MobileHero from "@/components/MobileHero";
import DesktopHero from "@/components/DesktopHero";
import Header from '@/components/Header';
import AddToCartButton from '@/components/AddToCartButton';
import QuizSection from '@/components/QuizSection';
import ReviewsSection from '@/components/ReviewsSection';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import RetroBadge from '@/components/RetroBadge';
import BestSellersCarousel from '@/components/BestSellersCarousel';
import VideoReels from '@/components/VideoReels';
import CategoryProducts from '@/components/CategoryProducts';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Phases Handcrafted | Premium Candles & Soft Toys',
  description: 'Discover our premium handcrafted candles and soft toys.',
};

export default async function Home() {
  const products = await getProducts();

  const categories = [
    { label: 'Candles', img: '/cat_candles.png', color: '#161A1F' },
    { label: 'Freshner', img: '/cat_freshner.png', color: '#161A1F' },
    { label: 'Soft Toys', img: '/cat_soft_toys.png', color: '#161A1F' },
    { label: 'Hampers', img: '/cat_hampers.png', color: '#161A1F' },
  ];

  return (
    <main>
      <Header theme="transparent" />

      {/* Desktop Hero (Video) */}
      <div className="desktop-only">
        <DesktopHero />
      </div>

      {/* Mobile Hero (Slideshow) */}
      <div className="mobile-only">
        <MobileHero />
      </div>

      {/* Best Sellers Carousel Section */}
      <BestSellersCarousel products={products} />

      {/* Legacy Hero Section (MyMuse Style)
      <section className="hero-mymuse">
        <img 
          src="/home-still.jpg" 
          alt="Handcrafted Candles and Soft Toys" 
          className="hero-image-bg" 
        />
        <div className="hero-content reveal-up">
          <div className="pill-label dark-pill mb-6">NEW COLLECTION</div>
          <h1 className="hero-title">
            It&apos;s a good day<br/>to feel good
          </h1>
          <div className="trust-badge">
            4.7 ★★★★★
          </div>
          <div className="trust-text">
            Trusted by 3.75L+ Indians
          </div>
          <Link href="#products" className="btn-island group" style={{ textDecoration: 'none' }}>
            <span className="btn-island-text">Shop the Collection</span>
            <div className="btn-nested-wrapper light-nested">
              <span>↗</span>
            </div>
          </Link>
        </div>
      </section>
      */}

      {/* Marquee Ticker */}
      <div className="marquee-container" style={{ backgroundColor: '#EED492', color: '#111', padding: '10px 0', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
        <div className="marquee-content" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
          <span>✨ 100% HANDPOURED SOY WAX</span>
          <span>•</span>
          <span>TOXIC FREE & VEGAN</span>
          <span>•</span>
          <span>LUXURY CRAFTSMANSHIP</span>
          <span>•</span>
          <span>FREE SHIPPING ON ORDERS ABOVE ₹500 ✨</span>
          <span>✨ 100% HANDPOURED SOY WAX</span>
          <span>•</span>
          <span>TOXIC FREE & VEGAN</span>
          <span>•</span>
          <span>LUXURY CRAFTSMANSHIP</span>
          <span>•</span>
          <span>FREE SHIPPING ON ORDERS ABOVE ₹500 ✨</span>
        </div>
      </div>

      {/* Categorized Products */}
      <CategoryProducts products={products} />

      {/* Reviews Section */}
      <ReviewsSection />

      <VideoReels />

      {/* Quiz Banner Section */}
      <QuizSection />

      {/* Insta Updates Section */}
      <section className="insta-updates-section reveal-up">
        <h2 className="insta-updates-title">Insta Updates</h2>
        <div className="insta-updates-grid">
          <img src="/cat1.png" alt="Insta update 1" loading="lazy" />
          <img src="/cat2.png" alt="Insta update 2" loading="lazy" />
          <img src="/cat3.png" alt="Insta update 3" loading="lazy" />
          <img src="/cat4.png" alt="Insta update 4" loading="lazy" />
          <img src="/cat5.png" alt="Insta update 5" loading="lazy" />
        </div>
      </section>

      {/* Parallax Banner Section */}
      <section style={{
        height: '70vh',
        width: '100%',
        backgroundImage: 'url("https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?q=80&w=2000")',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 1
        }} />
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#fff',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '300', fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Handpoured with Intention
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            <span>Ethically sourced</span>
            <span>•</span>
            <span>Non-toxic</span>
            <span>•</span>
            <span>Cruelty Free</span>
          </div>
        </div>
      </section>

      {/* Maker Story Section (Premium) */}
      <section style={{ backgroundColor: '#fff', padding: '6rem 2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          
          {/* Image Side */}
          <div style={{ flex: '1 1 400px', position: 'relative' }}>
            <div style={{ 
              width: '100%', 
              aspectRatio: '4/5', 
              overflow: 'hidden', 
              borderRadius: '4px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80" 
                alt="Handpouring soy wax" 
                loading="lazy" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Decorative accent */}
            <div style={{
              position: 'absolute',
              bottom: '-1.5rem',
              right: '-1.5rem',
              width: '60%',
              height: '40%',
              backgroundColor: '#f5f5f0',
              zIndex: -1,
              borderRadius: '4px'
            }} />
          </div>

          {/* Text Side */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '0.85rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.2em', 
              color: '#888',
              marginBottom: '1.5rem',
              display: 'block'
            }}>
              Our Artistry
            </span>
            
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
              fontWeight: 400, 
              color: '#111', 
              lineHeight: 1.2,
              marginBottom: '2rem'
            }}>
              Crafted in Small Batches with <span style={{ fontStyle: 'italic' }}>Pure Intent.</span>
            </h2>
            
            <p style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '1rem', 
              color: '#555', 
              lineHeight: 1.8, 
              marginBottom: '1.5rem',
              maxWidth: '500px'
            }}>
              At Phases, every candle is hand-poured in our studio using 100% natural soy wax, lead-free cotton wicks, and botanical fragrance oils.
            </p>
            
            <p style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '1rem', 
              color: '#555', 
              lineHeight: 1.8,
              marginBottom: '3rem',
              maxWidth: '500px'
            }}>
              We believe your sanctuary deserves scents that bring warmth without toxins. Every flame is a reminder to slow down, breathe, and embrace your current phase.
            </p>

            <div>
              <button 
                className="premium-btn"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #111',
                  color: '#111',
                  padding: '12px 32px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
              >
                Discover Our Story
              </button>
            </div>
          </div>
          
        </div>
      </section>

      {/* The Phases Promise Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: 400, color: '#111', marginBottom: '4rem' }}>
          The Phases Handcrafted Promise
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3rem' }}>🤝</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 500, color: '#111' }}>Trusted by Thousands</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3rem' }}>📦</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 500, color: '#111' }}>Safe & Secure Packaging</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3rem' }}>✨</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 500, color: '#111' }}>Premium Handcrafted Quality</div>
          </div>
        </div>
      </section>



      {/* Minimalist Dark Green Footer */}
      <footer style={{ backgroundColor: '#1b2c13', color: '#fff', padding: '4rem 2rem 2rem 2rem', fontFamily: 'var(--font-sans)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontStyle: 'italic', fontWeight: 300, marginBottom: '2rem', letterSpacing: '1px' }}>
              Phases Handcrafted
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              {['f', 'ig', 'p', 't'].map((icon, i) => (
                <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fff', color: '#1b2c13', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {icon === 'f' ? 'f' : icon === 'ig' ? 'in' : icon === 'p' ? 'P' : 't'}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>About</span>
              <span style={{ fontSize: '1.2rem' }}>+</span>
            </div>
            <div style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Information</span>
              <span style={{ fontSize: '1.2rem' }}>+</span>
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Newsletter</h4>
            <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1.5rem' }}>Subscribe so you don't miss anything!</p>
            <div style={{ display: 'flex', height: '50px', maxWidth: '400px' }}>
              <input type="email" placeholder="Your e-mail" style={{ flex: 1, padding: '0 1rem', border: 'none', backgroundColor: '#fff', outline: 'none', color: '#111', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }} />
              <button style={{ padding: '0 1.5rem', backgroundColor: '#e5e0d8', border: 'none', color: '#111', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>→</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', fontSize: '0.75rem', letterSpacing: '0.1em', color: '#aaa', textTransform: 'uppercase' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <span>COPYRIGHT &copy;{new Date().getFullYear()} PHASES HANDCRAFTED</span>
              <span style={{ display: 'none' }}>|</span>
            </div>
            <button style={{ backgroundColor: '#111', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>
              Refund Policy
            </button>
          </div>

        </div>
      </footer>
    </main>
  );
}
