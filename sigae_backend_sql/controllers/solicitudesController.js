import { sql, poolPromise } from '../database/sqlConnection.js';
import { solicitudesQueries } from '../querys/solicitudesQuerys.js';

export const postGuardarSolicitud = async (req, res) => {
    try {
        const { claveUsrRegistro, idTipoMovimiento, claveEmpleado, nombreEmpleado, curpEmpleado, idRbac, observaciones } = req.body;
        const pool = await poolPromise;
        
        // Iniciamos la transacción (Todo o Nada)
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Insertamos la Solicitud Principal
            const resultSolicitud = await transaction.request()
                .input('claveUsrRegistro', sql.NVarChar, claveUsrRegistro || 'ADM001')
                .input('idTipoMovimiento', sql.Int, idTipoMovimiento)
                .input('claveEmpleado', sql.NVarChar, claveEmpleado)
                .input('nombreEmpleado', sql.NVarChar, nombreEmpleado)
                .input('curpEmpleado', sql.NVarChar, curpEmpleado)
                .input('idRbac', sql.Int, idRbac)
                .input('observaciones', sql.NVarChar, observaciones)
                .query(solicitudesQueries.insertarSolicitud);

            const idNuevaSolicitud = resultSolicitud.recordset[0].idSolicitud;

            if (idRbac) {
                const resultActividades = await transaction.request()
                    .input('idRbac', sql.Int, idRbac)
                    .query(solicitudesQueries.getActividadesPorRbac);

                // Insertamos cada actividad usando query "insertarActividad"
                for (const actividad of resultActividades.recordset) {
                    await transaction.request()
                        .input('idSolicitud', sql.BigInt, idNuevaSolicitud)
                        .input('idRbac', sql.Int, idRbac)
                        .input('idGrupo', sql.Int, actividad.idGrupo)
                        .input('idGrupoDetalle', sql.Int, actividad.idGrupoDetalle)
                        .input('claveEmpleado', sql.NVarChar, claveEmpleado)
                        .input('nombreEmpleado', sql.NVarChar, nombreEmpleado)
                        .input('correoResponsable', sql.NVarChar, actividad.correoResponsable)
                        .query(solicitudesQueries.insertarActividad); // Usamos el nombre exacto de tu archivo
                }
            }

            // 3. Confirmamos los cambios
            await transaction.commit();
            res.status(201).json({ ok: true, idSolicitud: idNuevaSolicitud, message: "Solicitud y tareas generadas" });

        } catch (error) {
            // Si algo falla, deshacemos todo
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error("Error al guardar solicitud:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// 1. LISTADO DE SOLICITUDES (Filtrado por Rol)
export const getTodasSolicitudes = async (req, res) => {
    try {
      const { rol, identificador } = req.query;
      
      console.log(`Buscando solicitudes en SQL para ROL: ${rol} con ID: ${identificador}`);

      const pool = await poolPromise;
      const result = await pool.request()
        .input('rol', sql.NVarChar, rol)
        .input('identificador', sql.NVarChar, identificador)
        .query(solicitudesQueries.getTodasSolicitudes); 

      console.log("Datos encontrados en BD:", result.recordset);

      // Si no hay datos, aseguramos que mande un arreglo vacío []
      const datosFinales = result.recordset || [];
      return res.json(datosFinales);
      
    } catch (err) {
      console.error("Error en SQL:", err);
      return res.status(500).json({ error: "Error interno al consultar SQL" });
    }
};
export const getSeguimientoSolicitud = async (req, res) => {
    try {
        // Imprimimos en la consola de Node para ver EXACTAMENTE qué está llegando
        console.log("Parámetros recibidos en backend_sql:", req.params);

        // EXTRAEMOS CUALQUIERA DE LOS DOS NOMBRES QUE ESTÉ EN EL ROUTER
        const folio = req.params.id || req.params.idSolicitud;

        // Si el folio llega vacío, detenemos todo antes de ir a SQL
        if (!folio) {
            return res.status(400).json({ ok: false, message: "No se recibió ningún número de folio en la URL" });
        }

        const pool = await poolPromise;
        
        const resultDetalle = await pool.request()
            .input('idSolicitud', sql.BigInt, folio) // Usamos 'folio'
            .query(solicitudesQueries.getDetalleSolicitud);

        const resultPasos = await pool.request()
            .input('idSolicitud', sql.BigInt, folio) // Usamos 'folio'
            .query(solicitudesQueries.getActividadesSolicitud);

        if (resultDetalle.recordset.length > 0) {
            const respuestaFinal = {
                ...resultDetalle.recordset[0],
                pasos: resultPasos.recordset 
            };
            res.json(respuestaFinal);
        } else {
            res.status(404).json({ ok: false, message: `Folio ${folio} no encontrado en SQL` });
        }
    } catch (error) {
        console.error("Error en getSeguimiento:", error.message);
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