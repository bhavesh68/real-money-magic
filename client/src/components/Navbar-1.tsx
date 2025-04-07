import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="bg-[#1D7E5F] text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="font-bold text-lg">🌿 Real Money Magic</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-[#1D7E5F] px-4 py-2 rounded-md hover:bg-yellow-200 font-semibold transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
