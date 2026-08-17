import { Resource } from '../models/Resources';
import { Process, IProcess, ProcessState } from '../models/Process';
import { ResourceHashMap } from '../dsa/HashMap';

export interface AllocationResult {
  success: boolean;
  message: string;
  process?: IProcess;
  newState: ProcessState;
}

export class CampusResourceManager {
  private resourceMap: ResourceHashMap<any> = new ResourceHashMap();

  // Load resources into fast HashMap memory for O(1) lookups
  public async syncResourceCache(): Promise<void> {
    const resources = await Resource.find();
    this.resourceMap.clear();
    for (const res of resources) {
      this.resourceMap.put(res.resourceId, res);
    }
  }

  // O(1) resource lookup demonstration
  public getResourceFast(resourceId: string) {
    return this.resourceMap.get(resourceId);
  }

  // Handle incoming process request and execute state transitions
  public async requestResource(processId: string): Promise<AllocationResult> {
    await this.syncResourceCache();

    const processDoc = await Process.findOne({ processId });
    if (!processDoc) {
      return { success: false, message: 'Process not found', newState: 'NEW' };
    }

    const resource = this.resourceMap.get(processDoc.resourceId);
    if (!resource) {
      processDoc.currentState = 'BLOCKED';
      await processDoc.save();
      return { success: false, message: 'Requested resource does not exist in inventory', newState: 'BLOCKED' };
    }

    // Check resource availability
    if (resource.availableQuantity >= processDoc.quantity) {
      // Allocate resources
      resource.availableQuantity -= processDoc.quantity;
      await Resource.updateOne({ resourceId: resource.resourceId }, { availableQuantity: resource.availableQuantity });
      
      // Update cache
      this.resourceMap.put(resource.resourceId, resource);

      // State transition: NEW -> READY -> RUNNING -> TERMINATED
      processDoc.currentState = 'RUNNING';
      processDoc.allocatedResources = processDoc.quantity;
      processDoc.waitingTime = 0; // Immediate allocation
      await processDoc.save();

      return {
        success: true,
        message: `Allocation successful. Resource ${resource.name} assigned to process ${processId}.`,
        process: processDoc,
        newState: 'RUNNING'
      };
    } else {
      // Insufficient resource -> WAITING / BLOCKED state
      processDoc.currentState = 'WAITING';
      await processDoc.save();

      return {
        success: false,
        message: `Insufficient resources available. Process ${processId} placed in WAITING queue.`,
        process: processDoc,
        newState: 'WAITING'
      };
    }
  }

  // Release resource upon process termination
  public async releaseResource(processId: string): Promise<boolean> {
    const processDoc = await Process.findOne({ processId });
    if (!processDoc || processDoc.allocatedResources === 0) return false;

    const resource = await Resource.findOne({ resourceId: processDoc.resourceId });
    if (resource) {
      resource.availableQuantity += processDoc.allocatedResources;
      await resource.save();
    }

    processDoc.currentState = 'TERMINATED';
    processDoc.allocatedResources = 0;
    await processDoc.save();

    return true;
  }
}

export const resourceManager = new CampusResourceManager();