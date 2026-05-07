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
import { api } from 'boot/axios' 
import FormAlta from 'src/components/rh/FormAlta.vue'
import FormBaja from 'src/components/rh/FormBaja.vue'
import FormCambio from 'src/components/rh/FormCambio.vue'

const router = useRouter()

const tipoMovimiento = ref(null)
const opcionesMovimiento = ref([])

onMounted(async () => {
  try {
    const response = await api.get('api/catalogos/get-movimientos') 
    opcionesMovimiento.value = response.data
  } catch (error) {
    console.error('Error al cargar movimientos. Verifica que la ruta /catalogos/movimientos exista en tu proxy:', error)
  }
})


function enviarSolicitud(respuestaDelFormulario) {
  if(respuestaDelFormulario && respuestaDelFormulario.ok) {
    router.push('/')
  }
}
</script>