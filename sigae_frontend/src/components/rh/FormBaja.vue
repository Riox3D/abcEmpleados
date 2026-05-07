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
            
            <!-- Aquí está la magia: El Autocomplete -->
            <q-select
              v-model="empleado"
              use-input
              hide-selected
              fill-input
              input-debounce="300"
              :options="opcionesEmpleados"
              @filter="filtrarEmpleados"
              option-label="nombre"
              label="Ingresa ID o Nombre completo"
              outlined
              bg-color="white"
              dense
              class="full-width"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No se encontraron empleados con esa búsqueda
                  </q-item-section>
                </q-item>
              </template>

              <!-- Personalizamos cómo se ven los resultados en la lista -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" icon="person" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                    <q-item-label caption class="text-primary text-weight-bold">{{ scope.opt.id }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{ scope.opt.area }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

          </q-card-section>
        </q-card>
      </div>

      <transition name="q-transition--fade">
        <div class="col-12 row q-col-gutter-md items-center" v-if="empleado && empleado.id">
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
        class="q-px-lg text-weight-bold" :disable="!empleado || !empleado.id || !fechaBaja" @click="submit" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios' // 1. IMPORTANTE: Agrega esta importación
import { empleadosService } from 'src/services/empleadosService'
import { useQuasar } from 'quasar';

const emit = defineEmits(['submit'])

const empleado = ref(null)
const opcionesEmpleados = ref([])
const fechaBaja = ref('')
const observaciones = ref('')

async function filtrarEmpleados(val, update, abort) {
  if (val.length < 2) {
    abort()
    return
  }
  const resultados = await empleadosService.buscar(val)
  update(() => {
    opcionesEmpleados.value = resultados
  })
}

function limpiarBusqueda() {
  empleado.value = null
  fechaBaja.value = ''
  observaciones.value = ''
}
const $q = useQuasar()
// 2. CAMBIO AQUÍ: La función ahora es async y guarda en la BD
async function submit() {
  // 1. Primero lanzamos la confirmación
  $q.dialog({
    title: 'Confirmar Baja Definitiva',
    message: `¿Estás seguro de que deseas procesar la baja de ${empleado.value.nombre}? Esta acción quedará registrada en el historial.`,
    cancel: {
      label: 'Cancelar',
      color: 'grey',
      flat: true
    },
    ok: {
      label: 'Sí, Procesar',
      color: 'negative', 
      unelevated: true
    },
    persistent: true // Obliga a elegir una opción
  }).onOk(async () => {
    
    try {
      const url = `api/solicitudes/guardar/10/${empleado.value.id}`

      const respuesta = await api.post(url, {
        idTipoMovimiento: 2, // Baja
        fechaEfectiva: fechaBaja.value,
        nombreEmpleado: empleado.value.nombre, 
        curpEmpleado: empleado.value.curp,
        observaciones: observaciones.value
      })

      if (respuesta.status === 200 || respuesta.data.success) {
        $q.notify({
          color: 'positive',
          message: 'Baja registrada correctamente',
          icon: 'check'
        })
        emit('submit', { ok: true })
      }
    } catch (error) {
      console.error("Error al procesar la baja:", error)
      $q.notify({
        color: 'negative',
        message: 'No se pudo registrar la baja en el servidor'
      })
    }
  })
}
</script>