import { ref, computed } from 'vue'

// Estado global del usuario
const usuarioLogueado = ref({
  nombre: 'Administrador', 
  rol: 'Admin',              // Cambiamos 'rh' por 'admin' para tu prueba
  claveEmpleado: 'ADM001',   // Asegúrate de que este ID exista en tu SQL
})

export function useAuth() {
  
  const simularInicioSesion = (nuevoRol, nuevoNombre, nuevaClave) => {
    usuarioLogueado.value = {
      nombre: nuevoNombre,
      rol: nuevoRol,
      claveEmpleado: nuevaClave,
    }
  }

  // Computed properties para verificar roles
  const esAdmin = computed(() => usuarioLogueado.value?.rol === 'admin') // NUEVO[cite: 5]
  const esRH = computed(() => usuarioLogueado.value?.rol === 'rh' || usuarioLogueado.value?.rol === 'admin') // El admin suele ver lo de RH
  const esValidadorTI = computed(() => usuarioLogueado.value?.rol === 'validador_ti')
  const esGerente = computed(() => usuarioLogueado.value?.rol === 'gerente')
  const esResponsable = computed(() => usuarioLogueado.value?.rol === 'responsable')

  return {
    usuarioLogueado,
    esAdmin, // Agregado al return[cite: 5]
    esRH,
    esValidadorTI,
    esGerente,
    esResponsable,
    simularInicioSesion
  }
}