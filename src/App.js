import React, { useEffect, useState } from 'react';
import './App.css';
import Registration from './Registration';
import Login from './Login';
import EpubReader from './EpubReader';
import LandingPage from './LandingPage';
import EpubLibrary from './EpubLibrary'; 
import { auth, onAuthStateChanged } from './firebase';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleShowLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={user ? <LandingPage /> : showLogin ? <Navigate to="/login" /> : <Navigate to="/register" /> } />
          <Route path="/library" element={user ? <EpubLibrary /> : <Navigate to="/login" /> } />
          <Route path="/reader" element={user ? <EpubReader /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Registration toggleShowLogin={toggleShowLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
