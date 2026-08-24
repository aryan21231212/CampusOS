import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { RequestDispatcher } from './components/RequestDispatcher';
import { SchedulerVisualizer } from './components/SchedulerVisualizer';

export function App() {
  return (
    <BrowserRouter>
      <div style={{ 
        backgroundColor: '#fcfbf9', 
        minHeight: '100vh', 
        width: '100vw', 
        margin: 0, 
        padding: '2rem', 
        boxSizing: 'border-box' 
      }}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dispatch" element={<RequestDispatcher />} />
            <Route path="/visualizer" element={<SchedulerVisualizer />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;