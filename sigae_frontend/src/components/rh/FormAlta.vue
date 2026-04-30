<template>
  <div>
    <div class="text-h6 text-primary q-mb-md">Formulario de Alta de Personal</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <q-input v-model="form.claveEmpleado" label="Número de Empleado (HUMAN) *" outlined 
          :rules="[val => val && val.length > 0 || 'Requerido']">
          <template v-slot:prepend><q-icon name="key" /></template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6">
        <q-input v-model="form.curpEmpleado" label="CURP *" outlined mask="AAAA######XXXXXX##"
          :rules="[val => val && val.length === 18 || 'CURP no válido']">
          <template v-slot:prepend><q-icon name="fingerprint" /></template>
        </q-input>
      </div>
      <div class="col-12">
        <q-input v-model="form.nombreEmpleado" label="Nombre completo (Apellidos y Nombres) *" outlined>
          <template v-slot:prepend><q-icon name="person" /></template>
        </q-input>
      </div>
      <div class="col-12">
        <q-select v-model="form.idRbac" :options="opcionesRbac" label="Perfil de Acceso (RBAC) *" 
          outlined emit-value map-options>
          <template v-slot:prepend><q-icon name="admin_panel_settings" /></template>
        </q-select>
      </div>
      <div class="col-12">
        <q-input v-model="form.observaciones" label="Observaciones adicionales" type="textarea" outlined rows="2" />
      </div>
    </div>
    <div class="row justify-end q-mt-lg">
      <q-btn label="Registrar Alta en SQL" color="primary" @click="submit" :loading="cargando" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { solicitudesService } from 'src/services/solicitudesService' //[cite: 2]
import { useQuasar } from 'quasar'

const $q = useQuasar()
const cargando = ref(false)
const emit = defineEmits(['submit'])

// Opciones temporales (Lo ideal es traerlas de la tabla c_rbac más adelante)
const opcionesRbac = [
  { label: 'Administrativo', value: 1 },
  { label: 'Técnico TI', value: 2 },
  { label: 'Gerencial', value: 3 }
]

const form = ref({
  idTipoMovimiento: 1, // 1 = Alta
  claveEmpleado: '',
  nombreEmpleado: '',
  curpEmpleado: '',
  idRbac: 1,
  observaciones: ''
})

async function submit() {
  try {
    cargando.value = true
    const res = await solicitudesService.enviarAlta(form.value) //[cite: 2]
    if (res.ok) {
      $q.notify({ color: 'positive', message: 'Registro exitoso. Folio: ' + res.idSolicitud })
      emit('submit', res) //
    }
  } catch (err) {
    console.error('Error capturado:', err)
    $q.notify({ color: 'negative', message: 'Error al conectar con el controlador' })
  } finally {
    cargando.value = false
  }
}
</script>