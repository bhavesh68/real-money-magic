// src/screens/Dashboard.tsx
import QuoteCard from '../components/QuoteCard';

const Dashboard = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/assets/MoneyMagicBG.png')" }}
    >
      {/* Soft overlay to blur and tint the background */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* Central container for dashboard content */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-3xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-[#1D7E5F]">
          Welcome to Your Real Money Magic Dashboard 🌞
        </h1>

        {/* Inspirational quote */}
        <QuoteCard />

        {/* Add more components here */}
        <p className="text-sm text-gray-500 mt-6">🌿 Abundance flows with clarity and awareness.</p>
      </div>
    </div>
  );
};

export default Dashboard;




  