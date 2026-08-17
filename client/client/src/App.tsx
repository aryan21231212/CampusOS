import React from 'react';
import { Dashboard } from './components/Dashboard';
import { SchedulerVisualizer } from './components/SchedulerVisualizer';

export function App() {
  return (
    <div style={{ backgroundColor: '#090d16', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Dashboard />
        <SchedulerVisualizer />
      </div>
    </div>
  );
}

export default App; 