import { getProducts } from '@/lib/shopify';
import PremiumHero from "@/components/PremiumHero";
import Header from '@/components/Header';
import AddToCartButton from '@/components/AddToCartButton';
import QuizSection from '@/components/QuizSection';
import ReviewsSection from '@/components/ReviewsSection';
import Link from 'next/link';

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

      {/* Fullscreen Premium Hero Slideshow */}
      <PremiumHero />

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
      <div className="marquee-container">
        <div className="marquee-content">
          <span>EXPRESS DELIVERY</span>
          <span>ENJOY FREE SHIPPING ON ORDERS ABOVE ₹500</span>
          <span>PRICES REDUCED AFTER GST 2.0 (MRP MAY VARY)</span>
          <span>FREE, DISCREET & 1-3 DAY EXPRESS DELIVERY</span>
          <span>EXPRESS DELIVERY</span>
          <span>ENJOY FREE SHIPPING ON ORDERS ABOVE ₹500</span>
          <span>PRICES REDUCED AFTER GST 2.0 (MRP MAY VARY)</span>
          <span>FREE, DISCREET & 1-3 DAY EXPRESS DELIVERY</span>
        </div>
      </div>

      {/* Categories Section */}
      <section className="categories-section reveal-up">
        <h2 className="categories-heading">Shop by Category</h2>
        <div className="categories-list">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-item">
              {cat.isOffer ? (
                <div className="category-circle offer">
                  50%<br/>OFF
                </div>
              ) : (
                <div className="category-circle" style={{ backgroundColor: cat.color }}>
                  {cat.img ? (
                    <img src={cat.img} alt={cat.label.replace('\n', ' ')} loading="lazy" />
                  ) : null}
                </div>
              )}
              <div className="category-label" style={{ whiteSpace: 'pre-line' }}>
                {cat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee Section */}
      <div className="marquee-container">
        <div className="marquee-content">
          HANDCRAFTED SOY WAX • 100% NATURAL & TOXIC FREE • SLOW BURNING • ETHICALLY SOURCED • HANDPOURED WITH LOVE • HANDCRAFTED SOY WAX • 100% NATURAL & TOXIC FREE • SLOW BURNING • ETHICALLY SOURCED • HANDPOURED WITH LOVE
        </div>
      </div>

      {/* Latest Arrivals */}
      <section id="products" className="products-section">
        <div className="products-header reveal-up" style={{ gap: '1.5rem', padding: '0 2rem' }}>
          <h2 className="products-title" style={{ marginBottom: '0.5rem' }}>Latest Arrivals</h2>
          <p className="products-subtitle" style={{ marginTop: '0' }}>Explore our newest hand-poured candles and comforting soft companions.</p>
        </div>

        {products.length === 0 ? (
          <div className="products-empty">
            No products found. Make sure your Shopify store has active products!
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => {
              const { node } = product;
              const image = node.images.edges[0]?.node;
              const price = node.priceRange.maxVariantPrice;
              return (
                <div 
                  key={node.id} 
                  className="product-card flat-card reveal-up group" 
                  style={{ animationDelay: `${index * 0.15}s`, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                >
                  <Link href={`/product/${node.handle}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="product-image-container" style={{ backgroundColor: '#f9f9f9', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1/1', marginBottom: '1rem', overflow: 'hidden' }}>
                      {image ? (
                        <img 
                          src={image.url} 
                          alt={image.altText || node.title} 
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="product-no-img">No Image</div>
                      )}
                    </div>
                    <div className="product-info" style={{ padding: '0' }}>
                      <h3 className="product-title" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.2rem' }}>{node.title.split('|')[0].trim()}</h3>
                      <p className="product-price" style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: price.currencyCode,
                          maximumFractionDigits: 0
                        }).format(price.amount)}
                      </p>
                    </div>
                  </Link>
                  <div style={{ marginTop: '0.5rem' }}>
                    <AddToCartButton 
                      variantId={node.variants.edges[0]?.node?.id} 
                      disabled={!node.variants.edges[0]?.node?.availableForSale}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quiz Banner Section */}
      <QuizSection />

      {/* Reviews Section */}
      <ReviewsSection />

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
      <section className="parallax-banner" style={{
        height: '70vh',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        backgroundImage: 'url("https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=2000")',
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
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          padding: '3rem 5rem',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          color: '#fff',
          maxWidth: '80%'
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '300', fontFamily: 'var(--font-serif)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Handpoured with Intention
          </h2>
          <p style={{ fontSize: '1.2rem', fontWeight: '300', letterSpacing: '0.1em', opacity: 0.8, textTransform: 'uppercase' }}>
            Ethically sourced • Non-toxic • Cruelty Free
          </p>
        </div>
      </section>

      {/* Maker Story Section */}
      <section className="maker-story-section reveal-up">
        <div className="maker-story-img-wrap">
          <img src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80" alt="Handpouring soy wax" loading="lazy" />
        </div>
        <div className="maker-story-content">
          <span className="maker-story-subtitle">Our Artistry</span>
          <h2 className="maker-story-title">Crafted in Small Batches with Pure Intent</h2>
          <p className="maker-story-p">
            At Phases, every candle is hand-poured in our studio using 100% natural soy wax, lead-free cotton wicks, and botanical fragrance oils.
          </p>
          <p className="maker-story-p">
            We believe your sanctuary deserves scents that bring warmth without toxins. Every flame is a reminder to slow down, breathe, and embrace your current phase.
          </p>
        </div>
      </section>

      {/* The Phases Promise Section */}
      <section className="promise-section reveal-up">
        <h2 className="promise-title">The Phases Promise</h2>
        <div className="promise-grid">
          <div className="promise-item">
            <div className="promise-icon-circle">
              <img src="https://cdn-icons-png.flaticon.com/512/195/195155.png" alt="Trusted" style={{ filter: 'invert(1)' }} />
            </div>
            <div className="promise-label">Trusted by Thousands</div>
          </div>
          <div className="promise-item">
            <div className="promise-icon-circle">
              <img src="https://cdn-icons-png.flaticon.com/512/679/679821.png" alt="Delivery" />
            </div>
            <div className="promise-label">Safe & Secure Packaging</div>
          </div>
          <div className="promise-item">
            <div className="promise-icon-circle">
              <img src="https://cdn-icons-png.flaticon.com/512/888/888034.png" alt="Quality" style={{ filter: 'invert(1)' }} />
            </div>
            <div className="promise-label">Premium Handcrafted Quality</div>
          </div>
        </div>
      </section>

      {/* Delivered Safely Section */}
      <section className="delivery-section reveal-up">
        <div className="delivery-text">
          <h2 className="delivery-title">Delivered Safely</h2>
          <p className="delivery-subtitle">Because we care about your unboxing experience.</p>
        </div>
        <div className="delivery-image">
          <img src="https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=800&q=80" alt="Cardboard Box" loading="lazy" />
        </div>
      </section>



      {/* Newsletter Signup */}
      <section className="newsletter-section reveal-up">
        <h2 className="newsletter-title">Join the Phases Handcrafted Sanctuary</h2>
        <p className="newsletter-sub">Subscribe to get 10% off your first order & exclusive early access to new seasonal drops.</p>
        <form className="newsletter-form" action="#">
          <input type="email" placeholder="Enter your email address..." className="newsletter-input" required />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section reveal-up">
        <div className="compare-card brand">
          <h2 className="compare-title">phases handcrafted.</h2>
          <ul className="compare-list">
            <li className="compare-item">
              <span className="compare-icon">✓</span>
              Premium Natural Wax
            </li>
            <li className="compare-item">
              <span className="compare-icon">✓</span>
              Hand-poured with Care
            </li>
            <li className="compare-item">
              <span className="compare-icon">✓</span>
              Safe, Non-toxic Scents
            </li>
            <li className="compare-item">
              <span className="compare-icon">✓</span>
              Elegant Minimalist Designs
            </li>
          </ul>
        </div>
        <div className="compare-card others">
          <h2 className="compare-title">Others</h2>
          <ul className="compare-list">
            <li className="compare-item">
              <span className="compare-icon">✕</span>
              Mass-produced Paraffin
            </li>
            <li className="compare-item">
              <span className="compare-icon">✕</span>
              Machine Manufactured
            </li>
            <li className="compare-item">
              <span className="compare-icon">✕</span>
              Harsh Artificial Fragrances
            </li>
            <li className="compare-item">
              <span className="compare-icon">✕</span>
              Clunky, Loud Designs
            </li>
          </ul>
        </div>
      </section>

      {/* Robust Footer */}
      <footer className="footer-robust">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">PHASES HANDCRAFTED.</div>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, maxWidth: '300px' }}>
              Handcrafted warmth for your home. Elevating everyday moments with gentle textures and inviting scents.
            </p>
          </div>
          <div>
            <h4 className="footer-col-title">Shop</h4>
            <ul className="footer-links">
              <li><Link href="/">All Products</Link></li>
              <li><Link href="/">Candles</Link></li>
              <li><Link href="/">Soft Toys</Link></li>
              <li><Link href="/">Gift Sets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">About</h4>
            <ul className="footer-links">
              <li><Link href="/">Our Story</Link></li>
              <li><Link href="/">Ingredients</Link></li>
              <li><Link href="/">Sustainability</Link></li>
              <li><Link href="/">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Help</h4>
            <ul className="footer-links">
              <li><Link href="/">FAQ</Link></li>
              <li><Link href="/">Shipping & Returns</Link></li>
              <li><Link href="/">Track Order</Link></li>
              <li><Link href="/">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Phases Handcrafted. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
