import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, Activity, Terminal, Send, BarChart3 } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: '1px solid #e7e3dc', 
      paddingBottom: '1rem', 
      marginBottom: '2rem' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: '#f4ede2', padding: '10px', borderRadius: '10px', border: '1px solid #e3dbcd' }}>
          <Cpu color="#b45309" size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em', color: '#1c1917' }}>CAMPUSOS</h1>
          <span style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 500 }}>Academic Kernel Management System</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', gap: '8px', background: '#f4ede2', padding: '4px', borderRadius: '10px', border: '1px solid #e3dbcd' }}>
        <NavLink 
          to="/" 
          end
          style={({ isActive }) => navStyle(isActive)}
        >
          <Terminal size={16} /> Monitor
        </NavLink>
        <NavLink 
          to="/dispatch" 
          style={({ isActive }) => navStyle(isActive)}
        >
          <Send size={16} /> Control Center
        </NavLink>
        <NavLink 
          to="/visualizer" 
          style={({ isActive }) => navStyle(isActive)}
        >
          <BarChart3 size={16} /> Scheduler
        </NavLink>
      </nav>

      {/* System Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f4ede2', padding: '0.4rem 0.9rem', borderRadius: '20px', border: '1px solid #e3dbcd' }}>
        <Activity color="#15803d" size={15} />
        <span style={{ color: '#15803d', fontSize: '0.75rem', fontWeight: 600 }}>KERNEL ONLINE</span>
      </div>
    </header>
  );
};

const navStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: 600,
  textDecoration: 'none',
  color: isActive ? '#1c1917' : '#78716c',
  background: isActive ? '#ffffff' : 'transparent',
  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
  transition: 'all 0.2s ease'
});