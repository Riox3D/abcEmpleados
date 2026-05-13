<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="min-width: 650px; border-radius: 12px" class="shadow-4">
      <q-card-section class="bg-primary text-white row items-center q-pa-md">
        <q-icon name="playlist_add_check" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">Registrar Avances del Grupo</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="white" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg scroll" style="max-height: 70vh">
        <div
          v-for="(avance, index) in formAvances"
          :key="index"
          class="q-mb-lg bg-grey-1 q-pa-md rounded-borders"
        >
          
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1 text-weight-bold text-primary">
                <q-icon name="task_alt" size="sm" class="q-mr-xs" /> {{ avance.titulo }}
              </div>
              <div class="text-caption text-grey-7 q-ml-md q-mt-xs">
                <q-icon name="person" size="xs" /> Agente: <strong>{{ avance.agente }}</strong>
              </div>
            </div>
            
            <q-checkbox
              v-model="avance.completado"
              label="Marcar como completado"
              color="positive"
              keep-color
            />
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-input
                v-model="avance.dato"
                label="Dato Generado / Cuenta (Opcional)"
                placeholder="Ej. Num. Serie, Correo, etc."
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="avance.comentario"
                label="Observaciones (Opcional)"
                outlined
                dense
              />
            </div>
          </div>
          
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md bg-grey-2">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn label="Guardar Avances" color="primary" @click="guardar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  pasosActuales: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'guardar'])

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})



const formAvances = ref([])

// Dentro del watch en DialogRegistrarAvance.vue
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.pasosActuales) {
      formAvances.value = props.pasosActuales.map((paso) => {
        return {
          idsolicitudActividad: paso.idsolicitudActividad,
          titulo: paso.descripcionDetalle,
          agente: paso.nombreResponsable || 'Sin asignar', // <-- Agregamos el agente
          completado: paso.estatusActividad === 'Completado',
          dato: paso.datoGenerado || '',
          comentario: paso.comentario || '',
        }
      })
    }
  },
)

function guardar() {
  const avancesProcesados = formAvances.value.map((av) => {
    return {
      idsolicitudActividad: av.idsolicitudActividad,
      estatusActividad: av.completado ? 'Completado' : 'EnProceso', // Traduce de vuelta el checkbox a texto
      datoGenerado: av.dato,
      observaciones: av.comentario
    }
  })

  // Emitimos el evento que escuchará SeguimientoSolicitud.vue
  emit('guardar', avancesProcesados)
  dialogModel.value = false
}
</script>
