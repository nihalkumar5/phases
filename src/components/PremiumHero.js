'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    image: '/home-still.jpg',
    title: (
      <>
        Illuminate Your<br/>Everyday.
      </>
    ),
    text: (
      <>
        Discover our artisanal collection of hand-poured<br/>
        soy wax candles, crafted to bring warmth and<br/>
        captivating fragrances to your space.
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

            <p className="slider-text" key={`text-${currentIndex}`} style={{ animation: 'revealUpAnim 1s ease forwards' }}>
              {slides[currentIndex % slides.length].text}
            </p>
          </div>

          <div className="mobile-left-btn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '0.8rem' }}>
            <Link href="#products" className="premium-shop-btn">
              Shop Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
