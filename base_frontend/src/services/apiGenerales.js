import { api } from "src/boot/axios";

export default {
  


/** 
* @param {Object} body - Datos del registro de actividad.
* @param {string} body.fechaRegistro - Fecha en la que se registra la actividad (YYYY-MM-DD).
* @param {string} body.fechaAfectar - Fecha en la que se aplica/afecta el registro (YYYY-MM-DD).
* @param {number} body.costoInstitucionalEmpleado - Costo institucional por hora del empleado.
* @param {string} body.claveProyecto - Clave del proyecto asociado (ej. "000CI0001").
* @param {string} body.claveActividad - Clave de la actividad asociada (ej. "ACT-001").
* @param {number} body.horasRegistrar - Número de horas dedicadas a la actividad.
* @param {string} [body.bitacoraRegistrar] - Descripción o bitácora de la actividad.
* @param {string} body.nombreProyecto - Nombre descriptivo del proyecto.
* @param {string} body.nombreActividad - Nombre descriptivo de la actividad.
*
* @returns {Promise<{
*    clavePerfil, nvarchar(20)
*    movimiento, nvarchar(4000)
*    idPlaneacion, int
*    claveProyecto, nvarchar(6)
* }>}
*/
postMovimientoBitacora(body) {
    return api.post('/ra/postmovimientobitacora', body);
},


};