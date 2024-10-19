import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import HomeScreen from './components/HomeScreen';
import MessageCompose from './components/MessageCompose';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage on first render
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/messages" 
            element={
              isAuthenticated ? <HomeScreen /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/compose" 
            element={
              isAuthenticated ? <MessageCompose /> : <Navigate to="/login" replace />
            } 
          />
          <Route path="/" element={isAuthenticated ? <Navigate to="/messages" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
