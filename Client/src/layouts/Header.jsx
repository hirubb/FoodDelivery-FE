import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logoColor from '../assets/logo-color.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#03081F] py-3 shadow-lg' : 'bg-transparent py-5'
      }`}>
      <div className="container mx-auto px-4 md:px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logoColor} alt="AMBULA.LK Logo" className="h-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="#benefits" className="text-white hover:text-[#FC8A06] font-medium transition-colors">
            Benefits
          </Link>
          <Link to="#how-it-works" className="text-white hover:text-[#FC8A06] font-medium transition-colors">
            How It Works
          </Link>
          <Link to="#faq" className="text-white hover:text-[#FC8A06] font-medium transition-colors">
            FAQs
          </Link>
          <Link to="#contact" className="text-white hover:text-[#FC8A06] font-medium transition-colors">
            Contact
          </Link>
          <Link to="/login" className="bg-[#FC8A06] hover:bg-[#e67e00] text-white px-6 py-2.5 rounded-lg font-bold transition-all transform hover:scale-105 shadow-md">
            Sign In
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-[#03081F] shadow-lg transition-all duration-300 ${mobileMenuOpen ? 'max-h-80 py-4' : 'max-h-0 py-0 overflow-hidden'
        }`}>
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <Link to="#benefits" className="text-white hover:text-[#FC8A06] py-2 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
            Benefits
          </Link>
          <Link to="#how-it-works" className="text-white hover:text-[#FC8A06] py-2 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </Link>
          <Link to="#faq" className="text-white hover:text-[#FC8A06] py-2 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
            FAQs
          </Link>
          <Link to="#contact" className="text-white hover:text-[#FC8A06] py-2 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          <Link to="/login" className="bg-[#FC8A06] hover:bg-[#e67e00] text-white px-6 py-2.5 rounded-lg font-bold transition-all w-full text-center" onClick={() => setMobileMenuOpen(false)}>
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
