export interface ProcessInput {
    processId: string;
    resourceId: string;
    quantity: number;
    arrivalTime: number;
    burstTime: number;
    deadline: number;
    priority: number;
  }
  
  export interface ScheduledProcess extends ProcessInput {
    startTime: number;
    completionTime: number;
    turnaroundTime: number;
    waitingTime: number;
    responseTime: number;
  }
  
  export interface GanttStep {
    processId: string;
    start: number;
    end: number;
  }
  
  export interface SchedulingResult {
    algorithmName: string;
    schedule: ScheduledProcess[];
    ganttChart: GanttStep[];
    metrics: {
      avgWaitingTime: number;
      avgTurnaroundTime: number;
      avgResponseTime: number;
      throughput: number;
      resourceUtilization: number;
    };
  }