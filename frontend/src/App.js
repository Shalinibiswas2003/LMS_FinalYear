import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './Pages/Home/Home';
import About from './Pages/About/About';

function App() {
  return (
    <div className="App">
      <Router>
       
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
       
      </Router>
    </div>
  );
}

export default App;
