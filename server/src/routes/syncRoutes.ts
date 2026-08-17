import { Router } from 'express';
import { runAgingSimulation, testMutexLock, releaseMutexLock } from '../controllers/syncController';

const router = Router();

router.post('/aging', runAgingSimulation);
router.post('/mutex/acquire', testMutexLock);
router.post('/mutex/release', releaseMutexLock);

export default router;