export interface BankersInput {
    available: number[]; // Available quantity of each resource type
    max: number[][];     // Max demand of each process
    allocation: number[][]; // Currently allocated resources to each process
  }
  
  export class BankersAlgorithm {
    // Safety algorithm to check if a request leaves system in a safe state
    public static isSafeState(input: BankersInput): { safe: boolean; safeSequence: string[] } {
      const { available, max, allocation } = input;
      const numProcesses = max.length;
      const numResources = available.length;
  
      const work = [...available];
      const finish = Array(numProcesses).fill(false);
      const safeSequence: string[] = [];
  
      // Calculate Need matrix: Need = Max - Allocation
      const need: number[][] = [];
      for (let i = 0; i < numProcesses; i++) {
        need[i] = [];
        for (let j = 0; j < numResources; j++) {
          need[i][j] = max[i][j] - allocation[i][j];
        }
      }
  
      let count = 0;
      while (count < numProcesses) {
        let found = false;
        for (let p = 0; p < numProcesses; p++) {
          if (!finish[p]) {
            // Check if need <= work for all resources
            let canProceed = true;
            for (let r = 0; r < numResources; r++) {
              if (need[p][r] > work[r]) {
                canProceed = false;
                break;
              }
            }
  
            if (canProceed) {
              // Simulate allocation release
              for (let r = 0; r < numResources; r++) {
                work[r] += allocation[p][r];
              }
              safeSequence.push(`P${p + 1}`);
              finish[p] = true;
              found = true;
              count++;
            }
          }
        }
  
        if (!found) {
          // No process could be allocated safely
          return { safe: false, safeSequence: [] };
        }
      }
  
      return { safe: true, safeSequence };
    }
  }