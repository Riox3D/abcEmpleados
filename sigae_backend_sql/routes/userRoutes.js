import express from 'express';
const router = express.Router();
import { getUsers, getUserMe } from '../controllers/userController.js';

// Rutas para obtener y crear usuarios
router.get('/users/:correo', getUsers);
router.get('/users/id/:id', getUserMe);

export default router;
