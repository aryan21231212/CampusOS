import { Router } from 'express';
import { submitRequest, getRequests } from '../controllers/requestController';

const router = Router();

router.post('/', submitRequest);
router.get('/', getRequests);

export default router;