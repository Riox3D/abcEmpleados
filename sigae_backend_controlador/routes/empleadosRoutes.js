import express from 'express';
import { proxyToSql, proxyToSqlAuth,proxyToSqlAuthRol, proxyToSqlNotify,proxyToSqlNotifyEnviar } from '../controllers/sqlController.js'
import { authMiddleware,roleMiddleware } from '../middleware/authMiddleware.js'


const router = express.Router();

// Función para aplicar los sellos de seguridad correctos
const aplicarCorsSeguro = (req, res) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
};

router.options('/buscar/:termino', (req, res) => {
    aplicarCorsSeguro(req, res);
    res.sendStatus(200);
});

router.get('/getEmpleado/:numEmpleado', /*authMiddleware*/ proxyToSql);

router.get('/getCatalogoEmpleados', /*authMiddleware*/ proxyToSql);
export default router;