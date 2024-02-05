import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Views/Home/Home';
import Trivia from './Views/Trivia/Trivia';
import Err404 from './Views/404';
import Input from './input';
import './App.css';
import { OneContext } from './Shared/Contexts';

export default function App() {
  const [oneConnected, setOneConnected] = useState(false);

  useEffect(() => {
    const inputOne = new Input('one');
    inputOne.InputEvent.on('connected', () => setOneConnected(true));
    inputOne.InputEvent.on('disconnected', () => setOneConnected(false));

    return () => {
      inputOne.InputEvent.removeAllListeners();
    };
  }, []);

  return (
    <Router>
      <OneContext.Provider value={oneConnected}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trivia" element={<Trivia />} />
          <Route path="*" element={<Err404 />} />
        </Routes>
      </OneContext.Provider>
    </Router>
  );
}
