import { Request, Response } from 'express';
import { CpuSchedulers } from '../os/Schedulers';
import { ProcessInput } from '../os/SchedulerTypes';

export const runSchedulerSimulation = async (req: Request, res: Response) => {
  try {
    const { processes, algorithm, timeQuantum } = req.body;

    if (!processes || !Array.isArray(processes) || processes.length === 0) {
      return res.status(400).json({ error: 'Valid processes array is required' });
    }

    let result;
    switch (algorithm?.toUpperCase()) {
      case 'FCFS':
        result = CpuSchedulers.fcfs(processes);
        break;
      case 'SJF':
        result = CpuSchedulers.sjf(processes);
        break;
      case 'PRIORITY':
        result = CpuSchedulers.priority(processes);
        break;
      case 'RR':
      case 'ROUNDROBIN':
        result = CpuSchedulers.roundRobin(processes, timeQuantum || 2);
        break;
      case 'ALL':
        // Run all algorithms for comparative "What-If" analysis simulator
        result = {
          fcfs: CpuSchedulers.fcfs(processes),
          sjf: CpuSchedulers.sjf(processes),
          priority: CpuSchedulers.priority(processes),
          roundRobin: CpuSchedulers.roundRobin(processes, timeQuantum || 2)
        };
        break;
      default:
        result = CpuSchedulers.fcfs(processes);
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('[Scheduler Error]', error);
    res.status(500).json({ error: 'Scheduler simulation failed' });
  }
};