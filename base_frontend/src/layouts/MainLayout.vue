<script setup>
import { ref, computed } from 'vue'
import AppHeader from 'components/header.vue'
import AppDrawer from 'components/sidebar.vue'
import { useAuthStore } from 'stores/authStore'

const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isAuthenticated)
const leftDrawerOpen = ref(false)

</script>

<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white">
      <!-- Barra oficial -->
      <iframe src="/barra.html" style="width: 100%; height: 70px; border: none; display: block;"></iframe>

      <!-- AppHeader solo si hay sesión -->

      <AppHeader @toggleDrawer="leftDrawerOpen = !leftDrawerOpen" />

    </q-header>
    <AppDrawer v-model="leftDrawerOpen" />


    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- Footer -->
    <q-footer class="q-pa-none">


        <iframe src="/footer.html" style="
      width: 100%;
      height: 280px; /* solo lo que mide el pie */
      border: none;
      display: block;
      position: relative;
      top: 0px; /* recorta la barra de arriba */
      overflow: hidden;
    " scrolling="no" sandbox="allow-same-origin allow-scripts"></iframe>


    </q-footer>

  </q-layout>
</template>
