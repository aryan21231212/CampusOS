import { Router } from 'express';
import { getResources, createResource } from '../controllers/resourceController.js';

const router = Router();

router.get('/', getResources);
router.post('/', createResource);

export default router;