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
              {{ solicitud.estatusSolicitud }}
            </q-chip>
          </q-card-section>
        </q-card>

        <div class="q-mb-lg">
          <q-card
            v-if="esValidadorTI && solicitud.estatusSolicitud === 'Pendiente de validación TI'"
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
            v-if="esGerente && solicitud.estatusSolicitud === 'Pendiente aprobación gerencial'"
            class="bg-blue-1 border-blue shadow-2 q-pa-md"
          >
            <div class="text-h6 text-blue-9 q-mb-sm row items-center">
              <q-icon name="admin_panel_settings" class="q-mr-sm" /> Aprobación Gerencial y
              Configuración RBAC
            </div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="solicitud.rbac.edificios"
                  :options="['Sede Principal', 'Planta 2', 'Almacén']"
                  label="Accesos a Edificios"
                  multiple
                  use-chips
                  outlined
                  bg-color="white"
                />
              </div>
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
                    <q-item-label>{{ solicitud.nssIssste }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
  <q-item-section>
    <q-item-label caption>CURP</q-item-label>
    <q-item-label>{{ solicitud.curpEmpleado || 'No disponible' }}</q-item-label>
  </q-item-section>
</q-item>
              </q-list>
            </q-card>

            <q-card
              v-if="solicitud.rbac && solicitud.rbac.edificios.length"
              class="shadow-3 q-mt-md"
              style="border-radius: 12px"
            >
              <q-card-section class="bg-indigo-1 text-indigo-9 text-weight-bold">
                <q-icon name="layers" size="sm" class="q-mr-xs" /> Configuración RBAC asignada
              </q-card-section>
              <q-card-section>
                <div class="text-caption text-grey-7">Edificios:</div>
                <div class="row q-gutter-xs q-mb-sm">
                  <q-chip
                    v-for="ed in solicitud.rbac.edificios"
                    :key="ed"
                    size="sm"
                    outline
                    color="indigo"
                    >{{ ed }}</q-chip
                  >
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-8">
            <q-card class="shadow-3" style="border-radius: 12px">
              <q-card-section class="bg-grey-2 row items-center justify-between">
                <div class="text-subtitle1 text-weight-bold text-primary">
                  <q-icon name="checklist" size="sm" class="q-mr-sm" /> Avance de Tareas
                </div>
                <q-btn
                  v-if="esResponsable && solicitud.estatusSolicitud === 'En proceso'"
                  label="Actualizar"
                  color="primary"
                  icon="edit"
                  @click="mostrarDialogo = true"
                />
              </q-card-section>
              <q-separator />

              <q-card-section class="q-pa-lg">
                <div
                  v-if="solicitud.estatusSolicitud?.includes('Pendiente de validación')"
                  class="text-center q-pa-xl"
                >
                  <q-icon name="lock" size="lg" color="grey-4" />
                  <div class="text-grey-6 q-mt-md">
                    Las tareas se activarán una vez que la solicitud sea validada por TI y Gerencia.
                  </div>
                </div>

                <q-timeline v-else color="secondary" layout="loose">
                  <q-timeline-entry
                    v-for="(paso, index) in pasos"
                    :key="index"
                    :title="paso.titulo"
                    :color="paso.completado ? 'positive' : 'grey-5'"
                    :icon="paso.esAutomatica ? 'auto_mode' : 'person'"
                  >
                    <div class="q-pa-sm bg-grey-2 rounded-borders">
                      <div class="text-caption text-grey-8">
                        Responsable: {{ paso.responsableNombre }}
                      </div>
                      <div
                        v-if="paso.esAutomatica"
                        class="text-caption text-blue-8 text-weight-bold italic"
                      >
                        Proceso Automático
                      </div>
                    </div>
                  </q-timeline-entry>
                </q-timeline>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <DialogRegistrarAvance
          v-model="mostrarDialogo"
          :pasosActuales="pasos"
          @guardar="actualizarAvances"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuth } from 'src/composables/useAuth'
import DialogRegistrarAvance from 'components/rh/DialogRegistrarAvance.vue'
import { solicitudesService } from 'src/services/solicitudesService'

const route = useRoute()
const $q = useQuasar()
const { esValidadorTI, esGerente, esResponsable } = useAuth()

const cargando = ref(true)
const mostrarDialogo = ref(false)
const solicitud = ref({})
const pasos = ref([])
const observacionesTI = ref('')
const observacionesGerente = ref('')

const colorEstatus = computed(() => {
  const s = solicitud.value.estatusSolicitud
  if (s?.includes('TI')) return 'orange'
  if (s?.includes('gerencial')) return 'blue'
  if (s === 'En proceso') return 'positive'
  return 'grey'
})

onMounted(async () => {
  try {
    cargando.value = true
    // Verificamos qué ID estamos mandando
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
async function validarSolicitud(tipo) {
  try {
    $q.loading.show({ message: 'Actualizando estatus...' })
    
    let nuevoEstatus = (tipo === 'aprobado_ti') ? 'ValidacionGerencial' : 'En proceso'
    let obs = (tipo === 'aprobado_ti') ? observacionesTI.value : observacionesGerente.value

    const res = await solicitudesService.actualizarEstatus(solicitud.value.idSolicitud, {
      estatus: nuevoEstatus,
      observaciones: obs,
      claveUsuario: 'ADM001' 
    })

    if (res) {
      solicitud.value.estatusSolicitud = nuevoEstatus
      $q.notify({ color: 'positive', message: 'Estatus actualizado' })
    }
  } catch (err) {
    console.error('Error en validación:', err)
    $q.notify({ color: 'negative', message: 'Error al actualizar' })
  } finally {
    $q.loading.hide()
  }
}

async function actualizarAvances(nuevosPasos) {
  try {
    await solicitudesService.actualizarEstatus(solicitud.value.idSolicitud, {
      pasos: nuevosPasos
    })
    pasos.value = nuevosPasos
    mostrarDialogo.value = false
    $q.notify({ color: 'positive', message: 'Avances guardados' })
  } catch (err) {
    console.error('Error al actualizar avances:', err)
    $q.notify({ color: 'negative', message: 'No se pudieron guardar los avances' })
  }
}
</script>
