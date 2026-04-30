
  const usuariosConectados = new Map()
  export const socketHandlers = (socket, io) => {
    console.log('Cliente conectado:', socket.id, 'Usuario:', socket.user.email)
  
    // Guarda el socket ID asociado al correo
    if (socket.user?.email) {
      usuariosConectados.set(socket.user.email, socket.id)
    }
  
    // Elimina el socket cuando se desconecta
    socket.on('disconnect', () => {
      if (socket.user?.email) {
        usuariosConectados.delete(socket.user.email)
        console.log(`Usuario desconectado: ${socket.user.email}`)
      }
    })
  
    //  Ejemplo básico: enviar notificación a un jefe
    socket.on('enviar_notificacion', (notifArray) => {
      notifArray.forEach(notif => {
        const correoJefe = notif.correoJefe
        const socketIdJefe = usuariosConectados.get(correoJefe)
        console.log('notif',notif)
        if (socketIdJefe) {
          io.to(socketIdJefe).emit('nueva_notificacion', {
            mensaje: `Nueva solicitud de ${notif.nombre}`,
            data: notif
          })
          console.log(`✅ Notificación enviada a ${correoJefe}`)
        } else {
          console.log(`⚠️ El jefe ${correoJefe} no está conectado`)
        }
      })
    })
  
    // Escuchar eventos del cliente
    socket.on('cliente_listo', () => {
      console.log('El cliente está listo')
    })
  }
  