import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loginUser] = useMutation(LOGIN_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await loginUser({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (data?.login?.accessToken) {
        localStorage.setItem('token', data.login.accessToken);
        localStorage.setItem('refresh_token', data.login.refreshToken);
        navigate('/dashboard');
      } else {
        alert('Invalid login');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please try again.');
    }
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
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
            value={formData.email}
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
