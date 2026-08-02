'use client';

export default function VideoReels() {
  const reels = [
    {
      title: "Handmade Process 🌿",
      placeholder: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&q=80"
    },
    {
      title: "Perfect Ambiance ✨",
      placeholder: "https://images.unsplash.com/photo-1572979213813-9118e6ecbecc?w=400&q=80"
    },
    {
      title: "Our Best Sellers 🤍",
      placeholder: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80"
    }
  ];

  return (
    <section style={{ padding: '0 0 4rem 0', backgroundColor: '#fff', width: '100%' }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        padding: '0 1.5rem',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none'
      }}
      className="hide-scroll video-reels-container"
      >
        {reels.map((reel, idx) => (
          <div key={idx} style={{
            flex: '0 0 75%',
            maxWidth: '320px',
            aspectRatio: '4/5',
            scrollSnapAlign: 'start',
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#eee'
          }}>
            {/* Placeholder Image simulating a video thumbnail */}
            <img 
              src={reel.placeholder} 
              alt={reel.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            
            {/* Dark Gradient Overlay for text readability */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '40%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
              zIndex: 1
            }} />

            {/* Play Button Icon */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 11L0.5 20.8135V1.18653L17.5 11Z" fill="white"/>
              </svg>
            </div>

            {/* Bottom Title */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              right: '1rem',
              zIndex: 2
            }}>
              <span style={{
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textShadow: '0px 1px 2px rgba(0,0,0,0.5)'
              }}>
                {reel.title}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
