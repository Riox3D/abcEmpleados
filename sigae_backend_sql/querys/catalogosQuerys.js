export const catalogosQueries = {
    getMovimientos: `
        SELECT idTipoMovimiento, descripcion 
        FROM c_movimientos
        -- WHERE estatus = 1 (Descomenta esto si tienes una columna de estatus activo)`
    ,
    getRbacActivos: `
        SELECT idRbac, nombreRbac 
        FROM c_rbac 
        WHERE estatus = 1
    `
    
};