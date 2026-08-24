import React from 'react';
import { ShieldAlert, Server, Terminal } from 'lucide-react';

interface DashboardProps {
  logs: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* Information Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        
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
          height: '240px', 
          overflowY: 'auto', 
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '0.85rem', 
          color: '#44403c',
          lineHeight: '1.5'
        }}>
          {logs.length === 0 ? (
            <span style={{ color: '#a8a29e' }}>
              Waiting for real-time process state events... Submit a resource request in the Control Center tab to see live logs.
            </span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '8px', borderBottom: '1px solid #f0ede6', paddingBottom: '4px' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};