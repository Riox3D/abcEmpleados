import { sql, poolPromise } from '../database/sqlConnection.js';
import { solicitudesQueries } from '../querys/solicitudesQuerys.js';

export const postGuardarSolicitud = async (req, res) => {
    // 1. Datos que vienen del formulario (Frontend)
    const { 
        idTipoMovimiento, 
        nombreEmpleado, 
        curpEmpleado, 
        idRbac, 
        observaciones, 
        actividades 
    } = req.body;
    
    
    const { claveUsrRegistro, claveEmpleado } = req.params; 

    try {
        const pool = await poolPromise;
        // Iniciamos la transacción
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // PASO A: Insertar la cabecera en la tabla 'Solicitudes'
            const request = new sql.Request(transaction);
            const resultSolicitud = await request
                .input('claveUsrRegistro', sql.NVarChar, claveUsrRegistro)
                .input('idTipoMovimiento', sql.Int, idTipoMovimiento)
                .input('claveEmpleado', sql.NVarChar, claveEmpleado)
                .input('nombreEmpleado', sql.NVarChar, nombreEmpleado)
                .input('curpEmpleado', sql.NVarChar, curpEmpleado)
                .input('idRbac', sql.Int, idRbac)
                .input('observaciones', sql.NVarChar, observaciones)
                .query(solicitudesQueries.insertarSolicitud);

            const idSolicitud = resultSolicitud.recordset[0].idSolicitud;

            if (actividades && actividades.length > 0) {
                for (const act of actividades) {
                    const reqAct = new sql.Request(transaction);
                    await reqAct
                        .input('idSolicitud', sql.BigInt, idSolicitud)
                        .input('idRbac', sql.Int, idRbac)
                        .input('idGrupo', sql.Int, act.idGrupo)
                        .input('idGrupoDetalle', sql.Int, act.idGrupoDetalle)
                        .input('claveEmpleado', sql.NVarChar, claveEmpleado)
                        .input('nombreEmpleado', sql.NVarChar, nombreEmpleado)
                        .input('correoResponsable', sql.NVarChar, act.correoResponsable)
                        .query(solicitudesQueries.insertarActividad);
                }
            }

            await transaction.commit();
            
            res.json({ 
                ok: true, 
                message: 'Registro guardado exitosamente en dbABCEmpleados', 
                idSolicitud 
            });

        } catch (err) {
            // Si hubo error en algún insert, deshacemos todo
            await transaction.rollback();
            throw err;
        }

    } catch (error) {
        console.error("❌ Error en la transacción de SQL:", error.message);
        res.status(500).json({ 
            ok: false, 
            error: "Error interno al procesar la solicitud en la base de datos" 
        });
    }
};

// 1. LISTADO DE SOLICITUDES (Filtrado por Rol)
export const getTodasSolicitudes = async (req, res) => {
    try {
      // 1. Atrapamos lo que manda la ruta (aunque no lo uses aún)[cite: 3]
      const { rol, identificador } = req.params; 
      
      // 2. Tu lógica de SQL que YA FUNCIONABA antes
      const pool = await poolPromise;
      const result = await pool.request().query(querys.getTodasSolicitudes); 
      
      // 3. Enviamos la respuesta
      return res.json(result.recordset);
    } catch (err) {
      console.error("Error en el controlador:", err);
      return res.status(500).json({ error: "Error al obtener solicitudes" });
    }
  };

export const getSeguimientoSolicitud = async (req, res) => {
    try {
        const { idSolicitud } = req.params;
        const pool = await poolPromise;
        
        const resultDetalle = await pool.request()
            .input('idSolicitud', sql.BigInt, idSolicitud)
            .query(solicitudesQueries.getDetalleSolicitud);

        const resultPasos = await pool.request()
            .input('idSolicitud', sql.BigInt, idSolicitud)
            .query(solicitudesQueries.getActividadesSolicitud);

        if (resultDetalle.recordset.length > 0) {
            const respuestaFinal = {
                ...resultDetalle.recordset[0],
                pasos: resultPasos.recordset //mandamos las tareas 
            };
            res.json(respuestaFinal);
        } else {
            res.status(404).json({ ok: false, message: "Folio no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarEstatusSolicitud = async (req, res) => {
    const { idSolicitud } = req.params;
    const { nuevoEstatus, observaciones } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('idSolicitud', sql.BigInt, idSolicitud)
            .input('nuevoEstatus', sql.NVarChar, nuevoEstatus)
            .query(solicitudesQueries.actualizarEstatusSolicitud);

        res.json({ ok: true, message: `Solicitud movida a ${nuevoEstatus}` });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};