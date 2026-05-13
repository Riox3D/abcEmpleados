<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-lg border-b-primary">
      <q-avatar icon="person_add" color="primary" text-color="white" size="lg" shadow-2 />
      <div class="q-ml-md">
        <div class="text-h5 text-weight-bolder text-primary">Alta de Personal</div>
        <div class="text-caption text-grey-7">Registro de nuevo ingreso y asignación de perfiles de acceso</div>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-card class="shadow-2" style="border-radius: 12px; border-left: 5px solid #1976D2">
          <q-card-section>
            <q-select
              v-model="empleadoSeleccionado"
              use-input
              input-debounce="100"
              :options="opcionesEmpleados"
              @update:model-value="actualizarEmpleado"
              @filter="filtrarEmpleados"
              option-label="nombreEmpleado"
              option-value="claveEmpleado"
              label="Busca al empleado (ID o Nombre) *"
              outlined
              clearable
              bg-color="blue-1"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No se encontraron resultados</q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
        </q-card>
      </div>

      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="col-12 row q-col-gutter-lg" v-if="form.claveEmpleado">
          
          <div class="col-12 col-md-5">
            <q-card class="shadow-2" style="border-radius: 12px">
              <q-card-section class="bg-blue-1">
                <div class="text-subtitle2 text-weight-bold text-primary">
                  <q-icon name="badge" class="q-mr-xs"/> Datos de Identidad
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-gutter-y-sm">
                
                <div class="row q-col-gutter-sm">
                  <div class ="col-12">
                <q-input v-model="form.nombreEmpleado" label="Nombre Completo" outlined dense readonly bg-color="grey-1" />
                </div>
                  <div class="col-12">
                    <q-input v-model="form.claveEmpleado" label="Clave de Empleado" outlined dense readonly bg-color="grey-1" />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.curpEmpleado" label="CURP" outlined dense readonly bg-color="grey-1" />
                  </div>
                </div>
                
              </q-card-section>
              
              <q-card-section class="bg-grey-2 q-mt-md">
                <div class="text-caption text-grey-8">
                  <q-icon name="info" color="primary" /> Estos datos se sincronizan automáticamente desde Human.
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-7">
            <q-card class="shadow-2" style="border-radius: 12px">
              <q-card-section class="bg-grey-2">
                <div class="text-subtitle2 text-weight-bold">
                  <q-icon name="business_center" class="q-mr-xs"/> 2. Datos Organizacionales
                </div>
              </q-card-section>
              <q-separator />
              
              <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.sede" label="Sede *" disable outlined dense />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.gerencia" label="Gerencia / Área *" disable outlined dense />
                  </div>
                  
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.jefeInmediato" label="Jefe Inmediato *" disable outlined dense />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.issste" label="Número ISSSTE" disable outlined dense />
                  </div>

                  <div class="col-12">
                    <q-select
                      v-model="form.idRbac"
                      :options="opcionesRbac"
                      option-label="nombreRbac"
                      option-value="idRbac"
                      emit-value
                      map-options
                      label="Perfil de Accesos a Asignar (RBAC) *"
                      outlined
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="admin_panel_settings" color="primary" />
                      </template>
                    </q-select>
                  </div>
                  
                  <div class="col-12">
                    <q-input
                      v-model="form.observaciones"
                      label="Observaciones adicionales"
                      type="textarea"
                      outlined
                      dense
                      rows="3"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right" class="q-pa-md bg-grey-1">
                <q-btn
                  label="Registrar Alta"
                  icon="send"
                  color="primary"
                  unelevated
                  class="q-px-xl text-weight-bold"
                  style="border-radius: 8px"
                  :disable="!form.claveEmpleado || !form.idRbac || !form.gerencia"
                  :loading="cargando"
                  @click="submit"
                />
              </q-card-actions>
            </q-card>
          </div>

        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.border-b-primary {
  border-bottom: 2px solid #1976D2;
  padding-bottom: 15px;
}
.full-height {
  height: 100%;
}
</style>

<script setup>
import { ref, onMounted } from 'vue' // Añadimos watch para detectar la sel ección
//import { empleadosService } from 'src/services/empleadosService' // Importamos el buscador
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import solicitudesService from 'src/services/solicitudesService';

const opcionesRbac = ref([])
const $q = useQuasar()
const cargando = ref(false)
const emit = defineEmits(['submit'])
const empleados = ref([])
const empleadoSeleccionado = ref(null)
const opcionesEmpleados = ref([])

