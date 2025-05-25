import React from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css';
import StudiousRobot from '../../Assets/StudiousRobot.jpg';
import { FaArrowLeft } from 'react-icons/fa'; // 👈 Import the icon

function Login() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) console.error('Error logging in:', error.message);
  };

  const handleBack = () => {
    window.location.href = '/'; // 👈 or use navigate() if using React Router
  };

  return (
    <div className="login-container">
      <img src={StudiousRobot} alt="Studious Robot" className="login-image" />

      <h1 className="login-heading">Welcome Back to EduSynth</h1>
      <p className="login-subtext">Continue your learning journey with us.</p>
      <button className="login-button" onClick={handleLogin}>
        Login with Google
      </button>

      {/* 👇 Back button below login */}
      <button className="back-button" onClick={handleBack} title="Back to homepage">
        <FaArrowLeft size={16} />
      </button>
    </div>
  );
}

export default Login;
