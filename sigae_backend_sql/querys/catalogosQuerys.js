export const catalogosQueries = {
    getMovimientos: `
        SELECT idTipoMovimiento, descripcion 
        FROM c_movimientos
        -- WHERE estatus = 1 (Descomenta esto si tienes una columna de estatus activo)
    `
};