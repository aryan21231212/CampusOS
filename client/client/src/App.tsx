import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { RequestDispatcher } from './components/RequestDispatcher';
import { SchedulerVisualizer } from './components/SchedulerVisualizer';
import { socket } from './services/socket';

export function App() {
  const [logs, setLogs] = useState<string[]>([]);

  // 1. Fetch existing process history from MongoDB Atlas on app load
  useEffect(() => {
    const handleStateUpdate = (data: { processId: string; state: string; message: string }) => {
      const timeStr = new Date().toLocaleTimeString();
      
      setLogs((prev) => {
        // If process is TERMINATED, append termination log & automatically clear it after 4 seconds
        if (data.state === 'TERMINATED') {
          const termLog = `[${timeStr}] Process ${data.processId} → TERMINATED: Resource released.`;
          
          // Remove completed process logs from active view after 4 seconds
          setTimeout(() => {
            setLogs((currentLogs) => currentLogs.filter(log => !log.includes(data.processId)));
          }, 4000);
  
          return [termLog, ...prev];
        }
  
        const newLog = `[${timeStr}] Process ${data.processId} → ${data.state}: ${data.message}`;
        return [newLog, ...prev];
      });
    };
  
    socket.on('processStateUpdate', handleStateUpdate);
  
    return () => {
      socket.off('processStateUpdate', handleStateUpdate);
    };
  }, []);

  // 2. Listen for live Socket.io events continuously
  useEffect(() => {
    const handleStateUpdate = (data: { processId: string; state: string; message: string }) => {
      const newLog = `[${new Date().toLocaleTimeString()}] Process ${data.processId} → ${data.state}: ${data.message}`;
      setLogs((prev) => [newLog, ...prev]);
    };

    socket.on('processStateUpdate', handleStateUpdate);

    return () => {
      socket.off('processStateUpdate', handleStateUpdate);
    };
  }, []);

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
            <Route path="/" element={<Dashboard logs={logs} />} />
            <Route path="/dispatch" element={<RequestDispatcher />} />
            <Route path="/visualizer" element={<SchedulerVisualizer />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;