import express from 'express';
const router = express.Router();
import * as solicitudesController from '../controllers/solicitudesController.js';

// 1. CREAR SOLICITUD (RH)
router.post('/guardar/:claveUsrRegistro/:claveEmpleado', solicitudesController.postGuardarSolicitud);

// 2. LISTADO SEGMENTADO POR ROL
router.get('/get-todas', solicitudesController.getTodasSolicitudes);

// 3. DETALLE DE SEGUIMIENTO
router.get('/seguimiento/:idSolicitud', solicitudesController.getSeguimientoSolicitud);

// 4. CAMBIO DE ESTATUS (TI y Gerente)
router.put('/actualizar-estatus/:idSolicitud', solicitudesController.actualizarEstatusSolicitud);

export default router;