import { Request, Response } from 'express';
import { Process } from '../models/Process';
import { resourceManager } from '../os/ResourceManager';
import { io } from '../server';

export const submitRequest = async (req: Request, res: Response) => {
  try {
    const { processId, userId, resourceId, quantity, burstTime, deadline, priority, arrivalTime } = req.body;

    const existing = await Process.findOne({ processId });
    if (existing) {
      return res.status(400).json({ error: 'Process ID already exists' });
    }

    // Create process in NEW state
    const newProcess = new Process({
      processId,
      userId,
      resourceId,
      quantity,
      burstTime: burstTime || 5,
      deadline: deadline || 50,
      priority: priority || 1,
      arrivalTime: arrivalTime || 0,
      currentState: 'NEW',
      maxRequirement: quantity
    });

    await newProcess.save();

    // Pass through Resource Manager allocation state machine
    newProcess.currentState = 'READY';
    await newProcess.save();

    const allocationResult = await resourceManager.requestResource(processId);

    // Broadcast real-time state update via Socket.io
    io.emit('processStateUpdate', {
      processId,
      state: allocationResult.newState,
      message: allocationResult.message
    });

    res.status(201).json({
      success: true,
      process: allocationResult.process || newProcess,
      allocationStatus: allocationResult
    });
  } catch (error) {
    console.error('[Request Error]', error);
    res.status(500).json({ error: 'Failed to submit resource request' });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await Process.find().populate('userId', 'name email role');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};