import { sql, poolPromise } from '../database/sqlConnection.js';
import { querys } from '../querys/querys.js';

const getUsers = async (req, res) => {
  try {
    console.log('prueba')
    let { correo } = req.params;
    const claveExtraida = correo.split('@')[0];

    const genericUser = {
      idUsuario: 0,
      nombre: "Usuario Genérico",
      claveEmpleado: "999999",
      rol: "user" // Cambiado de role a rol
    };

    let userFromSQL = null;
    let rolFromSQL = "user"; // Cambiado para consistencia

    try {
      const pool = await poolPromise;

      const resultUser = await pool.request()
        .input('claveEmpleado', sql.NVarChar, claveExtraida)
        .query(querys.getUser);

      if (resultUser.recordset.length === 0) {
        await pool.request()
          .input('claveEmpleado', sql.NVarChar, claveExtraida)
          .input('idrol', sql.Int, 1) 
          .query(querys.insertUsuario);
      }

      const resultUser2 = await pool.request()
        .input('claveEmpleado', sql.NVarChar, claveExtraida)
        .query(querys.getUser);

      userFromSQL = resultUser2.recordset[0];

      const resultRole = await pool.request()
        .input('claveEmpleado', sql.NVarChar, userFromSQL.claveEmpleado)
        .query(querys.selectRol);

      if (resultRole.recordset.length > 0) {
        // Obtenemos el valor de la columna 'rol' de la DB
        rolFromSQL = resultRole.recordset[0].rol; 
      }

    } catch (sqlErr) {
      console.log("❗ Usando usuario genérico (Sin SQL)");
    }

    const finalUser = userFromSQL
      ? {
          id: userFromSQL.idUsuario,
          email: correo,
          name: "Cristian Cortes", 
          claveEmpleado: userFromSQL.claveEmpleado,
          role: rolFromSQL, // Cambiado de role a rol
          source: "SQL-Server-OK"
        }
      : {
          id: genericUser.idUsuario,
          email: correo,
          name: genericUser.nombre,
          claveEmpleado: genericUser.claveEmpleado,
          role: genericUser.rol, // Cambiado de role a rol
          source: "Modo-Desarrollador"
        };

    return res.json(finalUser);

  } catch (err) {
    return res.json({ id: 0, name: "Error Fallback", rol: "user" }); // Cambiado
  }
};



const getUserMe = async (req, res) => {
  try {
    console.log('prueba',req.params)
    const{id}=req.params;
    if(id){
      res.json({
        id: 0,
        email: 'josec.chavez@cidesi.edu.mx',
        name: 'Usuario Genérico',
        claveEmpleado: '999999',
        role: 'user',
        source: 'Modo-Desarrollador'

    })
  }

  } catch (error) {
    
  }
};

export { getUsers, getUserMe };