import { api } from "src/boot/axios";

export default {
  // Correcion aqui soluciona....
  /**
   * Todos los empleados de planeaciones
   */
  getEmployeesByPlan() {
    return api.get("/baan/get-empleadosPL");
  },

  /**
   * !
   *! Es para el RA (Registro de Actividades)
   */
  getProyectosRA() {
    return api.get("/baan/get-proyectosRA");
  },

  // ========================== PLANEACIONES ==========================

  /**
   * Obtiene todas las planeaciones registradas por el usuario que ingresó.
   *
   * @returns {Promise<Array<{
   *   idPlaneacion: number,
   *   claveProyecto string,
   *   nombreProyecto: string,
   *   gerenteProyecto: string,
   *   adminProyecto: string,
   *   fechaInicio: string,   // formato ISO
   *   fechaFin: string       // formato ISO
   *   estatus bit,
   * }>>}
   */
  getPlaneaciones() {
    return api.get("/ra/get-planeaciones");
  },
  /**
   * Obtiene el detalle de una planeación específica.
   *
   * @param {number} idPlaneacion - ID de la planeación a consultar.
   * @returns {Promise<{
   *   idPlaneacion: number,
   *   estatus: bit,
   *   fechaRegistro: string,   // formato ISO
   *   usuarioRegistroID: number,  // se hace en back ignorar
   *   numEmpUsuarioRegistro: string // se hace en back ignorar
   *   idProyecto: string,
   *   nombreProyecto: string,
   *   presupuesto: number,
   *   adminProyecto: string,
   *   gerenteProyecto: string,
   *   numEmpAdminProyecto: string,
   *   numEmpGerenteProyecto: string,
   *   fechaInicio: string,     // formato ISO
   *   fechaFin: string,        // formato ISO
   *   presupuestoHoraIngenieria: number,
   *   gastoActual: number,
   *   presupuestoDisponible: number,
   *   presupuestoAsignado: number,
   *   porcentajeAvance number,
   *   porcentajeNotificaciones: number|null,
   *
   *
   *
   * }>}
   */
  getPlaneacion(idPlaneacion) {
    return api.get("/ra/get-planeacion/" + idPlaneacion);
  },

  // ========================== PROYECTOS ==========================

  /**
   * Obtiene el catálogo de proyectos disponibles en BAAN.
   *
   * @returns {Promise<{
   *   cacheProyectos: Array<{
   *     CLAVEPROY: string,
   *     NOMBREPROY: string
   *   }>
   * }>}
   */
  getProyectos() {
    return api.get("/baan/get-proyectos");
  },
  /**
   * Obtiene el detalle de un proyecto específico en BAAN.
   *
   * @param {string} claveProy - Clave del proyecto (CLAVEPROY).
   * @returns {Promise<{
   *   proyecto: Array<{
   *     CLAVEPROY: string,
   *     NOMBREPROY: string,
   *     AREA: string,
   *     CLAVEGTEPROY: string,
   *     CLAVEPMPROY: string,
   *     FECHAINICIOPROY: string,   // formato ISO
   *     FECHAFINPROY: string,      // formato ISO
   *     PRESUPHIPROY: number,
   *     TIPO: string
   *   }>
   * }>}
   */
  getProyecto(claveProy) {
    return api.get("/baan/get-proyecto/" + claveProy);
  },

  /**
   * Inserta una nueva planeación.(detalles generales tab general)
   *
   * Endpoint esperado: POST /planeacion/post-insertPlaneacion
   *
   * El body debe contener los campos correspondientes a la tabla Planeacion:
   *
   * @param {Object} body - Datos de la planeación.
   * @param {boolean} [body.estatus=true] - Estatus de la planeación.
   * @param {string} body.idProyecto - ID del proyecto.
   * @param {string} body.nombreProyecto - Nombre del proyecto.
   * @param {number} [body.presupuesto=0] - Presupuesto total del proyecto.
   * @param {string} [body.adminProyecto] - Nombre del administrador del proyecto.
   * @param {string} [body.gerenteProyecto] - Nombre del gerente del proyecto.
   * @param {string} [body.numEmpAdminProyecto] - Número de empleado del administrador.
   * @param {string} [body.numEmpGerenteProyecto] - Número de empleado del gerente.
   * @param {string} body.fechaInicio - Fecha de inicio del proyecto (YYYY-MM-DD).
   * @param {string} body.fechaFin - Fecha de fin del proyecto (YYYY-MM-DD).
   * @param {number} [body.presupuestoHoraIngenieria=0] - Presupuesto destinado a horas de ingeniería.
   * @param {number} [body.gastoActual=0] - Gasto actual registrado.
   * @param {number} [body.presupuestoAsignado=0] - Presupuesto asignado.
   *
   * @returns {Promise<{
   *   idPlaneacion: number,
   *   estatus: boolean,
   *   fechaRegistro: string,
   *   idProyecto: string,
   *   nombreProyecto: string,
   *   adminProyecto: string|null,
   *   gerenteProyecto: string|null,
   *   numEmpAdminProyecto: string|null,
   *   numEmpGerenteProyecto: string|null,
   *   fechaInicio: string,
   *   fechaFin: string,
   *   presupuestoHoraIngenieria: number,
   *   gastoActual: number,
   *   presupuestoAsignado: number,
   *   presupuestoDisponible: number,
   *   porcentajeAvance: number
   * }>}
   */
  postinsertPlaneacion(body) {
    return api.post("/ra/post-insertPlaneacion", body);
  },
  /**
   *Actualiza el campo validaDisponible.
   *
   *
   * @param {number} idPlaneacion - ID de la planeacion .
   * @param {Object} body - Datos.
   * @param {number} body.validaDisponible - ID de la planeación asociada.
   * @returns {Promise<{idPlaneacion: number, success: true }>} - Confirma que se realizó la baja lógica.
   */

  putPlaneacion(idPlaneacion, body) {
    return api.put("/ra/put-planeacion/" + idPlaneacion, body);
  },
/**
 * 
 * @param {*} idPlaneacion 
 * @returns :200 success, correo enviado succesCorreo:true 
 */
  putActivarPlaneacion(idPlaneacion) {
    return api.put("/ra/put-activarPlaneacion/" + idPlaneacion);
  },
  deletePlaneacion(idPlaneacion) {
    return api.delete("/ra/delete-planeacion/" + idPlaneacion);
  },
  putCerrarPlaneacion(idPlaneacion) {
    return api.put("/ra/put-cerrarPlaneacion/" + idPlaneacion);
  },
  /**
   *
   * @param {*} idPlaneacion
   * @returns 200 success, correo enviado succesCorreo:true 
   */
  putEnviarPlaneacion(idPlaneacion) {
    return api.put("/ra/put-enviarPlaneacion/" + idPlaneacion);
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
   *   estatus: boolean
   * }>}
   */
  postInsertActividad(body) {
    return api.post("/ra/post-insertActividad", body);
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
   * @param {number} body.numEmp - Número de empleado.
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
    return api.post("/ra/post-insertParticipante", body);
  },

  /**
   * Obtiene todas las actividades de una planeación específica.
   *
   * Endpoint esperado: GET /planeacion/get-actividades/:idPlaneacion
   *
   * @param {number} idPlaneacion - ID de la planeación de la cual se quieren obtener las actividades.
   *
   * @returns {Promise<Array<{
   *   idActividad: number,
   *   idPlaneacion: number,
   *   claveAct: string,
   *   nombreActividad: string,
   *   fechaInicio: string,  // formato ISO YYYY-MM-DD
   *   fechaFin: string,     // formato ISO YYYY-MM-DD
   *   estatus: boolean
   * }>>}
   */
  getActividades(idPlaneacion) {
    return api.get(`/ra/get-actividades/${idPlaneacion}`);
  },

  /**
   * Obtiene todos los participantes de una planeación específica.
   *
   * Endpoint esperado: GET /planeacion/get-participantes/:idPlaneacion
   *
   * @param {number} idPlaneacion - ID de la planeación de la cual se quieren obtener los participantes.
   *
   * @returns {Promise<Array<{
   *   idParticipante: number,
   *   idPlaneacion: number,
   *   numEmpleado: number,
   *   costoInstitucional: number,
   *   tipoEmpleado: string|null,
   *   claveDiereccion: string|null,
   *   nombreEmpleado: string|null,
   *   estatus: boolean
   * }>>}
   */
  getParticipantes(idPlaneacion) {
    return api.get(`/ra/get-participantes/${idPlaneacion}`);
  },

  /**
   * Elimina (baja lógica) una actividad.
   *
   *
   * @param {number} idActividad - ID de la actividad eliminar.
   *
   * @returns {Promise<{idActividad: number }>} - Confirma que se realizó la baja lógica.
   */

  deleteActividad(idActividad) {
    return api.delete("/ra/delete-actividad/" + idActividad);
  },

  /**
   * Elimina todas las actividades de una plenacio.
   *
   *
   * @param {number} idPlaneacion - ID de la planeacion .
   *
   * @returns {Promise<{idPlaneacion: number }>} - Confirma que se realizó la baja lógica.
   */

  deleteActividades(idPlaneacion) {
    return api.delete("/ra/delete-actividades/" + idPlaneacion);
  },
  /**
   * Actualiza una actividad existente.
   *
   * @param {Object} body - Datos de la actividad a actualizar.
   * @param {number} body.idActividad - ID de la actividad a actualizar.
   * @param {string} body.nombreActividad - Nombre de la actividad.
   * @param {string} body.fechaInicio - Fecha de inicio de la actividad (YYYY-MM-DD).
   * @param {string} body.fechaFin - Fecha de fin de la actividad (YYYY-MM-DD).
   * @returns {Promise<{idActividad: number, success: true}>} - Confirma que se actualizó la actividad.
   */
  putUpdateActividad(body) {
    return api.put("/ra/put-updateActividad", body);
  },

  /**
   * Inserta un nuevo detalle (asigna participante a actividad dentro de una planeación).
   *
   * Endpoint esperado: POST /ra/post-insertDetalle
   *
   * El body debe contener los campos correspondientes a la tabla PlaneacionDetalle:
   *
   * @param {Object} body - Datos del detalle.
   * @param {number} body.idPlaneacion - ID de la planeación asociada.
   * @param {number} body.idActividad - ID de la actividad asociada.
   * @param {number} body.idParticipante - ID del participante.
   * @param {number} body.horasAsignadas - Horas asignadas al participante.
   * @param {number} body.horasDisponibles - Horas disponibles del participante.
   * @param {number} body.horasRealizadas - Horas que ya realizó el participante.
   *
   * @returns {Promise<{ success: boolean,idDetalle: number }>} - Devuelve el ID del detalle insertado.
   */
  postInsertDetalle(body) {
    return api.post("/ra/post-insertDetalle", body);
  },
  /**
 * Obtiene todos los detalles de una planeación.
 *
 * Endpoint esperado: GET /ra/get-detalles/:idPlaneacion
 *
 * @param {number} idActividad
 * @param {number} idPlaneacion - ID de la planeación.

 * @returns {Promise<Array<{
 *   idDetalle: number,
 *   idPlaneacion: number,
 *   idActividad: number,
 *   idParticipante: number,
 *   horasAsignadas: number,
 *   horasDisponibles: number,
 *   horasRealizadas: number
 * }>>} - Lista de detalles con información de actividad y participante.
 */
  getDetalles(idPlaneacion, idActividad) {
    return api.get("/ra/get-detalles/" + idPlaneacion + "/" + idActividad);
  },

  putActualizarDetalle(body) {
    console.log("body Recibido: ", body);
    return api.put("/ra/put-detalle", body);
  },
  /**
   *
   * @param {*} idDetalle
   * @returns
   */
  deleteDetalle(idDetalle) {
    return api.delete("/ra/delete-detalle/" + idDetalle);
  },
};
