import { Router } from 'express'
import { login, me, logout, loginAD,getMenuByRole } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { check } from 'express-validator'

const router = Router()

router.post('/login', login)
router.post('/loginAD',[
    check('username').notEmpty().withMessage('El nombre de usuario es requerido'),
    check('password').notEmpty().withMessage('La contraseña es requerida'),
  ], loginAD)
router.get('/me', authMiddleware, me)
router.post('/logout', logout)
router.get('/menu', authMiddleware, getMenuByRole)

export default router