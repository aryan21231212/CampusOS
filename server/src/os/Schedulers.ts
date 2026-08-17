import { ProcessInput, ScheduledProcess, GanttStep, SchedulingResult } from './SchedulerTypes';
import { Queue } from '../dsa/Queue';
import { PriorityQueue } from '../dsa/PriorityQueue';

export class CpuSchedulers {
  
  // 1. FCFS (First-Come, First-Served)
  public static fcfs(processes: ProcessInput[]): SchedulingResult {
    // Sort processes by arrival time
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const schedule: ScheduledProcess[] = [];
    const ganttChart: GanttStep[] = [];
    
    let currentTime = 0;
    let totalWaiting = 0;
    let totalTurnaround = 0;
    let totalResponse = 0;

    for (const p of sorted) {
      if (currentTime < p.arrivalTime) {
        currentTime = p.arrivalTime; // CPU idle until process arrives
      }

      const startTime = currentTime;
      const completionTime = startTime + p.burstTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = startTime - p.arrivalTime;
      const responseTime = waitingTime;

      schedule.push({
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime
      });

      ganttChart.push({
        processId: p.processId,
        start: startTime,
        end: completionTime
      });

      totalWaiting += waitingTime;
      totalTurnaround += turnaroundTime;
      totalResponse += responseTime;
      currentTime = completionTime;
    }

    const n = processes.length;
    const totalTime = currentTime > 0 ? currentTime : 1;
    const busyTime = ganttChart.reduce((acc, step) => acc + (step.end - step.start), 0);

    return {
      algorithmName: 'FCFS',
      schedule,
      ganttChart,
      metrics: {
        avgWaitingTime: n ? Number((totalWaiting / n).toFixed(2)) : 0,
        avgTurnaroundTime: n ? Number((totalTurnaround / n).toFixed(2)) : 0,
        avgResponseTime: n ? Number((totalResponse / n).toFixed(2)) : 0,
        throughput: n ? Number((n / totalTime).toFixed(2)) : 0,
        resourceUtilization: Number(((busyTime / totalTime) * 100).toFixed(1))
      }
    };
  }

  // 2. SJF (Shortest Job First - Non-Preemptive)
  public static sjf(processes: ProcessInput[]): SchedulingResult {
    const unexecuted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const schedule: ScheduledProcess[] = [];
    const ganttChart: GanttStep[] = [];

    let currentTime = 0;
    let totalWaiting = 0;
    let totalTurnaround = 0;
    let totalResponse = 0;

    while (unexecuted.length > 0) {
      // Find all processes that have arrived by currentTime
      const available = unexecuted.filter(p => p.arrivalTime <= currentTime);

      if (available.length === 0) {
        // Jump time to next arriving process if CPU is idle
        currentTime = unexecuted[0].arrivalTime;
        continue;
      }

      // Pick the available process with the shortest burst time
      available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);
      const p = available[0];

      // Remove from unexecuted
      const index = unexecuted.findIndex(item => item.processId === p.processId);
      unexecuted.splice(index, 1);

      const startTime = currentTime;
      const completionTime = startTime + p.burstTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = startTime - p.arrivalTime;
      const responseTime = waitingTime;

      schedule.push({
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime
      });

      ganttChart.push({
        processId: p.processId,
        start: startTime,
        end: completionTime
      });

      totalWaiting += waitingTime;
      totalTurnaround += turnaroundTime;
      totalResponse += responseTime;
      currentTime = completionTime;
    }

    const n = processes.length;
    const totalTime = currentTime > 0 ? currentTime : 1;
    const busyTime = ganttChart.reduce((acc, step) => acc + (step.end - step.start), 0);

