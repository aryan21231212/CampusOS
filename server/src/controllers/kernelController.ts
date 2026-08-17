import { Request, Response } from 'express';
import { DeadlockDetector } from '../os/DeadlockDetector';
import { BankersAlgorithm } from '../os/BankersAlgorithm';

export const checkDeadlock = async (req: Request, res: Response) => {
  try {
    const result = await DeadlockDetector.detectDeadlocks();
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: 'Deadlock detection failed' });
  }
};

export const checkBankersSafety = async (req: Request, res: Response) => {
  try {
    const { available, max, allocation } = req.body;
    if (!available || !max || !allocation) {
      return res.status(400).json({ error: 'Missing available, max, or allocation matrices' });
    }

    const result = BankersAlgorithm.isSafeState({ available, max, allocation });
    res.status(200).json({
      success: true,
      ...result,
      message: result.safe 
        ? `Request Granted — System remains in a safe state. Safe sequence: ${result.safeSequence.join(' → ')}`
        : 'Request Delayed — Granting this request leads to an unsafe state (Potential Deadlock).'
    });
  } catch (error) {
    res.status(500).json({ error: 'Banker algorithm evaluation failed' });
  }
};