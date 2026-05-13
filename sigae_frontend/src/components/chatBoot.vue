<template>
  <div>
    <!-- Botón flotante -->
    <div class="chatbot-toggle" @click="toggleMinimized">
      <img src="~assets/chatbot.png" alt="Abrir ChatBot" />
    </div>

    <!-- Ventana del chat -->
    <div v-if="!minimized" class="chatbot-window">
      <div class="chatbot-header">
        <span>Tutoriales</span>
        <button class="close-btn" @click="toggleMinimized">✕</button>
      </div>
      <div class="chatbot-body">
        <ul>
          <li v-for="(item, index) in tutoriales" :key="index">
            <!-- El label actúa como botón -->
            <a 
              class="video-label" 
              href="javascript:void(0)" 
              @click="abrirVideo(index)"
            >
              {{ item.label }}
            </a>

            <!-- Solo se muestra el video si fue seleccionado -->
            <video
              v-if="videoActivo === index"
              width="100%"
              height="200"
              controls
              :src="item.link"
              preload="metadata"
            ></video>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref } from "vue";
  import { useQuasar } from 'quasar'

  const $q = useQuasar()
  const minimized = ref(true);
  const videoActivo = ref(null);


  
  const tutoriales = ref([]);
  
  const toggleMinimized = async () => {
  try {
    $q.loading.show()
/*     let sistemaClave = "SISRA"
    const response = await apiPlaneacion.getCatTutoriales(sistemaClave)
    tutoriales.value = response.data.catTutoriales */
    minimized.value = !minimized.value;
    videoActivo.value = null; // cerrar videos al minimizar

    $q.loading.hide()
  } catch (error) {
    $q.loading.hide()
    $q.notify({
      type: 'negative',
      message: 'Error con el servidor'
    })
  }
  
  };

  function abrirVideo(index) {
  videoActivo.value = index;
}
  </script>
  
  <style scoped>
  .video-label {
  margin-bottom: 4px;
  font-weight: 600;
  color: #333;
}

.chatbot-toggle {
  position: fixed;
  bottom: 290px;
  right: 20px;
  z-index: 2000;
  cursor: pointer;
  box-shadow: 
    0 6px 18px 0 rgba(0,0,0,0.30), /* Sombra principal */
    0 1.5px 12px 0 rgba(60,60,60,0.18); /* Sombra difusa secundaria */
  border-radius: 50%; /* Mantiene la sombra redonda */
  background: #f5f5f5;  /* Mejora contraste si el fondo es claro */
  transition: box-shadow 0.2s;
}
.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 
    0 12px 24px 0 rgba(28,60,130,0.35), /* Más sombra al hacer hover */
    0 2px 16px 0 rgba(60,60,60,0.20);
}

  
  .chatbot-toggle img {
    width: 80px;
    height: 80px;
  }
  
  .chatbot-window {
    position: fixed;
    bottom: 290px;
    right: 20px;
    width: 300px;
    max-height: 400px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  }
  
  .chatbot-header {
    background: #1976d2;
    color: white;
    padding: 10px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .chatbot-header .close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  .chatbot-body {
    padding: 10px;
    overflow-y: auto;
  }
  
  .chatbot-body ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .chatbot-body li {
    margin: 8px 0;
  }

  
  
  .chatbot-body a {
    text-decoration: none;
    color: #1976d2;
    font-weight: 500;
  }
  .chatbot-body a:hover {
    text-decoration: underline;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 600px) {
    .chatbot-toggle {
      bottom: 30px;
      right: 16px;
      width: 60px;
      height: 60px;
    }
    .chatbot-toggle img {
      width: 54px;
      height: 54px;
    }
    .chatbot-window {
      width: 95vw;
      right: 2vw;
      bottom: 110px;
      max-height: 70vh;
    }
  }
  @media (min-width: 601px) and (max-width: 1024px) {
    .chatbot-toggle {
      bottom: 300px;
      right: 10px;
      width: 70px;
      height: 70px;
    }
    .chatbot-toggle img {
      width: 64px;
      height: 64px;
    }
    .chatbot-window {
      width: 300px;
      right: 10px;
      bottom: 300px;
      max-height: 380px;
    }
  }
  
  </style>
 
  