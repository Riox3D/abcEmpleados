import express from 'express';
const router = express.Router();
import { getUsers, getUserCheck } from '../controllers/userController.js';

// Rutas para obtener y crear usuarios
router.get('/users/:correo', getUsers);
router.get('/users/id/:id', getUserCheck);

export default router;
