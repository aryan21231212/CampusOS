export class ResourceGraph {
    private adjacencyList: Map<string, Set<string>>;
  
    constructor() {
      this.adjacencyList = new Map<string, Set<string>>();
    }
  
    public addVertex(vertex: string): void {
      if (!this.adjacencyList.has(vertex)) {
        this.adjacencyList.set(vertex, new Set());
      }
    }
  
    public addEdge(source: string, destination: string): void {
      this.addVertex(source);
      this.addVertex(destination);
      this.adjacencyList.get(source)!.add(destination);
    }
  
    // Time Complexity: O(V + E) using DFS
    public hasCycle(): { detected: boolean; path: string[] } {
      const visited = new Set<string>();
      const recursionStack = new Set<string>();
      let cyclePath: string[] = [];
  
      const dfs = (node: string, path: string[]): boolean => {
        visited.add(node);
        recursionStack.add(node);
        path.push(node);
  
        const neighbors = this.adjacencyList.get(node);
        if (neighbors) {
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              if (dfs(neighbor, [...path])) return true;
            } else if (recursionStack.has(neighbor)) {
              // Cycle found! Extract the cycle path
              const cycleStartIndex = path.indexOf(neighbor);
              cyclePath = [...path.slice(cycleStartIndex), neighbor];
              return true;
            }
          }
        }
  
        recursionStack.delete(node);
        return false;
      };
  
      for (const vertex of this.adjacencyList.keys()) {
        if (!visited.has(vertex)) {
          if (dfs(vertex, [])) {
            return { detected: true, path: cyclePath };
          }
        }
      }
  
      return { detected: false, path: [] };
    }
  
    public clear(): void {
      this.adjacencyList.clear();
    }
  }