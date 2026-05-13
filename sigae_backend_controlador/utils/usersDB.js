
import { config } from '../config/config.js'
import axios from 'axios';

// Definir la URL base desde las variables de entorno
const BASE_URL = config.URL_SQL;

//Esto es solo temporal, esto se tiene que buscar en BD
export async function autenticarUsuario(payload) {
  try {
    console.log('autenticarUsuario URL: ',`${BASE_URL}/login/users/${payload.email}`)
    const response = await axios.get(`${BASE_URL}/login/users/${payload.email}`);
   console.log('autenticarUsuario response: ',response.data)

    const user = response.data;
  
    if (!user) {
      return null; // <- en vez de lanzar error
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      numEmp: user.numEmp,
   
    };

  } catch (error) {
    console.error('Error al autenticar:', error.message);

    // Si el error viene porque no lo encontró, axios puede lanzar 404
    if (error.response && error.response.status === 404) {
      return null; // usuario no encontrado
    }

    // Otros errores (como de red o servidor), sí deben lanzarse
    throw new Error('Error del servidor al validar el usuario');
  }
}

export async function obtenerUsuarioPorId(id) {
  try {
    const response = await axios.get(`${BASE_URL}/login/users/id/${id}`);
    console.log('obtenerUsuarioPorId URL: ',`${BASE_URL}/login/users/id/${id}`)
    const user = response.data;
    console.log('obtenerUsuarioPorId: ',user)
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      numEmp: user.numEmp,
    };

  } catch (error) {
    console.error('Error al obtener usuario:', error.message);

    if (error.response && error.response.status === 404) {
      return null;
    }

    throw new Error('Error al buscar usuario por ID');
  }
}



//Esto es solo temporal, esto se tiene que buscar en BD // Para rutas
export const menusByRole = {
  user: [

    { label: 'Inspeccion', icon: 'edit_calendar', to: '/dashboard' } ,
   
    
  ],
  admin: [
  
    { label: 'Inspeccion', icon: 'edit_calendar', to: '/dashboard' } ,
  
  ],

}
