import { Router } from 'express'
import FormData from 'form-data';
import { authMiddleware,roleMiddleware } from '../middleware/authMiddleware.js'
import multer from 'multer';
import { config } from '../config/config.js'
import axios from 'axios';

const router = Router()
const upload = multer() // o configuración específica

router.post('/post-upload',upload.any(), async (req, res) => {
  
    try {
      let response;
      const url = `${config.BASE_URL_ADJUNTOS}/upload`;
      // Verifica el tipo de contenido de la solicitud
      if (req.is('multipart/form-data')) {
        // Caso form-data: Maneja la solicitud como form-data
        const form = new FormData();
  
        // Añadir todos los campos de texto al form-data
        for (const key in req.body) {
          form.append(key, req.body[key]);
        }
  
        // Añadir los archivos al form-data
        req.files.forEach(file => {
          form.append(file.fieldname, file.buffer, { filename: file.originalname });
        });
  
        // Enviar el form-data al otro servidor
        response = await axios.post(url, form, {
          headers: {
            ...form.getHeaders(), // Obtener y pasar los headers adecuados
          },
        });
      } else {
        return res.status(400).send('Tipo de contenido no soportado.');
      }
  
      // Responder con el resultado del otro servidor
      res.status(response.status).send(response.data);
    } catch (error) {
      console.error('Error al reeenviar la solicitud:', error.message);
      res.status(500).send('Error en el servidor.');
    }
  });

  // Nueva ruta para obtener archivos desde el backend
router.get('get-files/:filename', async (req, res) => {
const { tipo, checklist, filename } = req.params;

try {
// http://localhost:3100/files/Entrada/1/1727392906454.pdf
// Construye la URL del archivo en el backend
const url = `${config.BASE_URL_ADJUNTOS}/files/${filename}`;
console.log(url)

// Realiza la solicitud GET al otro servidor
const response = await axios.get(url, {
  responseType: 'arraybuffer', // Esto es importante para manejar archivos binarios
});

// Establece los headers adecuados para la respuesta
res.setHeader('Content-Type', response.headers['content-type']);
res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

// Envía el archivo como respuesta
res.status(response.status).send(response.data);
} catch (error) {
console.error('Error al obtener el archivo:', error.message);
res.status(500).send('Error en el servidor al obtener el archivo.');
}
});

export default router
