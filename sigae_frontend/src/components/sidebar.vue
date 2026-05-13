<template>
  <q-drawer show-if-above v-if="isLoggedIn" width="140" :breakpoint="800"
    class="bg-primary text-white flex justify-center text-center" v-model="leftDrawerOpen">
    <q-list padding class="q-mt-xl">
      <q-item v-ripple v-for="item in auth.menu" :key="item.label" class="flex justify-center q-my-md" :to="item.to"
        active-class="custom-active2" clickable>
        <q-item-section avatar class="flex justify-center items-center q-pa-md">
          <q-icon :name="item.icon" size="lg" />
          {{ item.label }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<style>
.custom-active {
  background-color: #ffffff38;
  /* Fondo semi-transparente para el elemento activo */
  border-radius: 0px 20px 20px 0px;

  width: 130px;
  color: #ffffff !important;
  /* Color de texto blanco para destacar */
  border-left: 4px solid #6191b3;
  /* Borde izquierdo blanco para indicar selección */
  font-weight: bold;
  /* Texto en negrita */
  transition: all 0.8s ease;
  /* Transición suave para cambios de estado */
}

.custom-active2 {
  background-image: linear-gradient(90deg,
      #5b9bc9 0%,
      #ffffff 100%);
  /* Fondo semi-transparente para el elemento activo */
  border-radius: 30px 0px 0px 30px;

  width: 140px;
  color: #303669 !important;
  /* Color de texto blanco para destacar */
  border-left: 4px solid #2f5977;
  /* Borde izquierdo blanco para indicar selección */
  font-weight: bold;
  /* Texto en negrita */
  transition: all 0.8s ease;
  /* Transición suave para cambios de estado */
}

.q-item:hover {
  background-color: #cfcdcd85;
  /* Fondo más claro al pasar el mouse */
  color: #31353d;
}
</style>

<script setup>
import { ref, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthStore } from "stores/authStore";

const auth = useAuthStore();
//console.debug('auth on sidebar: ', auth.menu);
const isLoggedIn = computed(() => auth.isAuthenticated);

const leftDrawerOpen = defineModel();
const linksList = [
  { title: "Docs", icon: "school", link: "https://quasar.dev" },
  { title: "GitHub", icon: "code", link: "https://github.com/quasarframework" },
  // ...
];
</script>