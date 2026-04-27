import { api } from "src/boot/axios";

export default {
  /**
   * Obtiene las actividades de un proyecto específico en BAAN.
   *
   * @param {string} claveProy - Clave del proyecto (CLAVEPROY).
   * @returns {Promise<{
   *   actvidades: Array<{
   *     CVEPROY: string,
   *     ACTIVIDAD: number,
   *     DESCACTIVIDAD: string,
   *   }>
   * }>}
   */
  getActvidades(claveProy) {
    return api.get("/baan/get-actvidades/" + claveProy);
  },

     /**
* Inserta una nueva actividad en una planeación.
*
* Endpoint esperado: POST /ra/post-insertActividad
*
* El body debe contener los campos correspondientes a la tabla PlaneacionActividades:
*
* @param {Object} body - Datos de la actividad.
* @param {number} body.idPlaneacion - ID de la planeación asociada.
* @param {string} body.claveAct - Clave de la actividad (ej. código único).
* @param {string} body.nombreActividad - Nombre de la actividad.
* @param {string} body.fechaInicio - Fecha de inicio (YYYY-MM-DD).
* @param {string} body.fechaFin - Fecha de fin (YYYY-MM-DD).
* @param {boolean} [body.estatus=true] - Estatus de la actividad.
*
* @returns {Promise<{
*   idActividad: number,
*   idPlaneacion: number,
*   claveAct: string, //hace referencia ACTIVIDAD
*   nombreActividad: string, //hace referencia DESCACTIVIDAD
*   fechaInicio: date, // se selecciona
*   fechaFin: date,  // se selecciona
* }>}
*/
postInsertActividad(body) {
    return api.post('/ra/post-insertActividad', body);
},

deleteActividad(idActividad) {
  return api.delete('/ra/delete-actividad/'+ idActividad);
},






   /**
   * Obtiene las actividades registradas por claveEmpleado en la fecha: fechaRegistro. 
   * @param {nvarchar} claveEmpleado - Clave del empleado
   * @param {date} fechaTraer - Fecha de registro en formato 'YYYY-MM-DD'
   * @returns {Promise<{
   *   actividades: Array<{
   *     idRegistro: bigint,
   *     fechaRegistro: date,
   *     fechaAfectar: date,
   *     claveEmpleado: nvarchar,
   *     costoInstitucionalEmpleado: decimal,
   *     claveProyecto: nvarchar,
   *      nombreProyecto: nvarchar,
   *     claveActividad: nvarchar,
   *    nombreActividad: nvarchar,
   *     horasRegistrar: decimal,
   *     bitacoraRegistrar: nvarchar,
   *     estatus: number,
   *     montoTotalRegistro: decimal,
   *    idPlaneacion: int,
   *    idParticipante:  int,
   *    idActividad:  int
   * 
   *   }>
   *
   * }>}
   */
   getRAPorFecha(fechaTraer) {
       return api.get(`/ra/get-RAPorFecha/${fechaTraer}`);
   },


   /**
   * Obtiene las fechas en las que un usuario puede registrar, incluyendo los dias habilitados extemporaneos. 
   * @param {nvarchar} claveEmpleado - Clave del empleado
   * @returns {Promise<{
   *   dias: Array<{
   *     orden: int,
   *     fechaLaboral: date,
   *     diaSemana: varchar,
   *     fechaFormateado: date,
   *   }>
   *
   * }>}
   */
   getDiasDisponiblesParaRa() {
      return api.get('/ra/get-DiasDisponiblesParaRa' );
   },

     /**
   * Obtiene las fechas en las que un usuario puede registrar hacia adelate, excluyendo fines de semana y dias festivos
   * @param {nvarchar} claveEmpleado - Clave del empleado
   * @returns {Promise<{
   *   dias: Array<{
   *     orden: int,
   *     fechaLaboral: date,
   *     diaSemana: varchar,
   *     fechaFormateado: date,
   *   }>
   *
   * }>}
   */
   getDiasDisponiblesParaRaAdelante() {
      return api.get('/ra/get-DiasDisponiblesParaRaAdelante' );
   },


/**
   * Obtiene las horas registradas por fecha y empleado. utiliza el stored procedure: EXEC [dbo].[sp_calcularNDiasLaborablesAtras] @CVEEMPLEADO = '000501', @TIPORESULTADO = 1;
   * @param {nvarchar} claveEmpleado - Clave del empleado
   * @returns {Promise<{
   *   horas: Array<{
   *   totalHorasPorDia: int
   *   }>
   *
   * }>}
   */
  getRegistrosAnteriores() {
      return api.get('/ra/get-getRegistrosAnteriores' );
   },
   

  /**
   * Obtiene las proyectos disponibles para registrar actividades. Por empleado
   * @param {nvarchar} claveEmpleado - Clave del empleado
   * @returns {Promise<{
   *   proyectos: Array<{
   * idProyecto: nvarchar, 
   * nombreCompleto: nvarchar,
  *
   * }>}
   */
  getProyectosDisponiblesParaRa() {
    return api.get('/ra/get-getProyectosDisponiblesParaRa' );
   },

   /**
   * Obtiene las actividades disponibles para registrar actividades. Por proyecto, empleado
   * @param {nvarchar} claveEmpleado - Clave del empleado
   * @param {nvarchar} claveProyecto - Clave del Proyecto
   * @returns {Promise<{
   *   actividades: Array<{
   *   claveActividad: nvarchar,
   * nombreActividad: nvarchar
   *
   * }>}
   */
  getActividadesDisponiblesParaRa(claveProyecto) {
    return api.get('/ra/get-getActividadesDisponiblesParaRa/'+claveProyecto);
   },



     /**
   * Obtiene los datos de la actividad elegida para registrar actividades. Por proyecto, empleado
   * @param {nvarchar} claveEmpleado - Clave del empleado
   * @param {nvarchar} claveProyecto - Clave del Proyecto
   * @returns {Promise<{
   *   actividad: Array<{
   *   claveActividad: nvarchar,
   * cveEmpleado: nvarchar,
   * estatusPlaneacion: bit,
   * horasAsignadas: int,
   * horasDisponibles: int,
   * horasRealizadas: int,
   * idActividad: int,
   * idParticipante: int,
   * idPlaneacion: int,
   * idProyecto: nvarchar, 
   * nombreActividad: nvarchar,
   * nombreEmpleado: nvarchar,
   * nombreProyecto: nvarchar,
   * validaDisponibles: bit,
   *
   * }>}
   */

  getActividadElegidaParaRa(claveProyecto, claveActividad) {
    return api.get("/ra/get-getActividadElegidaParaRa/"+claveProyecto+"/"+claveActividad);
   },


   /**
   * Obtiene los parametros configurados por sistema
   * @returns {Promise<{
   *   parametros: objetc<{
   *      * 
   * }>}
   */
  getSistemaParametros() {
    return api.get('/ra/get-getSistemaParametros' );
   },


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
*  idRegistro: number,
*  fechaRegistro: string, // YYYY-MM-DD
*  fechaAfectar: string,  // YYYY-MM-DD
*  claveEmpleado: string, // obtenido del contexto/autenticación
*  costoInstitucionalEmpleado: number,
*  claveProyecto: string,
*  claveActividad: string,
*  horasRegistrar: number,
*  bitacoraRegistrar: string,
*  montoTotalRegistro: number, // calculado: costoInstitucionalEmpleado * horasRegistrar
*  nombreProyecto: string,
*  nombreActividad: string,
*  estatusIndirecto: boolean,
*  estatusForaneo: boolean|null
* }>}
*/
postInsertRegistroActividad(body) {
    return api.post('/ra/post-insertRegistroActividad', body);
},


/** 
* @param {Object} body - Datos a modificar en el registro de actividad.
* @param {string} body.claveActividad - Clave de la actividad asociada (ej. "ACT-001").
* @param {number} body.horasRegistrar - Número de horas dedicadas a la actividad.
* @param {string} [body.bitacoraRegistrar] - Descripción o bitácora de la actividad.
* @param {string} body.nombreActividad - Nombre descriptivo de la actividad.
* @param {string} body.estatus - estatus
* @param {string} body.idRegistro - 
*
* @returns {Promise<{
*  idRegistro: number,
*  fechaAfectar: string,  // YYYY-MM-DD
*  claveEmpleado: string, // obtenido del contexto/autenticación
*  claveActividad: string,
*  horasRegistrar: number,
*  bitacoraRegistrar: string,
*  nombreActividad: string,
*  estatus: boolean,
*  
* }>}
*/
putActualizaRegistroActividades(body) {
    return api.put('/ra/putActualizaRegistroActividades', body);
},


  /**
   * Obtiene los dias. festivos activos del año
   * @returns {Promise<{
   *   parametros: objetc<{
   *      * 
   * }>}
   */
  getDiasFestivos() {
    return api.get('/ra/get-getDiasFestivos' );
   },


};


