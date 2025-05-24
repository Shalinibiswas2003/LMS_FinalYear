import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import ContentGen from './Pages/ContentGen/ContentGen';
import Login from './Pages/Login/Login';
import TestPage from './Pages/TestPage/TestPage';

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient"; // Make sure this path is correct
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courseGen" element={<ContentGen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </div>
    </SessionContextProvider>
  );
}

export default App;
