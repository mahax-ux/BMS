import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import bgVideo from './assets/Vid.mp4';
import centerImg from './assets/image.png'; 
import borderOverlay from './assets/border_image.png'; 

import gpayLogo from './assets/gpay.png';
import phonepeLogo from './assets/phonepay.png';

import './App.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UPI_ID = '8867456612@ptyes';
const PAYEE_NAME = 'Camp Cha Samrat';

function App() {
  const [step, setStep] = useState('HOME'); 
  const [isQrMaximized, setIsQrMaximized] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState(null); 

  const logTransaction = async (method) => {
    try {
      const payload = { 
        amount: 0, 
        app_used: method,
        status: 'initiated',
        donor_name: 'Anonymous'
      };
      await supabase.from('transactions').insert([payload]);
    } catch (error) {
      console.error('Database log failed:', error.message);
    }
  };

  const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(upiString)}`;

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CampChaSamrat_QR.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(qrImageUrl, '_blank');
    }
  };

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      alert('✅ UPI ID Copied! Paste it in your payment app.');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleAppLaunch = (provider, scheme) => {
    logTransaction(provider);
    window.location.href = scheme;
  };

  const resetApp = () => {
    setStep('HOME');
    setIsQrMaximized(false);
    setActiveInfoModal(null);
  };

  const timelineData = [
    { 
      id: 1, 
      title: 'Our History', 
      desc: 'Read about the legacy of Camp Cha Samrat.', 
      content: 'Established decades ago, Camp Cha Samrat has been the heart of our local cultural celebrations. From humble beginnings with a small pandal, we have grown into one of the most prominent mandals in the city. Our legacy is built on community service, grand visual storytelling, and an unwavering devotion that brings thousands of devotees together every year.' 
    },
    { 
      id: 2, 
      title: 'Gallery', 
      desc: 'Explore photos and videos from previous years.', 
      content: 'This section will house our vibrant gallery. Relive the spectacular aartis, the intricate idol designs of the past, the energetic dhol-tasha performances, and the joyous visarjan processions. (Images coming soon!)' 
    },
    { 
      id: 3, 
      title: 'Events Schedule', 
      desc: 'Check out the upcoming aarti and cultural timings.', 
      content: '• Morning Aarti: 8:00 AM Daily\n• Evening Maha Aarti: 7:30 PM Daily\n• Mahaprasad Distribution: Day 5 & Day 9 at 1:00 PM\n• Dhol Tasha Pathak Performance: Day 8 evening\n• Visarjan Miravnuk: Final Day starting at 4:00 PM.' 
    },
    { 
      id: 4, 
      title: 'Mandal Members', 
      desc: 'Meet the dedicated karyakartas behind the festival.', 
      content: 'Our mandal operates flawlessly thanks to our dedicated volunteers (Karyakartas). From crowd management and stage decoration to daily rituals and digital presence, our youth wing works day and night to ensure a safe and spiritually uplifting experience for all visitors.' 
    }
  ];

  return (
    <div className="app-container">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="content">
        {step === 'HOME' && (
          <div className="scrollable-page">
            
            <section className="hero-section">
              <img src={centerImg} alt="Center Graphic" className="floating-image" /> 
              <button className="gold-btn" onClick={() => setStep('PAY_MANUAL')}>
                <span className="btn-main-text">Contribute Now</span>
              </button>
              
              <div className="scroll-indicator">
                <p>Scroll Down To Explore</p>
                <div className="chevron-arrows">
                  <span className="chevron"></span>
                  <span className="chevron"></span>
                  <span className="chevron"></span>
                </div>
              </div>
            </section>

            <section className="timeline-section">
              <div className="timeline-container">
                <div className="timeline-line"></div>
                
                {timelineData.map((item, index) => (
                  <div key={item.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                    <div className="glass-nav-card" onClick={() => setActiveInfoModal(item)}>
                      <span className="card-number">0{item.id}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Us Section */}
            <section className="contact-section">
              <h2 className="contact-title">Contact Us</h2>
              <div className="contact-buttons">
                <a href="tel:9538764241" className="contact-btn">
                  📞 9538764241
                </a>
                <a href="https://instagram.com/bms_cha_raja" target="_blank" rel="noopener noreferrer" className="contact-btn insta-btn">
                  📸 @bms_cha_raja
                </a>
              </div>
            </section>

          </div>
        )}

        {activeInfoModal && (
          <div className="modal-overlay" onClick={() => setActiveInfoModal(null)}>
            <div className="donation-card info-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setActiveInfoModal(null)}>✕</button>
              
              <h2 className="donation-title" style={{ fontSize: '1.4rem' }}>
                {activeInfoModal.title}
              </h2>
              
              <div className="modal-body-text">
                {activeInfoModal.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'PAY_MANUAL' && (
          <div className="modal-overlay">
            <div className="donation-card" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
              <button className="close-btn" onClick={resetApp}>✕</button>
              
              <h2 className="donation-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="title-vector">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#title-grad)"/>
                  <defs>
                    <linearGradient id="title-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fff7c2" />
                      <stop offset="0.5" stopColor="#ffd700" />
                      <stop offset="1" stopColor="#d4af37" />
                    </linearGradient>
                  </defs>
                </svg>
                CONTRIBUTE
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="title-vector" style={{ transform: 'scaleX(-1)' }}>
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#title-grad)"/>
                </svg>
              </h2>
              
              <div className="qr-container" onClick={() => setIsQrMaximized(true)} title="Tap to Enlarge">
                <img src={qrImageUrl} alt="UPI QR Code" className="qr-image" />
              </div>
              
              <button onClick={handleDownloadQR} className="qr-download-btn">
                ⬇ Download QR Code
              </button>

              <div className="upi-copy-wrapper">
                <div className="upi-id-display">{UPI_ID}</div>
                <button onClick={handleCopyUPI} className="upi-copy-btn">Copy</button>
              </div>

              <p className="payment-steps">
                1. Download QR or Copy UPI ID.<br/>
                2. Open your app using buttons below.<br/>
                3. Scan from Gallery or Paste ID.
              </p>

              <div className="apps-flex">
                <button className="white-glass-btn" onClick={() => handleAppLaunch('gpay', 'tez://')}>
                  <img src={gpayLogo} alt="GPay" className="app-logo-icon" /> GPay
                </button>
                <button className="white-glass-btn" onClick={() => handleAppLaunch('phonepe', 'phonepe://')}>
                  <img src={phonepeLogo} alt="PhonePe" className="app-logo-icon" /> PhonePe
                </button>
              </div>

              <button className="action-btn" onClick={() => setStep('SUCCESS')}>
                I Have Paid
              </button>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="modal-overlay">
            <div className="donation-card success-card">
              <button className="close-btn" onClick={resetApp}>✕</button>
              <div className="success-icon">🙏</div>
              <h2 className="donation-title">Thank You!</h2>
              <p className="success-msg">
                Please show your <b>payment history</b> to the mandal karyakarta and collect your Paavthi.
              </p>
              <button className="action-btn" onClick={resetApp}>
                Done
              </button>
            </div>
          </div>
        )}

        {isQrMaximized && (
          <div className="qr-modal-overlay" onClick={() => setIsQrMaximized(false)}>
            <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="qr-close-btn" onClick={() => setIsQrMaximized(false)}>✕</button>
              <img src={qrImageUrl} alt="Enlarged UPI QR Code" className="qr-image-maximized" />
              <p className="qr-modal-text">Scan & Pay</p>
            </div>
          </div>
        )}
      </div>

      <img src={borderOverlay} alt="Golden Border Overlay" className="border-overlay" /> 
    </div>
  );
}

export default App;