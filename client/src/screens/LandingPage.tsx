import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [showSpill, setShowSpill] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStartAnimation(true);
      setTimeout(() => {
        setShowSpill(true);
      }, 2500); // Switch to spilled bag after 2.5s

      setTimeout(() => {
        setStartAnimation(false);
        setShowSpill(false);
      }, 10000); // Reset after 10s
    }, 30000); // Repeat every 30s

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center text-white text-center px-6"
      style={{
        backgroundImage: "url('/assets/LandingPageRMM.png')",
      }}
    >
      {/* Background blur */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0" />

      {/* ✨ Sparkle Layer */}
      <div className="sparkle-layer z-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* 💰 Animated Money Bag */}
      <div className="absolute z-0 w-full flex justify-center items-start pointer-events-none">
        {!showSpill && startAnimation && (
          <img
            src="/assets/moneybag.png"
            alt="Money Bag"
            className="w-32 h-auto animate-fall"
            style={{ animationDuration: '2.5s' }}
          />
        )}
        {showSpill && (
          <img
            src="/assets/moneybagspill.png"
            alt="Spilled Money Bag"
            className="w-40 h-auto mt-[30rem] fade-in"
          />
        )}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Title with shimmer animation */}
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#29AB87] via-white to-[#29AB87] animate-shimmer drop-shadow-lg font-serif">
          Real Money Magic
        </h1>

        {/* Subquote */}
        <p className="text-xl md:text-2xl italic drop-shadow-md text-[#1D3557]">
          Truth isn't just freeing — it's fertile. It grows new ideas, new courage, and new beginnings.
        </p>

        {/* Promo line */}
        <h2 className="text-lg md:text-xl mt-6 font-semibold text-[#0A2A66] drop-shadow">
          Join thousands discovering new opportunities today.<br />
          Your journey toward financial freedom <span className="font-bold">STARTS HERE.</span>
        </h2>

        {/* CTA Button */}
        <div className="mt-4">
          <Link to="/signup">
            <button className="bg-[#29AB87] hover:bg-[#218F71] text-white font-bold py-3 px-6 rounded-full shadow-lg transition">
              🌱 Get Started
            </button>
          </Link>
        </div>

        {/* Description */}
        <p className="text-md md:text-lg font-semibold leading-relaxed max-w-2xl mx-auto text-[#4B3621] mt-[12rem] animate-fade-in">
          Real Money Magic is a calming, modern financial wellness app for families and individuals
          living paycheck to paycheck. This is not another cold calculator or confusing spreadsheet — it’s
          a human-centered experience designed to support emotional well-being while transforming your
          relationship with money.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
