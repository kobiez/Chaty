import React from 'react';
import ChatyRegister from './Registerchat';
import ChatArea from './ChatArea';
import LoginToChat from './login';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App text-center">
      <h1 className='headline display-4 text-primary fw-normal bg-light mb-0 pb-2'>
        Chaty
      </h1>
      <Routes>
        <Route path="/" element={<ChatyRegister />} />
        <Route path="/login" element={<LoginToChat />} />
        <Route path="/ChatArea/:code" element={<ChatArea />} />
      </Routes>
    </div>
  );
}

export default App;