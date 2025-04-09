import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
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
      {/* Jen Animated Money Bag Fall */}
      <img
        src="/assets/moneybag.png"
        alt="Money Bag"
        className="absolute w-24 sm:w-28 md:w-32 animate-money-drop z-0 pointer-events-none"
        style={{ animationDelay: '30s' }}
        />
    </div>
  );
};

export default LandingPage;

