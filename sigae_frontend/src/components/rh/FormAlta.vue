<template>
  <div>
    <div class="text-h6 text-primary q-mb-md">Formulario de Alta de Personal</div>
    
    <div class="row q-col-gutter-md">
      <!-- 1. El Buscador que conecta con 'filtrarEmpleados' -->
      <div class="col-12 q-mb-md">
        <q-select
          v-model="empleadoSeleccionado"
          use-input
          hide-selected
          fill-input
          input-debounce="300"
          :options="opcionesEmpleados"
          @filter="filtrarEmpleados"
          option-label="nombre"
          label="1. Busca al empleado en HUMAN (ID o Nombre) *"
          outlined
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
      </div>

      <!-- 2. Campos que se auto-rellenan (ahora deshabilitados para evitar errores manuales) -->
      <div class="col-12 col-sm-6">
        <q-input 
          v-model="form.claveEmpleado" 
          label="Número de Empleado *" 
          outlined 
          readonly
          bg-color="grey-2"
        >
          <template v-slot:prepend><q-icon name="key" /></template>
        </q-input>
      </div>
      
      <div class="col-12 col-sm-6">
        <q-input 
          v-model="form.curpEmpleado" 
          label="CURP *" 
          outlined 
          readonly
          bg-color="grey-2"
        >
          <template v-slot:prepend><q-icon name="fingerprint" /></template>
        </q-input>
      </div>

      <div class="col-12">
        <q-input 
          v-model="form.nombreEmpleado" 
          label="Nombre completo *" 
          outlined 
          readonly
          bg-color="grey-2"
        >
          <template v-slot:prepend><q-icon name="person" /></template>
        </q-input>
      </div>
      
      <div class="col-12">
        <q-input v-model="form.observaciones" label="Observaciones adicionales" type="textarea" outlined rows="2" />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn 
        label="Registrar Alta en SQL" 
        color="primary" 
        @click="submit" 
        :loading="cargando"
        :disable="!form.claveEmpleado" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue' // Añadimos watch para detectar la selección
import { solicitudesService } from 'src/services/solicitudesService'
import { empleadosService } from 'src/services/empleadosService' // Importamos el buscador
import { useQuasar } from 'quasar'

const $q = useQuasar()
const cargando = ref(false)
const emit = defineEmits(['submit'])

// 1. Nuevas variables para el buscador inteligente
const empleadoSeleccionado = ref(null)
const opcionesEmpleados = ref([])

const form = ref({
  idTipoMovimiento: 1, 
  claveEmpleado: '',
  nombreEmpleado: '',
  curpEmpleado: '',
  idRbac: null, 
  observaciones: ''
})

// 2. Lógica para buscar en "Human"
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

// 3. Vigilante: Cuando elijas a alguien, llenamos el formulario automáticamente
watch(empleadoSeleccionado, (nuevoEmpleado) => {
  console.log('Datos del empleado recibido:', nuevoEmpleado)
  if (nuevoEmpleado) {
    form.value.claveEmpleado = nuevoEmpleado.id
    form.value.nombreEmpleado = nuevoEmpleado.nombre
    form.value.curpEmpleado = nuevoEmpleado.curp || '' // Evitamos errores si no trae CURP
  } else {
    // Si borras la selección, limpiamos los campos
    form.value.claveEmpleado = ''
    form.value.nombreEmpleado = ''
    form.value.curpEmpleado = ''
  }
})

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