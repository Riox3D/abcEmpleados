<template>
  <div>
    <div class="text-h6 text-orange-9 q-mb-md">Formulario de Cambio (Transferencia)</div>

    <div class="row q-col-gutter-md">
      <!-- 1. El nuevo Buscador Inteligente -->
      <div class="col-12 col-sm-6">
        <q-select
          v-model="empleado"
          use-input
          hide-selected
          fill-input
          input-debounce="300"
          :options="opcionesEmpleados"
          @filter="filtrarEmpleados"
          option-label="nombre"
          label="Buscar empleado (ID o Nombre)"
          outlined
          bg-color="white"
        >
          <template v-slot:prepend><q-icon name="search" color="primary" /></template>
          
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No hay coincidencias</q-item-section>
            </q-item>
          </template>

          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                <q-item-label caption>{{ scope.opt.id }} | Actual: {{ scope.opt.area }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <!-- 2. Información del empleado seleccionado -->
      <div class="col-12 col-sm-6">
        <q-input 
          :model-value="empleado ? empleado.nombre : ''" 
          label="Empleado seleccionado" 
          outlined 
          disable 
          filled
        >
          <template v-slot:prepend><q-icon name="person" /></template>
        </q-input>
      </div>

      <!-- 3. Datos del Cambio -->
      <div class="col-12 col-sm-6">
  <q-select
    v-model="area"
    :options="areas"
    label="Nueva Área de adscripción"
    outlined
    bg-color="white"
  >
    <template v-slot:prepend><q-icon name="domain" /></template>
  </q-select>

  <div v-if="empleado && area === empleado.area" class="text-caption text-negative q-mt-xs q-ml-sm">
    <q-icon name="warning" /> El empleado ya pertenece a esta área.
  </div>
</div>

      <div class="col-12 col-sm-6">
        <q-select
          v-model="jefe"
          :options="jefes[area] || []"
          label="Nuevo Jefe inmediato"
          outlined
          bg-color="white"
          :disable="!area"
        >
          <template v-slot:prepend><q-icon name="manage_accounts" /></template>
        </q-select>
      </div>

      <div class="col-12">
        <q-input
          v-model="permisos"
          type="textarea"
          label="Permisos a cambiar o modificar (Sistemas, accesos, etc.)"
          outlined
          bg-color="white"
          rows="3"
        >
          <template v-slot:prepend><q-icon name="security" /></template>
        </q-input>
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn
        label="Registrar Cambio"
        icon="swap_calls"
        color="warning"
        text-color="dark"
        unelevated
        class="q-px-md text-weight-bold"
        :disable="!jefe || !empleado || area === empleado.area"
        @click="submit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { empleadosService } from 'src/services/empleadosService'

const emit = defineEmits(['submit'])

const empleado = ref(null)
const opcionesEmpleados = ref([])
const area = ref('')
const jefe = ref('')
const permisos = ref('')

const areas = ['TI', 'RH', 'Finanzas'] 
const jefes = {
  TI: ['Antonio'],
  RH: ['Laura'],
  Finanzas: ['Miguel'],
}

// Lógica de búsqueda 
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

// 2. FUNCIÓN SUBMIT ACTUALIZADA (Guardado real en SQL)
async function submit() {
  try {
    // Usamos el '10' como tu clave de registro y el ID del empleado seleccionado
    const url = `api/solicitudes/guardar/10/${empleado.value.id}` 

    const respuesta = await api.post(url, {
      idTipoMovimiento: 3, // ID para Cambios
      
      // Datos del empleado 
      nombreEmpleado: empleado.value.nombre,
      curpEmpleado: empleado.value.curp, 
      
      // Datos específicos de la transferencia
      areaAnterior: empleado.value.area,
      nuevaArea: area.value,
      jefeNuevo: jefe.value,
      permisosModificar: permisos.value
    })

    if (respuesta.status === 200 || respuesta.data.success) {
      emit('submit', { ok: true })
    }
  } catch (error) {
    console.error("Error al procesar el cambio:", error)
  }
}
</script>