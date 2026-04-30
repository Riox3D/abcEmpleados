import { querySqlService } from '../utils/sqlService.js'
import axios from "axios";
import { config } from '../config/config.js'

export const proxyToSql = async (req, res) => {
  try {
    
    const endpoint = req.originalUrl // quita /sql/
    const method = req.method.toLowerCase() // post, get, put, delete...
    const data = {
      body: req.body,
      query: req.query,
    }

    const result = await querySqlService(endpoint, method, data)
    if (result.status === 204) {
      return res.status(204).send() // ✅ No Content
    }else{
      res.status(200).json(result.data)
    }
  
  } catch (error) {
    res.status(error.status || 500).json(error.data || { message: 'Error inesperado en proxy' })
  }
}


export const proxyToSqlAuth = async (req, res) => {
  try {
    // 1. Usamos claveEmpleado para que coincida con tu BD
    const userId = req.user?.id || '999999';
    const claveEmpleado = req.user?.claveEmpleado || '000000'; // Cambiado de numEmp a claveEmpleado[cite: 2]

    console.log('Probando con Usuario:', userId, 'Clave Empleado:', claveEmpleado);

    // 2. Quitamos /api y armamos la ruta final[cite: 2]
    const endpoint = `${req.originalUrl.replace('/api', '')}/${userId}/${claveEmpleado}`; 
    
    const method = req.method.toLowerCase();
    const data = {
      body: req.body,
      query: req.query,
    };

    const result = await querySqlService(endpoint, method, data);
    
    if (result.status === 204) {
      return res.status(204).send();
    } else {
      return res.status(200).json(result.data);
    }
  
  } catch (error) {
    console.error('Error en Proxy:', error);
    return res.status(error.status || 500).json(error.data || { message: 'Error inesperado en proxy' });
  }
};

export const proxyToSqlAuthRol = async (req, res) => {
  try {
    const userId = req.user?.id || '999999';
    const userNumEmp = req.user?.numEmp || '000000';
    const userRole = req.user?.role || 'admin'; // Rol de prueba

    // Aplicamos el mismo replace aquí[cite: 5]
    const endpoint = `${req.originalUrl.replace('/api', '')}/${userId}/${userNumEmp}/${userRole}`; 
    
    const method = req.method.toLowerCase();
    const data = {
      body: req.body,
      query: req.query,
    };

    const result = await querySqlService(endpoint, method, data);
    return res.status(result.status || 200).json(result.data);
  
  } catch (error) {
    return res.status(error.status || 500).json(error.data || { message: 'Error en proxy con Rol' });
  }
};





export const proxyToSqlNotify = async (req, res) => {
  try {
    const endpoint = `${req.originalUrl}/${req.user.id}/${req.user.numEmp}`;
    const method = req.method.toLowerCase();
    const data = {
      body: req.body,
      query: req.query,
    };

    // 🔹 1. Ejecutar query en SQL
    const result = await querySqlService(endpoint, method, data);

    if (result.status === 204) {
      return res.status(204).send(); // ✅ no content
    }
console.log('result.data',result.data)
    // 🔹 2. Construir datos para correo
    const dynamicData = {
      name: result?.data?.planeacion?.nombreEmpleado,
      idProyecto: result?.data?.planeacion?.idProyecto,
      adminProyecto: result?.data?.correo?.nombre,
      link: config.FRONTEND_URL,
    };
  
    const body = {
      to: result?.data?.planeacion?.correo, // o result?.data?.planeacion?.correo
      subject: "Notificación de Activación",
      templateName: "fhActivar",
      dynamicData,
    };

    try {
      // 🔹 3. Intentar enviar correo
      await axios.post(config.BASE_URL_NOTIFY, body);

      // 🔹 4. Todo salió bien (SQL + correo)
      return res.status(200).json({
        successCorreo: true,
        message: "Actualización realizada y correo enviado correctamente",
      
      });

    } catch (notifyErr) {
      console.error("⚠️ Error al enviar correo:", notifyErr.message);

      // 🔹 5. SQL sí se actualizó, pero correo falló
      return res.status(200).json({
        successCorreo: false,
        message: "La actualización se realizó, pero no se pudo enviar el correo",
      
      });
    }

  } catch (error) {
    console.error("❌ Error en proxyToSqlNotify:", error);
    res.status(error.status || 500).json(
      error.data || { success: false, message: "Error inesperado en proxy" }
    );
  }
};

export const proxyToSqlNotifyEnviar = async (req, res) => {
  try {
    const endpoint = `${req.originalUrl}/${req.user.id}/${req.user.numEmp}`;
    const method = req.method.toLowerCase();
    const data = {
      body: req.body,
      query: req.query,
    };

    // 🔹 1. Ejecutar query en SQL
    const result = await querySqlService(endpoint, method, data);

    if (result.status === 204) {
      return res.status(204).send(); // ✅ no content
    }else if (result.status === 206) {
      return res.status(206).send(); // ✅ no content
    }
    else if (result.status === 208) {
      return res.status(208).send(); // ✅ no content
    }
  
    // 🔹 2. Construir datos para correo
    const dynamicData = {
      idProyecto: `${result?.data?.planeacion?.idProyecto}-${result?.data?.planeacion?.nombreProyecto}`,
      nombreEmpleado: result?.data?.planeacion?.nombreEmpleado,
      presupuestoHoraIngenieria: result?.data?.planeacion?.presupuestoHoraIngenieria,
      presupuestoAsignado: result?.data?.planeacion?.presupuestoAsignado,
      link: config.FRONTEND_URL,
    };
    console.log('dynamicData',dynamicData)
    console.log('result?.data?.correos',result?.data?.correos)


    const body = {
      to: result?.data?.correos, // o result.data?.correo
      subject: "Notificación de Solicitud de Activación",
      templateName: "fhEnvio",
      dynamicData,
    };

    try {
      // 🔹 3. Intentar enviar correo
      await axios.post(config.BASE_URL_NOTIFY, body);

      // 🔹 4. Todo salió bien (SQL + correo)
      return res.status(200).json({
        successCorreo: true,
        message: "Actualización realizada y correo enviado correctamente",
      
      });

    } catch (notifyErr) {
      console.error("⚠️ Error al enviar correo:", notifyErr.message);

      // 🔹 5. SQL sí se actualizó, pero correo falló
      return res.status(200).json({
        successCorreo: false,
        message: "La actualización se realizó, pero no se pudo enviar el correo",
      
      });
    }

  } catch (error) {
    console.error("❌ Error en proxyToSqlNotify:", error);
    res.status(error.status || 500).json(
      error.data || { success: false, message: "Error inesperado en proxy" }
    );
  }
};


