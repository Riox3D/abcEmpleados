import { Router } from 'express';
import { buscarEmpleado } from '../controllers/empleadosController.js';

const router = Router();

// El frontend le pegará a esta ruta
router.get('/buscar/:termino', buscarEmpleado);

export default router;