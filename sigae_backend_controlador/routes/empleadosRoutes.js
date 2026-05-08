import express from 'express';
//import { getCatalogoEmpleados } from '../controllers/empleadosController.js';
//import { proxyToSql, proxyToSqlAuth,proxyToSqlAuthRol, proxyToSqlNotify,proxyToSqlNotifyEnviar, proxyToSqlNotifyRechazar  } from '../controllers/sqlController.js'
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

router.get('/buscar/:termino', async (req, res) => {
    try {
        const { termino } = req.params;
        
        const response = await fetch(`http://127.0.0.1:3002/api/empleados/buscar/${termino}`);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: "Error en el servidor SQL" });
        }
        
        const data = await response.json();
        
        aplicarCorsSeguro(req, res);
        res.json(data);
    } catch (error) {
        console.error("❌ Error en el proxy:", error.message);
        res.status(500).json({ error: "Error conectando al SQL" });
    }
});

//router.get('/getCatalogoEmpleados', authMiddleware, proxyToSql);
export default router;