
import { querysPSNET } from '../querys/querysPSNET.js';
import { getOraConn } from '../database/oracleConnectionBaan.js';

import oracledb from 'oracledb';

/*export const buscarEmpleado = async (req, res) => {
    try {
        // Obtenemos lo que el usuario escribió en la barra de búsqueda
        const { termino } = req.params; 
        const terminoMinusculas = termino.toLowerCase();
        
        const resultados = mockHumanJSON.filter(empleado => 
            empleado.id.toLowerCase().includes(terminoMinusculas) || 
            empleado.nombre.toLowerCase().includes(terminoMinusculas)
        );
        
        // Devolvemos el resultado al frontend
        res.json(resultados);
    } catch (error) {
        console.error("❌ Error en el mock de búsqueda:", error);
        res.status(500).json({ error: "Error interno al buscar empleado" });
    }
};*/

export const getCatalogoEmpleados = async (req, res) => {
    let oraConn;
    try { 

      oraConn = await getOraConn();
      const resultado = await oraConn.execute(querysPSNET.getCatalogoEmpleados,
       []);
       

    // Verificar que hay resultados
    if (!resultado.rows || resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Empleados no encontrados getCatalogoEmpleados...' });
    }

      //console.log('Resultado...  ', resultado.rows)
      let empleados = resultado.rows;
      console.log(resultado)
      res.json({empleados})
   } catch (err) {
      console.error('Error al obtener getCatalogoEmpleados:', err);
       if (!res.headersSent) {
        res.status(500).json({
              error:'Error al obtener getCatalogoEmpleados',
              detalles: err.message
            });
       }
 } finally {
      if (oraConn) {
        try {
          await oraConn.close(); // ✅ SIEMPRE cerrar
           // console.log('Conexión Oracle cerrada correctamente. en cargarActividades');
        } catch (err) {
          console.error('Error al cerrar conexión en getCatalogoEmpleados:', err);
        }
      }
  }
      
}

export const getEmpleado = async (req, res) => {
  let oraConn;
  const empleado=req.params.numEmpleado;
  try { 

    oraConn = await getOraConn();
    const resultado = await oraConn.execute(querysPSNET.getEmpleado,
     [empleado]);
     

  // Verificar que hay resultados
  if (!resultado.rows || resultado.rows.length === 0) {
    return res.status(404).json({ error: 'Empleados no encontrados getEmpleado...' });
  }

    //console.log('Resultado...  ', resultado.rows)
    let empleados = resultado.rows;
    console.log(resultado)
    res.json({empleados})
 } catch (err) {
    console.error('Error al obtener getEmpleado:', err);
     if (!res.headersSent) {
      res.status(500).json({
            error:'Error al obtener getEmpleado',
            detalles: err.message
          });
     }
} finally {
    if (oraConn) {
      try {
        await oraConn.close(); // ✅ SIEMPRE cerrar
         // console.log('Conexión Oracle cerrada correctamente. en cargarActividades');
      } catch (err) {
        console.error('Error al cerrar conexión en getCatalogoEmpleados:', err);
      }
    }
}
    
}