import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MessageList from './components/MessageList';
import MessageCompose from './components/MessageCompose';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/messages" 
            element={
              isAuthenticated ? <MessageList /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/compose" 
            element={
              isAuthenticated ? <MessageCompose /> : <Navigate to="/login" replace />
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;