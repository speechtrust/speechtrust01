import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mic } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#162456] rounded-md flex items-center justify-center group-hover:bg-[#243882] transition-colors">
            <Mic size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            SpeechTrust
          </span>
        </Link>

        <div className="flex items-center gap-4">

          {isAuthenticated && (
            <span className="hidden md:block text-sm text-slate-600 font-medium">
              Hi, {user?.firstname || "User"}
            </span>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md transition-all"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#162456] text-white hover:bg-[#243882] shadow-md transition-all"
            >
              Login
            </button>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;