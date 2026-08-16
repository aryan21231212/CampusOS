export interface PriorityItem {
    id: string;
    priority: number; // Higher number = higher priority (or vice versa)
    arrivalTime: number;
    deadline: number;
    waitingTime: number;
    [key: string]: any;
  }
  
  export class PriorityQueue {
    private heap: PriorityItem[] = [];
  
    private getParentIndex(i: number): number {
      return Math.floor((i - 1) / 2);
    }
  
    private getLeftChildIndex(i: number): number {
      return 2 * i + 1;
    }
  
    private getRightChildIndex(i: number): number {
      return 2 * i + 2;
    }
  
    private swap(i1: number, i2: number): void {
      const temp = this.heap[i1];
      this.heap[i1] = this.heap[i2];
      this.heap[i2] = temp;
    }
  
    // Compare function: Higher priority comes first. If priorities are equal, check earlier deadline or arrival time.
    private compare(i: number, j: number): boolean {
      if (this.heap[i].priority !== this.heap[j].priority) {
        return this.heap[i].priority > this.heap[j].priority; // Max priority first
      }
      if (this.heap[i].deadline !== this.heap[j].deadline) {
        return this.heap[i].deadline < this.heap[j].deadline; // Earlier deadline first
      }
      return this.heap[i].arrivalTime < this.heap[j].arrivalTime; // FCFS tie breaker
    }
  
    // Time Complexity: O(log n)
    public enqueue(item: PriorityItem): void {
      this.heap.push(item);
      this.heapifyUp();
    }
  
    private heapifyUp(): void {
      let index = this.heap.length - 1;
      while (index > 0 && this.compare(index, this.getParentIndex(index))) {
        this.swap(index, this.getParentIndex(index));
        index = this.getParentIndex(index);
      }
    }
  
    // Time Complexity: O(log n)
    public dequeue(): PriorityItem | null {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop()!;
  
      const root = this.heap[0];
      this.heap[0] = this.heap.pop()!;
      this.heapifyDown();
      return root;
    }
  
    private heapifyDown(): void {
      let index = 0;
      while (this.getLeftChildIndex(index) < this.heap.length) {
        let smallerChildIndex = this.getLeftChildIndex(index);
        const rightChildIndex = this.getRightChildIndex(index);
  
        if (
          rightChildIndex < this.heap.length &&
          this.compare(rightChildIndex, smallerChildIndex)
        ) {
          smallerChildIndex = rightChildIndex;
        }
  
        if (this.compare(index, smallerChildIndex)) {
          break;
        }
  
        this.swap(index, smallerChildIndex);
        index = smallerChildIndex;
      }
    }
  
    public peek(): PriorityItem | null {
      return this.heap.length > 0 ? this.heap[0] : null;
    }
  
    public size(): number {
      return this.heap.length;
    }
  
    public isEmpty(): boolean {
      return this.heap.length === 0;
    }
  
    public toArray(): PriorityItem[] {
      return [...this.heap];
    }
  }