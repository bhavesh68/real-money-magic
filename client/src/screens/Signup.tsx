import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [registerUser] = useMutation(REGISTER_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { data } = await registerUser({
        variables: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      });

      if (data.register) {
        // ✅ Registration succeeded
        navigate("/login");
      } else {
        alert("A user with that email already exists.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong during signup.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/assets/MoneyMagicBG.png')" }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#1D7E5F] mb-2">
          Create Your Account 🌱
        </h2>

        {/* ✨ Sparkle Magic Line */}
        <p className="text-center text-base text-[#1D7E5F] font-semibold mt-2 mb-6 leading-relaxed">
        <span className="text-xl text-yellow-400 drop-shadow-md animate-pulse">✨</span>{' '}
        Transform your relationship with money<br />and transform your life{' '}
        <span className="text-xl text-yellow-400 drop-shadow-md animate-pulse">✨</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87]"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-[#29AB87] text-white py-3 rounded-xl hover:bg-[#218F71] transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-[#1D7E5F] hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

/* Real Money Magic Jungle Color Palette

Primary Jungle Green:       #29AB87   → bg-[#29AB87]
Darker Hover Jungle Green:  #218F71   → hover:bg-[#218F71]
Text Accent Jungle:         #1D7E5F   → text-[#1D7E5F]
Input Focus Ring:           #29AB87   → focus:ring-[#29AB87]

Usage Examples:

bg-[#29AB87]          → buttons
hover:bg-[#218F71]    → button hover state
text-[#1D7E5F]        → headings, links
focus:ring-[#29AB87]  → input highlight

This palette was inspired by “Jungle” (#29AB87) 🌿
*/
