import React, { useState, useEffect } from 'react';
import { Play, BarChart3, RefreshCw, Database } from 'lucide-react';

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
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingDb, setFetchingDb] = useState<boolean>(false);

  // Fetch live requests directly from MongoDB Atlas
  const fetchDbProcesses = async () => {
    setFetchingDb(true);
    try {
      const res = await fetch('http://localhost:3030/api/requests');
      const data = await res.json();

      if (data.success && data.data.length > 0) {
        const formatted: ProcessRow[] = data.data.map((item: any, idx: number) => ({
          processId: item.processId || `P_${item._id.substring(18)}`,
          resourceId: item.resourceId || 'UNKNOWN_RES',
          quantity: item.quantity || 1,
          arrivalTime: item.arrivalTime ?? idx,
          burstTime: item.burstTime || 5,
          deadline: item.deadline || 30,
          priority: item.priority || 1
        }));
        setProcesses(formatted);
      } else {
        // Fallback fallback defaults if DB is empty
        setProcesses([
          { processId: 'P1', resourceId: 'LAB_101', quantity: 10, arrivalTime: 0, burstTime: 5, deadline: 30, priority: 3 },
          { processId: 'P2', resourceId: 'GPU_1', quantity: 2, arrivalTime: 1, burstTime: 3, deadline: 20, priority: 10 }
        ]);
      }
    } catch (err) {
      console.error('Failed to connect to MongoDB Atlas:', err);
    } finally {
      setFetchingDb(false);
    }
  };

  useEffect(() => {
    fetchDbProcesses();
  }, []);

  const handleAddProcess = () => {
    const id = `P_MANUAL_${processes.length + 1}`;
    setProcesses([
      ...processes,
      { processId: id, resourceId: 'AUDI_A', quantity: 1, arrivalTime: processes.length, burstTime: 4, deadline: 40, priority: 5 }
    ]);
  };

  const handleProcessChange = (index: number, field: keyof ProcessRow, value: any) => {
    const updated = [...processes];
    updated[index] = { ...updated[index], [field]: value };
    setProcesses(updated);
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
    <div style={{
      backgroundColor: '#ffffff',
      color: '#2d2a26',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderRadius: '16px',
      border: '1px solid #e7e3dc',
      marginTop: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#f4ede2', padding: '8px', borderRadius: '8px', border: '1px solid #e3dbcd' }}>
            <BarChart3 color="#b45309" size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#1c1917' }}>OS Process Scheduler & Gantt Visualizer</h2>
            <span style={{ fontSize: '0.75rem', color: '#78716c' }}>Data Source: MongoDB Atlas (`ProcessRequest` collection)</span>
          </div>
        </div>

        <button
          onClick={fetchDbProcesses}
          disabled={fetchingDb}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.5rem 0.9rem',
            background: '#f4ede2',
            color: '#44403c',
            border: '1px solid #e3dbcd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500
          }}
        >
          <RefreshCw size={14} className={fetchingDb ? 'animate-spin' : ''} /> {fetchingDb ? 'Syncing...' : 'Sync DB'}
        </button>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#78716c', marginBottom: '0.4rem', fontWeight: 500 }}>Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            style={inputSelectStyle}
          >
            <option value="FCFS">FCFS (First-Come, First-Served)</option>
            <option value="SJF">SJF (Shortest Job First)</option>
            <option value="PRIORITY">Priority Scheduling</option>
            <option value="RR">Round Robin</option>
            <option value="ALL">Comparative Analysis (All)</option>
          </select>
        </div>

        {algorithm === 'RR' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#78716c', marginBottom: '0.4rem', fontWeight: 500 }}>Time Quantum</label>
            <input
              type="number"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(Number(e.target.value))}
              style={inputSelectStyle}
            />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          <button
            onClick={handleAddProcess}
            style={{ padding: '0.6rem 1rem', background: '#f4ede2', color: '#44403c', border: '1px solid #e3dbcd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
          >
            + Override Process
          </button>
          <button
            onClick={runSimulation}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.2rem', background: '#1c1917', color: '#ffffff', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <Play size={15} /> {loading ? 'Simulating...' : 'Execute Algorithm'}
          </button>
        </div>
      </div>

      {/* Interactive Process Table */}
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e7e3dc', color: '#78716c' }}>
              <th style={{ padding: '8px', fontWeight: 500 }}>Process ID</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Resource ID</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Arrival Time</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Burst Time</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f4ede2' }}>
                <td style={{ padding: '8px', color: '#0369a1', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={13} color="#0369a1" />
                    {p.processId}
                  </div>
                </td>
                <td style={{ padding: '8px', color: '#44403c' }}>{p.resourceId}</td>
                <td style={{ padding: '8px' }}>
                  <input
                    type="number"
                    value={p.arrivalTime}
                    onChange={(e) => handleProcessChange(idx, 'arrivalTime', Number(e.target.value))}
                    style={tableInputStyle}
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <input
                    type="number"
                    value={p.burstTime}
                    onChange={(e) => handleProcessChange(idx, 'burstTime', Number(e.target.value))}
                    style={tableInputStyle}
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <input
                    type="number"
                    value={p.priority}
                    onChange={(e) => handleProcessChange(idx, 'priority', Number(e.target.value))}
                    style={tableInputStyle}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Output Gantt Chart */}
      {result && result.ganttChart && (
        <div style={{ background: '#f9f8f6', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e7e3dc' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 600, color: '#15803d' }}>
            Gantt Sequence Results ({result.algorithmName})
          </h3>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '1rem', alignItems: 'center' }}>
            {result.ganttChart.map((step: any, idx: number) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #d6d3ce', padding: '10px 14px', borderRadius: '8px', textAlign: 'center', minWidth: '65px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                <div style={{ color: '#0369a1', fontWeight: 700, fontSize: '0.85rem' }}>{step.processId}</div>
                <div style={{ fontSize: '0.75rem', color: '#78716c', marginTop: '4px' }}>{step.start} → {step.end}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '1rem', fontSize: '0.85rem' }}>
            <div style={metricBoxStyle}>
              <span style={{ color: '#78716c', display: 'block', fontSize: '0.75rem' }}>Avg Waiting Time</span>
              <strong style={{ color: '#1c1917', fontSize: '0.95rem' }}>{result.metrics.avgWaitingTime} ms</strong>
            </div>
            <div style={metricBoxStyle}>
              <span style={{ color: '#78716c', display: 'block', fontSize: '0.75rem' }}>Avg Turnaround Time</span>
              <strong style={{ color: '#1c1917', fontSize: '0.95rem' }}>{result.metrics.avgTurnaroundTime} ms</strong>
            </div>
            <div style={metricBoxStyle}>
              <span style={{ color: '#78716c', display: 'block', fontSize: '0.75rem' }}>CPU Utilization</span>
              <strong style={{ color: '#15803d', fontSize: '0.95rem' }}>{result.metrics.resourceUtilization}%</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inputSelectStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem',
  background: '#fcfbf9',
  color: '#1c1917',
  border: '1px solid #e7e3dc',
  borderRadius: '8px',
  fontSize: '0.85rem'
};

const tableInputStyle: React.CSSProperties = {
  width: '60px',
  padding: '0.3rem 0.5rem',
  border: '1px solid #e7e3dc',
  borderRadius: '6px',
  background: '#fcfbf9',
  fontSize: '0.825rem',
  color: '#1c1917'
};

const metricBoxStyle: React.CSSProperties = {
  background: '#ffffff',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #e7e3dc'
};