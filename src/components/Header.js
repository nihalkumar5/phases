'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function Header({ theme = 'light' }) {
  const { openCart, cart } = useCart();
  const itemCount = cart?.lines?.edges?.reduce((acc, line) => acc + line.node.quantity, 0) || 0;

  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = [
    { label: 'Candles', img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80' },
    { label: 'Freshner', img: 'https://images.unsplash.com/photo-1572979213813-9118e6ecbecc?w=400&q=80' },
    { label: 'Soft Toys', img: 'https://images.unsplash.com/photo-1558522195-e1201b090344?w=400&q=80' },
    { label: 'Hampers', img: 'https://images.unsplash.com/photo-1513885045260-6b3086b24c17?w=400&q=80' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = theme === 'transparent' || theme === 'transparent-dark';
  const isDarkText = theme === 'light' || theme === 'transparent-dark';
  
  return (
    <>
      {/* Announcement Bar */}
      <div style={{
        backgroundColor: '#1b2c13',
        color: '#ffffff', 
        padding: '0.6rem 1rem', 
        fontSize: '0.65rem',
        fontWeight: '700',
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          SCENT OF THE MONTH OFFER <span style={{ fontSize: '0.8rem' }}>🤍</span>
        </div>
      </div>
      
      {/* Main Header */}
      <header 
        style={{ 
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#ffffff',
          color: '#111',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: scrolled ? '0.8rem 1.5rem' : '1.2rem 1.5rem', 
          transition: 'all 0.3s ease',
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
          
        {/* Left Side: Hamburger & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <button onClick={() => setIsMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          {/* MENU Text is hidden on mobile via CSS, but we use a span to avoid overriding display property */}
          <span className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>MENU</span>
          <button onClick={() => setIsSearchOpen(true)} className="mobile-only" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginTop: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
        </div>

        {/* Center: Logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Phases Handcrafted" style={{ height: '65px', objectFit: 'contain' }} />
          </Link>
        </div>

        {/* Right Side: Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
          <span onClick={() => setIsSearchOpen(true)} className="desktop-only" style={{ cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
          <span className="desktop-only" style={{ cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <span onClick={openCart} style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#e0e0e0', color: '#111', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.3rem' }}>
              {itemCount}
            </span>
          </span>
        </div>
      </header>

      {/* Search Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(255,255,255,0.95)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        opacity: isSearchOpen ? 1 : 0,
        pointerEvents: isSearchOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
        padding: '2rem'
      }}>
        <button onClick={() => setIsSearchOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search our candles..." 
            style={{
              width: '100%', border: 'none', borderBottom: '2px solid #111',
              backgroundColor: 'transparent', padding: '1rem 0',
              fontSize: '2rem', fontFamily: 'var(--font-serif)', outline: 'none', color: '#111'
            }} 
            autoFocus={isSearchOpen}
          />
          <button style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 100,
          display: 'flex'
        }}>
          {/* Overlay */}
          <div 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }} 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div 
            className="menu-drawer-container"
            style={{
            position: 'relative',
            backgroundColor: '#fff',
            height: '100%',
            overflowY: 'auto'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
                background: 'none', border: 'none', padding: '1rem', cursor: 'pointer'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="menu-drawer-inner">
              {/* Left Column: Navigation Links */}
              <div className="menu-left-col" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {['Candles', 'Freshner', 'Soft Toys', 'Hampers', 'Gift Sets', 'All Products'].map((item, i) => (
                    <Link href="#products" key={i} onClick={() => setIsMenuOpen(false)} className="menu-link-item" style={{
                      padding: '1.2rem 0',
                      borderBottom: '1px solid #f0f0f0',
                      textDecoration: 'none',
                      color: '#111',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}>
                      {item}
                    </Link>
                  ))}
                </div>

                {/* Secondary Links & Footer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3rem' }}>
                  {['My Account', 'FAQ', 'Client Reviews', 'Contact'].map((item, i) => (
                    <Link href="#" key={i} style={{
                      textDecoration: 'none',
                      color: '#666',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem'
                    }}>
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Column: Featured Image Cards */}
              <div className="menu-right-col" style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '0.5rem',
                padding: '4rem 1rem 2rem 1rem',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}>
                <div className="menu-image-grid hide-scroll" style={{ display: 'flex', gap: '0.5rem' }}>
                  {categories.map((cat, idx) => (
                    <Link href="#products" key={idx} onClick={() => setIsMenuOpen(false)} className="menu-image-card" style={{
                      flex: '0 0 auto',
                      width: '180px',
                      aspectRatio: '3/4',
                      position: 'relative',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, width: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                        color: '#fff',
                        padding: '1rem 0.5rem',
                        textAlign: 'center',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                      }}>
                        {cat.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </>
  );
}
