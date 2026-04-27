// googleAuth.js
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/config.js'


// Definir la URL base desde las variables de entorno
const urlCliente = config.CLIENT_ID;
const CLIENT_ID = urlCliente;
const client = new OAuth2Client(CLIENT_ID);
export async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}
