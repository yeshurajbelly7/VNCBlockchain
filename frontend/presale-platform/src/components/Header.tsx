'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Wallet, TrendingUp, LayoutDashboard, BookOpen, LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [_userEmail, setUserEmail] = useState('');
  const [_userRole, setUserRole] = useState('');

  // Get role-based dashboard link
  const getDashboardLink = () => {
    const role = localStorage.getItem('vnc_user_role');
    switch (role) {
      case 'super-admin':
      case 'admin':
        return '/super-admin';
      case 'validator':
        return '/validator-dashboard';
      case 'presale-admin':
        return '/presale-admin';
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('vnc_auth_token');
      const email = localStorage.getItem('vnc_user_email');
      const role = localStorage.getItem('vnc_user_role');
      setIsAuthenticated(!!token);
      setUserEmail(email || '');
      setUserRole(role || '');
    };

    checkAuth();
    // Check auth status periodically
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vnc_auth_token');
    localStorage.removeItem('vnc_user_email');
    localStorage.removeItem('vnc_user_role');
    setIsAuthenticated(false);
    setUserEmail('');
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Presale', href: '/presale', icon: TrendingUp },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Explorer', href: '/explorer', icon: BookOpen },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-card-bg/95 backdrop-blur-md border-b border-border-color' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-quantum rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              V
            </div>
            <div>
              <div className="text-xl font-bold gradient-text">VNC Blockchain</div>
              <div className="text-xs text-gray-400">vncblockchain.com</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons / User Info */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="px-6 py-2.5 rounded-lg border border-border-color hover:border-primary transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-lg border border-border-color hover:border-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-quantum hover:opacity-90 transition-opacity font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-card-bg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-color">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors p-2"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 pt-4 border-t border-border-color">
                {isAuthenticated ? (
                  <>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-2.5 rounded-lg border border-border-color hover:border-primary transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="px-6 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-2.5 rounded-lg border border-border-color hover:border-primary transition-colors text-center"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-quantum hover:opacity-90 transition-opacity font-semibold text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

