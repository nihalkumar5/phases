'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    image: '/home-still.jpg',
    title: (
      <>
        handmade<br/>natural<br/>scented candle
      </>
    ),
    text: (
      <>
        a sense of intimacy, togetherness and<br/>
        inner warmth, a world lit by candles<br/>
        and snuggled under blankets.
      </>
    )
  },
  {
    image: '/cat3.png',
    title: (
      <>
        handcrafted<br/>premium<br/>soft companions
      </>
    ),
    text: (
      <>
        a gentle touch of comfort, woven<br/>
        with love and care, creating moments<br/>
        of pure joy for everyday living.
      </>
    )
  }
];

export default function PremiumHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="premium-hero">
      <div className="premium-hero-bg" style={{ overflow: 'hidden' }}>
        <div style={{ 
          display: 'flex', 
          height: '100%', 
          width: '100%', 
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)'
        }}>
          {slides.map((slide, index) => (
            <div key={index} className={index === currentIndex ? 'is-active' : ''} style={{ flex: '0 0 100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <img 
                src={slide.image} 
                alt="Hero Background" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>
        <div className="premium-hero-overlay"></div>
      </div>

      <div className="premium-hero-content reveal-up">
        <h1 className="premium-hero-title" key={`title-${currentIndex}`} style={{ animation: 'revealUpAnim 0.8s ease forwards' }}>
          {slides[currentIndex % slides.length].title}
        </h1>

        <div className="premium-hero-bottom">
          <div className="premium-hero-slider">
            <div className="slider-indicator">
              <span>0{currentIndex + 1}</span>
              <div className="slider-line">
                <div 
                  className="slider-progress"
                  style={{ 
                    width: `${((currentIndex + 1) / slides.length) * 100}%`,
                    transition: 'width 0.5s ease-in-out'
                  }}
                ></div>
              </div>
              <span>0{slides.length}</span>
            </div>
            <p className="slider-text" key={`text-${currentIndex}`} style={{ animation: 'revealUpAnim 1s ease forwards' }}>
              {slides[currentIndex % slides.length].text}
            </p>
          </div>

          <div className="mobile-center-btn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0.8rem' }}>
            <Link href="#products" className="premium-shop-btn">
              shop now
            </Link>
            <span style={{ fontSize: '0.8rem', fontWeight: 300, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.03em', textAlign: 'center' }}>
              enjoy free shipping on prepaid orders
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
