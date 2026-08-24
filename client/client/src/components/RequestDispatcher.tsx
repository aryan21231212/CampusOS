import React, { useState } from 'react';
import { Send, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

export const RequestDispatcher: React.FC = () => {
  // Form state for creating a new process request
  const [processId, setProcessId] = useState('P_DEMO_1');
  const [userId, setUserId] = useState('65f1a2b3c4d5e6f7a8b9c0d1');
  const [resourceId, setResourceId] = useState('AUDI_A');
  const [quantity, setQuantity] = useState(1);
  const [burstTime, setBurstTime] = useState(5);
  const [priority, setPriority] = useState(1);

  // Form state for creating a new resource
  const [newResId, setNewResId] = useState('LAB_202');
  const [newResName, setNewResName] = useState('Robotics Lab 202');
  const [newResType, setNewResType] = useState('Hardware');
  const [newResQty, setNewResQty] = useState(10);

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handler: Submit Process Request
  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await fetch('http://localhost:3030/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processId, userId, resourceId, quantity, burstTime, priority })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', text: `Process ${processId} dispatched to Kernel!` });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to dispatch process' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error communicating with Kernel' });
    }
  };

  // Handler: Seed/Create Resource
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await fetch('http://localhost:3030/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: newResId,
          name: newResName,
          type: newResType,
          totalQuantity: newResQty,
          availableQuantity: newResQty,
          location: 'Block C',
          status: 'Active'
        })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: `Resource ${newResId} registered in Inventory!` });
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to register resource' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error registering resource' });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
      
      {/* Dispatch Process Request Card */}
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e7e3dc', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Send color="#0369a1" size={20} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1c1917' }}>Dispatch Process Request</h3>
        </div>

        <form onSubmit={handleProcessSubmit} style={{ display: 'grid', gap: '0.8rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Process ID</label>
              <input value={processId} onChange={e => setProcessId(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Resource ID</label>
              <input value={resourceId} onChange={e => setResourceId(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Quantity</label>
              <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Burst Time</label>
              <input type="number" value={burstTime} onChange={e => setBurstTime(Number(e.target.value))} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Priority</label>
              <input type="number" value={priority} onChange={e => setPriority(Number(e.target.value))} required style={inputStyle} />
            </div>
          </div>

          <button type="submit" style={{ ...buttonStyle, background: '#1c1917', color: '#ffffff', marginTop: '0.5rem' }}>
            Submit to Kernel State Machine
          </button>
        </form>
      </div>

      {/* Register Resource Card */}
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e7e3dc', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <PlusCircle color="#15803d" size={20} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1c1917' }}>Register Campus Resource</h3>
        </div>

        <form onSubmit={handleResourceSubmit} style={{ display: 'grid', gap: '0.8rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Resource ID</label>
              <input value={newResId} onChange={e => setNewResId(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Resource Name</label>
              <input value={newResName} onChange={e => setNewResName(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Type</label>
              <input value={newResType} onChange={e => setNewResType(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#78716c', display: 'block', marginBottom: '0.2rem' }}>Total Capacity</label>
              <input type="number" value={newResQty} onChange={e => setNewResQty(Number(e.target.value))} required style={inputStyle} />
            </div>
          </div>

          <button type="submit" style={{ ...buttonStyle, background: '#f4ede2', color: '#44403c', border: '1px solid #e3dbcd', marginTop: '0.5rem' }}>
            Add Resource to Inventory
          </button>
        </form>
      </div>

      {/* Status Feedback Toast */}
      {statusMsg && (
        <div style={{ gridColumn: '1 / -1', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', background: statusMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: statusMsg.type === 'success' ? '#15803d' : '#991b1b' }}>
          {statusMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {statusMsg.text}
        </div>
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.55rem',
  background: '#fcfbf9',
  border: '1px solid #e7e3dc',
  borderRadius: '6px',
  fontSize: '0.825rem',
  color: '#1c1917',
  boxSizing: 'border-box'
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.85rem',
  cursor: 'pointer'
};