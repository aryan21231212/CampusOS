export class Queue<T> {
    private items: T[] = [];
  
    // Time Complexity: O(1)
    public enqueue(item: T): void {
      this.items.push(item);
    }
  
    // Time Complexity: O(N) due to shift, can be optimized with head pointer if needed, sufficient for campus workload
    public dequeue(): T | undefined {
      return this.items.shift();
    }
  
    public peek(): T | undefined {
      return this.items[0];
    }
  
    public isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    public size(): number {
      return this.items.length;
    }
  
    public toArray(): T[] {
      return [...this.items];
    }
  }