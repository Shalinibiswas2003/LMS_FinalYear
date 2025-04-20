import React from 'react';
import { supabase } from '../../supabaseClient';

function Login() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
