import { Request, Response } from 'express';
import { Process } from '../models/Process';

import { resourceManager } from '../os/ResourceManager';
import { io } from '../server';

export const submitRequest = async (req: Request, res: Response) => {
  try {
    const { processId, userId, resourceId, quantity, burstTime, deadline, priority, arrivalTime } = req.body;

    // Check for existing Process ID
    const existing = await Process.findOne({ processId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Process ID already exists' });
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

    // Transition state to READY
    newProcess.currentState = 'READY';
    await newProcess.save();

    // Pass through Resource Manager allocation state machine
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
    res.status(500).json({ success: false, error: 'Failed to submit resource request' });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await Process.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('[Get Requests Error]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch requests' });
  }
};