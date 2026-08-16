export class ResourceHashMap<T> {
    private map: Map<string, T>;
  
    constructor() {
      this.map = new Map<string, T>();
    }
  
    // Time Complexity: O(1) average
    public put(key: string, value: T): void {
      this.map.set(key, value);
    }
  
    // Time Complexity: O(1) average
    public get(key: string): T | undefined {
      return this.map.get(key);
    }
  
    // Time Complexity: O(1) average
    public remove(key: string): boolean {
      return this.map.delete(key);
    }
  
    // Time Complexity: O(1)
    public has(key: string): boolean {
      return this.map.has(key);
    }
  
    // Time Complexity: O(N) where N is map size
    public values(): T[] {
      return Array.from(this.map.values());
    }
  
    public clear(): void {
      this.map.clear();
    }
  }