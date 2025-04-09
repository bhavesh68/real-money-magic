import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../graphql/cache";
import { onLogout } from "../utils/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-[#1D7E5F]">
          <span className="text-2xl">🌿</span> Real Money Magic
        </Link>

        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex space-x-4 items-center`}
        >
          {isLoggedIn ? (
            <>
                {/* 👤 Profile Icon */}
              <Link to="/profile">
              <div className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-sm shadow flex items-center justify-center text-[#1D7E5F] text-lg hover:shadow-md transition">
                👤
              </div>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#29AB87] text-white px-3 py-1 rounded hover:bg-[#218F71] transition"
              >
                <span className="mr-1">🚪</span> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
