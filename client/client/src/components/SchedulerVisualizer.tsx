import React, { useState } from 'react';
import { Play, BarChart3, Clock, Zap } from 'lucide-react';

interface ProcessRow {
  processId: string;
  resourceId: string;
  quantity: number;
  arrivalTime: number;
  burstTime: number;
  deadline: number;
  priority: number;
}

export const SchedulerVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<string>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [processes, setProcesses] = useState<ProcessRow[]>([
    { processId: 'P1', resourceId: 'LAB_101', quantity: 10, arrivalTime: 0, burstTime: 5, deadline: 30, priority: 3 },
    { processId: 'P2', resourceId: 'GPU_1', quantity: 2, arrivalTime: 1, burstTime: 3, deadline: 20, priority: 10 },
    { processId: 'P3', resourceId: 'AUDI_A', quantity: 1, arrivalTime: 2, burstTime: 8, deadline: 50, priority: 5 }
  ]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddProcess = () => {
    const id = `P${processes.length + 1}`;
    setProcesses([...processes, { processId: id, resourceId: 'LAB_101', quantity: 5, arrivalTime: processes.length, burstTime: 4, deadline: 40, priority: 5 }]);
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3030/api/scheduler/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, timeQuantum, processes })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '2rem', fontFamily: 'monospace', borderRadius: '12px', border: '1px solid #334155', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <BarChart3 color="#38bdf8" size={24} />
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>OS Process Scheduler & Gantt Visualizer</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Algorithm</label>
          <select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', background: '#1e293b', color: '#fff', border: '1px solid #475569', borderRadius: '6px' }}
          >
            <option value="FCFS">FCFS (First-Come, First-Served)</option>
            <option value="SJF">SJF (Shortest Job First)</option>
            <option value="PRIORITY">Priority Scheduling</option>
            <option value="RR">Round Robin</option>
            <option value="ALL">Comparative (All)</option>
          </select>
        </div>

        {algorithm === 'RR' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Time Quantum</label>
            <input 
              type="number" 
              value={timeQuantum} 
              onChange={(e) => setTimeQuantum(Number(e.target.value))}
              style={{ width: '100%', padding: '0.5rem', background: '#1e293b', color: '#fff', border: '1px solid #475569', borderRadius: '6px' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          <button 
            onClick={handleAddProcess}
            style={{ padding: '0.5rem 1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            + Add Process
          </button>
          <button 
            onClick={runSimulation}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1.2rem', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Play size={16} /> {loading ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Process Table Preview */}
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '8px' }}>Process ID</th>
              <th style={{ padding: '8px' }}>Resource ID</th>
              <th style={{ padding: '8px' }}>Arrival Time</th>
              <th style={{ padding: '8px' }}>Burst Time</th>
              <th style={{ padding: '8px' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px', color: '#38bdf8' }}>{p.processId}</td>
                <td style={{ padding: '8px' }}>{p.resourceId}</td>
                <td style={{ padding: '8px' }}>{p.arrivalTime}</td>
                <td style={{ padding: '8px' }}>{p.burstTime}</td>
                <td style={{ padding: '8px' }}>{p.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gantt Chart Output */}
      {result && result.ganttChart && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#4ade80' }}>Gantt Chart Sequence ({result.algorithmName})</h3>
          
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '1rem', alignItems: 'center' }}>
            {result.ganttChart.map((step: any, idx: number) => (
              <div key={idx} style={{ background: '#0f172a', border: '1px solid #38bdf8', padding: '10px 14px', borderRadius: '6px', textAlign: 'center', minWidth: '60px' }}>
                <div style={{ color: '#38bdf8', fontWeight: 'bold' }}>{step.processId}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{step.start} → {step.end}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '1rem', fontSize: '0.85rem' }}>
            <div style={{ background: '#090d16', padding: '10px', borderRadius: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Avg Waiting:</span> <strong style={{ color: '#fff' }}>{result.metrics.avgWaitingTime}</strong>
            </div>
            <div style={{ background: '#090d16', padding: '10px', borderRadius: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Avg Turnaround:</span> <strong style={{ color: '#fff' }}>{result.metrics.avgTurnaroundTime}</strong>
            </div>
            <div style={{ background: '#090d16', padding: '10px', borderRadius: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Utilization:</span> <strong style={{ color: '#4ade80' }}>{result.metrics.resourceUtilization}%</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};