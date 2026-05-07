import { Router } from 'express';
import { proxyToSqlAuth } from '../controllers/sqlController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Rutas para modulo de solicitudes
// El prefijo será /api/solicitudes
// ... imports
router.post('/guardar/:claveUsrRegistro/:claveEmpleado', /*authMiddleware, */proxyToSqlAuth); // RH crea la solicitud
router.get('/get-pendientes-ti', authMiddleware, proxyToSqlAuth); // TI ve qué hay por validar
router.get('/seguimiento/:id', /*authMiddleware, */proxyToSqlAuth); // Para ver el Timeline/Actividades
router.put('/put-validar-solicitud', authMiddleware, proxyToSqlAuth); // Cuando TI o Gerente aprueban el global
router.put('/put-actualizar-actividad', authMiddleware, proxyToSqlAuth); // Cuando el técnico termina una tarea
router.get('/get-todas', /*authMiddleware,*/ proxyToSqlAuth);

export default router;  