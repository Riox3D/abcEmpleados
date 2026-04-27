import { api } from "src/boot/axios";

export default {

    /**
   * Obtiene el catálogo de empleados desde BAAN.
   *
   * @returns {Promise<{
   *   cacheProyectos: Array<{
   *     PERNUMEMP: string,
   *     PERNOMCOMPLETO: string,
   *
   *   }>
   * }>}
   */
   getCatEmpleados() {
       return api.get('/baan/get-empleadosPL');
   },




   /**
   * Obtiene el catálogo de empleados desde BAAN.
   * @param {string} numEmpleado - Clave del proyecto (CLAVEPROY).
   * @returns {Promise<{
   *   cacheProyectos: Array<{
   *     PERNUMEMP: string,
   *     PERNOMCOMPLETO: string,
   *     PERUNIDAD: string,
   *     PERDIRECCION: string,
   *     PERGERENCIA: string,
   *     GERENCIABAAN: string, areas gerencia baan
   *     PERCOSTINS: number,
   *     PERTIPOEMP: string,
   *     TIPOEMPBAAN: number,
   *     PERIDJEFE: string,
   *     HUNIFIS: string
   *   }>
   * }>}
   */
   getCatEmpleado(numEmpleado) {
       return api.get('/baan/get-empleadoPL/'+ numEmpleado);
   },

    /**
 * Inserta un nuevo participante en una planeación.
 *
 * Endpoint esperado: POST /ra/post-insertParticipante
 *
 * El body debe contener los campos correspondientes a la tabla PlaneacionParticipantes:
 *
 * @param {Object} body - Datos del participante.
 * @param {number} body.idPlaneacion - ID de la planeación asociada.
 * @param {number} body.numEmpleado - Número de empleado.
 * @param {number} body.costoInstitucional - Costo institucional asignado al participante.
 * @param {string} [body.tipoEmpleado] - Tipo de empleado (ej. "Planta", "Contratado").
 * @param {string} [body.area] - Área del empleado.
 * @param {string} [body.nombre] - Nombre del empleado.
 * @param {boolean} [body.estatus=true] - Estatus del participante.
 *
 * @returns {Promise<{
 *   idParticipante: number,
    *   idPlaneacion: number,
    *   numEmpleado: string,
    *   costoInstitucional: number,
    *   tipoEmpleado: string|null,
    *   nombreArea: string|null,
    *   nombreEmpleado: string|null,
    *   estatus: boolean
    * }>}
    */
    postInsertParticipante(body) {
        return api.post('/ra/post-insertParticipante', body);
    },
    deleteParticipante(idParticipante) {
        return api.delete('/ra/delete-participante/'+ idParticipante);
    },
 

 



}