import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ModelEngine from './components/ModelEngine';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ModelEngine />} />
      </Routes>
    </Router>
  );
}

export default App;