import React from 'react';
import { Dashboard } from './components/Dashboard';
import { SchedulerVisualizer } from './components/SchedulerVisualizer';

export function App() {
  return (
    <div style={{ 
      backgroundColor: '#fcfbf9', 
      minHeight: '100vh', 
      width: '100vw',
      margin: 0,
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      <Dashboard />
      <SchedulerVisualizer />
    </div>
  );
}

export default App;