const form = ref({
  idTipoMovimiento: 1, 
  claveEmpleado: '',
  nombreEmpleado: '',
  curpEmpleado: '',
  correoEmpleado: '',
  sede: '',
  direccion: '',
  gerencia: '',
  issste: '',
  claveJefe: '',
  jefeInmediato: '',
  // -------------------------------------------
  idRbac: null, 
  observaciones: ''
})

// 2. Lógica para buscar en "Human"
async function filtrarEmpleados(val, update) {
 
  if (val === "") {
        update(() => {
          opcionesEmpleados.value = [...empleados.value];

          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toUpperCase();
        opcionesEmpleados.value = empleados.value.filter((v) =>
          v.nombreEmpleado.toUpperCase().includes(needle)
        );
      });
}

async function actualizarEmpleado(empleado) {
  // Si el usuario borra la selección en el buscador, limpiamos todo
  if (!empleado) {
    form.value.claveEmpleado = ''
    form.value.nombreEmpleado = ''
    form.value.curpEmpleado = ''
    form.value.gerencia = ''
    form.value.jefeInmediato = ''
    form.value.sede = ''
    form.value.issste = ''
    form.value.idRbac = null
    form.value.observaciones = ''
    // Puedes limpiar los demás si lo deseas
    return
  }

  console.log("Empleado seleccionado:", empleado)
  try {
    // Activamos un pequeño indicador de carga si lo deseas (opcional)
    $q.loading.show({ message: 'Obteniendo datos de Human...' })
       // const response = await solicitudesService.getEmpleado(empleado.claveEmpleado)
    const response = await api.get('/api/empleados/getEmpleado/' + empleado.claveEmpleado)
    console.log("Empleado elegido completo:", response)

    // Extraemos el primer (y único) arreglo de empleado de la respuesta
    const datosDb = response.data?.empleados?.[0]

    if (datosDb) {
      // Asignamos usando los índices de tu consola y .trim() para quitar espacios vacíos
      form.value.claveEmpleado = datosDb[0]?.trim() || ''
      form.value.nombreEmpleado = datosDb[1]?.trim() || ''
      form.value.correoEmpleado = datosDb[2]?.trim() || ''
      form.value.sede = datosDb[4]?.trim() || ''
      form.value.direccion = datosDb[6]?.trim() || ''
      form.value.gerencia = datosDb[8]?.trim() || ''
      form.value.curpEmpleado = datosDb[9]?.trim() || ''
      form.value.issste = datosDb[10]?.trim() || ''
      form.value.claveJefe = datosDb[13]?.trim() || ''
      form.value.jefeInmediato = datosDb[14]?.trim() || ''
    }

  } catch (error) {
    console.error("Error al cargar empleado:", error)
    $q.notify({ color: 'negative', message: 'Error al conectar con Human' })
  } finally {
    $q.loading.hide()
  }
}


/*watch(empleadoSeleccionado, (nuevoEmpleado) => {
  console.log('Datos del empleado recibido:', nuevoEmpleado)
  if (nuevoEmpleado) {
    form.value.claveEmpleado = nuevoEmpleado.id
    form.value.nombreEmpleado = nuevoEmpleado.nombre
    form.value.curpEmpleado = nuevoEmpleado.curp || '' 
  } else {
    // Si borra la selección, limpiamos los campos
    form.value.claveEmpleado = ''
    form.value.nombreEmpleado = ''
    form.value.curpEmpleado = ''
  }
})*/
onMounted(async () => {
  try {
    const response = await api.get('/api/catalogos/rbac')
    opcionesRbac.value = response.data
  } catch (error) {
    console.error("Error al cargar RBAC:", error)
  }
  try {
    const response = await api.get('/api/empleados/getCatalogoEmpleados')
    empleados.value = response.data.empleados.map((empleado) => ({ 
      claveEmpleado: empleado[0],
      nombreEmpleado: empleado[1],
    }))  
    opcionesEmpleados.value = empleados.value
    console.log(opcionesEmpleados.value)
  } catch (error) {
    console.error("Error al cargar RBAC:", error)
  }
}
)
async function submit() {
  if (!form.value.claveEmpleado) {
    $q.notify({ color: 'warning', message: 'Primero selecciona un empleado de Human' })
    return
  }

  try {
    cargando.value = true
    const res = await solicitudesService.enviarAlta(form.value)
    if (res.ok) {
      $q.notify({ color: 'positive', message: 'Registro exitoso. Folio: ' + res.idSolicitud })
      emit('submit', res) 
    }
  } catch (err) {
    console.error('Error capturado:', err)
    $q.notify({ color: 'negative', message: 'Error al conectar con el servidor' })
  } finally {
    cargando.value = false
  }
}
</script>