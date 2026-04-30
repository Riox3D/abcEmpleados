<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card class="shadow-3" style="border-radius: 12px">
          <q-card-section class="bg-primary text-white row items-center justify-between q-pa-md">
            <div class="row items-center q-gutter-sm">
              <q-icon name="post_add" size="md" />
              <div class="text-h6 text-weight-bold">Nueva Solicitud</div>
            </div>
            <q-btn icon="close" flat round dense color="white" @click="$router.push('/')">
              <q-tooltip class="bg-primary">Cancelar y volver</q-tooltip>
            </q-btn>
          </q-card-section>

          <q-card-section class="bg-grey-2 q-pb-none">
            <p class="text-subtitle2 text-grey-8 q-mb-sm">
              Selecciona el tipo de trámite que deseas realizar:
            </p>

            <q-select v-model="tipoMovimiento" :options="opcionesMovimiento" option-value="idTipoMovimiento"
              option-label="descripcion" emit-value map-options label="Tipo de movimiento" outlined bg-color="white"
              class="q-mb-md">
              <template v-slot:prepend>
                <q-icon name="swap_horiz" color="primary" />
              </template>
            </q-select>
          </q-card-section>

          <q-separator v-if="tipoMovimiento" />

          <div class="q-pa-md">
            <transition name="q-transition--fade" mode="out-in">
              <FormAlta v-if="tipoMovimiento === 1" @submit="enviarSolicitud" />
              <FormBaja v-else-if="tipoMovimiento === 2" @submit="enviarSolicitud" />
              <FormCambio v-else-if="tipoMovimiento === 3" @submit="enviarSolicitud" />

              <div v-else class="text-center q-py-xl text-grey-5">
                <q-icon name="touch_app" size="4xl" class="q-mb-sm" />
                <div class="text-h6">Esperando selección</div>
                <div>Elige un tipo de movimiento para continuar</div>
              </div>
            </transition>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import api from 'src/services/api'
import FormAlta from 'src/components/rh/FormAlta.vue'
import FormBaja from 'src/components/rh/FormBaja.vue'
import FormCambio from 'src/components/rh/FormCambio.vue'

const router = useRouter()
const $q = useQuasar()

const tipoMovimiento = ref(null)
const opcionesMovimiento = ref([])

const usuario = ref({
  claveUsuario: 'EMP01'
})


onMounted(async () => {
  try {
    const response = await api.get('/movimientos')
    opcionesMovimiento.value = response.data
  } catch (error) {
    console.error('Error al cargar movimientos:', error)
  }
})

async function enviarSolicitud(data) {
  const payload = {
    claveUsuario: usuario.value.claveUsuario,
    idTipoMovimiento: tipoMovimiento.value,
    claveEmpleado: data.claveEmpleado
  }

  try {
    $q.loading.show({ message: 'Guardando solicitud en BD...' })

    const response = await api.post('/solicitudes', payload)

    $q.notify({
      color: 'positive',
      icon: 'check',
      message: '¡Solicitud guardada con el Folio: ' + response.data.idGenerado
    })

    router.push('/')

  } catch (error) {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Error al guardar: ' + error.message
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
