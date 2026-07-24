'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function Header({ theme = 'light' }) {
  const { openCart, cart } = useCart();
  const itemCount = cart?.lines?.edges?.reduce((acc, line) => acc + line.node.quantity, 0) || 0;

  const [scrolled, setScrolled] = useState(false);

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
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      width: '100%',
      zIndex: 50, 
      backgroundColor: (!scrolled && isTransparent) ? 'transparent' : (isTransparent ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.7)'),
      backdropFilter: (!scrolled && isTransparent) ? 'none' : 'blur(12px)',
      WebkitBackdropFilter: (!scrolled && isTransparent) ? 'none' : 'blur(12px)',
      color: (!scrolled && isTransparent && !isDarkText) ? '#fff' : '#111',
      transition: 'all 0.4s ease'
    }}>
      {/* Main Header */}
      <nav 
        className="header-nav"
        style={{ 
          padding: scrolled ? '1.2rem 1.5rem' : '2rem 1.5rem', 
          borderBottom: scrolled ? 'none' : (isTransparent ? '2px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(0, 0, 0, 0.1)'),
          transition: 'all 0.4s ease'
        }}
      >
        
        {/* Left Side: Logo & Nav */}
        <div className="header-left">
          <Link href="/" style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.02em', color: 'inherit', textDecoration: 'none' }}>
            phases handcrafted.
          </Link>
          
          <div className="header-links">
            <Link href="#shop" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }} className="header-link">
              shop 
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </Link>
            <Link href="#about" style={{ color: 'inherit', textDecoration: 'none' }} className="header-link">about</Link>
            <Link href="#contact" style={{ color: 'inherit', textDecoration: 'none' }} className="header-link">contact</Link>
          </div>
        </div>

        {/* Right Side: Icons */}
        <div className="header-icons">
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} className="header-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} className="header-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button onClick={openCart} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }} className="header-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, backgroundColor: (!scrolled && isTransparent && !isDarkText) ? '#fff' : '#111', color: (!scrolled && isTransparent && !isDarkText) ? '#111' : '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {itemCount}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
