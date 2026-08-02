'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const slides = [
  {
    image: "/hero/file_00000000d16c7208a405287a0090462d.png",
    title: "Aromatic<br/>Blends",
    subtitle: "Handpoured soy wax candles<br/>for a perfect ambiance.",
    buttonText: "SHOP CANDLES"
  },
  {
    image: "/hero/file_00000000410871fa8d7f65d4ef805131.png",
    title: "Cozy<br/>Companions",
    subtitle: "Handcrafted soft toys<br/>made with love and care.",
    buttonText: "SHOP TOYS"
  }
];

export default function MobileHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '85vh',
      minHeight: '600px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--bg-cream)'
    }}>
      {/* Background Image Slideshow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <AnimatePresence initial={false}>
          <motion.img 
            key={currentIndex}
            src={slides[currentIndex].image}
            alt="Hero Slideshow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'bottom center'
            }}
          />
        </AnimatePresence>
        
        {/* Subtle gradient overlay to ensure text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 2
        }} />
      </div>

      {/* Content Overlay */}
      <div style={{ 
        position: 'absolute', 
        zIndex: 5, 
        top: '12%', 
        left: 0, 
        width: '100%', 
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{ width: '90%', maxWidth: '400px', textAlign: 'center', pointerEvents: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 
                dangerouslySetInnerHTML={{ __html: slides[currentIndex].title }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.8rem',
                  color: '#fff',
                  lineHeight: 1.1,
                  marginBottom: '0.8rem',
                  fontWeight: 400
                }}
              />

              <p 
                dangerouslySetInnerHTML={{ __html: slides[currentIndex].subtitle }}
                style={{
                  fontSize: '1rem',
                  color: '#fff',
                  marginBottom: '1.5rem',
                  lineHeight: 1.4,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500
                }}
              />

              <Link href="#products" style={{
                display: 'inline-block',
                backgroundColor: '#fff',
                color: '#000',
                padding: '0.8rem 1.5rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                transition: 'background-color 0.3s ease',
                border: 'none',
                pointerEvents: 'auto'
              }}>
                {slides[currentIndex].buttonText}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Bottom indicator dots */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 10
      }}>
        {slides.map((_, idx) => (
          <div 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: currentIndex === idx ? '20px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: '#fff',
              opacity: currentIndex === idx ? 1 : 0.4,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} 
          />
        ))}
      </div>
    </section>
  );
}
