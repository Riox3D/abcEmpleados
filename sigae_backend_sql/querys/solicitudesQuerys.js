export const solicitudesQueries = {
    // 1. Insertar la solicitud inicial (RH)
    // 1. Insertar la solicitud inicial (RH) con los datos de Human
insertarSolicitud: `
INSERT INTO Solicitudes (
    fechaRegistro, 
    claveUsrRegistro, 
    idTipoMovimiento, 
    claveEmpleado, 
    nombreEmpleado, 
    curpEmpleado, 
    correoEmpleado,
    sede,
    direccion,
    gerencia,
    issste,
    claveJefe,
    jefeInmediato,
    idRbac, 
    observaciones, 
    estatus
)
VALUES (
    GETDATE(), 
    @claveUsrRegistro, 
    @idTipoMovimiento, 
    @claveEmpleado, 
    @nombreEmpleado, 
    @curpEmpleado, 
    @correoEmpleado,
    @sede,
    @direccion,
    @gerencia,
    @issste,
    @claveJefe,
    @jefeInmediato,
    @idRbac, 
    @observaciones, 
    'PendienteValidacionTI' 
);
SELECT SCOPE_IDENTITY() AS idSolicitud;
`,

    // 2. Obtener configuración de actividades según el RBAC seleccionado
    getActividadesPorRbac: `
        SELECT 
            rg.idGrupo, rg.idGrupoDetalle, ra.correoResponsable, gd.descripcion
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

    // 4. Listado para la tabla principal (Resuelve el error 404 y el array vacío)
    getTodasSolicitudes: `
        SELECT 
            s.*, 
            m.descripcion AS movimiento 
        FROM Solicitudes s
        LEFT JOIN c_movimientos m ON s.idTipoMovimiento = m.idTipoMovimiento
        WHERE @rol = 'Admin' 
           OR s.claveEmpleado = @identificador 
           OR s.claveUsrRegistro = @identificador
    `,

    // 5. Detalle profundo de una sola solicitud (Para SeguimientoSolicitud.vue)
    getDetalleSolicitud: `
        SELECT 
            s.*, m.descripcion as movimiento 
        FROM Solicitudes s
        LEFT JOIN c_movimientos m ON s.idTipoMovimiento = m.idTipoMovimiento
        WHERE s.idSolicitud = @idSolicitud
    `,

    // 6. Catálogo para que el Gerente elija el RBAC
    getCatRbac: `
        SELECT idRbac, nombreRbac FROM c_rbac WHERE estatus = 1
    `,

    // 7. Actualizar el estatus del flujo 
    actualizarEstatusSolicitud: `
        UPDATE Solicitudes 
        SET estatus = @nuevoEstatus,
            observaciones = CASE 
                                WHEN @observaciones IS NOT NULL AND @observaciones != '' 
                                THEN @observaciones 
                                ELSE observaciones 
                            END
        WHERE idSolicitud = @idSolicitud

    `,
    // Actualizar el avance de UNA sola actividad
actualizarAvanceActividad: `
UPDATE solicitud_actividades 
SET 
    estatusActividad = @estatusActividad,
    datoGenerado = @datoGenerado,
    observaciones = @observaciones
WHERE 
    idsolicitudActividad = @idsolicitudActividad 
    AND idSolicitud = @idSolicitud;
`,
    // 8. Actividades reales de una solicitud 
   // En solicitudesQuerys.js
getActividadesSolicitud: `
SELECT 
    sa.*, 
    g.descripcionGrupo AS descripcionGrupo, 
    gd.descripcion AS descripcionDetalle,
    ra.nombreEmpleado AS nombreResponsable
FROM solicitud_actividades sa
INNER JOIN c_grupos_detalle gd ON sa.idGrupoDetalle = gd.idGrupoDetalle
INNER JOIN c_grupos g ON sa.idGrupo = g.idGrupo
LEFT JOIN c_responsables_actividad ra ON gd.idResponsable = ra.idResponsable
WHERE sa.idSolicitud = @idSolicitud
`
};