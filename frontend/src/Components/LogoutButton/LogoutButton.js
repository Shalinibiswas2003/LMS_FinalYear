import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { FiLogOut } from 'react-icons/fi';
import './LogoutButton.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/Login');
  };

  return (
    <button
      aria-label="Logout"
      className="logout-button"
      onClick={handleLogout}
      type="button"
    >
      <FiLogOut size={20} />
      <span className="logout-tooltip">Logout</span>
    </button>
  );
};

export default LogoutButton;
