import React from 'react';
import './App.css';
import ChatyRegister from './components/Registerchat';
import ChatArea from './components/ChatArea';
import LoginToChat from './components/login';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1 style={{ color: 'orange' }}>Chaty</h1>
      <Routes>
        <Route path="/" element={<ChatyRegister />} />
        <Route path="/login" element={<LoginToChat />} />
        <Route path="/ChatArea/:code" element={<ChatArea />} />
      </Routes>
    </div>
  );
}

export default App;