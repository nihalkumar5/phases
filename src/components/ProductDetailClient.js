'use client';

import { useState } from 'react';
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

  const handleAddToCart = async () => {
    if (!variant?.id || !isAvailable) return;
    setIsAddedAnimation(true);
    await addToCart(variant.id, quantity, true);
    setTimeout(() => setIsAddedAnimation(false), 1200);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeMessage({ valid: true, text: `✓ Standard delivery to ${pincode} available in 3-5 days.` });
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
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                >
                  <img src={img.url} alt={img.altText || `Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Featured Image Display / Mobile Swipe */}
          <div className="main-image-viewport">
            <div className="main-image-container">
              {images[selectedImageIndex] ? (
                <img 
                  src={images[selectedImageIndex].url} 
                  alt={images[selectedImageIndex].altText || product.title} 
                  className="hero-product-image"
                />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              <span className="luxury-badge">✦ Handcrafted in Small Batches</span>
            </div>

            {/* Mobile Carousel Indicators */}
            {images.length > 1 && (
              <div className="mobile-dots-indicator">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
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
              <span className="review-count">(94 Verified Reviews)</span>
              <span className="live-viewers">• 14 sold in last 24 hrs</span>
            </div>

            <h1 className="product-title-serif">
              {product.title.split('|')[0].trim()}
            </h1>

            <div className="price-tag-row">
              <span className="current-price">{formattedPrice}</span>
              <span className="mrp-strikethrough">₹{Math.round(numericPrice * 1.25)}</span>
              <span className="discount-pill">Save 20%</span>
            </div>
            <p className="tax-shipping-subtext">Inclusive of all taxes • Free shipping on orders above ₹500</p>
          </div>

          {/* Quick Gifting Highlights Card */}
          <div className="gifting-perks-box">
            <div className="perk-item">
              <span className="perk-icon">🎁</span>
              <div className="perk-text">
                <strong>Luxury Gift Box Ready</strong>
                <span>Packed with care in signature luxury presentation.</span>
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
                <span>Clean, non-toxic, smoke-free burn.</span>
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
                  <span>Adding to Cart...</span>
                ) : isAddedAnimation ? (
                  <span>✓ Added to Cart!</span>
                ) : (
                  <span>ADD TO CART • {new Intl.NumberFormat('en-IN', { style: 'currency', currency: price?.currencyCode || 'INR', maximumFractionDigits: 0 }).format(numericPrice * quantity)}</span>
                )}
              </button>
            </div>

            {/* Secondary Bundle Builder CTA */}
            <Link href="/build-your-bundle" className="secondary-bundle-btn">
              <span>✨ Or Add this into a Custom Gift Box (Save up to 15%) →</span>
            </Link>
          </div>

          {/* Pincode Delivery Check */}
          <div className="pincode-check-card">
            <span className="pincode-label">🚚 Check Estimated Delivery</span>
            <form onSubmit={handleCheckPincode} className="pincode-form">
              <input 
                type="text" 
                placeholder="Enter 6-digit PIN Code" 
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
            <div className="pdp-tab-headers">
              <button 
                onClick={() => setActiveTab('description')} 
                className={`tab-link ${activeTab === 'description' ? 'active' : ''}`}
              >
                Description & Scents
              </button>
              <button 
                onClick={() => setActiveTab('specs')} 
                className={`tab-link ${activeTab === 'specs' ? 'active' : ''}`}
              >
                Features & Craft
              </button>
              <button 
                onClick={() => setActiveTab('care')} 
                className={`tab-link ${activeTab === 'care' ? 'active' : ''}`}
              >
                Care & Burning Tips
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
                        <span>Pure soy & natural coconut botanical blend</span>
                      </div>
                    </div>
                    <div className="spec-pill">
                      <span className="spec-icon">🕯️</span>
                      <div>
                        <strong>Burn Time</strong>
                        <span>Approx. 25-35 hours clean, consistent burn</span>
                      </div>
                    </div>
                    <div className="spec-pill">
                      <span className="spec-icon">🧵</span>
                      <div>
                        <strong>Wick Craft</strong>
                        <span>100% Lead-free braided organic cotton</span>
                      </div>
                    </div>
                    <div className="spec-pill">
                      <span className="spec-icon">🧪</span>
                      <div>
                        <strong>Toxin Free</strong>
                        <span>No parabens, phthalates, or chemical accelerants</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="tab-pane-fade">
                  <ul className="candle-care-list">
                    <li>✦ Trim the wick to 1/4 inch before each burn for a cleaner, smoke-free flame.</li>
                    <li>✦ Allow the wax to melt completely to the edges on your first burn to prevent tunneling.</li>
                    <li>✦ Burn for a maximum of 3-4 hours at a time in a draft-free space.</li>
                    <li>✦ Keep away from flammable objects, children, and pets.</li>
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
          margin: 0 auto;
          padding: 1.5rem 1.5rem 4rem 1.5rem;
          font-family: var(--font-sans);
          color: #111;
        }

        /* Breadcrumbs */
        .pdp-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #777;
          margin-bottom: 2rem;
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
        }

        /* Main Grid */
        .pdp-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
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
          gap: 1.2rem;
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
        }
        .main-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          background-color: #faf9f6;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .hero-product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .hero-product-image:hover {
          transform: scale(1.03);
        }
        .luxury-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background-color: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          color: #1b2c13;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.4rem 0.8rem;
          border-radius: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .mobile-dots-indicator {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        @media (min-width: 992px) {
          .mobile-dots-indicator {
            display: none;
          }
        }
        .dot-pill {
          width: 24px;
          height: 4px;
          border-radius: 2px;
          background-color: #ddd;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .dot-pill.active {
          background-color: #1b2c13;
          width: 36px;
        }

        /* Product Info Column */
        .pdp-info-column {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
        }

        /* Header Block */
        .rating-review-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: #555;
          margin-bottom: 0.6rem;
          flex-wrap: wrap;
        }
        .stars {
          color: #e5a93b;
          letter-spacing: 1px;
          font-size: 0.95rem;
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
          font-size: clamp(1.9rem, 3.5vw, 2.6rem);
          font-weight: 400;
          line-height: 1.18;
          color: #111;
          margin: 0 0 0.8rem 0;
        }
        .price-tag-row {
          display: flex;
          align-items: baseline;
          gap: 0.8rem;
          margin-bottom: 0.3rem;
        }
        .current-price {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1b2c13;
        }
        .mrp-strikethrough {
          font-size: 1.1rem;
          color: #999;
          text-decoration: line-through;
        }
        .discount-pill {
          background-color: #fce8e6;
          color: #c53030;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }
        .tax-shipping-subtext {
          font-size: 0.8rem;
          color: #777;
          margin: 0;
        }

        /* Gifting Perks Card */
        .gifting-perks-box {
          background-color: #faf9f5;
          border: 1px solid #ebd492;
          border-radius: 10px;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .perk-item {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
        }
        .perk-icon {
          font-size: 1.3rem;
          line-height: 1;
        }
        .perk-text strong {
          display: block;
          font-size: 0.85rem;
          color: #1b2c13;
          font-weight: 700;
        }
        .perk-text span {
          display: block;
          font-size: 0.78rem;
          color: #666;
        }

        /* Actions: Quantity + Button */
        .purchase-action-group {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .quantity-and-add-row {
          display: flex;
          gap: 0.8rem;
        }
        .luxury-quantity-stepper {
          display: flex;
          align-items: center;
          background: #f6f5f0;
          border: 1px solid #ddd;
          border-radius: 6px;
          width: 110px;
          height: 52px;
          flex-shrink: 0;
        }
        .luxury-quantity-stepper button {
          flex: 1;
          height: 100%;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #111;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .luxury-quantity-stepper .qty-value {
          font-weight: 700;
          font-size: 1rem;
          width: 30px;
          text-align: center;
        }
        .primary-add-to-cart-btn {
          flex: 1;
          height: 52px;
          background-color: #1b2c13;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(27,44,19,0.2);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .primary-add-to-cart-btn:hover:not(:disabled) {
          background-color: #27401c;
          transform: translateY(-1px);
        }
        .primary-add-to-cart-btn.success {
          background-color: #2e7d32;
        }
        .secondary-bundle-btn {
          display: block;
          text-align: center;
          padding: 0.8rem;
          background-color: #fff;
          border: 1px dashed #1b2c13;
          color: #1b2c13;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .secondary-bundle-btn:hover {
          background-color: #f6f5f0;
        }

        /* Pincode Check */
        .pincode-check-card {
          border: 1px solid #eee;
          padding: 1.1rem;
          border-radius: 8px;
          background-color: #fff;
        }
        .pincode-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.6rem;
        }
        .pincode-form {
          display: flex;
          gap: 0.5rem;
        }
        .pincode-input {
          flex: 1;
          padding: 0.65rem 0.8rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.85rem;
          font-family: var(--font-sans);
          outline: none;
        }
        .pincode-input:focus {
          border-color: #1b2c13;
        }
        .pincode-btn {
          padding: 0.65rem 1.2rem;
          background-color: #111;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
        .pincode-result {
          font-size: 0.8rem;
          margin: 0.6rem 0 0 0;
          font-weight: 600;
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
          padding: 1.1rem;
          background-color: #fff;
        }
        .upsell-heading {
          margin-bottom: 0.8rem;
        }
        .upsell-badge {
          background-color: #ebd492;
          color: #1b2c13;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          display: inline-block;
          margin-bottom: 0.3rem;
        }
        .upsell-heading p {
          margin: 0;
          font-size: 0.82rem;
          font-weight: 600;
          color: #444;
        }
        .upsell-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .upsell-product-preview {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .upsell-img-wrap {
          width: 48px;
          height: 48px;
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
        .upsell-meta h4 {
          margin: 0 0 0.2rem 0;
          font-size: 0.85rem;
          font-weight: 600;
          color: #111;
        }
        .upsell-price {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1b2c13;
        }

        /* Tabs Section */
        .pdp-tabs-section {
          border-top: 1px solid #eee;
          padding-top: 1.5rem;
          margin-top: 0.5rem;
        }
        .pdp-tab-headers {
          display: flex;
          gap: 1.5rem;
          border-bottom: 1px solid #eee;
          margin-bottom: 1.2rem;
          overflow-x: auto;
        }
        .tab-link {
          background: none;
          border: none;
          padding: 0.6rem 0;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 600;
          color: #777;
          cursor: pointer;
          position: relative;
          white-space: nowrap;
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
          font-size: 0.92rem;
          color: #444;
          line-height: 1.7;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .spec-pill {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
          background-color: #faf9f5;
          padding: 0.9rem;
          border-radius: 6px;
        }
        .spec-icon {
          font-size: 1.3rem;
        }
        .spec-pill strong {
          display: block;
          font-size: 0.82rem;
          color: #111;
        }
        .spec-pill span {
          display: block;
          font-size: 0.75rem;
          color: #666;
        }
        .candle-care-list {
          padding-left: 1.2rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #555;
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
            width: 100%;
            background-color: rgba(255, 255, 255, 0.97);
            backdrop-filter: blur(8px);
            border-top: 1px solid #eee;
            padding: 0.8rem 1.2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 999;
            box-shadow: 0 -4px 15px rgba(0,0,0,0.06);
          }
          .sticky-meta {
            display: flex;
            flex-direction: column;
          }
          .sticky-title {
            font-size: 0.8rem;
            font-weight: 600;
            color: #111;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .sticky-price {
            font-size: 0.95rem;
            font-weight: 700;
            color: #1b2c13;
          }
          .sticky-add-btn {
            background-color: #1b2c13;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 0.7rem 1.4rem;
            font-size: 0.82rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
}
