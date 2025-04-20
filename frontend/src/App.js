import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import ContentGen from './Pages/ContentGen/ContentGen';
import Login from './Pages/Login/Login';

function App() {
  return (
    <div className="App">
      <Router>
       
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courseGen" element={<ContentGen />} />
            <Route path="/login" element={<Login />} />
          </Routes>
       
      </Router>
    </div>
  );
}

export default App;
