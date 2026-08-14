import { getProducts } from '@/lib/shopify';
import Header from '@/components/Header';
import QuizSection from '@/components/QuizSection';
import ReviewsSection from '@/components/ReviewsSection';
import Link from 'next/link';
import BestSellersCarousel from '@/components/BestSellersCarousel';
import VideoReels from '@/components/VideoReels';
import CategoryProducts from '@/components/CategoryProducts';
import ReadyToGiftHampers from '@/components/ReadyToGiftHampers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Phases Handcrafted | Premium Handcrafted Gifts, Candles & Hampers',
  description: 'Shop premium handcrafted soy candles, adorable soft toys, keychains, and curated gift hampers. Make your own personalized gift box with pan-India express delivery.',
};

export default async function Home() {
  const products = await getProducts();

  // Filter curated hampers for the dedicated Hampers shelf
  const curatedHampers = products.filter(({ node }) => {
    const title = node.title.toLowerCase();
    const tags = (node.tags || []).map(t => t.toLowerCase());
    return tags.includes('hamper') || title.includes('hamper') || title.includes('bundle') || title.includes('gift set');
  }).map(({ node }) => node);

  return (
    <main style={{ backgroundColor: '#faf9f5' }}>
      <Header theme="transparent" />

      {/* Premium responsive Hero Section */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '78vh',
        minHeight: '550px',
        backgroundColor: '#ebd492',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1.5rem',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.03)'
      }}>
        {/* Background Image & Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(to right, rgba(250, 249, 245, 0.96) 35%, rgba(250, 249, 245, 0.7) 100%), url("https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-sans)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1b2c13', marginBottom: '1.2rem', display: 'inline-block' }}>
            ✦ Premium Gifting Store ✦
          </span>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(2.5rem, 6vw, 4.6rem)', 
            fontWeight: 400, 
            color: '#111', 
            lineHeight: 1.15, 
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            Gifts They’ll <span style={{ fontStyle: 'italic', color: '#1b2c13' }}>Actually</span> Remember.
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-sans)', 
            fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)', 
            color: '#555', 
            marginBottom: '2.5rem', 
            lineHeight: 1.6,
            maxWidth: '650px'
          }}>
            Handcrafted soy candles, adorable plush toys & festive picks — thoughtfully curated and custom-packed for every special moment.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link href="#products" style={{ 
              backgroundColor: '#1b2c13', color: '#fff', padding: '1.1rem 2.2rem', borderRadius: '4px',
              fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(27,44,19,0.15)', transition: 'all 0.2s ease'
            }}>
              Shop Gifts
            </Link>
            <Link href="/build-your-bundle" style={{ 
              backgroundColor: '#fff', color: '#1b2c13', padding: '1.1rem 2.2rem', borderRadius: '4px', border: '1px solid #1b2c13',
              fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}>
              Make Your Own Bundle →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Trigger Bar */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
        padding: '1.2rem 0',
        overflow: 'hidden'
      }}>
        <div style={{ 
          maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '1.5rem',
          fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, color: '#444', letterSpacing: '0.05em', textTransform: 'uppercase'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🌱 100% Handcrafted</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🎁 Gift-Ready Packaging</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>✍️ Personalized Message card</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🚚 Pan-India Delivery</span>
        </div>
      </div>

      {/* Shop By Occasion */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#faf9f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 400, color: '#1b2c13', marginBottom: '0.8rem' }}>
            Shop by Occasion
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '3rem', fontFamily: 'var(--font-sans)' }}>Find the perfect gift tailored for every milestone.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Birthday', icon: '🎂', bg: '#fcddec', query: '/?occasion=Birthday#products' },
              { label: 'Anniversary', icon: '❤️', bg: '#fde2e4', query: '/?occasion=Anniversary#products' },
              { label: 'Raksha Bandhan', icon: '🧵', bg: '#ffeed9', query: '/?occasion=Raksha%20Bandhan#products' },
              { label: 'Romantic', icon: '💕', bg: '#ffcad4', query: '/?occasion=Romantic#products' },
              { label: 'Festive Gifts', icon: '✨', bg: '#e8f5e9', query: '/?occasion=Festive#products' },
              { label: 'Kids Gifts', icon: '👶', bg: '#e3f2fd', query: '/?occasion=Kids#products' }
            ].map((occ, i) => (
              <Link href={occ.query} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="hover-card"
                style={{
                  backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', padding: '1.8rem 1rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
                  cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
                >
                  <span style={{ fontSize: '2rem', backgroundColor: occ.bg, width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {occ.icon}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: '#111' }}>{occ.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <BestSellersCarousel products={products} />

      {/* Make Your Own Bundle Teaser Section */}
      <section style={{ backgroundColor: '#1b2c13', color: '#fff', padding: '6rem 2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          <div style={{ flex: '1 1 450px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ebd492', display: 'block', marginBottom: '1.2rem', fontFamily: 'var(--font-sans)' }}>
              ✦ Interactive Builder ✦
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: '1.5rem' }}>
              Create a Gift That&apos;s <span style={{ fontStyle: 'italic' }}>Uniquely Yours</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#e5e0d8', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '550px', fontFamily: 'var(--font-sans)' }}>
              Choose your box packaging, add hand-picked candles, adorable toys, keychains, and a personalized greeting card. We will assemble it beautifully and deliver it to your loved ones.
            </p>
            <Link href="/build-your-bundle" style={{ 
              backgroundColor: '#ebd492', color: '#1b2c13', padding: '1.1rem 2.5rem', borderRadius: '4px', textDecoration: 'none',
              fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
              display: 'inline-block', boxShadow: '0 4px 15px rgba(238,212,146,0.2)', transition: 'all 0.2s ease'
            }}>
              Build My Bundle →
            </Link>
          </div>
          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px', aspectRatio: '1', backgroundColor: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎁</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>Build a ₹999 Gift Box</h3>
              <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.4, fontFamily: 'var(--font-sans)' }}>Pick any 4 items and get a free premium box + personalized card + gift discount!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Budget */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#faf9f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 400, color: '#1b2c13', marginBottom: '0.8rem' }}>
            Gifts For Every Budget
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '3.5rem', fontFamily: 'var(--font-sans)' }}>Filter products instantly based on your budget limit.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Under ₹299', desc: 'Small surprises', query: '/?budget=Under%20%E2%82%B9299#products' },
              { label: 'Under ₹499', desc: 'Thoughtful gestures', query: '/?budget=Under%20%E2%82%B9499#products' },
              { label: 'Under ₹999', desc: 'Perfect gift sets', query: '/?budget=Under%20%E2%82%B9999#products' },
              { label: 'Premium Gifts', desc: 'Luxury collections', query: '/?budget=Premium#products' }
            ].map((bud, i) => (
              <Link href={bud.query} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="hover-card"
                style={{
                  backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', padding: '2rem 1.5rem',
                  cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1b2c13', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-sans)' }}>{bud.label}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, fontFamily: 'var(--font-sans)' }}>{bud.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ready-to-Gift Hampers grid shelf */}
      <ReadyToGiftHampers hampers={curatedHampers} />

      {/* Catalog & Filter Grid */}
      <CategoryProducts products={products} />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Reels Ticker */}
      <VideoReels />

      {/* Quiz Section */}
      <QuizSection />

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
            <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1.5rem' }}>Subscribe so you don&apos;t miss anything!</p>
            <div style={{ display: 'flex', height: '50px', maxWidth: '400px' }}>
              <input type="email" placeholder="Your e-mail" style={{ flex: 1, padding: '0 1rem', border: 'none', backgroundColor: '#fff', outline: 'none', color: '#111', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }} />
              <button style={{ padding: '0 1.5rem', backgroundColor: '#ebd492', border: 'none', color: '#1b2c13', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>→</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', fontSize: '0.75rem', letterSpacing: '0.1em', color: '#aaa', textTransform: 'uppercase' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <span>COPYRIGHT &copy;{new Date().getFullYear()} PHASES HANDCRAFTED</span>
            </div>
            <button style={{ backgroundColor: '#111', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>
              Refund Policy
            </button>
          </div>

        </div>
      </footer>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-4px) !important;
          border-color: #1b2c13 !important;
        }
      `}} />
    </main>
  );
}
