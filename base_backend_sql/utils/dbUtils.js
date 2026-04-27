import { poolPromise } from '../database/sqlConnection.js';

export const executeQuery = async (res, query, params = {}) => {
    try {
      const pool = await poolPromise;
      const request = pool.request();
  
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value ?? null);
      });
  
      const result = await request.query(query);
      res.json(result.recordset);
  
    } catch (err) {
      console.error("SQL Error:", err);
  
      // Detectar errores por código
      if (err.number === 2627) { // Unique constraint violation
        return res.status(409).json({ error: "Registro duplicado." });
      }
      if (err.number === 547) { // Foreign key violation
        return res.status(400).json({ error: "Violación de llave foránea. Verifica las referencias." });
      }
      if (err.number === 515) { // Cannot insert NULL into column
        return res.status(400).json({ error: "Campos requeridos no pueden ser nulos." });
      }
  
      res.status(500).json({ error: "Error en la operación de base de datos." });
    }
  };
  

  export const executeMutation = async (res, query, params = {}) => {
    try {
      const pool = await poolPromise;
      const request = pool.request();
  
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value ?? null);
      });
  
      const result = await request.query(query);

      // ⬇️ Aquí está la clave: si no se afectó nada
      if (result.rowsAffected[0] === 0 || result.recordset.length === 0) {
        return res.status(204).send(); // No Content
      }
  
      // Si sí hubo cambios, devolver lo que insertaste/actualizaste
      return res.status(200).json(result.recordset[0]);
  
    } catch (err) {
      console.error("SQL Error:", err);
      res.status(500).json({ error: "Error en la operación de base de datos." });
    }
  };
  
  