import React, { useState, useEffect } from 'react';
import { Send, PlusCircle, CheckCircle, AlertCircle, Box, Server } from 'lucide-react';
import { socket } from '../services/socket';

interface ResourceItem {
  _id?: string;
  resourceId: string;
  name: string;
  type: string;
  totalQuantity: number;
  availableQuantity: number;
  location?: string;
}

export const RequestDispatcher: React.FC = () => {
  // Process Request Form State
  const [processId, setProcessId] = useState('P_DEMO_1');
  const [userId, setUserId] = useState('65f1a2b3c4d5e6f7a8b9c0d1');
  const [resourceId, setResourceId] = useState('AUDI_A');
  const [quantity, setQuantity] = useState(1);
  const [burstTime, setBurstTime] = useState(5);
  const [priority, setPriority] = useState(1);

  // New Resource Form State
  const [newResId, setNewResId] = useState('LAB_301');
  const [newResName, setNewResName] = useState('AI Supercomputer Lab');
  const [newResType, setNewResType] = useState('Hardware');
  const [newResQty, setNewResQty] = useState(5);

  // Resources List State
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper function to extract array regardless of wrapper key
  const extractResourceArray = (data: any): ResourceItem[] => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.resources)) return data.resources;
    return [];
  };

  // Fetch Resources on Component Mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('http://localhost:3030/api/resources');
        const data = await res.json();
        const resourceList = extractResourceArray(data);
        
        setResources(resourceList);

        if (resourceList.length > 0) {
          setResourceId(resourceList[0].resourceId);
        }
      } catch (err) {
        console.error('Failed to fetch resources:', err);
      }
    };

    fetchResources();

    // Listen for real-time resource updates via Socket.io
    const handleResourceCreated = (newRes: ResourceItem) => {
      if (!newRes || !newRes.resourceId) return;
      setResources((prev) => [
        newRes,
        ...prev.filter((r) => r.resourceId !== newRes.resourceId)
      ]);
    };

    socket.on('resourceCreated', handleResourceCreated);

    return () => {
      socket.off('resourceCreated', handleResourceCreated);
    };
  }, []);

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
        setStatusMsg({ type: 'success', text: `Process ${processId} submitted successfully!` });
      } else {
        setStatusMsg({ type: 'error', text: data.error || data.message || 'Failed to dispatch process' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error connecting to Kernel' });
    }
  };

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
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', text: `Resource ${newResId} created and added to inventory!` });
        const createdObj = data.data || data;
        if (createdObj && createdObj.resourceId) {
          setResources((prev) => [createdObj, ...prev.filter(r => r.resourceId !== createdObj.resourceId)]);
          setResourceId(createdObj.resourceId);
        }
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to create resource' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error creating resource' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Forms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Dispatch Process Request Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Send color="#0369a1" size={20} />
            <h3 style={cardTitleStyle}>Dispatch Process Request</h3>
          </div>

          <form onSubmit={handleProcessSubmit} style={{ display: 'grid', gap: '0.8rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={labelStyle}>Process ID</label>
                <input value={processId} onChange={e => setProcessId(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Target Resource ID</label>
                <select value={resourceId} onChange={e => setResourceId(e.target.value)} required style={inputStyle}>
                  {resources.map((r) => (
                    <option key={r.resourceId || r._id} value={r.resourceId}>
                      {r.resourceId} ({r.name})
                    </option>
                  ))}
                  {resources.length === 0 && <option value="AUDI_A">AUDI_A (Auditorium A)</option>}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Burst Time (s)</label>
                <input type="number" value={burstTime} onChange={e => setBurstTime(Number(e.target.value))} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <input type="number" value={priority} onChange={e => setPriority(Number(e.target.value))} required style={inputStyle} />
              </div>
            </div>

            <button type="submit" style={{ ...buttonStyle, background: '#1c1917', color: '#ffffff', marginTop: '0.5rem' }}>
              Submit to Kernel State Machine
            </button>
          </form>
        </div>

        {/* Register Resource Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <PlusCircle color="#15803d" size={20} />
            <h3 style={cardTitleStyle}>Register Campus Resource</h3>
          </div>

          <form onSubmit={handleResourceSubmit} style={{ display: 'grid', gap: '0.8rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={labelStyle}>Resource ID</label>
                <input value={newResId} onChange={e => setNewResId(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Resource Name</label>
                <input value={newResName} onChange={e => setNewResName(e.target.value)} required style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={labelStyle}>Type</label>
                <input value={newResType} onChange={e => setNewResType(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Total Capacity</label>
                <input type="number" value={newResQty} onChange={e => setNewResQty(Number(e.target.value))} required style={inputStyle} />
              </div>
            </div>

            <button type="submit" style={{ ...buttonStyle, background: '#f4ede2', color: '#44403c', border: '1px solid #e3dbcd', marginTop: '0.5rem' }}>
              Add Resource to Inventory
            </button>
          </form>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {statusMsg && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', background: statusMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: statusMsg.type === 'success' ? '#15803d' : '#991b1b' }}>
          {statusMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {statusMsg.text}
        </div>
      )}

      {/* Live Resources View Grid */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Server color="#b45309" size={20} />
          <h3 style={cardTitleStyle}>Live Active Resource Pool ({resources.length})</h3>
        </div>

        {resources.length === 0 ? (
          <p style={{ color: '#a8a29e', fontSize: '0.85rem', margin: 0 }}>
            No resources loaded. Register one above or check database connection.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {resources.map((res, idx) => (
              <div key={res.resourceId || idx} style={{ background: '#f9f8f6', border: '1px solid #e7e3dc', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                  <Box size={16} color="#0369a1" />
                  <strong style={{ fontSize: '0.9rem', color: '#1c1917' }}>{res.resourceId}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#44403c', fontWeight: 600 }}>{res.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#78716c', marginTop: '0.4rem' }}>
                  Type: <span>{res.type}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '0.2rem' }}>
                  Capacity: {res.availableQuantity ?? res.totalQuantity} / {res.totalQuantity}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  padding: '1.5rem',
  borderRadius: '16px',
  border: '1px solid #e7e3dc',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1rem',
  fontWeight: 600,
  color: '#1c1917'
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#78716c',
  display: 'block',
  marginBottom: '0.2rem',
  fontWeight: 500
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