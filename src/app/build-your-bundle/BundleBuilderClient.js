'use client';

import { useState, useMemo } from 'react';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';

export default function BundleBuilderClient({ products }) {
  const { addBundleToCart, isLoading: isCartLoading } = useCart();
  
  // Builder States
  const [boxSize, setBoxSize] = useState('medium'); // small, medium, large, premium
  const [selectedItems, setSelectedItems] = useState([]); // Array of { product, quantity }
  const [cardType, setCardType] = useState('birthday'); // birthday, anniversary, rakhi, thank_you, none
  const [recipientName, setRecipientName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [packaging, setPackaging] = useState('premium'); // basic, premium, festive
  const [activeCategory, setActiveCategory] = useState('Candles');
  const [step, setStep] = useState(1); // Step tracker for mobile helper

  // Box Configs
  const boxConfigs = {
    small: { name: 'Small Box', maxItems: 3, price: 99, desc: 'Perfect for a candle & a small plush' },
    medium: { name: 'Medium Box', maxItems: 5, price: 149, desc: 'Holds up to 5 items. Our most popular box.' },
    large: { name: 'Large Box', maxItems: 8, price: 199, desc: 'Fits a complete collection of gifts' },
    premium: { name: 'Premium Wood Box', maxItems: 12, price: 299, desc: 'Handcrafted premium pinewood box' }
  };

  const currentBox = boxConfigs[boxSize];

  // Categories available
  const categories = ['Candles', 'Rakhis', 'Soft Toys', 'Keychains', 'Gifts'];

  // Calculations
  const selectedCount = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [selectedItems]);

  const itemsSubtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [selectedItems]);

  // Bundle Discount rules:
  // 3+ items -> 5% Off
  // 5+ items -> 10% Off
  // 7+ items -> 15% Off
  const discountRate = useMemo(() => {
    if (selectedCount >= 7) return 0.15;
    if (selectedCount >= 5) return 0.10;
    if (selectedCount >= 3) return 0.05;
    return 0;
  }, [selectedCount]);

  const discountAmount = useMemo(() => {
    return Math.round(itemsSubtotal * discountRate);
  }, [itemsSubtotal, discountRate]);

  const cardPrice = cardType !== 'none' ? 49 : 0;
  
  const packagingPrices = {
    basic: 0,
    premium: 79,
    festive: 99
  };
  const packagingPrice = packagingPrices[packaging];

  const totalPrice = useMemo(() => {
    return itemsSubtotal + currentBox.price + cardPrice + packagingPrice - discountAmount;
  }, [itemsSubtotal, currentBox.price, cardPrice, packagingPrice, discountAmount]);

  // Actions
  const handleAddItem = (product) => {
    if (selectedCount >= currentBox.maxItems) {
      alert(`Your selected ${currentBox.name} can hold a maximum of ${currentBox.maxItems} items. Please upgrade your box size to add more!`);
      return;
    }
    
    setSelectedItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing.quantity === 1) {
        return prev.filter(item => item.product.id !== productId);
      }
      return prev.map(item => item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const handleBoxSizeChange = (size) => {
    setBoxSize(size);
    const limit = boxConfigs[size].maxItems;
    // If selected items exceed new limit, trim down quantities
    if (selectedCount > limit) {
      let count = 0;
      const newItems = [];
      for (const item of selectedItems) {
        if (count >= limit) break;
        const availableSpace = limit - count;
        const qtyToAdd = Math.min(item.quantity, availableSpace);
        newItems.push({ ...item, quantity: qtyToAdd });
        count += qtyToAdd;
      }
      setSelectedItems(newItems);
    }
  };

  const handleAddBundleToCart = async () => {
    if (selectedCount === 0) {
      alert('Please add at least 1 product to your box before adding to cart!');
      return;
    }
    
    const bundleId = `bundle-${Date.now()}`;
    const bundleLabel = `${currentBox.name} (Custom Hamper)`;
    
    // Construct cart line items
    const lines = [];

    // Add selected products with metadata attributes
    selectedItems.forEach(item => {
      lines.push({
        variantId: item.product.id,
        quantity: item.quantity,
        attributes: [
          { key: '_bundle_id', value: bundleId },
          { key: '_bundle_name', value: bundleLabel },
          { key: '_bundle_recipient', value: recipientName || 'Special Someone' },
          { key: '_bundle_message', value: giftMessage || 'Enjoy your gift!' },
          { key: '_bundle_card', value: cardType },
          { key: '_bundle_packaging', value: packaging },
          { key: 'Gift Box', value: 'Part of Custom Bundle' }
        ]
      });
    });

    await addBundleToCart(lines);
  };

  // Filtered products based on active category tab
  const filteredProducts = products.filter(p => p.category === activeCategory);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '100%', gap: '2rem', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }} className="builder-desktop-grid">
      
      {/* CSS injection for split columns and custom layouts */}
      <style jsx global>{`
        @media (min-width: 992px) {
          .builder-desktop-grid {
            grid-template-columns: 1.4fr 1fr !important;
          }
          .sticky-preview {
            position: sticky;
            top: 100px;
            height: fit-content;
          }
        }
        .builder-step-card {
          background-color: #fff;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.04);
          overflow: hidden;
        }
        @media (min-width: 992px) {
          .builder-step-card {
            padding: 2rem;
          }
        }
        .step-badge {
          display: inline-block;
          background-color: #1b2c13;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .category-tab-btn {
          background: none;
          border: none;
          padding: 0.8rem 1.2rem;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          color: #777;
          transition: all 0.2s ease;
        }
        .category-tab-btn.active {
          border-bottom-color: #1b2c13;
          color: #1b2c13;
        }
        .visual-box-container {
          background-color: #f7f6f0;
          border: 2px dashed #d1cebd;
          border-radius: 12px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .visual-item-bubble {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          overflow: hidden;
          background-color: #fff;
          position: absolute;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>

      {/* LEFT COLUMN: Selector Steps */}
      <div>
        
        {/* Step 1: Box Size */}
        <div className="builder-step-card">
          <span className="step-badge">Step 1</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#111', marginBottom: '1.5rem' }}>
            Choose Your Box Size
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {Object.entries(boxConfigs).map(([size, config]) => (
              <div 
                key={size}
                onClick={() => handleBoxSizeChange(size)}
                style={{
                  border: boxSize === size ? '2px solid #1b2c13' : '1px solid #e2e2e2',
                  backgroundColor: boxSize === size ? '#f4f6f3' : '#fff',
                  borderRadius: '8px',
                  padding: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {boxSize === size && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1b2c13', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111' }}>{config.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#777', margin: '0 0 0.8rem 0' }}>{config.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1b2c13', backgroundColor: '#e2eae0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Holds {config.maxItems} items
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>₹{config.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Choose Products */}
        <div className="builder-step-card" id="products-step">
          <span className="step-badge">Step 2</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#111', margin: 0 }}>
                Select Your Gifts
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.3rem 0 0 0' }}>
                Fill your box: <strong>{selectedCount} of {currentBox.maxItems} items</strong> added.
              </p>
            </div>
            
            {/* Box Progress Bar */}
            <div style={{ width: '150px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.3rem' }}>
                <span>Box Capacity</span>
                <span>{Math.round((selectedCount / currentBox.maxItems) * 100)}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(selectedCount / currentBox.maxItems) * 100}%`, height: '100%', backgroundColor: selectedCount >= currentBox.maxItems ? '#D97706' : '#1b2c13', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eaeaea', overflowX: 'auto', gap: '0.5rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }} className="hide-scroll">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.8rem' }}>
            {filteredProducts.map(product => {
              const cartItem = selectedItems.find(item => item.product.id === product.id);
              const qty = cartItem ? cartItem.quantity : 0;
              
              return (
                <div 
                  key={product.id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: qty > 0 ? '1px solid #1b2c13' : '1px solid #f0f0f0',
                    padding: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: qty > 0 ? '0 4px 12px rgba(27,44,19,0.05)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {qty > 0 && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#1b2c13', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                      {qty}
                    </div>
                  )}
                  <div style={{ aspectRatio: '1', width: '100%', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f9f9f9', marginBottom: '0.8rem' }}>
                    <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', margin: '0 0 0.4rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4rem', lineHeight: '1.2rem' }}>
                    {product.title}
                  </h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>₹{product.price}</span>
                    
                    {qty > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1b2c13', borderRadius: '4px', overflow: 'hidden' }}>
                        <button onClick={() => handleRemoveItem(product.id)} style={{ padding: '0.2rem 0.6rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, color: '#1b2c13' }}>-</button>
                        <span style={{ padding: '0 0.4rem', fontSize: '0.85rem', fontWeight: 700 }}>{qty}</span>
                        <button onClick={() => handleAddItem(product)} style={{ padding: '0.2rem 0.6rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, color: '#1b2c13' }}>+</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddItem(product)}
                        disabled={!product.available}
                        style={{
                          backgroundColor: '#1b2c13',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: product.available ? 'pointer' : 'not-allowed',
                          opacity: product.available ? 1 : 0.5
                        }}
                      >
                        {product.available ? 'Add' : 'Out of Stock'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Add Personal Touch */}
        <div className="builder-step-card">
          <span className="step-badge">Step 3</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#111', marginBottom: '1.5rem' }}>
            Add a Personal Touch
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="personal-touch-grid">
            
            {/* Greeting Card Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#333', marginBottom: '0.8rem' }}>
                Select Greeting Card (₹49)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
                {[
                  { id: 'birthday', label: '🎂 Birthday' },
                  { id: 'anniversary', label: '❤️ Anniversary' },
                  { id: 'rakhi', label: '🧵 Rakhi Special' },
                  { id: 'thank_you', label: '✨ Thank You' },
                  { id: 'none', label: '🚫 No Card' }
                ].map(card => (
                  <div 
                    key={card.id}
                    onClick={() => setCardType(card.id)}
                    style={{
                      border: cardType === card.id ? '2px solid #1b2c13' : '1px solid #e2e2e2',
                      backgroundColor: cardType === card.id ? '#f4f6f3' : '#fff',
                      borderRadius: '6px',
                      padding: '0.8rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {card.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient details */}
            {cardType !== 'none' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#333', marginBottom: '0.5rem' }}>
                    Recipient Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter recipient's name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#333', marginBottom: '0.5rem' }}>
                    Gift Message
                  </label>
                  <textarea 
                    rows="3"
                    placeholder="Type your heartfelt greeting card message here..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-sans)',
                      resize: 'none'
                    }}
                  />
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Step 4: Choose Packaging */}
        <div className="builder-step-card">
          <span className="step-badge">Step 4</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#111', marginBottom: '1.5rem' }}>
            Choose Packaging Style
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {[
              { id: 'basic', name: 'Basic Wrap', desc: 'Craft carton box with bubblewrap safety.', price: 0, icon: '📦' },
              { id: 'premium', name: 'Signature Premium', desc: 'Elegant matte finish rigid box with shreddings and ribbon.', price: 79, icon: '🎀' },
              { id: 'festive', name: 'Festive Special', desc: 'Traditional royal packaging with marigold tags.', price: 99, icon: '✨' }
            ].map(pack => (
              <div 
                key={pack.id}
                onClick={() => setPackaging(pack.id)}
                style={{
                  border: packaging === pack.id ? '2px solid #1b2c13' : '1px solid #e2e2e2',
                  backgroundColor: packaging === pack.id ? '#f4f6f3' : '#fff',
                  borderRadius: '8px',
                  padding: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {packaging === pack.id && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1b2c13', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{pack.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#111' }}>{pack.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#777', margin: '0 0 0.8rem 0', lineHeight: '1.2rem' }}>{pack.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>{pack.price === 0 ? 'FREE' : `+ ₹${pack.price}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Sticky Preview & Summary */}
      <div className="sticky-preview">
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400, color: '#1b2c13', marginBottom: '1.5rem', textAlign: 'center' }}>
            Your Gift Box Preview
          </h2>

          {/* Visual Box Container */}
          <div className="visual-box-container">
            {selectedCount === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Your Box is Empty</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>Select products on the left to pack them.</div>
              </div>
            ) : (
              <>
                {/* Background Box Graphic */}
                <div style={{
                  position: 'absolute', inset: '10%', borderRadius: '10px',
                  backgroundColor: packaging === 'basic' ? '#dfd5c6' : packaging === 'premium' ? '#1b2c13' : '#a22020',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'background-color 0.4s ease'
                }} />
                
                {/* Shredding paper inside box */}
                <div style={{
                  position: 'absolute', inset: '12%', borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 15%, transparent 16%)',
                  backgroundSize: '8px 8px'
                }} />

                {/* Selected Item Bubbles arranged inside box */}
                {selectedItems.map((item, idx) => {
                  // Coordinate positions to make a nice scattered layout inside the box
                  const positions = [
                    { top: '25%', left: '25%' },
                    { top: '25%', left: '55%' },
                    { top: '55%', left: '25%' },
                    { top: '55%', left: '55%' },
                    { top: '40%', left: '40%' },
                    { top: '15%', left: '40%' },
                    { top: '40%', left: '15%' },
                    { top: '40%', left: '68%' },
                    { top: '68%', left: '40%' },
                    { top: '15%', left: '15%' },
                    { top: '68%', left: '68%' },
                    { top: '15%', left: '68%' }
                  ];
                  
                  const pos = positions[idx % positions.length];
                  
                  return (
                    <div 
                      key={item.product.id} 
                      className="visual-item-bubble"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        transform: 'scale(1)',
                        zIndex: idx + 2
                      }}
                    >
                      <img src={item.product.image} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  );
                })}
                
                {/* Floating Card indicator */}
                {cardType !== 'none' && (
                  <div style={{
                    position: 'absolute', bottom: '15px', right: '15px',
                    backgroundColor: '#fff', color: '#111', fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.3rem 0.6rem', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 20, transform: 'rotate(-5deg)', fontFamily: 'var(--font-sans)', border: '1px solid #eee'
                  }}>
                    ✉️ {recipientName ? `${recipientName}'s Card` : 'Greeting Card'}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pricing Details */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#555' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{currentBox.name} Packaging</span>
                <span style={{ fontWeight: 600, color: '#111' }}>₹{currentBox.price}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Gifts Subtotal ({selectedCount} items)</span>
                <span style={{ fontWeight: 600, color: '#111' }}>₹{itemsSubtotal}</span>
              </div>

              {cardPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Greeting Card</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>₹{cardPrice}</span>
                </div>
              )}

              {packagingPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{packaging.charAt(0).toUpperCase() + packaging.slice(1)} Gift Box Wrap</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>₹{packagingPrice}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e4a26', fontWeight: 600 }}>
                  <span>Bundle Discount ({discountRate * 100}%)</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              
              {/* Progress bar to next discount */}
              {selectedCount > 0 && selectedCount < 7 && (() => {
                const nextTier = selectedCount < 3 ? 3 : (selectedCount < 5 ? 5 : 7);
                const nextDiscount = nextTier === 3 ? '5%' : (nextTier === 5 ? '10%' : '15%');
                const remaining = nextTier - selectedCount;
                return (
                  <div style={{ fontSize: '0.75rem', backgroundColor: '#e2eae0', color: '#1b2c13', padding: '0.5rem 0.8rem', borderRadius: '6px', fontWeight: 500, marginTop: '0.4rem' }}>
                    💡 Add <strong>{remaining} more item{remaining > 1 ? 's' : ''}</strong> to unlock <strong>{nextDiscount} OFF</strong> your gifts!
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eaeaea', paddingTop: '1rem', marginTop: '0.5rem', fontSize: '1.15rem', fontWeight: 800, color: '#1b2c13' }}>
                <span>Total Box Price</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Add Bundle to Cart Action */}
          <button
            onClick={handleAddBundleToCart}
            disabled={selectedCount === 0 || isCartLoading}
            style={{
              width: '100%',
              backgroundColor: '#1b2c13',
              color: '#fff',
              border: 'none',
              padding: '1.2rem',
              borderRadius: '6px',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: (selectedCount === 0 || isCartLoading) ? 'not-allowed' : 'pointer',
              opacity: (selectedCount === 0 || isCartLoading) ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(27,44,19,0.15)'
            }}
          >
            {isCartLoading ? 'Adding Bundle to Cart...' : `Add Custom Bundle • ₹${totalPrice}`}
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', color: '#777', marginTop: '1rem' }}>
            <span>🔒 Safe & Secure Checkout</span>
            <span>•</span>
            <span>📦 Pan-India Delivery</span>
          </div>

        </div>
      </div>

    </div>
  );
}
