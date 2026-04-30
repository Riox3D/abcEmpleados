export const solicitudesQueries = {
    // --- TUS CONSULTAS ORIGINALES ---
    
    // 1. Insertar la solicitud inicial (RH)
    insertarSolicitud: `
        INSERT INTO Solicitudes (
            fechaRegistro, claveUsrRegistro, idTipoMovimiento, claveEmpleado, 
            nombreEmpleado, curpEmpleado, idRbac, observaciones, estatus
        )
        VALUES (
            GETDATE(), @claveUsrRegistro, @idTipoMovimiento, @claveEmpleado, 
            @nombreEmpleado, @curpEmpleado, @idRbac, @observaciones, 'PendienteValidacionTI' 
        );
        SELECT SCOPE_IDENTITY() AS idSolicitud;
    `,

    // 2. Obtener configuración de actividades según el RBAC seleccionado
    getActividadesPorRbac: `
        SELECT 
            rg.idGrupo, rg.idGrupoDetalle, ra.correoResponsable, gd.descripcionDetalle
        FROM c_rbac_grupos rg
        INNER JOIN c_grupos_detalle gd ON rg.idGrupoDetalle = gd.idGrupoDetalle
        INNER JOIN c_responsables_actividad ra ON gd.idResponsable = ra.idResponsable
        WHERE rg.idRbac = @idRbac AND rg.estatus = 1
    `,

    // 3. Crear una tarea específica en la tabla de actividades
    insertarActividad: `
        INSERT INTO solicitud_actividades (
            idSolicitud, idRbac, idGrupo, idGrupoDetalle, 
            claveEmpleado, nombreEmpleado, correoResponsable, estatusActividad
        )
        VALUES (
            @idSolicitud, @idRbac, @idGrupo, @idGrupoDetalle, 
            @claveEmpleado, @nombreEmpleado, @correoResponsable, 'EnProceso' 
        );
    `,

    // 4. Tu consulta original de seguimiento (Lista por usuario)
    getSeguimiento: `
        SELECT 
            s.idSolicitud, s.fechaRegistro, s.nombreEmpleado, 
            m.descripcion as movimiento, s.estatus 
        FROM Solicitudes s
        INNER JOIN c_movimientos m ON s.idTipoMovimiento = m.idTipoMovimiento
        WHERE s.claveEmpleado = @claveEmpleado OR s.claveUsrRegistro = @claveUsrRegistro
    `,



    // 5. Listados para la Tabla principal segun el ROL
    obtenerTodasRH: `
        SELECT s.*, m.descripcion AS movimiento 
        FROM Solicitudes s
        INNER JOIN c_movimientos m ON s.idTipoMovimiento = m.idTipoMovimiento
    `,
    obtenerPorEstatus: `
        SELECT s.*, m.descripcion AS movimiento 
        FROM Solicitudes s
        INNER JOIN c_movimientos m ON s.idTipoMovimiento = m.idTipoMovimiento
        WHERE s.estatus = @estatus
    `,

    // 6. Detalle profundo de una sola solicitud (Para SeguimientoSolicitud.vue)
    getDetalleSolicitud: `
        SELECT 
            s.*, m.descripcion as movimiento 
        FROM Solicitudes s
        INNER JOIN c_movimientos m ON s.idTipoMovimiento = m.idTipoMovimiento
        WHERE s.idSolicitud = @idSolicitud
    `,

    // 7. Catálogo para que el Gerente elija el RBAC
    getCatRbac: `
        SELECT idRbac, nombreRbac FROM c_rbac WHERE estatus = 1
    `,

    // 8. Actualizar el estatus del flujo (Mueve la solicitud entre TI, Gerencia y Proceso)
    actualizarEstatusSolicitud: `
        UPDATE Solicitudes 
        SET estatus = @nuevoEstatus
        WHERE idSolicitud = @idSolicitud
    `,

    // 9. Actividades reales de una solicitud 
    getActividadesSolicitud: `
        SELECT sa.*, gd.descripcionDetalle as titulo
        FROM solicitud_actividades sa
        INNER JOIN c_grupos_detalle gd ON sa.idGrupoDetalle = gd.idGrupoDetalle
        WHERE sa.idSolicitud = @idSolicitud
    `
};