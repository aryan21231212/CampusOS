import React, { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { Activity, ShieldAlert, Cpu, Server, Terminal } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [systemStatus, setSystemStatus] = useState<string>('ONLINE');

  useEffect(() => {
    socket.on('processStateUpdate', (data: { processId: string; state: string; message: string }) => {
      setLogs((prev) => [`[${new Date().toLocaleTimeString()}] Process ${data.processId} → ${data.state}: ${data.message}`, ...prev]);
    });

    return () => {
      socket.off('processStateUpdate');
    };
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#fcfbf9', 
      color: '#2d2a26', 
      minHeight: '100vh', 
      padding: '2.5rem', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' 
    }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #e7e3dc', 
        paddingBottom: '1.25rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#f4ede2', padding: '10px', borderRadius: '10px', border: '1px solid #e3dbcd' }}>
            <Cpu color="#b45309" size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em', color: '#1c1917' }}>CAMPUSOS</h1>
            <span style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 500 }}>Academic Kernel Monitor</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f4ede2', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #e3dbcd' }}>
          <Activity color="#15803d" size={16} />
          <span style={{ color: '#15803d', fontSize: '0.8rem', fontWeight: 600 }}>STATUS: {systemStatus}</span>
        </div>
      </header>

      {/* Info Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Resource Inventory Card */}
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          border: '1px solid #e7e3dc',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', color: '#0369a1' }}>
            <Server size={20} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1c1917' }}>Resource Inventory</h3>
          </div>
          <p style={{ color: '#78716c', fontSize: '0.875rem', margin: 0 }}>O(1) Hash Map Synchronization Active</p>
        </div>

        {/* Deadlock Card */}
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          border: '1px solid #e7e3dc',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', color: '#b45309' }}>
            <ShieldAlert size={20} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1c1917' }}>Deadlock & Banker's Safety</h3>
          </div>
          <p style={{ color: '#78716c', fontSize: '0.875rem', margin: 0 }}>Graph DFS Cycle Detector Active</p>
        </div>
      </div>

      {/* Broadcast Log Terminal Container */}
      <div style={{ 
        background: '#ffffff', 
        padding: '1.75rem', 
        borderRadius: '16px', 
        border: '1px solid #e7e3dc',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#44403c' }}>
          <Terminal size={20} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Real-Time Kernel Broadcast Log</h3>
        </div>
        <div style={{ 
          background: '#f9f8f6', 
          border: '1px solid #e7e3dc', 
          padding: '1.25rem', 
          borderRadius: '12px', 
          height: '220px', 
          overflowY: 'auto', 
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '0.85rem', 
          color: '#44403c',
          lineHeight: '1.5'
        }}>
          {logs.length === 0 ? (
            <span style={{ color: '#a8a29e' }}>Waiting for real-time process state events... Submit a resource request to see live logs.</span>
          ) : (
            logs.map((log, idx) => <div key={idx} style={{ marginBottom: '8px', borderBottom: '1px solid #f0ede6', paddingBottom: '4px' }}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};