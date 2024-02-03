import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Mil } from './Views';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mil" element={<Mil />} />
      </Routes>
    </Router>
  );
}
