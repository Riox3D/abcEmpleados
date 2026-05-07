import { Router } from 'express';
import { getMovimientos } from '../controllers/catalogosController.js';

const router = Router();

router.get('/get-movimientos', getMovimientos);

export default router;