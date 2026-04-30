<template>
  <div>
    <div class="row items-center q-gutter-sm q-mb-lg text-negative">
      <q-icon name="person_remove" size="md" />
      <div class="text-h6 text-weight-bold">Formulario de Baja de Personal</div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-card flat bordered class="bg-grey-1" style="border-radius: 8px">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-8 q-mb-sm">1. Localiza al empleado</div>
            <q-input v-model="busqueda" label="Ingresa ID o Nombre completo" outlined bg-color="white" dense
              hint="Presiona Enter para buscar" @keyup.enter="buscarEmpleado" class="full-width">
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-slot:append>
                <q-btn round dense flat icon="arrow_forward" color="primary" @click="buscarEmpleado" />
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </div>

      <transition name="q-transition--fade">
        <div class="col-12 row q-col-gutter-md items-center" v-if="empleado.id">
          <div class="col-12 col-sm-7">
            <q-item class="bg-white shadow-1 rounded-borders q-pa-md" style="border: 1px solid #e0e0e0">
              <q-item-section avatar>
                <q-avatar size="60px" color="negative" text-color="white" icon="person" class="shadow-2" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-weight-bold text-negative">EMPLEADO A DAR DE BAJA</q-item-label>
                <q-item-label class="text-h6 text-weight-bold text-dark">{{ empleado.nombre }}</q-item-label>
                <q-item-label caption class="text-grey-7">ID: {{ empleado.id }} | Área: {{ empleado.area }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn round flat icon="close" color="grey-6" dense @click="limpiarBusqueda" />
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-5">
            <q-input v-model="fechaBaja" type="date" label="Fecha efectiva de baja" outlined bg-color="white" stack-label>
              <template v-slot:prepend>
                <q-icon name="event_busy" color="negative" />
              </template>
            </q-input>
          </div>

          <div class="col-12 q-mt-md">
            <q-input v-model="observaciones" label="Motivo o comentarios de la baja" type="textarea" outlined
              bg-color="white" rows="3" hint="Indica el motivo de la salida (renuncia, término de contrato, etc.)" />
          </div>
        </div>

        <div v-else class="col-12 text-center q-py-xl text-grey-5 bg-grey-1 rounded-borders q-mt-md"
          style="border: 2px dashed #ccc">
          <q-icon name="find_in_page" size="4rem" class="q-mb-sm" />
          <div class="text-h6">Esperando búsqueda</div>
          <div>Utiliza el buscador para seleccionar al empleado que saldrá de la empresa</div>
        </div>
      </transition>
    </div>

    <q-separator class="q-mt-xl q-mb-md" />
    <div class="row justify-end q-gutter-sm">
      <q-btn label="Procesar Baja Definitiva" icon="delete_forever" color="negative" unelevated
        class="q-px-lg text-weight-bold" :disable="!empleado.id || !fechaBaja" @click="submit" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const busqueda = ref('')
const empleado = ref({})
const fechaBaja = ref('')
const observaciones = ref('')

function buscarEmpleado() {
  if (busqueda.value.trim() !== '') {

    empleado.value = {
      id: 'EMP-1234',
      nombre: 'Juan Pérez Rodríguez',
      area: 'Tecnologías de la Información',
    }
  } else {
    empleado.value = {}
  }
}

function limpiarBusqueda() {
  busqueda.value = ''
  empleado.value = {}
  fechaBaja.value = ''
  observaciones.value = ''
}

function submit() {

  emit('submit', {
    claveEmpleado: empleado.value.id,
    observaciones: observaciones.value,
    fechaBaja: fechaBaja.value
  })
}
</script>