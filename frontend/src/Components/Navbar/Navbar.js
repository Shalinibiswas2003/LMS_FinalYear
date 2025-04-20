import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { supabase } from '../../supabaseClient';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    setUser(null);
  };

  const getDisplayName = () => {
    const fullName = user?.user_metadata?.full_name;
    const email = user?.email;
    return fullName || email || 'User';
  };

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">EduSynth</div>
        </div>

        <nav className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            {user && <li><a href="/coursegen">CourseGen</a></li>}
            <li><a href="/contact">Contact</a></li>
            {user ? (
              <li><a href="/" onClick={handleLogout}>Logout</a></li>
            ) : (
              <li><a href="/login">Login</a></li>
            )}
          </ul>
        </nav>

        {user && (
          <div className="navbar-user">Hi, {getDisplayName()}</div>
        )}

        <div className="navbar-toggle" onClick={toggleMenu}>
          &#9776;
        </div>
      </div>
      <div className="navbar-line"></div>
    </header>
  );
};

export default Navbar;
