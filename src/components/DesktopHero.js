'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DesktopHero() {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '90vh',
      minHeight: '700px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#000'
    }}>
      {/* Background Video */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        {/* Replace the src with actual video URL when available */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.8
          }}
        >
          <source src="https://cdn.pixabay.com/video/2021/08/04/83897-584736528_large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient overlay for text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)',
          zIndex: 2
        }} />
      </div>

      {/* Content Overlay */}
      <div style={{ 
        position: 'relative', 
        zIndex: 5, 
        width: '100%', 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        pointerEvents: 'none'
      }}>
        <div style={{ maxWidth: '550px', textAlign: 'center', marginRight: '4rem', pointerEvents: 'auto' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(4rem, 6vw, 6rem)',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              fontWeight: 400,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            Handcrafted<br/>Moments
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              fontSize: '1.2rem',
              color: '#fff',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Fall for our unique fragrances<br/>and comforting soft companions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link href="#products" style={{
              display: 'inline-block',
              backgroundColor: '#fff',
              color: '#000',
              padding: '1.2rem 3rem',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease',
              border: 'none',
              pointerEvents: 'auto'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              I DISCOVER
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
