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
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '2rem', fontFamily: 'monospace' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu color="#38bdf8" size={32} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold' }}>CAMPUSOS // KERNEL MONITOR</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <Activity color="#4ade80" size={18} />
          <span style={{ color: '#4ade80', fontSize: '0.875rem' }}>STATUS: {systemStatus}</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#38bdf8' }}>
            <Server size={20} />
            <h3 style={{ margin: 0 }}>Resource Inventory</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>O(1) Hash Map Sync Active</p>
        </div>

        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#facc15' }}>
            <ShieldAlert size={20} />
            <h3 style={{ margin: 0 }}>Deadlock & Banker's Safety</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Graph DFS Cycle Detector Active</p>
        </div>
      </div>

      <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#f43f5e' }}>
          <Terminal size={20} />
          <h3 style={{ margin: 0 }}>Real-Time Kernel Broadcast Log</h3>
        </div>
        <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', height: '200px', overflowY: 'auto', fontSize: '0.85rem', color: '#cbd5e1' }}>
          {logs.length === 0 ? (
            <span style={{ color: '#64748b' }}>Waiting for real-time process state events... Submit a resource request to see live logs.</span>
          ) : (
            logs.map((log, idx) => <div key={idx} style={{ marginBottom: '6px' }}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};