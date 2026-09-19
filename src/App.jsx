import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import bgVideo from './assets/Vid.mp4';
import centerImg from './assets/image.png'; /*[cite: 1]*/
import borderOverlay from './assets/border_image.png'; /**/

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
  const [actionTaken, setActionTaken] = useState(false);

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
    setActionTaken(true);
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
    setActionTaken(true);
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
    setActionTaken(false);
  };

  return (
    <div className="app-container">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="content">
        {step === 'HOME' && (
          <>
            <img src={centerImg} alt="Center Graphic" className="floating-image" /> {/*[cite: 1]*/}
            <button className="gold-btn" onClick={() => setStep('PAY_MANUAL')}>
              <span className="btn-main-text">Contribute Now</span>
            </button>
          </>
        )}

        {step === 'PAY_MANUAL' && (
          <div className="donation-card" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
            <button className="close-btn" onClick={resetApp}>✕</button>
            
            <h2 className="donation-title">Contribute</h2>
            
            {/* QR Code Section */}
            <div style={{
              background: '#fff', padding: '8px', borderRadius: '12px', 
              margin: '0 auto 8px auto', border: '2px solid #d4af37', width: 'fit-content'
            }}>
              <img src={qrImageUrl} alt="UPI QR Code" style={{ width: '135px', height: '135px', display: 'block' }} />
            </div>
            
            <button onClick={handleDownloadQR} className="pay-app-btn" style={{background: 'rgba(218, 165, 32, 0.15)', padding: '6px 14px', fontSize: '0.8rem', marginBottom: '12px'}}>
              ⬇ Download QR Code
            </button>

            {/* UPI Copy Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                background: 'rgba(0,0,0,0.6)', border: '1px solid #d4af37', 
                padding: '6px 10px', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', letterSpacing: '0.5px'
              }}>
                {UPI_ID}
              </div>
              <button onClick={handleCopyUPI} style={{
                background: '#d4af37', border: 'none', borderRadius: '8px', 
                padding: '7px 12px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem'
              }}>
                Copy
              </button>
            </div>

            {/* Instructions */}
            <p className="success-msg" style={{ fontSize: '0.7rem', color: '#ffd700', textAlign: 'left', margin: '0 auto 12px auto', width: 'fit-content', lineHeight: '1.3' }}>
              <b>1.</b> Download QR or Copy UPI ID.<br/>
              <b>2.</b> Open your app using buttons below.<br/>
              <b>3.</b> Scan from Gallery or Paste ID.
            </p>

            {/* White-Transparent App Launchers with PNG Logos */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
              <button className="white-glass-btn" onClick={() => handleAppLaunch('gpay', 'tez://')}>
                <img src={gpayLogo} alt="GPay" className="app-logo-icon" /> GPay
              </button>
              <button className="white-glass-btn" onClick={() => handleAppLaunch('phonepe', 'phonepe://')}>
                <img src={phonepeLogo} alt="PhonePe" className="app-logo-icon" /> PhonePe
              </button>
            </div>

            <button className="action-btn" onClick={() => setStep('SUCCESS')} style={{ padding: '10px' }}>
              I Have Paid
            </button>
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

      <img src={borderOverlay} alt="Golden Border Overlay" className="border-overlay" /> {/**/}
    </div>
  );
}

export default App;