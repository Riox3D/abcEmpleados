import { sql, poolPromise } from '../database/sqlConnection.js';
import { catalogosQueries } from '../querys/catalogosQuerys.js';

export const getMovimientos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(catalogosQueries.getMovimientos);
        
        // Enviamos el recordset (el arreglo de datos) directo al Proxy
        res.json(result.recordset);
    } catch (error) {
        console.error("Error en SQL al obtener movimientos:", error.message);
        res.status(500).json({ error: "Error interno al consultar el catálogo" });
    }

};
export const getRbac = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(catalogosQueries.getRbacActivos);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};