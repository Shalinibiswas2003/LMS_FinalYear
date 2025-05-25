import React from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css';
import StudiousRobot from '../../Assets/StudiousRobot.jpg' // 👈 Import the image

function Login() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <div className="login-container">
      {/* 👇 Image goes here */}
      <img src={StudiousRobot} alt="Studious Robot" className="login-image" />

      <h1 className="login-heading">Welcome Back to EduSynth</h1>
      <p className="login-subtext">Continue your learning journey with us.</p>
      <button className="login-button" onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
}

export default Login;
