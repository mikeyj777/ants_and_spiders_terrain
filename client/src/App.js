import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Model from './components/Model';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Model />} />
      </Routes>
    </Router>
  );
}

export default App;