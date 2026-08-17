import { Router } from 'express';
import { runSchedulerSimulation } from '../controllers/schedulerController';

const router = Router();

router.post('/simulate', runSchedulerSimulation);

export default router;