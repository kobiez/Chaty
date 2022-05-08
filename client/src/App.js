import React from 'react';
import './App.css';
import ChatyLogin from './components/Loginchat';
import ChatArea from './components/ChatArea';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Chaty</h1>
      <Routes>
        <Route path="/" element={<ChatyLogin />} />
        <Route path="/ChatArea/:code" element={<ChatArea />} />
      </Routes>
    </div>
  );
}

export default App;