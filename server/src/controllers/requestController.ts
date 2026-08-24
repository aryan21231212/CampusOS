import { Request, Response } from 'express';
import { Process } from '../models/Process';
import { resourceManager } from '../os/ResourceManager';
import { io } from '../server';

export const submitRequest = async (req: Request, res: Response) => {
  try {
    const { processId, userId, resourceId, quantity, burstTime, deadline, priority, arrivalTime } = req.body;

    const existing = await Process.findOne({ processId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Process ID already exists' });
    }

    const duration = burstTime || 5;

    const newProcess = new Process({
      processId,
      userId,
      resourceId,
      quantity,
      burstTime: duration,
      deadline: deadline || 50,
      priority: priority || 1,
      arrivalTime: arrivalTime || 0,
      currentState: 'NEW',
      maxRequirement: quantity
    });

    await newProcess.save();

    newProcess.currentState = 'READY';
    await newProcess.save();

    const allocationResult = await resourceManager.requestResource(processId);
    const finalState = allocationResult.newState || 'RUNNING';

    io.emit('processStateUpdate', {
      processId,
      state: finalState,
      message: allocationResult.message || `Resource ${resourceId} allocated to ${processId}.`
    });

    // Auto-termination timer
    if (finalState === 'RUNNING') {
      setTimeout(async () => {
        try {
          await resourceManager.releaseResource(processId);
          await Process.findOneAndUpdate({ processId }, { currentState: 'TERMINATED' });

          io.emit('processStateUpdate', {
            processId,
            state: 'TERMINATED',
            message: `Execution complete after ${duration}s. Resource ${resourceId} released back to pool.`
          });
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