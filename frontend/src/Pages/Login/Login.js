import React from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css'; // 👈 import the CSS

function Login() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome to the Assignment Agent</h2>
      <button className="login-button" onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
