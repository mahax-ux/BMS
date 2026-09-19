import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

import bgVideo from './assets/Vid.mp4';
import centerImg from './assets/image.png';
import borderOverlay from './assets/border_image.png';

import gpayLogo from './assets/gpay.png';
import phonepeLogo from './assets/phonepay.png';
import instaLogo from './assets/insta.png';

import './App.css';


// =====================================================
// SUPABASE
// =====================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);


// =====================================================
// PAYMENT
// =====================================================

const UPI_ID = '8867456612@ptyes';
const PAYEE_NAME = 'Camp Cha Samrat';


// =====================================================
// APP
// =====================================================

function App() {

  const [step, setStep] = useState('HOME');

  const [isQrMaximized, setIsQrMaximized] =
    useState(false);

  const [activeInfoModal, setActiveInfoModal] =
    useState(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [copied, setCopied] =
    useState(false);


  // ===================================================
  // UPI QR
  // ===================================================

  const upiString =
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
      PAYEE_NAME
    )}&cu=INR`;

  const qrImageUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
      upiString
    )}`;


  // ===================================================
  // DATABASE
  // ===================================================

  const logTransaction = async (method) => {

    try {

      await supabase
        .from('transactions')
        .insert([
          {
            amount: 0,
            app_used: method,
            status: 'initiated',
            donor_name: 'Anonymous'
          }
        ]);

    } catch (error) {

      console.error(
        'Database log failed:',
        error.message
      );

    }

  };


  // ===================================================
  // DOWNLOAD QR
  // ===================================================

  const handleDownloadQR = async () => {

    try {

      const response =
        await fetch(qrImageUrl);

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        'CampChaSamrat_QR.png';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch {

      window.open(
        qrImageUrl,
        '_blank'
      );

    }

  };


  // ===================================================
  // COPY UPI
  // ===================================================

  const handleCopyUPI = async () => {

    try {

      await navigator.clipboard.writeText(
        UPI_ID
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {

      console.error(
        'Copy failed:',
        error
      );

    }

  };


  // ===================================================
  // PAYMENT APP
  // ===================================================

  const handleAppLaunch = (
    provider,
    scheme
  ) => {

    logTransaction(provider);

    window.location.href = scheme;

  };


  // ===================================================
  // RESET
  // ===================================================

  const resetApp = () => {

    setStep('HOME');

    setIsQrMaximized(false);

    setActiveInfoModal(null);

    setMenuOpen(false);

  };


  // ===================================================
  // SCROLL
  // ===================================================

  const scrollToSection = (id) => {

    setMenuOpen(false);

    const element =
      document.getElementById(id);

    if (element) {

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }

  };


  // ===================================================
  // TIMELINE DATA
  // ===================================================

  const timelineData = [

    {
      id: 1,

      title: 'Our History',

      desc:
        'Read about the legacy of Camp Cha Samrat.',

      content:
        'Established decades ago, Camp Cha Samrat has been the heart of our local cultural celebrations. From humble beginnings with a small pandal, we have grown into one of the most prominent mandals in the city. Our legacy is built on community service, grand visual storytelling, and devotion that brings thousands of devotees together every year.'
    },

    {
      id: 2,

      title: 'Gallery',

      desc:
        'Explore photos and videos from previous years.',

      content:
        'Relive the spectacular aartis, intricate idol designs, dhol-tasha performances, cultural celebrations and joyous visarjan processions from previous years.'
    },

    {
      id: 3,

      title: 'Events Schedule',

      desc:
        'Check out the upcoming aarti and cultural timings.',

      content:
        'Morning Aarti: 8:00 AM Daily\nEvening Maha Aarti: 7:30 PM Daily\nMahaprasad Distribution: Day 5 & Day 9 at 1:00 PM\nDhol Tasha Pathak Performance: Day 8 evening\nVisarjan Miravnuk: Final Day starting at 4:00 PM.'
    },

    {
      id: 4,

      title: 'Mandal Members',

      desc:
        'Meet the dedicated karyakartas behind the festival.',

      content:
        'Our mandal operates through dedicated volunteers and Karyakartas. From crowd management and decoration to rituals and digital presence, our team works day and night to make the celebration special.'
    }

  ];


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="app-container">


      {/* =================================================
          BACKGROUND VIDEO
      ================================================= */}

      <video
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
      >

        <source
          src={bgVideo}
          type="video/mp4"
        />

      </video>


      <div className="video-overlay" />

      <div className="gold-particles" />


      {/* =================================================
          SCROLLABLE CONTENT
      ================================================= */}

      <div className="content">


        {/* =================================================
            HOME
        ================================================= */}

        {step === 'HOME' && (

          <div className="home-page">


            {/* =================================================
                LANDING PAGE
            ================================================= */}

            <section
              id="home"
              className="hero-section"
            >


              {/* =================================================
                  NAVIGATION
              ================================================= */}

              <nav className="landing-nav">

                <button
                  className="landing-logo"
                  onClick={() =>
                    scrollToSection('home')
                  }
                >

                  <span className="landing-logo-dot" />

                  <span>
                    CCS
                  </span>

                </button>


                <button
                  className="landing-menu"
                  onClick={() =>
                    setMenuOpen(!menuOpen)
                  }
                  aria-label="Menu"
                >

                  <span />
                  <span />
                  <span />

                </button>


                {menuOpen && (

                  <div className="landing-menu-panel">

                    <button
                      onClick={() =>
                        scrollToSection('home')
                      }
                    >
                      HOME
                    </button>

                    <button
                      onClick={() =>
                        scrollToSection('legacy')
                      }
                    >
                      LEGACY
                    </button>

                    <button
                      onClick={() =>
                        scrollToSection('events')
                      }
                    >
                      EVENTS
                    </button>

                    <button
                      onClick={() =>
                        scrollToSection('contact')
                      }
                    >
                      CONTACT
                    </button>

                    <button
                      className="menu-contribute"
                      onClick={() => {

                        setMenuOpen(false);

                        setStep('PAY_MANUAL');

                      }}
                    >
                      CONTRIBUTE
                    </button>

                  </div>

                )}

              </nav>


              {/* =================================================
                  WEBSITE BY + SHLOKA
              ================================================= */}

              <div className="landing-top-info">

                <div className="creator-tag">

                  <span>
                    WEBSITE BY
                  </span>

                  <strong>
                    Mahant · 7483430871
                  </strong>

                </div>


                <div className="shloka-tag">

                  वक्रतुण्ड महाकाय
                  सूर्यकोटि समप्रभ।<br />

                  निर्विघ्नं कुरु मे देव
                  सर्वकार्येषु सर्वदा॥

                </div>

              </div>


              {/* =================================================
                  SINGLE CENTER ARTWORK
              ================================================= */}

              <div className="landing-artwork">

                <div className="artwork-glow" />

                <img
                  src={centerImg}
                  alt="Camp Cha Samrat"
                  className="main-artwork"
                />

              </div>


              {/* =================================================
                  CONTRIBUTE NOW
              ================================================= */}

              <button
                className="landing-contribute"
                onClick={() =>
                  setStep('PAY_MANUAL')
                }
              >

                <span>
                  CONTRIBUTE NOW
                </span>

                <b>
                  ↗
                </b>

              </button>


              {/* =================================================
                  SCROLL
              ================================================= */}

              <div className="landing-scroll">

                <span>
                  SCROLL TO EXPLORE
                </span>

                <div className="scroll-line">

                  <div />

                </div>

              </div>


            </section>


            {/* =================================================
                LEGACY / TIMELINE
            ================================================= */}

            <section
              id="legacy"
              className="timeline-section"
            >

              <div className="section-heading">

                <span>
                  01 — OUR STORY
                </span>

                <h2>

                  A LEGACY

                  <strong>
                    IN MOTION.
                  </strong>

                </h2>

              </div>


              <div className="timeline-container">

                <div className="timeline-line" />


                {timelineData.map(
                  (item, index) => (

                    <div
                      key={item.id}
                      className={`timeline-item ${
                        index % 2 === 0
                          ? 'left'
                          : 'right'
                      }`}
                    >

                      <div
                        className="timeline-card"
                        onClick={() =>
                          setActiveInfoModal(item)
                        }
                      >

                        <span className="card-number">
                          0{item.id}
                        </span>

                        <span className="card-arrow">
                          ↗
                        </span>

                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          {item.desc}
                        </p>

                        <span className="explore-text">
                          EXPLORE →
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>


            {/* =================================================
                EVENTS
            ================================================= */}

            <section
              id="events"
              className="events-section"
            >

              <div className="section-heading centered">

                <span>
                  02 — THE EXPERIENCE
                </span>

                <h2>

                  MOMENTS THAT

                  <strong>
                    MATTER.
                  </strong>

                </h2>

              </div>


              <div className="event-list">

                <div className="event-row">

                  <span>
                    01
                  </span>

                  <div>

                    <small>
                      08:00 AM
                    </small>

                    <h3>
                      Morning Aarti
                    </h3>

                  </div>

                  <b>
                    🪔
                  </b>

                </div>


                <div className="event-row">

                  <span>
                    02
                  </span>

                  <div>

                    <small>
                      07:30 PM
                    </small>

                    <h3>
                      Maha Aarti
                    </h3>

                  </div>

                  <b>
                    🙏
                  </b>

                </div>


                <div className="event-row">

                  <span>
                    03
                  </span>

                  <div>

                    <small>
                      DAY 5 & DAY 9
                    </small>

                    <h3>
                      Mahaprasad
                    </h3>

                  </div>

                  <b>
                    🍚
                  </b>

                </div>


                <div className="event-row">

                  <span>
                    04
                  </span>

                  <div>

                    <small>
                      DAY 8
                    </small>

                    <h3>
                      Dhol Tasha
                    </h3>

                  </div>

                  <b>
                    🥁
                  </b>

                </div>


                <div className="event-row">

                  <span>
                    05
                  </span>

                  <div>

                    <small>
                      FINAL DAY
                    </small>

                    <h3>
                      Visarjan
                    </h3>

                  </div>

                  <b>
                    🚩
                  </b>

                </div>

              </div>

            </section>


            {/* =================================================
                FINAL CTA
            ================================================= */}

            <section className="final-cta">

              <span>
                SUPPORT THE MANDAL
              </span>

              <h2>

                BE PART OF

                <strong>
                  THE LEGACY.
                </strong>

              </h2>

              <p>
                Every contribution helps
                continue the tradition.
              </p>

              <button
                onClick={() =>
                  setStep('PAY_MANUAL')
                }
              >

                CONTRIBUTE TO BAPPA

                <b>
                  ↗
                </b>

              </button>

            </section>


            {/* =================================================
                CONTACT
            ================================================= */}

            <section
              id="contact"
              className="contact-section"
            >

              <span>
                GET IN TOUCH
              </span>

              <h2>

                CAMP CHA

                <strong>
                  SAMRAT.
                </strong>

              </h2>


              <a href="tel:9538764241">

                <small>
                  PHONE
                </small>

                <strong>
                  9538764241
                </strong>

              </a>


              <a
                href="https://instagram.com/bms_camp_boys"
                target="_blank"
                rel="noopener noreferrer"
              >

                <small>
                  INSTAGRAM
                </small>

                <strong>

                  <img
                    src={instaLogo}
                    alt="Instagram"
                  />

                  @bms_camp_boys

                </strong>

              </a>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer>

              <span>
                © CAMP CHA SAMRAT
              </span>

              <span>
                गणपती बाप्पा मोरया
              </span>

              <span>
                MADE WITH DEVOTION
              </span>

            </footer>


          </div>

        )}


        {/* =================================================
            INFO MODAL
        ================================================= */}

        {activeInfoModal && (

          <div
            className="modal-overlay"
            onClick={() =>
              setActiveInfoModal(null)
            }
          >

            <div
              className="info-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="close-btn"
                onClick={() =>
                  setActiveInfoModal(null)
                }
              >
                ×
              </button>


              <span className="modal-index">
                0{activeInfoModal.id}
              </span>


              <h2>
                {activeInfoModal.title}
              </h2>


              <div className="modal-line" />


              <div className="modal-content">

                {activeInfoModal.content
                  .split('\n')
                  .map((line, index) => (

                    <p key={index}>
                      {line}
                    </p>

                  ))}

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            PAYMENT MODAL
        ================================================= */}

        {step === 'PAY_MANUAL' && (

          <div className="modal-overlay">

            <div className="payment-modal">


              {/* CLOSE */}

              <button
                className="close-btn"
                onClick={resetApp}
              >
                ×
              </button>


              {/* HEADER */}

              <span className="payment-label">
                SUPPORT THE MANDAL
              </span>


              <h2>
                CONTRIBUTE
              </h2>


              <p className="payment-subtitle">
                Scan the QR code or use the UPI ID below.
              </p>


              {/* =================================================
                  QR + DOWNLOAD — ONE ROW
              ================================================= */}

              <div className="qr-payment-row">


                <div
                  className="qr-container"
                  onClick={() =>
                    setIsQrMaximized(true)
                  }
                >

                  <img
                    src={qrImageUrl}
                    alt="UPI QR Code"
                  />

                </div>


                <button
                  className="download-btn"
                  onClick={handleDownloadQR}
                >
                  ↓ DOWNLOAD QR
                </button>


              </div>


              {/* =================================================
                  UPI ID + COPY — ONE ROW
              ================================================= */}

              <div className="upi-row">

                <span>
                  {UPI_ID}
                </span>

                <button
                  onClick={handleCopyUPI}
                >
                  {copied ? '✓' : 'COPY'}
                </button>

              </div>


              {/* =================================================
                  STEPS
              ================================================= */}

              <p className="steps">

                <span>
                  01 — Open your payment app
                </span>

                <br />

                <span>
                  02 — Scan QR or enter UPI ID
                </span>

                <br />

                <span>
                  03 — Complete your contribution
                </span>

              </p>


              {/* =================================================
                  PAYMENT APPS — ONE ROW
              ================================================= */}

              <div className="payment-apps">

                <button
                  onClick={() =>
                    handleAppLaunch(
                      'gpay',
                      'tez://'
                    )
                  }
                >

                  <img
                    src={gpayLogo}
                    alt="GPay"
                  />

                  <span>
                    GPay
                  </span>

                </button>


                <button
                  onClick={() =>
                    handleAppLaunch(
                      'phonepe',
                      'phonepe://'
                    )
                  }
                >

                  <img
                    src={phonepeLogo}
                    alt="PhonePe"
                  />

                  <span>
                    PhonePe
                  </span>

                </button>

              </div>


              {/* =================================================
                  PAID
              ================================================= */}

              <button
                className="paid-btn"
                onClick={() =>
                  setStep('SUCCESS')
                }
              >
                I HAVE PAID →
              </button>


            </div>

          </div>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {step === 'SUCCESS' && (

          <div className="modal-overlay">

            <div className="payment-modal success-modal">

              <div className="om">
                ॐ
              </div>


              <span className="payment-label">
                CONTRIBUTION RECEIVED
              </span>


              <h2>
                THANK YOU
              </h2>


              <p>
                Please show your
                <b> payment history </b>
                to the mandal Karyakarta
                and collect your Paavthi.
              </p>


              <button
                className="paid-btn"
                onClick={resetApp}
              >
                DONE
              </button>

            </div>

          </div>

        )}


        {/* =================================================
            QR FULLSCREEN
        ================================================= */}

        {isQrMaximized && (

          <div
            className="qr-fullscreen"
            onClick={() =>
              setIsQrMaximized(false)
            }
          >

            <div
              className="qr-box"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                onClick={() =>
                  setIsQrMaximized(false)
                }
              >
                ×
              </button>


              <img
                src={qrImageUrl}
                alt="UPI QR Code"
              />


              <span>
                SCAN & PAY
              </span>

            </div>

          </div>

        )}

      </div>


      {/* =================================================
          FIXED BORDER
      ================================================= */}

      <img
        src={borderOverlay}
        alt=""
        className="border-overlay"
      />

    </div>

  );
}

export default App;