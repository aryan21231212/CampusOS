import { ProcessInput, ScheduledProcess, GanttStep, SchedulingResult } from './SchedulerTypes';

export interface AgingProcessInput extends ProcessInput {
  agingFactor?: number; // How much priority increases per waiting time unit
}

export class AgingScheduler {
  public static scheduleWithAging(processes: AgingProcessInput[], agingInterval: number = 2): SchedulingResult {
    // Clone processes with tracking fields
    let unexecuted = processes.map(p => ({
      ...p,
      currentPriority: p.priority,
      waitingTimeTracker: 0,
      arrivalTime: p.arrivalTime
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);

    const schedule: ScheduledProcess[] = [];
    const ganttChart: GanttStep[] = [];
    
    let currentTime = 0;
    let totalWaiting = 0;
    let totalTurnaround = 0;
    let totalResponse = 0;

    while (unexecuted.length > 0) {
      // Find arrived processes
      const available = unexecuted.filter(p => p.arrivalTime <= currentTime);

      if (available.length === 0) {
        currentTime = unexecuted[0].arrivalTime;
        continue;
      }

      // Age waiting processes that were NOT chosen
      for (const p of unexecuted) {
        if (p.arrivalTime <= currentTime && p.processId !== available[0].processId) {
          p.waitingTimeTracker += 1;
          if (p.waitingTimeTracker % agingInterval === 0) {
            p.currentPriority += 1; // Boost priority due to aging
          }
        }
      }

      // Pick process with highest current (aged) priority, tie-break by arrival time
      available.sort((a, b) => b.currentPriority - a.currentPriority || a.arrivalTime - b.arrivalTime);
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
        priority: p.currentPriority, // Record aged priority
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
      algorithmName: 'Priority with Aging (Anti-Starvation)',
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