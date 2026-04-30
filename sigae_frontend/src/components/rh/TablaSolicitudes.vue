<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="idSolicitud"
    flat
    bordered
    class="my-sticky-header-table"
    table-header-class="bg-grey-2 text-weight-bolder text-grey-9"
  >
    <template v-slot:body-cell-estatus="props">
      <q-td :props="props">
        <q-chip
          :color="getColorEstatus(props.row.estatus)"
          text-color="white"
          dense
          class="text-weight-bold"
          size="sm"
        >
          {{ props.row.estatus}}
        </q-chip>
      </q-td>
    </template>

    <template v-slot:body-cell-acciones="props">
  <q-td :props="props" class="text-center">
    <!-- Aquí es donde conectamos la función "verSeguimiento" -->
    <q-btn
      flat
      round
      color="primary"
      icon="visibility"
      @click="verSeguimiento(props.row.idSolicitud)"
    >
      <q-tooltip>Ver Seguimiento</q-tooltip>
    </q-btn>
  </q-td>
</template>

    <template v-slot:no-data>
      <div class="full-width row flex-center text-grey-6 q-pa-md">
        <q-icon size="2em" name="sentiment_dissatisfied" class="q-mr-sm" />
        <span>No se encontraron solicitudes.</span>
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Necesario para navegar
import { solicitudesService } from 'src/services/solicitudesService'
import { useAuth } from 'src/composables/useAuth'
import { watch } from 'vue'
const { usuarioLogueado } = useAuth()
const router = useRouter()
const rows = ref([])
const loading = ref(false)

// Función para cargar los datos reales desde SQL Server
const cargarSolicitudes = async () => {
  if (!usuarioLogueado.value || !usuarioLogueado.value.claveEmpleado) return 
  
  try {
    loading.value = true
    
    const data = await solicitudesService.obtenerTodas()
    
    rows.value = data || []
  } catch (error) {
    console.error("Error al cargar la tabla:", error)
  } finally {
    loading.value = false
  }
}
watch(
  () => usuarioLogueado.value, 
  (nuevoUsuario) => {
    if (nuevoUsuario && nuevoUsuario.claveEmpleado) {
      console.log("Vigilante: Usuario detectado, cargando solicitudes...")
      cargarSolicitudes()
    }
  }, 
  { immediate: true, deep: true } // immediate hace que lo intente apenas cargue el componente
)

onMounted(() => {
  cargarSolicitudes()
})


const verSeguimiento = (id) => {
  router.push(`/seguimiento/${id}`)
}

const getColorEstatus = (estatus) => {
  const colores = {
    'PendienteValidacionTI': 'orange',
    'ValidacionGerencial': 'blue',
    'En proceso': 'positive',
    'Finalizada': 'grey-8',
    'Rechazada': 'negative'
  }
  return colores[estatus] || 'grey'
}

const columns = [
  { 
    name: 'id', 
    label: 'ID Folio', 
    field: 'idSolicitud', // Coincide con tu SQL
    align: 'left', 
    classes: 'text-weight-bold text-primary' 
  },
  { 
    name: 'fecha', 
    label: 'Fecha Registro', 
    field: 'fechaRegistro', // Campo de tu query[
    align: 'left',
    format: val => new Date(val).toLocaleDateString() // Formato legible
  },
  { 
    name: 'empleado', 
    label: 'Empleado', 
    field: 'nombreEmpleado', 
    align: 'left' 
  },
  { 
    name: 'movimiento', 
    label: 'Movimiento', 
    field: 'movimiento', // Traído por el INNER JOIN
    align: 'left' 
  },
  { 
    name: 'estatus', 
    label: 'Estatus', 
    field: 'estatus', 
    align: 'center'
  },
  { name: 'acciones', label: 'Acciones', field: '', align: 'center' }
]
</script>

<style scoped>
.q-table__container {
  border-radius: 8px;
}
</style>
