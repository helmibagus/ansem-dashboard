'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#' },
    { label: 'Wallet Check', href: '#tracker' },
    { label: 'Position Calc', href: '#calculator' },
    { label: 'Holders', href: '#holders' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-gray-800/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐂</span>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                $ANSEM
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1">Live Holder Dashboard</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="text-xs text-green-400">● Live RPC</span>
            </div>
            <a
              href="https://solscan.io/token/9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs text-yellow-400 hover:bg-yellow-500/15 transition-colors"
            >
              Open Solscan
            </a>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="md:hidden bg-[#0a0a0f]/98 backdrop-blur-xl border-b border-gray-800">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="block py-2 text-gray-300 hover:text-yellow-400" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
