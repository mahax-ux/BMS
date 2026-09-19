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
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

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
  };

  return (
    <div className="app-container">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="content">
        {step === 'HOME' && (
          <>
            <img src={centerImg} alt="Center Graphic" className="floating-image" /> 
            <button className="gold-btn" onClick={() => setStep('PAY_MANUAL')}>
              <span className="btn-main-text">Contribute Now</span>
            </button>
          </>
        )}

        {step === 'PAY_MANUAL' && (
          <div className="donation-card" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
            <button className="close-btn" onClick={resetApp}>✕</button>
            
            <h2 className="donation-title">
              {/* Premium Gold Spark Vector */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="title-vector">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#title-grad)"/>
                <defs>
                  <linearGradient id="title-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff7c2" />
                    <stop offset="0.5" stopColor="#ffd700" />
                    <stop offset="1" stopColor="#d4af37" />
                  </linearGradient>
                </defs>
              </svg>
              Contribute
            </h2>
            
            <div className="qr-container">
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
        )}

        {step === 'SUCCESS' && (
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
        )}
      </div>

      <img src={borderOverlay} alt="Golden Border Overlay" className="border-overlay" /> 
    </div>
  );
}

export default App;