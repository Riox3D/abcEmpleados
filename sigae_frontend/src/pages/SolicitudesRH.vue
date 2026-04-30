<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <q-card class="shadow-3" style="border-radius: 12px">
          <!-- Encabezado se queda igual -->
          <q-card-section class="bg-primary text-white row items-center justify-between q-pa-md">
            <div class="row items-center q-gutter-sm">
              <q-icon name="people_alt" size="md" />
              <div class="text-h6 text-weight-bold">Solicitudes de RH</div>
            </div>

            <q-btn
              label="Nueva Solicitud"
              icon="add"
              color="white"
              text-color="primary"
              unelevated
              rounded
              class="text-weight-bold"
              @click="$router.push('/registro')"
            />
          </q-card-section>

          <!-- Quitamos el filtro de aquí, porque la tabla ya viene filtrada desde SQL -->
          <q-card-section class="bg-grey-2 q-py-sm q-px-md">
            <div class="text-subtitle2 text-grey-8">
              Gestiona y da seguimiento a las solicitudes registradas.
            </div>
          </q-card-section>

          <q-separator />

          <!-- LA TABLA AHORA ES LIMPIA Y AUTÓNOMA -->
          <q-card-section class="q-pa-none">
            <div class="q-pa-md">
              <!-- No necesita :solicitudes ni @ver, ella solita lo hace todo ahora -->
              <TablaSolicitudes /> 
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Limpiamos el script. Ya no necesitamos cargar nada aquí 
// porque la lógica se movió a TablaSolicitudes.vue
import TablaSolicitudes from 'components/rh/TablaSolicitudes.vue'
</script>