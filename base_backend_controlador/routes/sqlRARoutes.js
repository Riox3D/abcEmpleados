import { Router } from 'express'
import { proxyToSql, proxyToSqlAuth,proxyToSqlAuthRol, proxyToSqlNotify,proxyToSqlNotifyEnviar  } from '../controllers/sqlController.js'
import { authMiddleware,roleMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// Captura cualquier ruta /sql/* y la pasa al proxy genérico
router.post('/post-insertPlaneacion', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.get('/get-planeaciones', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuthRol);
router.get('/get-planeacion/:idPlaneacion', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuthRol);
router.post('/post-insertActividad', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSql);
router.put('/put-updateActividad', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.post('/post-insertParticipante', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSql);
router.get('/get-actividades/:idPlaneacion', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.get('/get-participantes/:idPlaneacion', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.delete('/delete-participante/:idParticipante', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.delete('/delete-actividad/:idActividad', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.delete('/delete-actividades/:idPlaneacion', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.post('/post-insertDetalle', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.get('/get-detalles/:idPlaneacion/:idActividad', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.delete('/delete-detalle/:idDetalle', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.put('/put-detalle', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.put('/put-activarPlaneacion/:idPlaneacion', authMiddleware, roleMiddleware(['cp', 'admin']), proxyToSqlNotify);
router.delete('/delete-planeacion/:idPlaneacion', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuth);
router.put('/put-planeacion/:idPlaneacion', authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlAuthRol);
router.put('/put-enviarPlaneacion/:idPlaneacion' , authMiddleware, roleMiddleware(['cp','pm','gerente', 'admin']), proxyToSqlNotifyEnviar);


// Rutas para procesos de Registro de Actividades
router.get('/get-RAPorFecha/:fechaTraer', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.get('/get-DiasDisponiblesParaRa', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.get('/get-DiasDisponiblesParaRaAdelante', authMiddleware, roleMiddleware(['user', 'cp','admin', 'pm','gerente']), proxyToSqlAuth);

router.get('/get-getRegistrosAnteriores', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.put('/put-cerrarPlaneacion/:idPlaneacion', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.get('/get-getProyectosDisponiblesParaRa', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.get('/get-getActividadesDisponiblesParaRa/:claveProyecto', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.get('/get-getActividadElegidaParaRa/:claveProyecto/:claveActividad', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.get('/get-getSistemaParametros', proxyToSql);
router.get('/get-getDiasFestivos', proxyToSql);
router.post('/post-insertRegistroActividad', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.put('/putActualizaRegistroActividades',  authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);
router.post('/postmovimientobitacora', authMiddleware, roleMiddleware(['user', 'admin', 'cp','pm','gerente']), proxyToSqlAuth);

export default router