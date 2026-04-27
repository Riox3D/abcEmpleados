<template>
  <div class="bg-primary text-white">
    <q-toolbar class="q-px-md" style="min-height: 70px; position: relative">
      <div class="row items-center justify-between full-width">
        <!-- IZQUIERDA -->
        <div class="row items-center" style="min-width: 200px">
          <q-btn
            v-if="isLoggedIn"
            flat
            round
            icon="menu"
            color="white"
            class="q-mr-sm"
            @click="$emit('toggleDrawer')"
          />
          <img src="~assets/CIDESI_1.svg" style="height: 60px; width: 105px" />
        </div>

        <!-- CENTRO ABSOLUTO -->
        <div style="position: absolute; left: 50%; transform: translateX(-50%)">
          <div class="text-h6 text-center">
            Sistema de Registro de Actividades
          </div>
        </div>

        <!-- DERECHA -->
        <div class="row items-center justify-end" style="min-width: 200px">
          <!--  {{ notifications }} -->
          <template v-if="isLoggedIn">
            <q-btn flat round dense color="white" class="q-mr-sm">
              <q-badge floating color="red" v-if="unreadCount > 0">{{
                unreadCount
              }}</q-badge>
              <q-icon name="notifications" size="md" />
              <q-menu anchor="bottom right" self="top right">
                <q-list style="min-width: 250px; max-height: 300px" separator>
                  <q-item
                    v-for="(notif, index) in notifications"
                    :key="index"
                    @click="handleSeleccionar(notif)"
                    clickable
                  >
                    <q-item-section>
                      <q-item-label
                        >Solicitud de {{ notif.nombre }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item v-if="notifications.length === 0">
                    <q-item-section
                      >No hay notificaciones nuevas</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <q-avatar class="q-mx-sm bg-white text-primary">
              {{ initials }}
              <q-menu class="no-shadow bg-grey-8 text-white">
                <div class="row q-pa-md flex justify-center">
                  <div class="column items-center">
                    <!-- <div class="flex justify-center">
                      <q-avatar size="72px" class="bg-white text-primary">
                        {{ initials }}
                      </q-avatar>
                    </div> -->

                    <div
                      class="flex justify-center text-subtitle1 q-mt-md q-mb-xs"
                    >
                      {{ auth.user.name }}
                    </div>
                  
                    <div class="flex justify-center text-caption">
                      {{
                        auth.user.role 
                      }}
                    </div>
                    <q-btn
                      class="q-mt-md q-mb-none q-pb-none full-width"
                      color="grey-9"
                      label="Cerrar Sesión"
                      unelevated
                      size="sm"
                      @click="logout"
                    />
                  </div>
                </div>
              </q-menu>
            </q-avatar>
            <!--
              <q-btn flat round dense color="white">
                <q-avatar class="bg-white text-primary">
                  {{ initials }}
                </q-avatar>
                <q-menu anchor="bottom right" self="top right">
                  <q-list style="min-width: 150px">
                    <q-item clickable v-close-popup @click="logout">
                      <q-item-section avatar><q-icon name="logout" /></q-item-section>
                      <q-item-section>Cerrar sesión</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
  -->
          </template>
        </div>
      </div>
    </q-toolbar>
  </div>
</template>
      
      
      <script setup>
import { ref, computed, watch } from "vue";
import { useAuthStore } from "stores/authStore";
import { useRouter } from "vue-router";
/* import apiFicha from "src/services/apiFichaTec"; */

const router = useRouter();
const auth = useAuthStore();

console.debug("auth[header.vue]: ", auth.user);
/* let unwatch = null */
const isLoggedIn = computed(() => auth.isAuthenticated);

/* watch(
  () => auth.isAuthenticated,
  async (newVal) => {
    if (newVal && auth.user?.email) {
      // await fetchNotifications();
      auth.iniciarSocket();
    }
  }
); */

const tab = ref("home");

const user = computed(() => auth.user || { name: "" });

const initials = computed(() => {
  const name = user.value.name || "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});

//  Notificaciones
const notifications = ref([]);
const unreadCount = computed(() => notifications.value.length);
/* const notifications = computed(() => auth.notifications)
    const unreadCount = computed(() => notifications.value.length)
    
    //  Obtener notificaciones solo una vez cuando se autentica
    const fetchNotifications = async () => {
      try {
        const res = await apiFicha.getNotiicaciones(auth.user.email)
        notifications.value.push(res.data.notificacioes[0])
        console.log('notifications', res.data.notificacioes)
      } catch (err) {
        console.error('Error obteniendo notificaciones:', err.message)
      }
    } */

/* onMounted(async () => {
      console.log('socket')
      if (auth.isAuthenticated && auth.user?.email) {
        
        await fetchNotifications()
        auth.iniciarSocket()
      }
    
      unwatch = watch(
        () => auth.user?.email,
        async(email) => {
          if (auth.isAuthenticated && email) {
            await fetchNotifications()
            auth.iniciarSocket()
          }
        }
      )
    })
    
    onBeforeUnmount(() => {
      if (unwatch) unwatch()
    })
    
    const handleSeleccionar = (notif) => {
      auth.setUserAprobar(notif)
      localStorage.setItem('notificacionAprobacion', JSON.stringify(notif.correo))
      router.push('consulta')
    }
     */

const logout = async () => {
  await auth.logout();
  router.push("/");
};
</script>
      
      
      <style scoped>
.q-header {
  height: 64px;
}
</style>
      








