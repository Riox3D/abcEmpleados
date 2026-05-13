<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row justify-center relative-position">
      <q-inner-loading :showing="cargando" style="z-index: 10">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>

      <div class="col-12 col-xl-10" v-if="!cargando">
        <q-card class="shadow-3 q-mb-lg" style="border-radius: 12px">
          <q-card-section class="bg-primary text-white row items-center justify-between q-pa-md">
            <div class="row items-center q-gutter-md">
              <q-btn icon="arrow_back" flat round dense color="white" @click="$router.back()" />
              <div>
                <div class="text-h6 text-weight-bold">Seguimiento de Solicitud</div>
                <div class="text-subtitle2" style="opacity: 0.8">
                  Folio: {{ solicitud.idSolicitud }}
                </div>
              </div>
            </div>
            <q-chip :color="colorEstatus" text-color="white" icon="info" class="text-weight-bold">
              {{ solicitud.estatus }}
            </q-chip>
          </q-card-section>
        </q-card>

        <div class="q-mb-lg">
          <q-card
            v-if="solicitud.estatus === 'PendienteValidacionTI'"
            class="bg-orange-1 border-orange shadow-2 q-pa-md"
          >
            <div class="text-h6 text-orange-9 q-mb-sm row items-center">
              <q-icon name="security" class="q-mr-sm" /> Validación de Factibilidad Técnica (TI)
            </div>
            <q-input
              v-model="observacionesTI"
              type="textarea"
              label="Observaciones de TI"
              outlined
              bg-color="white"
              rows="2"
              class="q-mb-md"
            />
            <div class="row q-gutter-sm">
              <q-btn
                label="Aprobar Factibilidad"
                color="positive"
                icon="check"
                @click="validarSolicitud('aprobado_ti')"
              />
              <q-btn label="Rechazar" color="negative" flat icon="close" />
            </div>
          </q-card>

          <q-card
            v-if="solicitud.estatus === 'ValidacionGerencial'"
            class="bg-blue-1 border-blue shadow-2 q-pa-md"
          >
            <div class="text-h6 text-blue-9 q-mb-sm row items-center">
              <q-icon name="admin_panel_settings" class="q-mr-sm" /> Aprobación Gerencial
            </div>
            <div class="row q-col-gutter-md q-mb-md">

              <div class="col-12 col-md-6">
                <q-input
                  v-model="observacionesGerente"
                  type="textarea"
                  label="Observaciones Gerenciales"
                  outlined
                  bg-color="white"
                  rows="2"
                />
              </div>
            </div>
            <div class="row q-gutter-sm">
              <q-btn
                label="Aprobar y Configurar"
                color="primary"
                icon="save"
                @click="validarSolicitud('aprobado_gerente')"
              />
              <q-btn label="Rechazar" color="negative" flat icon="close" />
            </div>
          </q-card>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <q-card class="shadow-3" style="border-radius: 12px">
              <q-card-section class="bg-grey-2 text-weight-bold text-primary">
                <q-icon name="person" size="sm" class="q-mr-xs" /> Datos del Empleado (Human)
              </q-card-section>
              <q-list separator>
                <q-item>
  <q-item-section>
    <q-item-label caption>Nombre del Empleado</q-item-label>
    <q-item-label class="text-weight-bold text-subtitle1 text-primary">
      {{ solicitud.nombreEmpleado || 'No disponible' }}
    </q-item-label>
  </q-item-section>
</q-item>
<q-item>
<q-item-section>
    <q-item-label caption>CURP</q-item-label>
    <q-item-label>{{ solicitud.curpEmpleado || 'No disponible' }}</q-item-label>
  </q-item-section>
