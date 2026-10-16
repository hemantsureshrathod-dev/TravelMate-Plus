import { Router } from 'express';
import { getDestinations, getDestinationById } from '../controllers/destination.controller.js';

const router = Router();

router.get('/', getDestinations);
router.get('/:id', getDestinationById);

export default router;
