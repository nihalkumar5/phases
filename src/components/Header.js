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
      {/* Announcement Bar */}
      <div style={{
        backgroundColor: 'var(--bg-cream, #FDF7F5)', 
        color: '#111', 
        padding: '0.6rem 2rem', 
        fontSize: '0.85rem',
        fontWeight: '500',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        letterSpacing: '0.02em',
        display: scrolled ? 'none' : 'flex'
      }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          Up to 40% OFF on selected products + Extra 10% off on your First Order
          <div style={{ fontStyle: 'italic', opacity: 0.8, fontSize: '0.75rem', marginTop: '0.1rem' }}>(Discount applied automatically at checkout)</div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>
      
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
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Phases Handcrafted" style={{ height: '40px', objectFit: 'contain' }} />
          </Link>
          
          <div className="header-links">
            <div className="header-dropdown-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }} onMouseEnter={(e) => e.currentTarget.querySelector('.dropdown-content').style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.querySelector('.dropdown-content').style.opacity = '0'}>
              <Link href="#shop" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }} className="header-link">
                shop 
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </Link>
              <div className="dropdown-content" style={{ 
                position: 'absolute', top: '100%', left: '0', marginTop: '1rem',
                backgroundColor: '#ffffff', color: '#111', 
                minWidth: '180px', borderRadius: '12px', padding: '0.5rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none',
                display: 'flex', flexDirection: 'column', gap: '0.2rem'
              }}>
                {/* Invisible bridge for hover */}
                <div style={{ position: 'absolute', top: '-1rem', left: 0, right: 0, height: '1rem' }}></div>
                <Link href="#products" style={{ padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: '8px', fontSize: '0.9rem' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f7'; e.currentTarget.parentElement.style.pointerEvents = 'auto'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.parentElement.style.pointerEvents = 'none'; }}>Candles</Link>
                <Link href="#products" style={{ padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: '8px', fontSize: '0.9rem' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f7'; e.currentTarget.parentElement.style.pointerEvents = 'auto'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.parentElement.style.pointerEvents = 'none'; }}>Rakhi</Link>
                <Link href="#products" style={{ padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: '8px', fontSize: '0.9rem' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f7'; e.currentTarget.parentElement.style.pointerEvents = 'auto'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.parentElement.style.pointerEvents = 'none'; }}>Soft Toys</Link>
                <Link href="#products" style={{ padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: '8px', fontSize: '0.9rem' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f7'; e.currentTarget.parentElement.style.pointerEvents = 'auto'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.parentElement.style.pointerEvents = 'none'; }}>Sale</Link>
                <Link href="#products" style={{ padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: '8px', fontSize: '0.9rem' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f7'; e.currentTarget.parentElement.style.pointerEvents = 'auto'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.parentElement.style.pointerEvents = 'none'; }}>Hamper</Link>
              </div>
            </div>
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
