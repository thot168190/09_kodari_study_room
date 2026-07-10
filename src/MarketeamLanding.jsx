import React, { useState, useEffect } from 'react';
import './MarketeamLanding.css';

// 1. Custom Hook for Count Up
function useCountUp(endVal = 20, duration = 2000, startDelay = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId = null;

    // Cubic ease-out
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = easeOutCubic(progress);
      setCount(Math.floor(easeProgress * endVal));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    const delayTimer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(delayTimer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [endVal, duration, startDelay]);

  return count;
}

// 2. Typewriter Heading Component
function TypewriterHeading() {
  const fullText = "Unlock Top Marketing Talent You Thought Was Out of Reach -- Now Just One Click Away!";
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let intervalId = null;

    const delayTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        if (currentIndex < fullText.length) {
          currentIndex++;
          setDisplayText(fullText.substring(0, currentIndex));
        } else {
          clearInterval(intervalId);
          setIsDone(true);
        }
      }, 35);
    }, 400);

    return () => {
      clearTimeout(delayTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const renderText = () => {
    if (displayText.length <= 67) {
      return (
        <>
          <span className="dark-text">{displayText}</span>
          {!isDone && <span className="mkt-cursor" />}
        </>
      );
    } else {
      const darkPart = displayText.substring(0, 67);
      const lightPart = displayText.substring(67);
      return (
        <>
          <span className="dark-text">{darkPart}</span>
          <span className="light-text">{lightPart}</span>
          {!isDone && <span className="mkt-cursor" />}
        </>
      );
    }
  };

  return <h1 className="mkt-heading">{renderText()}</h1>;
}

export default function MarketeamLanding() {
  const specialistsCount = useCountUp(20, 2000, 1200);

  // Avatar Configuration
  const avatars = [
    // Orbit 1
    {
      id: 1,
      orbit: 1,
      angle: 270,
      radius: 177,
      size: 58,
      borderRadius: '20px',
      glowClass: 'glow-purple',
      delay: 0.6,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/aa51718fb3af3637e6d666b6543fc27a175fada6.png',
      spinClass: 'orbit-spin-cw' // opposite of Orbit 1 (ccw)
    },
    // Orbit 2
    {
      id: 2,
      orbit: 2,
      angle: 60,
      radius: 251,
      size: 58,
      borderRadius: '50%',
      glowClass: 'glow-yellow',
      delay: 0.8,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/ca755f7f93c1126fb8bdbf99ab364a33aa9ab272.png',
      spinClass: 'orbit-spin-ccw' // opposite of Orbit 2 (cw)
    },
    {
      id: 3,
      orbit: 2,
      angle: 180,
      radius: 251,
      size: 78,
      borderRadius: '50%',
      glowClass: 'glow-pink',
      delay: 1.0,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/dc01064c7093dcc32674876ee3cf5e41c4a485c6.png',
      spinClass: 'orbit-spin-ccw'
    },
    {
      id: 4,
      orbit: 2,
      angle: 300,
      radius: 251,
      size: 58,
      borderRadius: '20px',
      glowClass: 'glow-blue',
      delay: 1.2,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/d5470a58b02388336141575048720f19a50de832.png',
      spinClass: 'orbit-spin-ccw'
    },
    // Orbit 3
    {
      id: 5,
      orbit: 3,
      angle: 130,
      radius: 325,
      size: 88,
      borderRadius: '50%',
      glowClass: 'glow-pink',
      delay: 1.4,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/018736aa5d0275c4ce56cfebaf2ae3007d81ca1e.png',
      spinClass: 'orbit-spin-ccw' // opposite of Orbit 3 (cw)
    },
    // Orbit 4
    {
      id: 6,
      orbit: 4,
      angle: 30,
      radius: 399,
      size: 58,
      borderRadius: '50%',
      glowClass: 'glow-purple',
      delay: 1.6,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/c76d8a0b99676de31c014344bfaf75bad090758d.png',
      spinClass: 'orbit-spin-cw' // opposite of Orbit 4 (ccw)
    },
    {
      id: 7,
      orbit: 4,
      angle: 95,
      radius: 399,
      size: 88,
      borderRadius: '24px',
      glowClass: 'glow-orange',
      delay: 1.8,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/7b1b5f039de7b54cc9913e96c1923c3b15a157fa.png',
      spinClass: 'orbit-spin-cw'
    },
    {
      id: 8,
      orbit: 4,
      angle: 220,
      radius: 399,
      size: 88,
      borderRadius: '24px',
      glowClass: 'glow-pink',
      delay: 2.0,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/9ae171d8895199349755c43fbff00e122221a027.png',
      spinClass: 'orbit-spin-cw'
    },
    {
      id: 9,
      orbit: 4,
      angle: 320,
      radius: 399,
      size: 58,
      borderRadius: '50%',
      glowClass: 'glow-purple',
      delay: 2.2,
      img: 'https://polo-pecan-73837341.figma.site/_assets/v11/926c9eb7b4bc1df846fa0e39f0b0dc3fefd80671.png',
      spinClass: 'orbit-spin-cw'
    }
  ];

  // Partners Logos
  const uniqueLogos = [
    'https://polo-pecan-73837341.figma.site/_assets/v11/1e7b0e6fcc016cd28aec5c68990118b8c54c35a5.svg',
    'https://polo-pecan-73837341.figma.site/_assets/v11/3eac03c183db2ae080d910159211c14843398b61.svg',
    'https://polo-pecan-73837341.figma.site/_assets/v11/17705a4c0023a0e5a99154dfb10582adbbf4260b.svg',
    'https://polo-pecan-73837341.figma.site/_assets/v11/0e5f442b09dc5c248e3e60d40a65505fb1887228.svg',
    'https://polo-pecan-73837341.figma.site/_assets/v11/63f99030ceb459e3c9ab9e429cfa2353491d3816.svg'
  ];

  // Repeat 4x
  const tickerLogos = [
    ...uniqueLogos,
    ...uniqueLogos,
    ...uniqueLogos,
    ...uniqueLogos
  ];

  const getAvatarsForOrbit = (orbitNum) => {
    return avatars.filter((a) => a.orbit === orbitNum);
  };

  return (
    <div className="marketeam-wrapper">
      {/* Header */}
      <header className="mkt-header-container">
        <div className="mkt-header-left">
          <img
            src="https://polo-pecan-73837341.figma.site/_assets/v11/17ae538989a509947a8de3892c644664895e69b1.png"
            alt="Marketeam Logo"
            className="mkt-logo"
          />
          <nav className="mkt-nav">
            <a href="#team" className="mkt-nav-link">Your Team</a>
            <a href="#solutions" className="mkt-nav-link">Solutions</a>
            <a href="#blog" className="mkt-nav-link">Blog</a>
            <a href="#pricing" className="mkt-nav-link">Pricing</a>
          </nav>
        </div>
        <div className="mkt-header-right">
          <a href="#login" className="mkt-login-link">Log In</a>
          <div className="btn-border-wrap">
            <button className="btn-join">
              <span>Join Now</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <div className="mkt-hero-container">
        {/* Left Side */}
        <div className="mkt-hero-left">
          <TypewriterHeading />

          {/* Start Project Button */}
          <div className="mkt-btn-container">
            <div className="btn-border-wrap">
              <button className="btn-start">
                <span>Start Project</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Cursor Element */}
          <div className="mkt-user-badge">
            <svg
              className="david-cursor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.65376 2.68067C4.69769 2.23847 3.65219 3.10972 3.8821 4.14856L6.96803 18.0931C7.19948 19.1389 8.52834 19.3957 9.12177 18.5218L12.4418 13.6331L18.0673 13.064C19.0734 12.9622 19.4673 11.6669 18.7042 11.0261L5.65376 2.68067Z"
                fill="#A068FF"
              />
            </svg>
            <div className="david-label">David</div>
          </div>
        </div>

        {/* Right Side Concentric Circles */}
        <div className="mkt-hero-right">
          {/* Orbit 1 */}
          <div className="orbit-line orbit-1">
            {getAvatarsForOrbit(1).map((avatar) => (
              <div
                key={avatar.id}
                className="avatar-node"
                style={{
                  '--radius': `${avatar.radius}px`,
                  '--angle': `${avatar.angle}deg`,
                  width: `${avatar.size}px`,
                  height: `${avatar.size}px`,
                  animationDelay: `${avatar.delay}s`,
                }}
              >
                <div
                  className={`avatar-img-wrap ${avatar.glowClass}`}
                  style={{
                    borderRadius: avatar.borderRadius,
                    animation: `orbit-spin-cw 30s linear infinite`, // opposite of Orbit 1
                  }}
                >
                  <img src={avatar.img} alt="Talent" className="avatar-img" />
                </div>
              </div>
            ))}
          </div>

          {/* Center stats */}
          <div className="center-circle-wrap">
            <div className="center-circle-content">
              <span className="count-up-num">{specialistsCount}k+</span>
              <span className="specialists-label">Specialists</span>
            </div>
          </div>

          {/* Orbit 2 */}
          <div className="orbit-line orbit-2">
            {getAvatarsForOrbit(2).map((avatar) => (
              <div
                key={avatar.id}
                className="avatar-node"
                style={{
                  '--radius': `${avatar.radius}px`,
                  '--angle': `${avatar.angle}deg`,
                  width: `${avatar.size}px`,
                  height: `${avatar.size}px`,
                  animationDelay: `${avatar.delay}s`,
                }}
              >
                <div
                  className={`avatar-img-wrap ${avatar.glowClass}`}
                  style={{
                    borderRadius: avatar.borderRadius,
                    animation: `orbit-spin-ccw 40s linear infinite`, // opposite of Orbit 2
                  }}
                >
                  <img src={avatar.img} alt="Talent" className="avatar-img" />
                </div>
              </div>
            ))}
          </div>

          {/* Orbit 3 */}
          <div className="orbit-line orbit-3">
            {getAvatarsForOrbit(3).map((avatar) => (
              <div
                key={avatar.id}
                className="avatar-node"
                style={{
                  '--radius': `${avatar.radius}px`,
                  '--angle': `${avatar.angle}deg`,
                  width: `${avatar.size}px`,
                  height: `${avatar.size}px`,
                  animationDelay: `${avatar.delay}s`,
                }}
              >
                <div
                  className={`avatar-img-wrap ${avatar.glowClass}`}
                  style={{
                    borderRadius: avatar.borderRadius,
                    animation: `orbit-spin-ccw 50s linear infinite`, // opposite of Orbit 3
                  }}
                >
                  <img src={avatar.img} alt="Talent" className="avatar-img" />
                </div>
              </div>
            ))}
          </div>

          {/* Orbit 4 */}
          <div className="orbit-line orbit-4">
            {getAvatarsForOrbit(4).map((avatar) => (
              <div
                key={avatar.id}
                className="avatar-node"
                style={{
                  '--radius': `${avatar.radius}px`,
                  '--angle': `${avatar.angle}deg`,
                  width: `${avatar.size}px`,
                  height: `${avatar.size}px`,
                  animationDelay: `${avatar.delay}s`,
                }}
              >
                <div
                  className={`avatar-img-wrap ${avatar.glowClass}`}
                  style={{
                    borderRadius: avatar.borderRadius,
                    animation: `orbit-spin-cw 60s linear infinite`, // opposite of Orbit 4
                  }}
                >
                  <img src={avatar.img} alt="Talent" className="avatar-img" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="mkt-ticker-container">
        <div className="mkt-ticker-track">
          {tickerLogos.map((logoUrl, index) => (
            <img
              key={index}
              src={logoUrl}
              alt="Partner Logo"
              className="mkt-ticker-logo"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