</q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Gerencia / Dirección</q-item-label>
                    <q-item-label class="text-weight-bold">{{ solicitud.gerencia }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Jefe Inmediato</q-item-label>
                    <q-item-label>{{ solicitud.jefeInmediato }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>NSS / ISSSTE</q-item-label>
                    <q-item-label>{{ solicitud.issste }}</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
            </q-card>

          
          </div>

          <div class="col-12 col-md-8">
              <q-card class="shadow-3" style="border-radius: 12px">
                <q-card-section>
                  <div class="text-h6 text-primary q-mb-md">Línea de Tiempo de Tareas</div>
                  
                  <q-banner v-if="solicitud.estatus === 'PendienteValidacionTI' || solicitud.estatus === 'ValidacionGerencial'" class="bg-blue-grey-1 text-blue-grey-9 q-mb-md rounded-borders">
                    <template v-slot:avatar>
                      <q-icon name="lock" size="md" color="blue-grey-7" />
                    </template>
                    <strong>Tareas en espera:</strong> Las actividades correspondientes a este perfil están bloqueadas temporalmente. Se mostrarán en esta sección una vez que TI y Gerencia aprueben la solicitud.
                  </q-banner>

                  <q-timeline v-if="solicitud.estatus === 'EnProceso' || solicitud.estatus === 'En proceso' || solicitud.estatus === 'En Proceso' || solicitud.estatus === 'Completada'" color="secondary">
                    <q-timeline-entry
                      v-for="grupo in pasosAgrupados"
                      :key="grupo.idGrupo"
                      :color="grupo.tareas.every(t => t.estatusActividad === 'Completado') ? 'positive' : 'warning'"
                      :icon="grupo.tareas.every(t => t.estatusActividad === 'Completado') ? 'check_circle' : 'pending_actions'"
                    >
                      <template v-slot:title>
                        <div class="text-h6 text-weight-bold text-primary q-mb-xs">{{ grupo.descripcionGrupo }}</div>
                      </template>

                      <div class="q-ml-sm q-pb-sm">
                        <ul class="text-grey-9 q-pl-md q-mt-none q-mb-md" style="font-size: 0.95rem;">
                          <li v-for="tarea in grupo.tareas" :key="tarea.idsolicitudActividad" class="q-mb-sm">
  <div class="row items-center">
    <span class="text-weight-medium">{{ tarea.descripcionDetalle }}</span>

    <q-badge outline color="blue-grey-4" class="q-ml-sm text-caption" size="sm">
      <q-icon name="person" size="10px" class="q-mr-xs" />
      {{ tarea.nombreResponsable || 'Sin asignar' }}
    </q-badge>

    <q-badge v-if="tarea.estatusActividad === 'Completado'" color="positive" class="q-ml-xs" label="✓" />
  </div>

  <div v-if="tarea.datoGenerado" class="text-blue-8 q-ml-md text-caption text-italic">
    Dato: {{ tarea.datoGenerado }}
  </div>
</li>
                        </ul> 

                        <q-btn
                          v-if="['EnProceso', 'En proceso', 'En Proceso'].includes(solicitud.estatus) && !grupo.tareas.every(t => t.estatusActividad === 'Completado')"
                          color="primary"
                          outline
                          rounded
                          size="sm"
                          no-caps
                          icon="checklist"
                          label="Registrar Avance del Grupo"
                          class="shadow-1"
                          @click="abrirDialogoAvanceGrupo(grupo)"
                        />
                      </div>
                    </q-timeline-entry>
                  </q-timeline>

                </q-card-section>
              </q-card>
            </div>
        </div>
      </div>
    </div>
    <DialogRegistrarAvance 
  v-model="showDialogAvance" 
  :pasosActuales="pasoSeleccionado?.tareas || []" 
  @guardar="alGuardarAvance" 
/>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import DialogRegistrarAvance from 'components/rh/DialogRegistrarAvance.vue'
import solicitudesService from 'src/services/solicitudesService.js'

const route = useRoute()
const $q = useQuasar()

const cargando = ref(true)
const solicitud = ref({})
const pasos = ref([])
const showDialogAvance = ref(false)
const pasoSeleccionado = ref(null)
const observacionesTI = ref('')
const observacionesGerente = ref('')

const colorEstatus = computed(() => {
  const s = solicitud.value.estatus
  if (s?.includes('TI')) return 'orange'
  if (s?.includes('Gerencial')) return 'blue'
  if (s === 'EnProceso') return 'positive'
  return 'grey'
})

const pasosAgrupados = computed(() => {
  const mapaGrupos = new Map();

  pasos.value.forEach((paso) => {
    if (!mapaGrupos.has(paso.idGrupo)) {
      mapaGrupos.set(paso.idGrupo, {
        idGrupo: paso.idGrupo,
        descripcionGrupo: paso.descripcionGrupo,
        tareas: []
      });
    }
    mapaGrupos.get(paso.idGrupo).tareas.push(paso);
  });

  return Array.from(mapaGrupos.values());
});

// 3. FUNCIONES DEL TIMELINE Y DIÁLOGO
const abrirDialogoAvanceGrupo = (grupo) => {
  pasoSeleccionado.value = grupo;
  showDialogAvance.value = true;
}

// Función maestra: Recibe las tareas editadas del diálogo, las manda al backend y recarga.
const alGuardarAvance = async (actividadesActualizadas) => {
  try {
    $q.loading.show({ message: 'Guardando avances...' })

    // 1. Mandamos las actividades específicas al backend
    await solicitudesService.actualizarAvancesActividades({
      idSolicitud: solicitud.value.idSolicitud,
      actividades: actividadesActualizadas
    })

    $q.notify({ color: 'positive', message: 'Avances guardados con éxito', icon: 'check' })

    // 2. Recargamos los datos para que el Timeline se actualice visualmente
    const res = await solicitudesService.obtenerSeguimiento(solicitud.value.idSolicitud)
    if (res) {
      solicitud.value = res
      pasos.value = res.pasos || []
    }
    
  } catch (err) {
    console.error('Error al actualizar avances:', err)
    $q.notify({ color: 'negative', message: 'No se pudieron guardar los avances' })
  } finally {
    $q.loading.hide()
  }
}

// 4. FUNCIONES DE APROBACIÓN (TI / GERENCIA)
async function validarSolicitud(tipo) {
  try {
    $q.loading.show({ message: 'Actualizando estatus...' })
    
    let nuevoEstatus = (tipo === 'aprobado_ti') ? 'ValidacionGerencial' : 'EnProceso'
    let obs = (tipo === 'aprobado_ti') ? observacionesTI.value : observacionesGerente.value

    const res = await solicitudesService.actualizarEstatus(solicitud.value.idSolicitud, {
      nuevoEstatus: nuevoEstatus,
      observaciones: obs,
      claveUsuario: 'ADM001' 
    })

    if (res) {
      solicitud.value.estatus = nuevoEstatus
      $q.notify({ color: 'positive', message: 'Estatus actualizado' })
    }
  } catch (err) {
    console.error('Error en validación:', err)
    $q.notify({ color: 'negative', message: 'Error al actualizar' })
  } finally {
    $q.loading.hide()
  }
}

// 5. CARGA INICIAL
onMounted(async () => {
  try {
    cargando.value = true
    console.log("Buscando folio:", route.params.id) 
    
    const data = await solicitudesService.obtenerSeguimiento(route.params.id)
    
    if (data) {
      solicitud.value = data
      pasos.value = data.pasos || []
    }
  } catch (err) {
    console.error('Error al cargar seguimiento:', err.response?.status, err.message)
    $q.notify({
      color: 'negative',
      message: `Error ${err.response?.status}: No se encontró la solicitud.`
    })
  } finally {
    cargando.value = false
  }
})
</script>
