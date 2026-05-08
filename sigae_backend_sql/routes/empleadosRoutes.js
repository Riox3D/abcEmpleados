import { Router } from 'express';
import { buscarEmpleado } from '../controllers/empleadosController.js';

const router = Router();
import { getCatalogoEmpleados } from '../controllers/empleadosController.js';
// El frontend le pegará a esta ruta
router.get('/buscar/:termino', buscarEmpleado);
router.get('/catalogo', getCatalogoEmpleados);

export default router;