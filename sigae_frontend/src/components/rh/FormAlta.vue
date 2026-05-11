<template>
  <div>
    <div class="text-h6 text-primary q-mb-md">Formulario de Alta de Personal</div>
    
    <div class="row q-col-gutter-md">
      <!-- 1. Buscador que conecta con 'filtrarEmpleados' -->
      <div class="col-12 q-mb-md">
        <q-select
          v-model="empleadoSeleccionado"
          use-input
          input-debounce="100"
          :options="opcionesEmpleados"
          @update:model-value="actualizarEmpleado"
          @filter="filtrarEmpleados"
          option-label="nombreEmpleado"
          option-value="claveEmpleado"
          label="1. Busca al empleado en HUMAN (ID o Nombre) *"
          outlined
          clearable
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
        <q-select
          v-model="form.idRbac"
          :options="opcionesRbac"
          option-value="idRbac"
          option-label="nombreRbac"
          emit-value
          map-options
          label="Perfil de Accesos (RBAC) *"
          outlined
          bg-color="white"
        >
          <template v-slot:prepend><q-icon name="admin_panel_settings" /></template>
        </q-select>
      </div>
      <div class="col-12">
        <q-input v-model="form.observaciones" label="Observaciones adicionales" type="textarea" outlined rows="2" />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn 
        label="Registrar Alta" 
        color="primary" 
        @click="submit" 
        :loading="cargando"
        :disable="!form.claveEmpleado" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Añadimos watch para detectar la sel ección
//import { empleadosService } from 'src/services/empleadosService' // Importamos el buscador
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import solicitudesService from 'src/services/solicitudesService';

const opcionesRbac = ref([])
const $q = useQuasar()
const cargando = ref(false)
const emit = defineEmits(['submit'])
const empleados = ref([])
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
async function filtrarEmpleados(val, update) {
 
  if (val === "") {
        update(() => {
          opcionesEmpleados.value = [...empleados.value];

          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toUpperCase();
        opcionesEmpleados.value = empleados.value.filter((v) =>
          v.nombreEmpleado.toUpperCase().includes(needle)
        );
      });
}

async function actualizarEmpleado(empleado) {
  console.log("Empleado seleccionado:",empleado)
  try {
   // const response = await solicitudesService.getEmpleado(empleado.claveEmpleado)
   const response = await api.get('/api/empleados/getEmpleado/'+empleado.claveEmpleado)
    console.log("Empleado elegido:",response)
  } catch (error) {
    console.error("Error al cargar empleado:", error)
  }
}


/*watch(empleadoSeleccionado, (nuevoEmpleado) => {
  console.log('Datos del empleado recibido:', nuevoEmpleado)
  if (nuevoEmpleado) {
    form.value.claveEmpleado = nuevoEmpleado.id
    form.value.nombreEmpleado = nuevoEmpleado.nombre
    form.value.curpEmpleado = nuevoEmpleado.curp || '' 
  } else {
    // Si borra la selección, limpiamos los campos
    form.value.claveEmpleado = ''
    form.value.nombreEmpleado = ''
    form.value.curpEmpleado = ''
  }
})*/
onMounted(async () => {
  try {
    const response = await api.get('/api/catalogos/rbac')
    opcionesRbac.value = response.data
  } catch (error) {
    console.error("Error al cargar RBAC:", error)
  }
  try {
    const response = await api.get('/api/empleados/getCatalogoEmpleados')
    empleados.value = response.data.empleados.map((empleado) => ({ 
      claveEmpleado: empleado[0],
      nombreEmpleado: empleado[1],
    }))  
    opcionesEmpleados.value = empleados.value
    console.log(opcionesEmpleados.value)
  } catch (error) {
    console.error("Error al cargar RBAC:", error)
  }
}
)
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