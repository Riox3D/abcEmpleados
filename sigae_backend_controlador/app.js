import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config/config.js'
import authRoutes from './routes/authRoutes.js'
import notifyRoutes from './routes/notifyRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import solicitudesRouter from './routes/solicitudesRoutes.js'
import catalogosRouter from './routes/catalogosRoutes.js'
import empleadosRoutes from './routes/empleadosRoutes.js';

import { createServer } from 'http'


/* import { Server } from 'socket.io'
import { verifySocketJWT } from './middleware/authMiddleware.js'
import { socketHandlers } from './sockets/socketHandlers.js'
 */

const app = express()
const httpServer = createServer(app)

// Configura socket.io
/* const io = new Server(httpServer, {
  cors: {
    origin: config.FRONTEND_URL,
    credentials: true
  }
}) */

// Eventos de conexión y seguridad
/* io.use(verifySocketJWT)
io.on('connection', (socket) => socketHandlers(socket, io))
 */


// Middleware y rutas
app.use(express.json())
app.use(cookieParser())
app.use('/api/empleados', empleadosRoutes);
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}))

app.use('/auth', authRoutes)
app.use('/notify', notifyRoutes)
app.use('/file', fileRoutes)
//app.use('/ra', sqlRARoutes)
app.use('/api/solicitudes', solicitudesRouter);
app.use('/api/catalogos', catalogosRouter);

// Inicia servidor HTTP (Express)
httpServer.listen(config.PORT, () => {
  console.log(`Servidor HTTP corriendo en http://localhost:${config.PORT}`)
})
