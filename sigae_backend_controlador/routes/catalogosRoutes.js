import { Router } from 'express';
import { proxyToSql } from '../controllers/sqlController.js';

const router = Router();

// Rutas para llenar catalogos
router.get('/get-movimientos', proxyToSql);
router.get('/get-rbac', proxyToSql);
router.get('/get-responsables', proxyToSql);

export default router;