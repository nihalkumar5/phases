'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import UpsellButton from './UpsellButton';

export default function ProductDetailClient({ product, relatedProducts }) {
  const { addToCart, isLoading } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState(null);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  const galleryRef = useRef(null);

  const images = product.images?.edges?.map(e => e.node) || [];
  const variant = product.variants?.edges?.[0]?.node;
  const isAvailable = variant?.availableForSale !== false;
  const price = product.priceRange?.maxVariantPrice;
  const numericPrice = parseFloat(price?.amount) || 0;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: price?.currencyCode || 'INR',
    maximumFractionDigits: 0
  }).format(numericPrice);

  const scrollToImage = (idx) => {
    if (idx < 0 || idx >= images.length) return;
    setSelectedImageIndex(idx);
    if (galleryRef.current) {
      const scrollWidth = galleryRef.current.offsetWidth;
      galleryRef.current.scrollTo({
        left: idx * scrollWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleGalleryScroll = () => {
    if (!galleryRef.current) return;
    const scrollLeft = galleryRef.current.scrollLeft;
    const width = galleryRef.current.offsetWidth;
    if (width > 0) {
      const newIdx = Math.round(scrollLeft / width);
      if (newIdx >= 0 && newIdx < images.length && newIdx !== selectedImageIndex) {
        setSelectedImageIndex(newIdx);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!variant?.id || !isAvailable) return;
    setIsAddedAnimation(true);
    await addToCart(variant.id, quantity, true);
    setTimeout(() => setIsAddedAnimation(false), 1200);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeMessage({ valid: true, text: `✓ Standard delivery to ${pincode} in 3-5 business days.` });
    } else {
      setPincodeMessage({ valid: false, text: 'Please enter a valid 6-digit PIN code.' });
    }
  };

  return (
    <div className="pdp-wrapper">
      {/* Breadcrumb Navigation */}
      <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <Link href="/shop">Shop</Link>
        <span className="separator">/</span>
        <span className="current">{product.title.split(/[-|]/)[0].trim()}</span>
      </nav>

      {/* Main Grid: Gallery + Product Info */}
      <div className="pdp-main-grid">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="pdp-gallery">
          {/* Desktop Thumbnail list */}
          {images.length > 1 && (
            <div className="desktop-thumbnails hide-scroll">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToImage(idx)}
                  className={`thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  <img src={img.url} alt={img.altText || `Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Swipeable Gallery Viewport */}
          <div className="main-image-viewport">
            <div className="gallery-container">
              {images.length > 0 ? (
                <div 
                  ref={galleryRef}
                  onScroll={handleGalleryScroll}
                  className="gallery-scroll-track hide-scroll"
                >
                  {images.map((img, idx) => (
                    <div key={idx} className="gallery-slide-item">
                      <img 
                        src={img.url} 
                        alt={img.altText || `${product.title} photo ${idx + 1}`} 
                        className="hero-product-image"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              
              <span className="luxury-badge">✦ Handcrafted Soy</span>

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => scrollToImage(selectedImageIndex - 1)}
                    disabled={selectedImageIndex === 0}
                    className="gallery-nav-arrow prev"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={() => scrollToImage(selectedImageIndex + 1)}
                    disabled={selectedImageIndex === images.length - 1}
                    className="gallery-nav-arrow next"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                  <div className="image-counter-pill">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Mobile / Desktop Dots Indicator */}
            {images.length > 1 && (
              <div className="mobile-dots-indicator">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToImage(idx)}
                    className={`dot-pill ${selectedImageIndex === idx ? 'active' : ''}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Information & Purchase Suite */}
        <div className="pdp-info-column">
          
          {/* Header Title & Ratings */}
          <div className="product-header-block">
            <div className="rating-review-tag">
              <span className="stars">★★★★★</span>
              <span className="rating-score">4.9</span>
              <span className="review-count">(94 Reviews)</span>
              <span className="live-viewers">• 14 sold recently</span>
            </div>

            <h1 className="product-title-serif">
              {product.title.split('|')[0].trim()}
            </h1>

            <div className="price-tag-row">
              <span className="current-price">{formattedPrice}</span>
              <span className="mrp-strikethrough">₹{Math.round(numericPrice * 1.25)}</span>
              <span className="discount-pill">Save 20%</span>
            </div>
            <p className="tax-shipping-subtext">Inclusive of all taxes • Free shipping over ₹500</p>
          </div>

          {/* Quick Gifting Highlights Card */}
          <div className="gifting-perks-box">
            <div className="perk-item">
              <span className="perk-icon">🎁</span>
              <div className="perk-text">
                <strong>Luxury Gift Box Ready</strong>
                <span>Packed with care in signature boutique wrap.</span>
              </div>
            </div>
            <div className="perk-item">
              <span className="perk-icon">✍️</span>
              <div className="perk-text">
                <strong>Free Handwritten Note</strong>
                <span>Add your custom message at checkout.</span>
              </div>
            </div>
            <div className="perk-item">
              <span className="perk-icon">🌱</span>
              <div className="perk-text">
                <strong>100% Pure Soy Wax</strong>
                <span>Clean, non-toxic, soot-free burn.</span>
              </div>
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="purchase-action-group">
            <div className="quantity-and-add-row">
              {/* Quantity Counter */}
              <div className="luxury-quantity-stepper">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isLoading}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isLoading}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Main Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || isLoading}
                className={`primary-add-to-cart-btn ${isAddedAnimation ? 'success' : ''}`}
              >
                {isLoading ? (
                  <span>Adding...</span>
                ) : isAddedAnimation ? (
                  <span>✓ Added!</span>
                ) : (
                  <span>ADD TO CART • {new Intl.NumberFormat('en-IN', { style: 'currency', currency: price?.currencyCode || 'INR', maximumFractionDigits: 0 }).format(numericPrice * quantity)}</span>
                )}
              </button>
            </div>

            {/* Secondary Bundle Builder CTA */}
            <Link href="/build-your-bundle" className="secondary-bundle-btn">
              <span>✨ Add to Custom Gift Box (Save 15%) →</span>
            </Link>
          </div>

          {/* Pincode Delivery Check */}
          <div className="pincode-check-card">
            <span className="pincode-label">🚚 Estimated Delivery</span>
            <form onSubmit={handleCheckPincode} className="pincode-form">
              <input 
                type="text" 
                placeholder="Enter 6-digit PIN" 
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="pincode-input"
              />
              <button type="submit" className="pincode-btn">Check</button>
            </form>
            {pincodeMessage && (
              <p className={`pincode-result ${pincodeMessage.valid ? 'success' : 'error'}`}>
                {pincodeMessage.text}
              </p>
            )}
          </div>

          {/* Complete the Gift Upsell (if related products exist) */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="complete-gift-upsell-card">
              <div className="upsell-heading">
                <span className="upsell-badge">Frequently Paired</span>
                <p>Complete your gift with this pairing</p>
              </div>
              <div className="upsell-body">
                <div className="upsell-product-preview">
                  <div className="upsell-img-wrap">
                    {relatedProducts[0].node.images?.edges?.[0]?.node?.url ? (
                      <img src={relatedProducts[0].node.images.edges[0].node.url} alt={relatedProducts[0].node.title} />
                    ) : (
                      <div className="no-img">🎁</div>
                    )}
                  </div>
                  <div className="upsell-meta">
                    <h4>{relatedProducts[0].node.title.split('|')[0].trim()}</h4>
                    <p className="upsell-price">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: relatedProducts[0].node.priceRange.maxVariantPrice.currencyCode,
                        maximumFractionDigits: 0
                      }).format(relatedProducts[0].node.priceRange.maxVariantPrice.amount)}
                    </p>
                  </div>
                </div>
                <UpsellButton 
                  variantId={relatedProducts[0].node.variants?.edges?.[0]?.node?.id} 
                  priceFormatted={new Intl.NumberFormat('en-IN', { style: 'currency', currency: relatedProducts[0].node.priceRange.maxVariantPrice.currencyCode, maximumFractionDigits: 0 }).format(relatedProducts[0].node.priceRange.maxVariantPrice.amount)} 
                />
              </div>
            </div>
          )}

          {/* Clean Interactive Tabbed Specifications */}
          <div className="pdp-tabs-section">
            <div className="pdp-tab-headers hide-scroll">
              <button 
                onClick={() => setActiveTab('description')} 
                className={`tab-link ${activeTab === 'description' ? 'active' : ''}`}
              >
                Description
              </button>
              <button 
                onClick={() => setActiveTab('specs')} 
                className={`tab-link ${activeTab === 'specs' ? 'active' : ''}`}
              >
                Features
              </button>
              <button 
                onClick={() => setActiveTab('care')} 
                className={`tab-link ${activeTab === 'care' ? 'active' : ''}`}
              >
                Care Tips
              </button>
            </div>

            <div className="pdp-tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane-fade">
                  <div 
                    className="product-description-html"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '<p>Handcrafted with love and natural botanicals.</p>' }} 
                  />
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="tab-pane-fade">
                  <div className="specs-grid">
                    <div className="spec-pill">
                      <span className="spec-icon">🌱</span>
                      <div>
                        <strong>100% Natural Wax</strong>
                        <span>Pure soy & natural botanical blend</span>
                      </div>
                    </div>
                    <div className="spec-pill">
                      <span className="spec-icon">🕯️</span>
                      <div>
                        <strong>Burn Time</strong>
                        <span>Approx. 25-35 hours clean burn</span>
                      </div>
                    </div>
                    <div className="spec-pill">
                      <span className="spec-icon">🧵</span>
                      <div>
                        <strong>Wick Craft</strong>
                        <span>Lead-free organic braided cotton</span>
                      </div>
                    </div>
                    <div className="spec-pill">
                      <span className="spec-icon">✨</span>
                      <div>
                        <strong>Non-Toxic</strong>
                        <span>No parabens or harmful additives</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="tab-pane-fade">
                  <ul className="candle-care-list">
                    <li>✦ Trim the wick to 1/4 inch before each burn for a clean flame.</li>
                    <li>✦ Allow wax to melt completely to the edges on first burn.</li>
                    <li>✦ Burn for 3-4 hours maximum in a draft-free space.</li>
                    <li>✦ Keep away from flammable objects and children.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* STICKY BOTTOM BUY BAR ON MOBILE (Scroll-triggered) */}
      <div className="mobile-sticky-buy-bar">
        <div className="sticky-meta">
          <span className="sticky-title">{product.title.split(/[-|]/)[0].trim()}</span>
          <span className="sticky-price">{formattedPrice}</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={!isAvailable || isLoading}
          className="sticky-add-btn"
        >
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      {/* Styled JSX Stylesheet */}
      <style jsx>{`
        .pdp-wrapper {
          max-width: 1350px;
          width: 100%;
          margin: 0 auto;
          padding: 1.5rem 1rem 5rem 1rem;
          font-family: var(--font-sans);
          color: #111;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* Breadcrumbs */
        .pdp-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: #777;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          width: 100%;
        }
        .pdp-breadcrumbs a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .pdp-breadcrumbs a:hover {
          color: #1b2c13;
        }
        .pdp-breadcrumbs .separator {
          color: #bbb;
        }
        .pdp-breadcrumbs .current {
          color: #111;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
        }

        /* Main Grid */
        .pdp-main-grid {
          display: grid;
          grid-template-columns: 100%;
          gap: 2rem;
          align-items: start;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        @media (min-width: 992px) {
          .pdp-main-grid {
            grid-template-columns: 1.1fr 1fr;
            gap: 4.5rem;
          }
        }

        /* Gallery */
        .pdp-gallery {
          display: flex;
          gap: 1rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        @media (max-width: 991px) {
          .pdp-gallery {
            flex-direction: column;
          }
        }

        /* Desktop Thumbnails */
        .desktop-thumbnails {
          display: none;
        }
        @media (min-width: 992px) {
          .desktop-thumbnails {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            width: 80px;
            flex-shrink: 0;
          }
          .thumb-btn {
            width: 80px;
            height: 95px;
            border-radius: 6px;
            overflow: hidden;
            border: 2px solid transparent;
            background: #f8f8f8;
            cursor: pointer;
            padding: 0;
            transition: all 0.2s ease;
          }
          .thumb-btn.active {
            border-color: #1b2c13;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .thumb-btn img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        /* Main Viewport */
        .main-image-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
        }
        .gallery-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          background-color: #faf9f6;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
          box-sizing: border-box;
        }
        .gallery-scroll-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          width: 100%;
          height: 100%;
        }
        .gallery-slide-item {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          position: relative;
        }
        .hero-product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }
        .luxury-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background-color: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          color: #1b2c13;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.35rem 0.7rem;
          border-radius: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          white-space: nowrap;
          pointer-events: none;
          z-index: 2;
        }
        .image-counter-pill {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background-color: rgba(0,0,0,0.6);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
          letter-spacing: 0.05em;
          pointer-events: none;
          z-index: 2;
        }
        .gallery-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(0,0,0,0.08);
          color: #111;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          line-height: 1;
          cursor: pointer;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
          padding: 0;
        }
        .gallery-nav-arrow.prev {
          left: 10px;
        }
        .gallery-nav-arrow.next {
          right: 10px;
        }
        .gallery-nav-arrow:disabled {
          opacity: 0;
          pointer-events: none;
        }
        .mobile-dots-indicator {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 0.8rem;
        }
        .dot-pill {
          width: 20px;
          height: 4px;
          border-radius: 2px;
          background-color: #ddd;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .dot-pill.active {
          background-color: #1b2c13;
          width: 32px;
        }

        /* Product Info Column */
        .pdp-info-column {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Header Block */
        .rating-review-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem 0.5rem;
          font-size: 0.78rem;
          color: #555;
          margin-bottom: 0.4rem;
          flex-wrap: wrap;
          width: 100%;
        }
        .stars {
          color: #e5a93b;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }
        .rating-score {
          font-weight: 700;
          color: #111;
        }
        .live-viewers {
          color: #1b2c13;
          font-weight: 600;
        }
        .product-title-serif {
          font-family: var(--font-serif);
          font-size: clamp(1.5rem, 5vw, 2.3rem);
          font-weight: 400;
          line-height: 1.2;
          color: #111;
          margin: 0 0 0.6rem 0;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .price-tag-row {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          margin-bottom: 0.2rem;
          flex-wrap: wrap;
        }
        .current-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1b2c13;
        }
        .mrp-strikethrough {
          font-size: 1rem;
          color: #999;
          text-decoration: line-through;
        }
        .discount-pill {
          background-color: #fce8e6;
          color: #c53030;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }
        .tax-shipping-subtext {
          font-size: 0.78rem;
          color: #777;
          margin: 0;
          line-height: 1.4;
        }

        /* Gifting Perks Card */
        .gifting-perks-box {
          background-color: #faf9f5;
          border: 1px solid #ebd492;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          box-sizing: border-box;
        }
        .perk-item {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
        }
        .perk-icon {
          font-size: 1.2rem;
          line-height: 1;
        }
        .perk-text strong {
          display: block;
          font-size: 0.82rem;
          color: #1b2c13;
          font-weight: 700;
        }
        .perk-text span {
          display: block;
          font-size: 0.75rem;
          color: #666;
          line-height: 1.35;
        }

        /* Actions: Quantity + Button */
        .purchase-action-group {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          width: 100%;
          box-sizing: border-box;
        }
        .quantity-and-add-row {
          display: flex;
          gap: 0.6rem;
          width: 100%;
          box-sizing: border-box;
        }
        .luxury-quantity-stepper {
          display: flex;
          align-items: center;
          background: #f6f5f0;
          border: 1px solid #ddd;
          border-radius: 6px;
          width: 95px;
          height: 48px;
          flex-shrink: 0;
        }
        .luxury-quantity-stepper button {
          flex: 1;
          height: 100%;
          background: none;
          border: none;
          font-size: 1.1rem;
          color: #111;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .luxury-quantity-stepper .qty-value {
          font-weight: 700;
          font-size: 0.95rem;
          width: 25px;
          text-align: center;
        }
        .primary-add-to-cart-btn {
          flex: 1;
          min-width: 0;
          height: 48px;
          background-color: #1b2c13;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(27,44,19,0.18);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.6rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .primary-add-to-cart-btn:hover:not(:disabled) {
          background-color: #27401c;
        }
        .primary-add-to-cart-btn.success {
          background-color: #2e7d32;
        }
        .secondary-bundle-btn {
          display: block;
          text-align: center;
          padding: 0.75rem 0.8rem;
          background-color: #fff;
          border: 1px dashed #1b2c13;
          color: #1b2c13;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          line-height: 1.4;
          word-break: break-word;
          overflow-wrap: break-word;
          width: 100%;
          box-sizing: border-box;
        }
        .secondary-bundle-btn:hover {
          background-color: #f6f5f0;
        }

        /* Pincode Check */
        .pincode-check-card {
          border: 1px solid #eee;
          padding: 1rem;
          border-radius: 8px;
          background-color: #fff;
          width: 100%;
          box-sizing: border-box;
        }
        .pincode-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .pincode-form {
          display: flex;
          gap: 0.5rem;
          width: 100%;
        }
        .pincode-input {
          flex: 1;
          min-width: 0;
          padding: 0.6rem 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.82rem;
          font-family: var(--font-sans);
          outline: none;
          box-sizing: border-box;
        }
        .pincode-input:focus {
          border-color: #1b2c13;
        }
        .pincode-btn {
          padding: 0.6rem 1rem;
          background-color: #111;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
        }
        .pincode-result {
          font-size: 0.78rem;
          margin: 0.5rem 0 0 0;
          font-weight: 600;
          line-height: 1.4;
        }
        .pincode-result.success {
          color: #2e7d32;
        }
        .pincode-result.error {
          color: #c53030;
        }

        /* Upsell Card */
        .complete-gift-upsell-card {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          padding: 1rem;
          background-color: #fff;
          width: 100%;
          box-sizing: border-box;
        }
        .upsell-heading {
          margin-bottom: 0.6rem;
        }
        .upsell-badge {
          background-color: #ebd492;
          color: #1b2c13;
          font-size: 0.62rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.15rem 0.45rem;
          border-radius: 3px;
          display: inline-block;
          margin-bottom: 0.25rem;
        }
        .upsell-heading p {
          margin: 0;
          font-size: 0.78rem;
          font-weight: 600;
          color: #444;
        }
        .upsell-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
        }
        .upsell-product-preview {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 0;
          flex: 1;
        }
        .upsell-img-wrap {
          width: 42px;
          height: 42px;
          border-radius: 6px;
          overflow: hidden;
          background-color: #f5f5f5;
          flex-shrink: 0;
        }
        .upsell-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .upsell-meta {
          min-width: 0;
          flex: 1;
        }
        .upsell-meta h4 {
          margin: 0 0 0.15rem 0;
          font-size: 0.8rem;
          font-weight: 600;
          color: #111;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .upsell-price {
          margin: 0;
          font-size: 0.8rem;
          font-weight: 700;
          color: #1b2c13;
        }

        /* Tabs Section */
        .pdp-tabs-section {
          border-top: 1px solid #eee;
          padding-top: 1.2rem;
          margin-top: 0.4rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .pdp-tab-headers {
          display: flex;
          gap: 1.2rem;
          border-bottom: 1px solid #eee;
          margin-bottom: 1rem;
          overflow-x: auto;
          width: 100%;
        }
        .tab-link {
          background: none;
          border: none;
          padding: 0.5rem 0;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 600;
          color: #777;
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tab-link.active {
          color: #1b2c13;
          font-weight: 700;
        }
        .tab-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #1b2c13;
        }
        .pdp-tab-content {
          font-size: 0.88rem;
          color: #444;
          line-height: 1.6;
          width: 100%;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.8rem;
          width: 100%;
        }
        @media (min-width: 600px) {
          .specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .spec-pill {
          display: flex;
          gap: 0.7rem;
          align-items: flex-start;
          background-color: #faf9f5;
          padding: 0.8rem;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .spec-icon {
          font-size: 1.2rem;
        }
        .spec-pill strong {
          display: block;
          font-size: 0.8rem;
          color: #111;
        }
        .spec-pill span {
          display: block;
          font-size: 0.72rem;
          color: #666;
          line-height: 1.35;
        }
        .candle-care-list {
          padding-left: 1.1rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #555;
          line-height: 1.5;
        }

        /* Mobile Sticky Buy Bar */
        .mobile-sticky-buy-bar {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-sticky-buy-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-width: 100vw;
            background-color: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border-top: 1px solid #eee;
            padding: 0.7rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.6rem;
            z-index: 999;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
            box-sizing: border-box;
          }
          .sticky-meta {
            display: flex;
            flex-direction: column;
            min-width: 0;
            flex: 1;
          }
          .sticky-title {
            font-size: 0.78rem;
            font-weight: 600;
            color: #111;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
            width: 100%;
          }
          .sticky-price {
            font-size: 0.92rem;
            font-weight: 700;
            color: #1b2c13;
          }
          .sticky-add-btn {
            background-color: #1b2c13;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 0.65rem 1.1rem;
            font-size: 0.78rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            cursor: pointer;
            flex-shrink: 0;
            white-space: nowrap;
          }
        }

        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
