import { sql, poolPromise } from '../database/sqlConnection.js';

import { querys } from '../querys/querys.js';


const getUsers = async (req, res) => {
  try {
    let { correo } = req.params;

    // Usuario genérico en caso de no tener SQL
    const genericUser = {
      EmpleadoID: 0,
      nombre: "Usuario Genérico",
      numEmp: 99999,
      role: "user"
    };

    let userFromSQL = null;
    let roleFromSQL = "user";

    // Intentar conexión SQL (puede fallar)
    try {
      const pool = await poolPromise;

      // Buscar usuario
      const resultUser = await pool.request()
        .input('correo', correo)
        .query(querys.getUser);

      // Si no existe, insertarlo
      if (resultUser.recordset.length === 0) {
        await pool.request()
          .input('nombre', genericUser.nombre)
          .input('numEmp', genericUser.numEmp)
          .input('correo', correo)
          .query(querys.insertEmpleado);
      }

      // Recuperarlo ya insertado
      const resultUser2 = await pool.request()
        .input('correo', correo)
        .query(querys.getUser);

      userFromSQL = resultUser2.recordset[0];

      // Obtener rol
      const resultRole = await pool.request()
        .input('numEmp', userFromSQL.numEmp)
        .query(querys.selectRol);

      if (resultRole.recordset.length > 0 && resultRole.recordset[0].nombreRol) {
        roleFromSQL = resultRole.recordset[0].nombreRol;
      }

    } catch (sqlErr) {
      console.log("❗ No hay conexión a SQL Server, usando usuario genérico");
      console.log(sqlErr.message);
    }

    // Si no hay SQL, usar valores genéricos.
    const finalUser = userFromSQL
      ? {
          id: userFromSQL.EmpleadoID,
          email: correo,
          name: genericUser.nombre,
          numEmp: userFromSQL.numEmp,
          role: roleFromSQL,
          source: "dev-mode (SQL OK, sin Oracle)"
        }
      : {
          id: genericUser.EmpleadoID,
          email: correo,
          name: genericUser.nombre,
          numEmp: genericUser.numEmp,
          role: genericUser.role,
          source: "dev-mode (NO SQL, sin Oracle)"
        };

    return res.json(finalUser);

  } catch (err) {
    console.log("❗ Error general:", err.message);

    // respuesta ultra fallback
    return res.json({
      id: 0,
      email: "desconocido",
      name: "Usuario Genérico",
      numEmp: 99999,
      role: "user",
      source: "fallback-total"
    });
  }
};



const getUserCheck = async (req, res) => {
  try {
    const { id } = req.params;

    const genericUser = {
      EmpleadoID: 0,
      correo: "generico@local.test",
      nombre: "Usuario Genérico",
      numEmp: 99999,
      role: "user"
    };

    let userSQL = null;
    let roleSQL = "user";

    try {
      const pool = await poolPromise;

      // Buscar usuario por ID
      const userResult = await pool.request()
        .input('EmpleadoID', id)
        .query(querys.getUserID);

      if (userResult.recordset.length > 0) {
        userSQL = userResult.recordset[0];

        // Buscar rol
        const roleResult = await pool.request()
          .input('numEmp', userSQL.numEmp)
          .query(querys.selectRol);

        if (roleResult.recordset.length > 0 && roleResult.recordset[0].nombreRol) {
          roleSQL = roleResult.recordset[0].nombreRol;
        }
      }

    } catch (sqlErr) {
      console.log("❗ SQL Server NO disponible en getUserCheck, usando usuario genérico");
      console.log(sqlErr.message);
    }

    // Si no hubo SQL, usar genérico
    const finalUser = userSQL
      ? {
          id: userSQL.EmpleadoID,
          email: userSQL.correo,
          name: userSQL.nombre,
          numEmp: userSQL.numEmp,
          role: roleSQL,
          source: "dev-mode (SQL OK)"
        }
      : {
          id: genericUser.EmpleadoID,
          email: genericUser.correo,
          name: genericUser.nombre,
          numEmp: genericUser.numEmp,
          role: genericUser.role,
          source: "dev-mode (NO SQL)"
        };

    return res.json(finalUser);

  } catch (err) {
    console.log("❗ Error general en getUserCheck:", err.message);

    return res.json({
      id: 0,
      email: "fallback@local.test",
      name: "Usuario Genérico",
      numEmp: 99999,
      role: "user",
      source: "fallback-total"
    });
  }
};





export { getUsers, getUserCheck };
