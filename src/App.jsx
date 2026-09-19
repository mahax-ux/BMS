// App.jsx
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
  const [activeProvider, setActiveProvider] = useState('');

  const logTransaction = async () => {
    try {
      const payload = { 
        amount: 0, // Amount is now entered in the UPI app, logged as 0 here
        app_used: activeProvider,
        status: 'initiated',
        donor_name: 'Anonymous'
      };
      const { error } = await supabase.from('transactions').insert([payload]);
      if (error) throw error;
    } catch (error) {
      console.error('Database log failed:', error.message);
    }
  };

  const handlePaymentLaunch = async (provider) => {
    setActiveProvider(provider);
    await logTransaction(); 

    // Removed the &am= parameter. This bypasses the locked-amount intent errors.
    const baseParams = `pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR&tn=${encodeURIComponent('Donation')}`;
    
    let intentUrl = `upi://pay?${baseParams}`;

    if (provider === 'gpay') {
      intentUrl = `tez://upi/pay?${baseParams}`;
    } else if (provider === 'phonepe') {
      intentUrl = `phonepe://pay?${baseParams}`;
    } else if (provider === 'paytm') {
      intentUrl = `paytmmp://pay?${baseParams}`;
    } else if (provider === 'whatsapp') {
      intentUrl = `whatsapp://send?text=${encodeURIComponent('Pay ' + PAYEE_NAME + ' via UPI: ' + UPI_ID)}`;
    }
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = intentUrl; 
    } else {
      console.log(`💻 PC Test Mode: Simulated ${provider} payment launch.`);
    }
    
    setTimeout(() => { 
      setStep('SUCCESS'); 
    }, 5000);
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
            <button className="gold-btn" onClick={() => setStep('OPTIONS')}>
              <span className="btn-main-text">Contribute Now</span>
            </button>
          </>
        )}

        {step !== 'HOME' && step !== 'SUCCESS' && (
          <div className="donation-card">
            <button className="close-btn" onClick={resetApp}>✕</button>

            {step === 'OPTIONS' && (
              <>
                <h2 className="donation-title">Select App</h2>
                <div className="apps-container">
                  <button className="pay-app-btn" onClick={() => handlePaymentLaunch('gpay')}>
                    <img src={gpayLogo} alt="GPay" className="brand-logo" /> GPay
                  </button>
                  <button className="pay-app-btn" onClick={() => handlePaymentLaunch('phonepe')}>
                    <img src={phonepeLogo} alt="PhonePe" className="brand-logo" /> PhonePe
                  </button>
                  <button className="pay-app-btn secondary-toggle" onClick={() => setStep('OTHER_OPTIONS')}>
                    Other Options
                  </button>
                </div>
              </>
            )}

            {step === 'OTHER_OPTIONS' && (
              <>
                <h2 className="donation-title">Other Payment Apps</h2>
                <div className="apps-container">
                  <button className="pay-app-btn" onClick={() => handlePaymentLaunch('whatsapp')}>
                    WhatsApp Pay
                  </button>
                  <button className="pay-app-btn" onClick={() => handlePaymentLaunch('paytm')}>
                    Paytm
                  </button>
                  <button className="pay-app-btn" onClick={() => handlePaymentLaunch('generic_upi')}>
                    Any UPI App
                  </button>
                  <button className="close-modal-btn" onClick={() => setStep('OPTIONS')} style={{marginTop: '8px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px', fontWeight: '500'}}>
                    Back
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="donation-card success-card">
            <button className="close-btn" onClick={resetApp}>✕</button>
            <div className="success-icon">🙏</div>
            <h2 className="donation-title" style={{color: '#ffd700'}}>Thank You!</h2>
            <p className="success-msg">
              Please show your <b>payment history</b> to mandal karyakarta and collect your Paavthi.
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
