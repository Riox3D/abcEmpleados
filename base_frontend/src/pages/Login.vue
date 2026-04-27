<template>
  <q-page
    :class="[$q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-2']"
    class="flex flex-center"
  >
    <q-card
      class="q-pa-lg shadow-2 rounded-borders login-card bg-white text-black"
    >
      <div class="text-h5 text-center q-mb-md">Iniciar sesión</div>

      <q-form @submit.prevent="login">
        <q-input
          filled
          v-model="username"
          label="Usuario"
          dense
          class="q-mb-md"
          lazy-rules
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <q-input
          filled
          v-model="password"
          label="Contraseña"
          type="password"
          dense
          class="q-mb-md"
          lazy-rules
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <q-btn
          label="Iniciar Sesión"
          type="submit"
          color="primary"
          class="full-width q-mb-sm"
        />
      </q-form>

      <div class="text-caption text-center q-mt-md q-mb-xs">
        o inicia sesión con
      </div>

      <div
        id="g_id_onload"
        :data-client_id="googleClientId"
        data-login_uri="http://localhost:9000"
        data-auto_prompt="false"
      ></div>
      <div class="flex justify-center q-pb-md">
        <div
          class="g_id_signin"
          data-type="standard"
          data-theme="filled_blue"
          data-onsuccess="onSignIn"
        ></div>
      </div>
    </q-card>
  </q-page>
</template>
  
<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/authStore";
import apiLogin from "src/services/apiLogin";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const googleClientId = import.meta.env.VITE_CLIENT_ID;
const username = ref("");
const password = ref("");

watchEffect(async () => {
  if (authStore.isAuthenticated) {
    router.push("/home");
  }
});

const login = async () => {
  try {
    $q.loading.show();
    const res = await apiLogin.postAD({
      username: username.value,
      password: password.value,
    });
    // Asignar usuario al store
    authStore.setUser(res.data.user);
    const resMenu = await apiLogin.getMenu();
    authStore.setMenu(resMenu.data);
    password.value = "";
    router.push("/home");
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message:
        error.response?.data?.message ||
        "Error al iniciar sesión. Intenta de nuevo.",
    });
  } finally {
    $q.loading.hide();
  }
};

const onSignIn = async (googleUser) => {
  try {
    $q.loading.show();

    const token = googleUser.credential;
    const res = await apiLogin.postLoginGoogle({ idToken: token });
    authStore.setUser(res.data.user);
    const resMenu = await apiLogin.getMenu();
    authStore.setMenu(resMenu.data);
    $q.loading.hide();
    router.push("/home");
  } catch (error) {
    console.log("Error Login...", error);
    $q.loading.hide();
    if (error.response.status == 401) {
      $q.notify({
        type: "negative",
        message: "Usuario no registrado",
      });
    } else if (error.response.status == 403) {
      $q.notify({
        type: "negative",
        message: "Error al iniciar con Google",
      });
    } else {
      $q.notify({
        type: "negative",
        message: "Error en el servidor",
      });
    }
  } finally {
    $q.loading.hide();
  }
};

const initGoogleSignIn = () => {
  if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: onSignIn,
    });

    google.accounts.id.renderButton(document.querySelector(".g_id_signin"), {
      type: "standard",
      theme: "filled_blue",
      size: "large",
    });
  } else {
    console.error("Google Sign-In no está cargado correctamente");
  }
};

onMounted(async () => {
  $q.dark.set(false);
  setTimeout(initGoogleSignIn, 1000);
});
</script>
  
<style scoped>
.login-card {
  width: 100%;
  max-width: 380px;
  border-radius: 16px;
  background: white;
}

@media (prefers-color-scheme: dark) {
  .login-card {
    background: #1e1e1e;
    color: white;
  }
}
</style>
  