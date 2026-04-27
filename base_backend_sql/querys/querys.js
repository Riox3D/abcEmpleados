export const querys = {



  getUser: `SELECT EmpleadoID, nombre, correo, numEmp
    FROM Empleados where correo = @correo`,

  getUserID: `SELECT EmpleadoID, nombre, correo,numEmp
    FROM Empleados where EmpleadoID = @EmpleadoID`,
  insertEmpleado: `
    INSERT INTO Empleados ( numEmp, nombre, correo)
    VALUES ( @numEmp, @nombre, @correo)
  `,


  selectRol: `
    SELECT * FROM Roles WHERE numEmp = @numEmp and estatus = 1
  `,


};


