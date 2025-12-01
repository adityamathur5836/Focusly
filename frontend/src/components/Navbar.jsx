import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, User } from 'lucide-react';
import Button from './ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/me', {
        credentials: 'include',
      });
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Focusly
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Features</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Pricing</Link>
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</Link>
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              {isAuthenticated ? (
                <Link to="/profile">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Features</Link>
            <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Pricing</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">About</Link>
            <div className="pt-4 pb-2 border-t border-gray-100">
              <div className="flex flex-col gap-2 px-3">
                {isAuthenticated ? (
                  <Link to="/profile" className="w-full">
                    <Button variant="ghost" className="w-full justify-center flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <Button variant="ghost" className="w-full justify-center">Log in</Button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button className="w-full justify-center">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
