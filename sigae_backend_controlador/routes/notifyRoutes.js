import { Router } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { authMiddleware,roleMiddleware } from '../middleware/authMiddleware.js'
import multer from 'multer';
import { config } from '../config/config.js'

const router = Router();
const upload = multer(); // Configuración de multer para manejar archivos en la memoria

// Ruta para recibir y reenviar FormData con archivos
router.post('/post-notify', upload.any(),authMiddleware,roleMiddleware, async (req, res) => {
  try {
   
    let response;

    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      const form = new FormData();

      // Campos de texto
      for (const key in req.body) {
        form.append(key, req.body[key]);
      }

      // Archivos
      if (Array.isArray(req.files)) {
        req.files.forEach(file => {
          form.append(file.fieldname, file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
          });
        });
      }

      // Reenvío a servicio de notificación
      response = await axios.post(config.BASE_URL_NOTIFY, form, {
        headers: form.getHeaders(),
      });

    } else if (contentType.includes('application/json')) {
      response = await axios.post(config.BASE_URL_NOTIFY, req.body, {
        headers: { 'Content-Type': 'application/json' },
      });

    } else {
      return res.status(400).json({ message: 'Tipo de contenido no soportado.' });
    }

    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Error al reenviar la solicitud:', error.message);
    res.status(500).json({ message: 'Error en el servidor.', error: error.message });
  }
});

      
export default router;