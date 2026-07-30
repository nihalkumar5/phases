'use client';

import { useState } from 'react';

export default function QuizSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const questions = [
    { question: "What type of mood are you looking to create?", options: ["Relaxing & Calm", "Energizing & Fresh", "Romantic & Cozy", "Productive & Focused"] },
    { question: "Which scent profile do you naturally gravitate towards?", options: ["Floral & Sweet", "Woody & Earthy", "Citrus & Fruity", "Spicy & Warm"] },
    { question: "Where do you plan to use this candle the most?", options: ["Bedroom", "Living Room", "Bathroom", "Workspace"] }
  ];

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setStep(0), 300);
  };

  return (
    <>
      <section className="quiz-banner reveal-up">
        <div className="quiz-image bezel-shell">
          <div className="bezel-core">
            <img src="/quiz-banner.png" alt="Quiz Banner" loading="lazy" />
          </div>
        </div>
        <div className="quiz-content">
          <div className="pill-label accent-pill mb-6">QUIZ</div>
          <h2 className="quiz-title">Need help choosing the perfect scent?</h2>
          <p className="quiz-subtitle">Take our 30 second quiz to find the perfect product for your home!</p>
          <button className="btn-island light-island group" onClick={() => setIsOpen(true)}>
            <span className="btn-island-text">Take Our Quiz</span>
            <div className="btn-nested-wrapper dark-nested">
              <span>↗</span>
            </div>
          </button>
        </div>
      </section>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} onClick={handleClose} />
          
          <div style={{ position: 'relative', background: '#fff', width: '90%', maxWidth: '500px', borderRadius: '24px', padding: '3rem 2rem', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center' }}>
            <button onClick={handleClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
            
            {step < questions.length ? (
              <>
                <p style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Question {step + 1} of {questions.length}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '2rem', color: '#111' }}>{questions[step].question}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {questions[step].options.map((option, idx) => (
                    <button key={idx} onClick={handleNext} style={{ padding: '1rem', background: '#f5f5f7', border: '1px solid transparent', borderRadius: '12px', fontSize: '1rem', color: '#111', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={(e) => e.target.style.borderColor = '#111'} onMouseOut={(e) => e.target.style.borderColor = 'transparent'}>
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '80px', height: '80px', background: '#f5f5f7', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>✨</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 500, marginBottom: '1rem', color: '#111' }}>Your Perfect Match</h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Based on your answers, we recommend the <strong>Iced Matcha Candle</strong> for a perfectly balanced and calming atmosphere.</p>
                <button onClick={handleClose} style={{ background: '#111', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '30px', fontSize: '1rem', cursor: 'pointer', width: '100%' }}>View Product</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
