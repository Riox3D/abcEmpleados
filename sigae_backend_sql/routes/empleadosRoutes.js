import { Router } from 'express';
//import { buscarEmpleado } from '../controllers/empleadosController.js';

const router = Router();
import { getCatalogoEmpleados, getEmpleado } from '../controllers/empleadosController.js';

router.get('/getCatalogoEmpleados', getCatalogoEmpleados);
router.get('/getEmpleado/:numEmpleado', getEmpleado);
export default router;