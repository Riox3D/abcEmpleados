import { Router } from 'express';
import { proxyToSqlAuth } from '../controllers/sqlController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Rutas para modulo de solicitudes
// El prefijo será /api/solicitudes
// ... imports
router.post('/guardar/:claveUsrRegistro/:claveEmpleado', /*authMiddleware, */proxyToSqlAuth); // RH crea la solicitud
router.get('/get-pendientes-ti', authMiddleware, proxyToSqlAuth); // TI ve qué hay por validar
router.get('/seguimiento/:idSolicitud', /*authMiddleware, */proxyToSqlAuth); // Para ver el Timeline/Actividades
router.put('/put-validar-solicitud', authMiddleware, proxyToSqlAuth); // Cuando TI o Gerente aprueban el global
router.put('/actualizar-estatus/:idSolicitud', (req, res) => {
    // Reenviamos la petición al puerto 3002 manteniendo el idSolicitud
    proxyToSqlAuth(req, res, `/api/solicitudes/actualizar-estatus/${req.params.idSolicitud}`);
});
router.get('/get-todas', /*authMiddleware,*/ proxyToSqlAuth);
router.put('/actualizar-avances', /*authMiddleware*/proxyToSqlAuth);

export default router;  