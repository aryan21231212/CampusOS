import { Router } from 'express';
import { checkDeadlock, checkBankersSafety } from '../controllers/kernelController';

const router = Router();

router.get('/deadlock', checkDeadlock);
router.post('/bankers', checkBankersSafety);

export default router;