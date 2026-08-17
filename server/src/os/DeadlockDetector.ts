import { ResourceGraph } from '../dsa/Graph';
import { Process } from '../models/Process';

export class DeadlockDetector {
  // Build a Resource Allocation Graph and check for cycles
  public static async detectDeadlocks(): Promise<{ detected: boolean; path: string[]; message: string }> {
    const graph = new ResourceGraph();

    // Fetch active processes holding or waiting for resources
    const activeProcesses = await Process.find({
      currentState: { $in: ['RUNNING', 'WAITING', 'BLOCKED'] }
    });

    // Construct edges: Process -> Resource (requests) and Resource -> Process (allocated)
    // For simulation, we map process dependencies from their requested/allocated states
    for (const p of activeProcesses) {
      if (p.currentState === 'WAITING' || p.currentState === 'BLOCKED') {
        // Process is waiting for resource
        graph.addEdge(p.processId, p.resourceId);
      } else if (p.currentState === 'RUNNING' && p.allocatedResources > 0) {
        // Resource is allocated to process (Resource -> Process)
        graph.addEdge(p.resourceId, p.processId);
      }
    }

    const cycleResult = graph.hasCycle();

    if (cycleResult.detected) {
      return {
        detected: true,
        path: cycleResult.path,
        message: `DEADLOCK DETECTED! Circular dependency found: ${cycleResult.path.join(' → ')}`
      };
    }

    return {
      detected: false,
      path: [],
      message: 'System is deadlock-free. No cycles detected in Resource Allocation Graph.'
    };
  }
}