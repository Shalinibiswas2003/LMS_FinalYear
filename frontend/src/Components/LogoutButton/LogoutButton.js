import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/Login');
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
