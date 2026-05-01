import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home_page';
import Prompt from './prompt';
import Results from './results';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prompt" element={<Prompt />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
