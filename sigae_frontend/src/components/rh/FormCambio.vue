<template>
  <div>
    <div class="text-h6 text-orange-9 q-mb-md">Formulario de Cambio (Transferencia)</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <q-input
          label="Buscar empleado (ID o Nombre)"
          outlined
          bg-color="white"
          @blur="buscarEmpleado"
          @keyup.enter="buscarEmpleado"
        >
          <template v-slot:prepend><q-icon name="search" color="primary" /></template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6">
        <q-input v-model="empleado.nombre" label="Empleado seleccionado" outlined disable filled>
          <template v-slot:prepend><q-icon name="person" /></template>
        </q-input>
      </div>

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
        :disable="!jefe"
        @click="submit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const empleado = ref({})
const area = ref('')
const jefe = ref('')
const permisos = ref('')

const areas = ['TI', 'RH', 'Finanzas']

const jefes = {
  TI: ['Antonio'],
  RH: ['Laura'],
  Finanzas: ['Miguel'],
}

function buscarEmpleado() {
  empleado.value = {
    id: 'EMP-1234',
    nombre: 'Juan Pérez',
  }
}

function submit() {
  emit('submit', {
    tipo: 'Cambio',
    empleado: empleado.value,
    nuevaArea: area.value,
    jefe: jefe.value,
    permisos: permisos.value,
  })
}
</script>
