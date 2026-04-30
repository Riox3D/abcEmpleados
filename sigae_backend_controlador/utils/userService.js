import { config } from '../config/config.js'
import axios from 'axios';

// Definir la URL base desde las variables de entorno
const BASE_URL = process.env.VITE_URLSQL;

export async function checkUserInDatabase(email) {
  try {
    const response = await axios.get(`${config.URL_SQL}/apiDBLogin/login/${email}`);
    if (response.status === 200) {
      return response.data; // Suponiendo que tu endpoint retorna { exists: true/false }
    } else {
      console.error('Error checking user in database:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error checking user in database:', error);
    return false;
  }
}
export async function checkUserADInDatabase(email) {
  try {
 
    const response = await axios.get(`${config.URL_SQL}/apiDBLogin/loginAdParameters`);
    if (response.status === 200) {
      return response.data; // Suponiendo que tu endpoint retorna { exists: true/false }
    } else {
      console.error('Error checking user in database:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error checking user in database:', error);
    return false;
  }
}
