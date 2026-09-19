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

const UPI_ID = '9538764241@ybl';
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

  const handleDirectPay = (provider) => {
    logTransaction(provider);
    
    // Construct the standard payment data
    const baseParams = `pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR`;
    
    // Route to the specific app using deep links
    let intentUrl = `upi://pay?${baseParams}`; // Universal fallback
    
    if (provider === 'gpay') {
      intentUrl = `tez://upi/pay?${baseParams}`;
    } else if (provider === 'phonepe') {
      intentUrl = `phonepe://pay?${baseParams}`;
    } else if (provider === 'paytm') {
      intentUrl = `paytmmp://pay?${baseParams}`;
    }

    // Launch the app
    window.location.href = intentUrl;
    
    // Move to success screen in the background
    setTimeout(() => setStep('SUCCESS'), 2500);
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
            <button className="gold-btn" onClick={() => setStep('PAY_OPTIONS')}>
              <span className="btn-main-text">Contribute Now</span>
            </button>
          </>
        )}

        {step === 'PAY_OPTIONS' && (
          <div className="donation-card">
            <button className="close-btn" onClick={resetApp}>✕</button>
            
            <h2 className="donation-title">Pay Directly via App</h2>
            <p className="success-msg" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
              Select your app below to open it directly.
            </p>

            <div className="apps-container">
              <button className="pay-app-btn" onClick={() => handleDirectPay('gpay')}>
                <img src={gpayLogo} alt="GPay" className="brand-logo" /> Open in GPay
              </button>
              <button className="pay-app-btn" onClick={() => handleDirectPay('phonepe')}>
                <img src={phonepeLogo} alt="PhonePe" className="brand-logo" /> Open in PhonePe
              </button>
              <button className="pay-app-btn" onClick={() => handleDirectPay('paytm')}>
                Open in Paytm
              </button>
              <button className="pay-app-btn secondary-toggle" onClick={() => handleDirectPay('generic')}>
                Other UPI App
              </button>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="donation-card success-card">
            <button className="close-btn" onClick={resetApp}>✕</button>
            <div className="success-icon">🙏</div>
            <h2 className="donation-title" style={{color: '#ffd700'}}>Thank You!</h2>
            <p className="success-msg">
              Please show your <b>payment history</b> to the mandal karyakarta and collect your Paavthi.
            </p>
            <button className="action-btn generate-btn" onClick={resetApp}>
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