    return {
      algorithmName: 'SJF',
      schedule,
      ganttChart,
      metrics: {
        avgWaitingTime: n ? Number((totalWaiting / n).toFixed(2)) : 0,
        avgTurnaroundTime: n ? Number((totalTurnaround / n).toFixed(2)) : 0,
        avgResponseTime: n ? Number((totalResponse / n).toFixed(2)) : 0,
        throughput: n ? Number((n / totalTime).toFixed(2)) : 0,
        resourceUtilization: Number(((busyTime / totalTime) * 100).toFixed(1))
      }
    };
  }

  // 3. Priority Scheduling (Non-Preemptive, higher priority number runs first)
  public static priority(processes: ProcessInput[]): SchedulingResult {
    const unexecuted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const schedule: ScheduledProcess[] = [];
    const ganttChart: GanttStep[] = [];

    let currentTime = 0;
    let totalWaiting = 0;
    let totalTurnaround = 0;
    let totalResponse = 0;

    while (unexecuted.length > 0) {
      const available = unexecuted.filter(p => p.arrivalTime <= currentTime);

      if (available.length === 0) {
        currentTime = unexecuted[0].arrivalTime;
        continue;
      }

      // Pick highest priority (largest priority value)
      available.sort((a, b) => b.priority - a.priority || a.arrivalTime - b.arrivalTime);
      const p = available[0];

      const index = unexecuted.findIndex(item => item.processId === p.processId);
      unexecuted.splice(index, 1);

      const startTime = currentTime;
      const completionTime = startTime + p.burstTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = startTime - p.arrivalTime;
      const responseTime = waitingTime;

      schedule.push({
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime
      });

      ganttChart.push({
        processId: p.processId,
        start: startTime,
        end: completionTime
      });

      totalWaiting += waitingTime;
      totalTurnaround += turnaroundTime;
      totalResponse += responseTime;
      currentTime = completionTime;
    }

    const n = processes.length;
    const totalTime = currentTime > 0 ? currentTime : 1;
    const busyTime = ganttChart.reduce((acc, step) => acc + (step.end - step.start), 0);

    return {
      algorithmName: 'Priority',
      schedule,
      ganttChart,
      metrics: {
        avgWaitingTime: n ? Number((totalWaiting / n).toFixed(2)) : 0,
        avgTurnaroundTime: n ? Number((totalTurnaround / n).toFixed(2)) : 0,
        avgResponseTime: n ? Number((totalResponse / n).toFixed(2)) : 0,
        throughput: n ? Number((n / totalTime).toFixed(2)) : 0,
        resourceUtilization: Number(((busyTime / totalTime) * 100).toFixed(1))
      }
    };
  }

  // 4. Round Robin (Preemptive with configurable time quantum)
  public static roundRobin(processes: ProcessInput[], timeQuantum: number = 2): SchedulingResult {
    // Clone processes tracking remaining burst times
    let queueList = processes.map(p => ({
      ...p,
      remainingBurst: p.burstTime,
      firstStartTime: -1,
      completionTime: 0
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);

    const ganttChart: GanttStep[] = [];
    const executionStats: { [id: string]: { firstStartTime: number; completionTime: number; arrivalTime: number; burstTime: number } } = {};
    
    let currentTime = 0;
    const readyQueue: typeof queueList = [];
    let processIndex = 0;

    // Push initially arrived processes
    while (processIndex < queueList.length && queueList[processIndex].arrivalTime <= currentTime) {
      readyQueue.push(queueList[processIndex]);
      processIndex++;
    }

    if (readyQueue.length === 0 && processIndex < queueList.length) {
      currentTime = queueList[processIndex].arrivalTime;
      readyQueue.push(queueList[processIndex]);
      processIndex++;
    }

    while (readyQueue.length > 0 || processIndex < queueList.length) {
      if (readyQueue.length === 0) {
        currentTime = queueList[processIndex].arrivalTime;
        while (processIndex < queueList.length && queueList[processIndex].arrivalTime <= currentTime) {
          readyQueue.push(queueList[processIndex]);
          processIndex++;
        }
      }

      const current = readyQueue.shift()!;

      if (current.firstStartTime === -1) {
        current.firstStartTime = currentTime;
      }

      const execTime = Math.min(current.remainingBurst, timeQuantum);
      const start = currentTime;
      currentTime += execTime;
      current.remainingBurst -= execTime;

      ganttChart.push({
        processId: current.processId,
        start,
        end: currentTime
      });

      // Add newly arrived processes during this time slice to ready queue
      while (processIndex < queueList.length && queueList[processIndex].arrivalTime <= currentTime) {
        readyQueue.push(queueList[processIndex]);
        processIndex++;
      }

      if (current.remainingBurst > 0) {
        readyQueue.push(current); // Requeue incomplete process
      } else {
        current.completionTime = currentTime;
        executionStats[current.processId] = {
          firstStartTime: current.firstStartTime,
          completionTime: current.completionTime,
          arrivalTime: current.arrivalTime,
          burstTime: current.burstTime
        };
      }
    }

    const schedule: ScheduledProcess[] = processes.map(p => {
      const stats = executionStats[p.processId];
      const turnaroundTime = stats.completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.burstTime;
      const responseTime = stats.firstStartTime - p.arrivalTime;

      return {
        ...p,
        startTime: stats.firstStartTime,
        completionTime: stats.completionTime,
        turnaroundTime: Math.max(0, turnaroundTime),
        waitingTime: Math.max(0, waitingTime),
        responseTime: Math.max(0, responseTime)
      };
    });

    const n = processes.length;
    let totalWaiting = schedule.reduce((acc, p) => acc + p.waitingTime, 0);
    let totalTurnaround = schedule.reduce((acc, p) => acc + p.turnaroundTime, 0);
    let totalResponse = schedule.reduce((acc, p) => acc + p.responseTime, 0);
    const totalTime = currentTime > 0 ? currentTime : 1;
    const busyTime = ganttChart.reduce((acc, step) => acc + (step.end - step.start), 0);

    return {
      algorithmName: `Round Robin (Q=${timeQuantum})`,
      schedule,
      ganttChart,
      metrics: {
        avgWaitingTime: n ? Number((totalWaiting / n).toFixed(2)) : 0,
        avgTurnaroundTime: n ? Number((totalTurnaround / n).toFixed(2)) : 0,
        avgResponseTime: n ? Number((totalResponse / n).toFixed(2)) : 0,
        throughput: n ? Number((n / totalTime).toFixed(2)) : 0,
        resourceUtilization: Number(((busyTime / totalTime) * 100).toFixed(1))
      }
    };
  }
}