<template>
    <q-page class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h5">Dashboard</div>
          <div class="text-subtitle2 text-grey">Bienvenido al panel principal</div>
        </q-card-section>
  
        <q-card-section>
          Aquí puedes mostrar estadísticas, accesos rápidos o resumen general del sistema.
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, reactive, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import apiFicha from "src/services/apiFichaTec";
import { useAuthStore } from 'stores/authStore'


const $q = useQuasar()
const auth = useAuthStore()
const catAcreditaciones = ref()
/* 
onMounted(async () => {
  $q.loading.show()
  try {
  const response = await apiFicha.getProyectos()
  catAcreditaciones.value = response.data
  console.debug('response...', response.data);
  $q.loading.hide()
  } catch (error) {
    $q.loading.hide()
    console.log('error: ',error)
  }
}) */
  </script>
  