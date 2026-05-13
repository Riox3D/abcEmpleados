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
  to="/registro" 
/>
          </q-card-section>

          <q-card-section class="bg-grey-2 q-py-sm q-px-md">
            <div class="text-subtitle2 text-grey-8">
              Gestiona y da seguimiento a las solicitudes registradas.
            </div>
          </q-card-section>

          <q-separator />

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
import { useRouter } from 'vue-router';
import TablaSolicitudes from 'components/rh/TablaSolicitudes.vue'
</script>