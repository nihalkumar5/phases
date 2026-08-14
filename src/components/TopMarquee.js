'use client';

import React from 'react';

export default function TopMarquee() {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span>✨ Handcrafted soy candles & adorable plush toys</span>
        <span className="separator">✦</span>
        <span>Free shipping on all prepaid orders</span>
        <span className="separator">✦</span>
        <span>Build your own premium gift bundle for just ₹999</span>
        <span className="separator">✦</span>
        <span>✨ Handcrafted soy candles & adorable plush toys</span>
        <span className="separator">✦</span>
        <span>Free shipping on all prepaid orders</span>
        <span className="separator">✦</span>
        <span>Build your own premium gift bundle for just ₹999</span>
        <span className="separator">✦</span>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          background-color: #1b2c13;
          color: #ebd492;
          padding: 8px 0;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          font-family: var(--font-sans), sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: scrollLeft 30s linear infinite;
        }

        .marquee-content span {
          padding: 0 1rem;
        }

        .separator {
          color: rgba(238, 212, 146, 0.4);
        }

        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
