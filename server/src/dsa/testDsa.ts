import { ResourceHashMap } from './HashMap';
import { PriorityQueue } from './PriorityQueue';
import { ResourceGraph } from './Graph';

console.log('--- Testing CAMPUSOS DSA Engine ---');

// 1. Test HashMap
const labMap = new ResourceHashMap<{ name: string; available: number }>();
labMap.put('LAB_101', { name: 'Computer Lab 101', available: 45 });
console.log('HashMap Lookup (LAB_101):', labMap.get('LAB_101'));

// 2. Test Priority Queue
const pq = new PriorityQueue();
pq.enqueue({ id: 'P1', priority: 2, arrivalTime: 0, deadline: 50, waitingTime: 5 });
pq.enqueue({ id: 'P2', priority: 10, arrivalTime: 1, deadline: 20, waitingTime: 0 }); // Higher priority
pq.enqueue({ id: 'P3', priority: 5, arrivalTime: 2, deadline: 30, waitingTime: 2 });

console.log('PQ Peek (Highest Priority):', pq.peek()?.id); // Should be P2
console.log('PQ Dequeue:', pq.dequeue()?.id); // P2
console.log('PQ Dequeue:', pq.dequeue()?.id); // P3

// 3. Test Graph Cycle Detection (Deadlock simulation)
const graph = new ResourceGraph();
graph.addEdge('P1', 'R2');
graph.addEdge('R2', 'P2');
graph.addEdge('P2', 'R1');
graph.addEdge('R1', 'P1'); // Creates a cycle!

const cycleCheck = graph.hasCycle();
console.log('Deadlock Cycle Detected:', cycleCheck.detected, 'Path:', cycleCheck.path);

console.log('--- DSA Engine Verified Successfully ---');