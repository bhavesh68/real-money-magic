// src/components/Login.tsx
import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', formData);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/assets/MoneyMagicBG.png')" }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#1D7E5F] mb-6">Welcome Back 🌿</h2>
        <p className="text-center text-base text-[#1D7E5F] font-semibold mt-2 mb-6 leading-relaxed">
        <span className="text-xl text-yellow-400 drop-shadow-md animate-pulse">✨</span>{' '}
         Transform your relationship with money<br />and transform your life{' '}
        <span className="text-xl text-yellow-400 drop-shadow-md animate-pulse">✨</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="Email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-[#29AB87] text-white py-3 rounded-xl hover:bg-[#218F71] transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-[#1D7E5F] hover:underline">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
