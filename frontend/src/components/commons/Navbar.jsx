import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mic } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#162456] rounded-md flex items-center justify-center group-hover:bg-[#243882] transition-colors">
            <Mic size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">SpeechTrust</span>
        </Link>

        {/* Desktop Links */}
        {/* <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <Link to="/" className={`hover:text-[#243882] transition-colors ${location.pathname === '/' ? 'text-[#162456] font-semibold' : ''}`}>Home</Link>
          <Link to="/login" className={`hover:text-[#243882] transition-colors ${location.pathname === '/login' ? 'text-[#162456] font-semibold' : ''}`}>Login</Link>
          <Link to="/signup" className={`hover:text-[#243882] transition-colors ${location.pathname === '/signup' ? 'text-[#162456] font-semibold' : ''}`}>Signup</Link>
        </div> */}

        {/* Action Button */}
        <div>
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#162456] text-white hover:bg-[#243882] shadow-md transition-all"
          >
            Login
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;