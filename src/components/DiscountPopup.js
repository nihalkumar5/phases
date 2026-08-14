'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartContext';

export default function DiscountPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { applyDiscount, cart } = useCart();

  useEffect(() => {
    // Open immediately when the website loads
    const hasSeenPopup = localStorage.getItem('phases_discount_seen_v2');
    if (!hasSeenPopup) {
      // Small delay just to let the page render first (smooth entrance)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('phases_discount_seen_v2', 'true');
  };

  const handleApplyDiscount = async () => {
    setIsApplying(true);
    const success = await applyDiscount('WELCOME10');
    setIsApplying(false);
    
    setApplied(true);
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  if (!isVisible) return null;

  return (
    <div className="premium-popup-overlay">
      <div className="premium-popup-content">
        <button className="premium-popup-close" onClick={handleClose}>&times;</button>
        
        {/* Left Image Section */}
        <div className="popup-image-pane">
          {/* Using a placeholder aesthetic image that matches luxury candles */}
          <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800" alt="Luxury Candle" />
          <div className="image-overlay"></div>
        </div>

        {/* Right Text Section */}
        <div className="popup-text-pane">
          <div className="welcome-subtitle">Exclusive Offer</div>
          <h2 className="luxury-title">A Gift For You.</h2>
          <p className="luxury-desc">
            Experience the warmth of handcrafted luxury. Enjoy <strong>10% off</strong> your first order with us.
          </p>
          
          <div className="coupon-box">
            <span className="coupon-code">WELCOME10</span>
          </div>
          
          <button 
            className={`premium-apply-btn ${applied ? 'applied' : ''}`} 
            onClick={handleApplyDiscount} 
            disabled={isApplying || applied}
          >
            {isApplying ? 'Applying to cart...' : applied ? 'Discount Applied ✓' : 'Claim My 10% Off'}
          </button>
          
          <button className="decline-btn" onClick={handleClose}>
            No thanks, I prefer paying full price
          </button>
        </div>
      </div>

      <style jsx>{`
        .premium-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 1rem;
          animation: fadeInOverlay 0.6s ease-out forwards;
        }

        .premium-popup-content {
          background: #faf9f5;
          width: 100%;
          max-width: 850px;
          height: 500px;
          border-radius: 4px;
          display: flex;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          animation: slideUpPopup 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }

        .premium-popup-close {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 2.2rem;
          line-height: 1;
          color: #111;
          cursor: pointer;
          z-index: 10;
          font-family: var(--font-sans);
          font-weight: 300;
          transition: transform 0.3s ease;
        }
        .premium-popup-close:hover {
          transform: rotate(90deg);
        }

        .popup-image-pane {
          flex: 1;
          position: relative;
          display: none;
        }
        
        .popup-image-pane img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
        }

        .popup-text-pane {
          flex: 1.1;
          padding: 4rem 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background-color: #faf9f5;
        }

        .welcome-subtitle {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #666;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .luxury-title {
          font-family: var(--font-serif);
          font-size: 2.8rem;
          color: #1b2c13;
          margin: 0 0 1rem 0;
          line-height: 1.1;
        }

        .luxury-desc {
          color: #555;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-family: var(--font-sans);
          max-width: 90%;
        }

        .coupon-box {
          border: 1px dashed #c0b8a1;
          padding: 0.8rem 1.5rem;
          background: #f1ebd9;
          margin-bottom: 1.5rem;
          border-radius: 4px;
        }
        
        .coupon-code {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          color: #1b2c13;
        }

        .premium-apply-btn {
          background: #1b2c13;
          color: #fff;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .premium-apply-btn:hover {
          background: #2e4a26;
          box-shadow: 0 4px 15px rgba(27,44,19,0.2);
        }
        
        .premium-apply-btn.applied {
          background: #276749;
          cursor: default;
        }

        .decline-btn {
          background: none;
          border: none;
          color: #888;
          font-size: 0.75rem;
          margin-top: 1.5rem;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .decline-btn:hover {
          color: #111;
        }

        /* Animations */
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUpPopup {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Mobile Layout */
        @media (min-width: 768px) {
          .popup-image-pane {
            display: block;
          }
        }
        
        @media (max-width: 767px) {
          .premium-popup-content {
            height: auto;
            max-height: 90vh;
            overflow-y: auto;
          }
          .popup-text-pane {
            padding: 3rem 1.5rem;
          }
          .luxury-title {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
