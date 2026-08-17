export class CampusMutex {
    private locked: boolean = false;
    private queue: Array<() => void> = [];
  
    // Acquire lock (P operation / wait)
    public async acquire(processId: string): Promise<boolean> {
      if (!this.locked) {
        this.locked = true;
        return true;
      }
  
      return new Promise((resolve) => {
        this.queue.push(() => {
          this.locked = true;
          resolve(true);
        });
      });
    }
  
    // Release lock (V operation / signal)
    public release(): void {
      if (this.queue.length > 0) {
        const nextProcessCallback = this.queue.shift();
        if (nextProcessCallback) {
          nextProcessCallback();
        }
      } else {
        this.locked = false;
      }
    }
  
    public isLocked(): boolean {
      return this.locked;
    }
  
    public getQueueLength(): number {
      return this.queue.length;
    }
  }
  
  // Global registry of mutexes for different campus resources
  export class SynchronizationManager {
    private static mutexes: Map<string, CampusMutex> = new Map();
  
    public static getMutex(resourceId: string): CampusMutex {
      if (!this.mutexes.has(resourceId)) {
        this.mutexes.set(resourceId, new CampusMutex());
      }
      return this.mutexes.get(resourceId)!;
    }
  }