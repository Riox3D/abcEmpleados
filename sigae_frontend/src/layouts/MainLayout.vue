<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="src/assets/cidesi_icon.png" />
          </q-avatar>
          abcEmpleados
        </q-toolbar-title>
         <!--
         <div class="row items-center q-gutter-sm q-mr-md">
          <div class="text-subtitle2 text-weight-bold">Vista actual:</div>
          <q-select
            v-model="rolSeleccionado"
            :options="opcionesRoles"
            dense
            outlined
            bg-color="white"
            options-dense
            emit-value
            map-options
            @update:model-value="cambiarRolActivo"
            style="min-width: 230px"
          >
            <template v-slot:prepend>
              <q-icon name="switch_account" color="primary" />
            </template>
          </q-select>
        </div>-->
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Pagina Principal" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
/*import { ref } from 'vue'
import { useAuth } from 'src/composables/useAuth'

const { simularInicioSesion } = useAuth()

const rolSeleccionado = ref('rh')

const opcionesRoles = [
  { label: 'Recursos Humanos', value: 'rh', nombre: 'Admin RH', clave: 'EMP-000' },
  { label: 'Validador TI', value: 'validador_ti', nombre: 'Ing. Sistemas', clave: 'EMP-999' },
  {
    label: 'Gerente (Jefe Inmediato)',
    value: 'gerente',
    nombre: 'Roberto Gómez',
    clave: 'EMP-555',
  },
  { label: 'Responsable de Tarea', value: 'responsable', nombre: 'Soporte TI', clave: 'EMP-888' },
]

function cambiarRolActivo(nuevoRol) {
  const datosRol = opcionesRoles.find((r) => r.value === nuevoRol)
  if (datosRol) {
    simularInicioSesion(datosRol.value, datosRol.nombre, datosRol.clave)
  }
} */
</script>
