import { Request, Response } from 'express';
import { Process } from '../models/Process';
import { Resource } from '../models/Resources';
import { resourceManager } from '../os/ResourceManager';
import { io } from '../server';

export const submitRequest = async (req: Request, res: Response) => {
  try {
    const { processId, userId, resourceId, quantity, burstTime, deadline, priority, arrivalTime } = req.body;

    // 1. Check if process already exists
    const existing = await Process.findOne({ processId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Process ID already exists' });
    }

    const duration = burstTime || 5;

    // 2. Create process in NEW state
    const newProcess = new Process({
      processId,
      userId,
      resourceId,
      quantity: quantity || 1,
      burstTime: duration,
      deadline: deadline || 50,
      priority: priority || 1,
      arrivalTime: arrivalTime || 0,
      currentState: 'NEW',
      maxRequirement: quantity || 1
    });

    await newProcess.save();

    // 3. Transition state to READY
    newProcess.currentState = 'READY';
    await newProcess.save();

    // 4. Request resource allocation from OS Resource Manager
    const allocationResult = await resourceManager.requestResource(processId);
    const finalState = allocationResult.newState || 'RUNNING';

    // Broadcast process state update
    io.emit('processStateUpdate', {
      processId,
      state: finalState,
      message: allocationResult.message || `Resource ${resourceId} allocated to process ${processId}.`
    });

    // Sync updated resource inventory with the frontend UI
    const updatedResource = await Resource.findOne({ resourceId });
    if (updatedResource) {
      io.emit('resourceCreated', updatedResource);
    }

    // 5. Auto-Termination Execution Timer (Simulates execution & resource release)
    if (finalState === 'RUNNING') {
      setTimeout(async () => {
        try {
          // Release locked resource back to OS pool
          await resourceManager.releaseResource(processId);

          // Mark process status as TERMINATED in MongoDB Atlas
          await Process.findOneAndUpdate({ processId }, { currentState: 'TERMINATED' });

          // Broadcast state completion to frontend
          io.emit('processStateUpdate', {
            processId,
            state: 'TERMINATED',
            message: `Execution complete after ${duration}s. Resource ${resourceId} released back to pool.`
          });

          // Broadcast restored resource capacity to UI
          const freedResource = await Resource.findOne({ resourceId });
          if (freedResource) {
            io.emit('resourceCreated', freedResource);
          }
        } catch (err) {
          console.error(`[Kernel Execution Error] Failed to terminate ${processId}:`, err);
        }
      }, duration * 1000);
    }

    res.status(201).json({
      success: true,
      process: allocationResult.process || newProcess,
      allocationStatus: allocationResult
    });
  } catch (error) {
    console.error('[Request Error]', error);
    res.status(500).json({ success: false, error: 'Failed to submit resource request' });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await Process.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('[Get Requests Error]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch requests' });
  }
};