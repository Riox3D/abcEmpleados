import { sql, poolPromise } from '../database/sqlConnection.js';
import { solicitudesQueries } from '../querys/solicitudesQuerys.js';

export const postGuardarSolicitud = async (req, res) => {
    try {
        // 1. EXTRAEMOS LOS NUEVOS DATOS DEL BODY
        const { 
            claveUsrRegistro, idTipoMovimiento, claveEmpleado, nombreEmpleado, curpEmpleado, 
            correoEmpleado, sede, direccion, gerencia, issste, claveJefe, jefeInmediato, // <-- NUEVOS CAMPOS
            idRbac, observaciones 
        } = req.body;
        
        const pool = await poolPromise;
        
        // Iniciamos la transacción (Todo o Nada)
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 2. AGREGAMOS LOS INPUTS A LA CONSULTA PRINCIPAL
            const resultSolicitud = await transaction.request()
                .input('claveUsrRegistro', sql.NVarChar, claveUsrRegistro || 'ADM001')
                .input('idTipoMovimiento', sql.Int, idTipoMovimiento)
                .input('claveEmpleado', sql.NVarChar, claveEmpleado)
                .input('nombreEmpleado', sql.NVarChar, nombreEmpleado)
                .input('curpEmpleado', sql.NVarChar, curpEmpleado)
                // --- NUEVOS INPUTS DE HUMAN ---
                .input('correoEmpleado', sql.NVarChar, correoEmpleado || null)
                .input('sede', sql.NVarChar, sede || null)
                .input('direccion', sql.NVarChar, direccion || null)
                .input('gerencia', sql.NVarChar, gerencia || null)
                .input('issste', sql.NVarChar, issste || null)
                .input('claveJefe', sql.NVarChar, claveJefe || null)
                .input('jefeInmediato', sql.NVarChar, jefeInmediato || null)
                // ------------------------------
                .input('idRbac', sql.Int, idRbac)
                .input('observaciones', sql.NVarChar, observaciones)
                .query(solicitudesQueries.insertarSolicitud);

            const idNuevaSolicitud = resultSolicitud.recordset[0].idSolicitud;

            if (idRbac) {
                const resultActividades = await transaction.request()
                    .input('idRbac', sql.Int, idRbac)
                    .query(solicitudesQueries.getActividadesPorRbac);

                // Insertamos cada actividad
                for (const actividad of resultActividades.recordset) {
                    await transaction.request()
                        .input('idSolicitud', sql.BigInt, idNuevaSolicitud)
                        .input('idRbac', sql.Int, idRbac)
                        .input('idGrupo', sql.Int, actividad.idGrupo)
                        .input('idGrupoDetalle', sql.Int, actividad.idGrupoDetalle)
                        .input('claveEmpleado', sql.NVarChar, claveEmpleado)
                        .input('nombreEmpleado', sql.NVarChar, nombreEmpleado)
                        .input('correoResponsable', sql.NVarChar, actividad.correoResponsable)
                        .query(solicitudesQueries.insertarActividad); 
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
        const { idSolicitud } = req.params; 

        const pool = await poolPromise;
        
        // 2. Buscamos la solicitud
        const resultDetalle = await pool.request()
            .input('idSolicitud', sql.BigInt, idSolicitud)
            .query(solicitudesQueries.getDetalleSolicitud);

        // 3. Buscamos las tareas
        const resultPasos = await pool.request()
            .input('idSolicitud', sql.BigInt, idSolicitud)
            .query(solicitudesQueries.getActividadesSolicitud);

        if (resultDetalle.recordset.length > 0) {
            const respuestaFinal = {
                ...resultDetalle.recordset[0],
                pasos: resultPasos.recordset 
            };
            res.json(respuestaFinal);
        } else {
            res.status(404).json({ ok: false, message: `Folio no encontrado` });
        }
    } catch (error) {
        console.error("Error en getSeguimientoSolicitud:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const actualizarEstatusSolicitud = async (req, res) => {
    const { idSolicitud } = req.params;
    const { nuevoEstatus, observaciones } = req.body; // <--- Aquí la recibimos del frontend

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('idSolicitud', sql.BigInt, idSolicitud)
            .input('nuevoEstatus', sql.NVarChar, nuevoEstatus)
            .input('observaciones', sql.NVarChar, observaciones || '') // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!
            .query(solicitudesQueries.actualizarEstatusSolicitud);

        res.json({ ok: true, message: "Estatus actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar estatus:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const putActualizarAvances = async (req, res) => {
    try {
        // Recibimos el paquete de datos que enviaste desde el Frontend
        const { idSolicitud, actividades } = req.body;
        
        if (!actividades || !Array.isArray(actividades)) {
            return res.status(400).json({ error: "No se enviaron actividades válidas" });
        }

        const pool = await poolPromise;
        
        // Usamos una transacción para que, si falla una tarea, no se guarde a medias
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Recorremos el arreglo de actividades y ejecutamos el UPDATE para cada una
            for (const actividad of actividades) {
                await transaction.request()
                    .input('idsolicitudActividad', sql.Int, actividad.idsolicitudActividad)
                    .input('idSolicitud', sql.BigInt, idSolicitud)
                    .input('estatusActividad', sql.NVarChar, actividad.estatusActividad)
                    .input('datoGenerado', sql.NVarChar, actividad.datoGenerado || null)
                    .input('observaciones', sql.NVarChar, actividad.observaciones || null)
                    .query(solicitudesQueries.actualizarAvanceActividad);
            }

            await transaction.commit();
            res.status(200).json({ ok: true, message: "Avances guardados correctamente" });

        } catch (error) {
            await transaction.rollback();
            throw error; // Lo mandamos al catch de afuera
        }

    } catch (error) {
        console.error("Error en putActualizarAvances:", error.message);
        res.status(500).json({ error: "Error interno al actualizar avances" });
    }
};