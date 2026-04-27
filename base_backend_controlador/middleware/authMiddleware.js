import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.tokenjson
  console.log('authMiddleware: ',token)
  if (!token) return res.status(401).json({ message: 'No autenticado' })

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}

export const roleMiddleware = (rolesPermitidos = []) => {
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ message: 'No autenticado' })
  
      if (!rolesPermitidos.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado: no tienes permiso' })
      }
  
      next()
    }
  }

  export const verifySocketJWT = (socket, next) => {
    try {
      // Obtener token desde cookies o headers del handshake
      const token = socket.handshake.auth.token || socket.handshake.headers['cookie']?.split('tokenjson=')[1]?.split(';')[0]
  
      if (!token) return next(new Error('No autenticado'))
  
      const decoded = jwt.verify(token, config.JWT_SECRET)
      socket.user = decoded // puedes usar socket.user después
      next()
    } catch (err) {
      next(new Error('Token inválido'))
    }
  }
  
  