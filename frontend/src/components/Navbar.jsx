import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import ToggleTheme from './ToggleTheme';

export default function Navbar({ activeSection, setActiveSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'overview', label: 'ARCHITECTURE' },
    { id: 'studio', label: 'INFERENCE STUDIO' },
    { id: 'research', label: 'RESEARCH & PROOFS' },
    { id: 'audit', label: 'ESL BENCHMARK' },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white dark:bg-[#000000] text-[#000000] dark:text-white border-b border-[#ebebeb] dark:border-[#27272a] h-16 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand with Orange Accent Badge */}
        <div 
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-[3px] bg-[#fc4c02] text-white flex items-center justify-center font-mono text-[11px] font-bold shadow-sm">
            V
          </div>
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-base sm:text-lg">
            <span className="text-black dark:text-white">Veritas</span>
            <span className="font-mono text-[10px] sm:text-[11px] text-[#fc4c02] uppercase tracking-wider font-semibold">
              AI CLOUD
            </span>
          </div>
        </div>

        {/* Desktop Uppercase Mono Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-[12px] lg:text-[13px] font-medium tracking-[0.05em] text-[#959494]">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`transition-colors hover:text-black dark:hover:text-white ${
                  isActive ? 'text-black dark:text-white font-bold' : ''
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Lightswind Swipe-Down Theme Toggle, CTA, & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ToggleTheme animationType="swipe-down" duration={500} />

          <button
            onClick={() => scrollTo('studio')}
            className="hidden sm:inline-flex btn-secondary-mint text-[11px] sm:text-[12px] !py-2 !px-3 sm:!px-4 hover:bg-[#fc4c02] hover:text-white transition-colors"
          >
            <span>TRY INFERENCE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile menu"
            className="md:hidden w-8 h-8 rounded-[4px] bg-[#f9f9f9] dark:bg-[#18181b] border border-[#ebebeb] dark:border-[#27272a] flex items-center justify-center text-black dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0c0c0e] border-b border-[#ebebeb] dark:border-[#27272a] px-6 py-5 space-y-4 shadow-xl font-mono text-xs animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left py-2 text-[#959494] hover:text-black dark:hover:text-white font-semibold transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-[#ebebeb] dark:border-[#27272a]">
            <button
              onClick={() => scrollTo('studio')}
              className="w-full btn-secondary-mint text-xs py-2.5 flex items-center justify-center gap-2"
            >
              <span>LAUNCH INFERENCE STUDIO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
