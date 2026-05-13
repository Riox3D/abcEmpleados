<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-lg border-b-negative">
      <q-avatar icon="person_remove" color="negative" text-color="white" size="lg" shadow-2 />
      <div class="q-ml-md">
        <div class="text-h5 text-weight-bolder text-negative">Formulario de Baja de Personal</div>
        <div class="text-caption text-grey-7">Proceso de revocación de accesos y recuperación de activos</div>
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
              label="1. Busca al empleado (Clave de Empleado o Nombre)"
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
            <q-card class="shadow-2 full-height" style="border-radius: 12px">
              <q-card-section class="bg-grey-2">
                <div class="text-subtitle2 text-weight-bold text-primary">
                  <q-icon name="badge" class="q-mr-xs"/> Información del Perfil
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-gutter-y-sm">
                <div class="row justify-between border-b q-py-xs">
                  <span class="text-grey-7">Nombre Completo:</span>
                  <span class="text-weight-medium">{{ form.nombreEmpleado }}</span>
                </div>
                <div class="row justify-between border-b q-py-xs">
                  <span class="text-grey-7">Clave Empleado:</span>
                  <span class="text-weight-medium text-uppercase">{{ form.claveEmpleado }}</span>
                </div>
                <div class="row justify-between border-b q-py-xs">
                  <span class="text-grey-7">CURP:</span>
                  <span class="text-weight-medium text-uppercase">{{ form.curpEmpleado }}</span>
                </div>
                <div class="row justify-between border-b q-py-xs">
                  <span class="text-grey-7">Gerencia/Área:</span>
                  <span class="text-weight-medium">{{ form.gerencia || 'No especificada' }}</span>
                </div>
                <div class="row justify-between q-py-xs">
                  <span class="text-grey-7">Correo Empleado:</span>
                  <span class="text-weight-medium">{{ form.correoEmpleado || 'No especificada' }}</span>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-7">
            <q-card class="shadow-2" style="border-radius: 12px">
              <q-card-section class="bg-grey-2">
                <div class="text-subtitle2 text-weight-bold text-negative">
                  <q-icon name="settings" class="q-mr-xs"/> 2. Configuración de Tareas de Baja
                </div>
              </q-card-section>
              <q-separator />
              
              <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-select
                      v-model="form.idRbac"
                      :options="opcionesRbac"
                      option-label="nombreRbac"
                      option-value="idRbac"
                      emit-value
                      map-options
                      label="Perfil de Accesos a Revocar *"
                      outlined
                      hint="Selecciona el perfil que tenía asignado para generar la lista de cierre."
                    >
                      <template v-slot:prepend>
                        <q-icon name="admin_panel_settings" color="negative" />
                      </template>
                    </q-select>
                  </div>
                  
                  <div class="col-12">
                    <q-input
                      v-model="form.observaciones"
                      label="Motivos o Comentarios de la Baja (Opcional)"
                      type="textarea"
                      outlined
                      placeholder="Escribe aquí detalles adicionales relevantes para TI..."
                      rows="3"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right" class="q-pa-md bg-grey-1">
                <q-btn
                  label="Procesar Baja Definitiva"
                  icon="delete_forever"
                  color="negative"
                  unelevated
                  class="q-px-xl text-weight-bold"
                  style="border-radius: 8px"
                  :disable="!form.claveEmpleado || !form.idRbac"
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
.border-b-negative {
  border-bottom: 2px solid #c10015;
  padding-bottom: 15px;
}
.border-b {
  border-bottom: 1px solid #e0e0e0;
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
  idTipoMovimiento: 2, 
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
    form.value.correoEmpleado= ''
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