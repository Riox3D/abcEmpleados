
export const querys = {
  
  getUser: "SELECT * FROM usuarios WHERE claveEmpleado = @claveEmpleado",
  

  insertUsuario: "INSERT INTO usuarios (claveEmpleado, idrol, estatus) VALUES (@claveEmpleado, @idrol, 1)",
  
  
  selectRol: `
    SELECT r.rol 
    FROM Roles r 
    INNER JOIN usuarios u ON r.idRol = u.idrol 
    WHERE u.claveEmpleado = @claveEmpleado
  `,
  
 
  getUserByID: "SELECT * FROM usuarios WHERE idUsuario = @idUsuario"
};