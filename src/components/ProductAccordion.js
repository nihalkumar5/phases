'use client';

import { useState } from 'react';

export default function ProductAccordion({ title, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: '1px solid #eaeaea' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          padding: '1.5rem 0',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: '0.85rem', 
          fontWeight: 700, 
          letterSpacing: '0.1em',
          color: '#111'
        }}>
          {title.toUpperCase()}
        </span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color: '#666'
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        style={{
          maxHeight: isOpen ? '2000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease-in-out',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div style={{ paddingBottom: '1.5rem', color: '#333', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
