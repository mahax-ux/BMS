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

const UPI_ID = '7483430871@fam';
const PAYEE_NAME = 'Camp Cha Samrat';
const SUGGESTED_AMOUNTS = [101, 201, 501, 1001];

function App() {
  const [step, setStep] = useState('HOME'); 
  const [amount, setAmount] = useState('');
  const [activeProvider, setActiveProvider] = useState('');

  const logTransaction = async () => {
    try {
      const payload = { 
        amount: parseFloat(amount) || 0, 
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

  const handleProceedToPay = () => {
    if (!parseFloat(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    setStep('OPTIONS');
  };

  const handlePaymentLaunch = async (provider) => {
    setActiveProvider(provider);
    await logTransaction(); 

    const baseParams = `pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent('Donation')}`;
    
    // Explicit app deep links to prevent all generic handlers from routing to WhatsApp
    let intentUrl = `upi://pay?${baseParams}`; // Default universal fallback

    if (provider === 'gpay') {
      intentUrl = `tez://upi/pay?${baseParams}`;
    } else if (provider === 'phonepe') {
      intentUrl = `phonepe://pay?${baseParams}`;
    } else if (provider === 'paytm') {
      intentUrl = `paytmmp://pay?${baseParams}`;
    } else if (provider === 'whatsapp') {
      intentUrl = `whatsapp://send?text=${encodeURIComponent('Pay ₹' + amount + ' to ' + UPI_ID)}`;
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
    setAmount('');
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
            <button className="gold-btn" onClick={() => setStep('AMOUNT')}>
              <span className="btn-main-text">Contribute Now</span>
            </button>
          </>
        )}

        {step !== 'HOME' && step !== 'SUCCESS' && (
          <div className="donation-card">
            <button className="close-btn" onClick={resetApp}>✕</button>

            {step === 'AMOUNT' && (
              <>
                <h2 className="donation-title">Enter your Contribution</h2>
                <div className="input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input type="number" inputMode="decimal" className="amount-input" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="suggestion-chips">
                  {SUGGESTED_AMOUNTS.map((val) => (
                    <button key={val} className={`chip-btn ${amount === val.toString() ? 'active' : ''}`} onClick={() => setAmount(val.toString())}>
                      ₹{val}
                    </button>
                  ))}
                </div>
                <button className="action-btn" onClick={handleProceedToPay}>Proceed to Payment</button>
              </>
            )}

            {step === 'OPTIONS' && (
              <>
                <h2 className="donation-title">Select App</h2>
                <p className="pay-amount-label">Amount: ₹{amount}</p>
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
                <p className="pay-amount-label">Amount: ₹{amount}</p>
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
                  <button className="close-modal-btn" onClick={() => setStep('OPTIONS')} style={{marginTop: '8px'}}>
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