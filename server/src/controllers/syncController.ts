import { Request, Response } from 'express';
import { AgingScheduler } from '../os/AgingScheduler';
import { SynchronizationManager } from '../os/Synchronization';

export const runAgingSimulation = async (req: Request, res: Response) => {
  try {
    const { processes, agingInterval } = req.body;
    if (!processes || !Array.isArray(processes)) {
      return res.status(400).json({ error: 'Valid processes array required' });
    }

    const result = AgingScheduler.scheduleWithAging(processes, agingInterval || 2);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: 'Aging simulation failed' });
  }
};

export const testMutexLock = async (req: Request, res: Response) => {
  try {
    const { resourceId, processId } = req.body;
    if (!resourceId || !processId) {
      return res.status(400).json({ error: 'resourceId and processId are required' });
    }

    const mutex = SynchronizationManager.getMutex(resourceId);
    const acquired = await mutex.acquire(processId);

    res.status(200).json({
      success: true,
      message: `Mutex acquired successfully by process ${processId} for resource ${resourceId}`,
      locked: mutex.isLocked(),
      waitingQueueLength: mutex.getQueueLength()
    });
  } catch (error) {
    res.status(500).json({ error: 'Mutex lock acquisition failed' });
  }
};

export const releaseMutexLock = async (req: Request, res: Response) => {
  try {
    const { resourceId } = req.body;
    if (!resourceId) {
      return res.status(400).json({ error: 'resourceId is required' });
    }

    const mutex = SynchronizationManager.getMutex(resourceId);
    mutex.release();

    res.status(200).json({
      success: true,
      message: `Mutex released for resource ${resourceId}`,
      locked: mutex.isLocked(),
      waitingQueueLength: mutex.getQueueLength()
    });
  } catch (error) {
    res.status(500).json({ error: 'Mutex release failed' });
  }
};