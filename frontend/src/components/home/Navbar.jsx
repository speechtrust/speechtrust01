import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
            <Mic size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">SpeechTrust</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Home</span>
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Login</span>
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Signup</span>
        </div>

        {/* Action Button */}
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
          >
            Go to Dashboard
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;