import { useEffect, useState, createContext } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Views/Home/Home';
import Mil from './Views/Mil';
import Err404 from './Views/404';
import Input from './input';
import './App.css';
import { OneContext } from './Shared/Contexts';

export default function App() {
  const [oneConnected, setOneConnected] = useState(false);

  useEffect(() => {
    const one = new Input('one');
    one.InputEvent.on('connected', () => setOneConnected(true));
    one.InputEvent.on('disconnected', () => setOneConnected(false));
  }, []);

  return (
    <Router>
      <OneContext.Provider value={oneConnected}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mil" element={<Mil />} />
          <Route path="*" element={<Err404 />} />
        </Routes>
      </OneContext.Provider>
    </Router>
  );
}
