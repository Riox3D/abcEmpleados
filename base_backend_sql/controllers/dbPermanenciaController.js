
import { sql, poolPromise } from '../database/sqlConnection.js';


// =======================
// EMPLEADOS
// =======================

/* export const getEmployeeAttendance = async (req, res) => {
  const { EmpleadoID, year, month } = req.params;

  try {
    const pool = await poolPromise;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await pool.request()
      .input('EmpleadoID', sql.Int, EmpleadoID)
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        SELECT 
          pd.*,
          CASE WHEN pd.horaEntrada > '08:15:00' THEN 1 ELSE 0 END as isLate,
          CASE WHEN pd.totalHorasDia = 0 THEN 1 ELSE 0 END as isAbsence,
          e.nombreCompleto
        FROM PermanenciaDiaria pd
        INNER JOIN Empleados e ON pd.EmpleadoID = e.EmpleadoID
        WHERE pd.EmpleadoID = @EmpleadoID 
          AND pd.fechaDia BETWEEN @startDate AND @endDate
        ORDER BY pd.fechaDia ASC
      `);

    res.json({ attendance: result.recordset });
  } catch (err) {
    res.status(500).send(err.message);
  }
};





export const getEmployeeMonthStats = async (req, res) => {
  const { EmpleadoID, year, month } = req.params;

  try {
    const pool = await poolPromise;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await pool.request()
      .input('EmpleadoID', sql.Int, EmpleadoID)
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        SELECT 
          COUNT(*) as totalDias,
          SUM(totalHorasDia) as totalHoras,
          SUM(CASE WHEN totalHorasDia > 0 THEN 1 ELSE 0 END) as diasAsistidos,
          SUM(CASE WHEN horaEntrada > '08:15:00' AND horaEntrada IS NOT NULL THEN 1 ELSE 0 END) as retardos,
          SUM(CASE WHEN totalHorasDia = 0 THEN 1 ELSE 0 END) as ausencias
        FROM PermanenciaDiaria 
        WHERE EmpleadoID = @employeeId 
          AND fechaDia BETWEEN @startDate AND @endDate
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};



export const getEmployeeNotifications = async (req, res) => {
  const { EmpleadoID } = req.params;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('EmpleadoID', sql.Int, EmpleadoID)
      .query(`
        SELECT TOP 5
          'Retardo frecuente' as title,
          CONCAT('Has acumulado ', retardos, ' retardos este mes') as message,
          fechaDia as date,
          'warning' as icon,
          'orange' as color
        FROM (
          SELECT COUNT(*) as retardos, MONTH(fechaDia) as mes
          FROM PermanenciaDiaria 
          WHERE EmpleadoID = @employeeId 
            AND YEAR(fechaDia) = YEAR(GETDATE())
            AND horaEntrada > '08:15:00'
          GROUP BY MONTH(fechaDia)
          HAVING COUNT(*) >= 5
        ) r
        UNION ALL
        SELECT TOP 5
          'Faltas acumuladas' as title,
          CONCAT('Tienes ', faltas, ' faltas registradas') as message,
          fechaDia as date,
          'error' as icon,
          'negative' as color
        FROM (
          SELECT COUNT(*) as faltas, MAX(fechaDia) as fechaDia
          FROM PermanenciaDiaria 
          WHERE EmpleadoID = @employeeId 
            AND YEAR(fechaDia) = YEAR(GETDATE())
            AND totalHorasDia = 0
          GROUP BY MONTH(fechaDia)
          HAVING COUNT(*) >= 2
        ) f
        ORDER BY date DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getPermanencia = async (req, res) => {
  const { EmpleadoID } = req.params; // EmpleadoID
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('EmpleadoID', sql.Int, EmpleadoID)
      .query("SELECT * FROM PermanenciaDiaria WHERE EmpleadoID = @EmpleadoID ORDER BY fechaDia DESC");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
}; */


// 1. DATOS CALENDARIO (DualCalendar) - Mantiene el original corregido
export const getEmployeeAttendance = async (req, res) => {
  const { EmpleadoID, year, month } = req.params;
  try {
    const pool = await poolPromise;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await pool.request()
      .input('EmpleadoID', sql.Int, EmpleadoID)
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        SELECT 
          CONVERT(VARCHAR(10), fechaDia, 23) as fechaDia,  -- "2025-12-01"
          CONVERT(VARCHAR(8), horaEntrada, 108) as horaEntrada,  -- "08:00:00"
          CONVERT(VARCHAR(8), horaSalida, 108) as horaSalida,    -- "17:15:00"
          totalHorasDia,
          horasExcedentes,
          observaciones,
          CASE WHEN horaEntrada > '08:15:00' THEN 1 ELSE 0 END as isLate,
          CASE WHEN totalHorasDia = 0 THEN 1 ELSE 0 END as isAbsence
        FROM PermanenciaDiaria 
        WHERE EmpleadoID = @EmpleadoID 
          AND fechaDia BETWEEN @startDate AND @endDate
        ORDER BY fechaDia ASC
      `);

    // ✅ FORMATEAR COMO OBJETO { "2025-12-01": { hours, isLate... } }
    const attendanceFormatted = {};
    result.recordset.forEach(day => {
      attendanceFormatted[day.fechaDia] = {
        hours: parseFloat(day.totalHorasDia),
        horaEntrada: day.horaEntrada,
        horaSalida: day.horaSalida,
        horasExcedentes: parseFloat(day.horasExcedentes),
        observaciones: day.observaciones,
        isLate: parseInt(day.isLate),
        isAbsence: parseInt(day.isAbsence)
      };
    });

    res.json({ attendance: attendanceFormatted });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// 2. ESTADÍSTICAS COMBINADAS (StatsCards) - 2 MESES
export const getEmployeeCombinedStats = async (req, res) => {
  const { EmpleadoID } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('EmpleadoID', sql.Int, EmpleadoID)
      .query(`
        SELECT 
          CAST(SUM(totalHorasDia) AS DECIMAL(10,2)) as totalHoras,
          SUM(CASE WHEN totalHorasDia > 0 THEN 1 ELSE 0 END) as diasAsistidos,
          SUM(CASE WHEN horaEntrada > '08:15:00' AND horaEntrada IS NOT NULL THEN 1 ELSE 0 END) as retardos,
          SUM(CASE WHEN totalHorasDia = 0 THEN 1 ELSE 0 END) as ausencias,
          COUNT(*) as totalDiasMes,
          CAST(SUM(horasExcedentes) AS DECIMAL(10,2)) as horasExcedentes
        FROM PermanenciaDiaria 
        WHERE EmpleadoID = @EmpleadoID 
          AND fechaDia >= DATEADD(MONTH, -1, CAST(GETDATE() AS DATE))
      `);

    const stats = result.recordset[0] || {};
    res.json({
      totalHoras: parseFloat(stats.totalHoras || 0).toFixed(1),
      diasAsistidos: parseInt(stats.diasAsistidos || 0),
      retardos: parseInt(stats.retardos || 0),
      ausencias: parseInt(stats.ausencias || 0),
      totalDiasMes: parseInt(stats.totalDiasMes || 0),
      horasExcedentes: parseFloat(stats.horasExcedentes || 0).toFixed(2)
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// 3. NOTIFICACIONES AUTOMÁTICAS
export const getEmployeeNotifications = async (req, res) => {
  const { EmpleadoID } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('EmpleadoID', sql.Int, EmpleadoID)
      .query(`
        SELECT 
          'Retardo frecuente' as title,
          CONCAT('Has acumulado ', retardos, ' retardos') as message,
          FORMAT(GETDATE(), 'dd/MM/yyyy') as date,
          'warning' as icon,
          'orange' as color
        FROM (SELECT COUNT(*) as retardos FROM PermanenciaDiaria 
              WHERE EmpleadoID = @EmpleadoID AND YEAR(fechaDia) = YEAR(GETDATE()) 
              AND horaEntrada > '08:15:00') r
        WHERE retardos >= 3
        UNION ALL
        SELECT 
          'Faltas acumuladas' as title,
          CONCAT('Tienes ', ausencias, ' ausencias') as message,
          FORMAT(GETDATE(), 'dd/MM/yyyy') as date,
          'error' as icon,
          'negative' as color
        FROM (SELECT COUNT(*) as ausencias FROM PermanenciaDiaria 
              WHERE EmpleadoID = @EmpleadoID AND YEAR(fechaDia) = YEAR(GETDATE()) 
              AND totalHorasDia = 0) a
        WHERE ausencias >= 2
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// 4. RUTAS - Agregar a tu router
// GET /api/permanencia/:EmpleadoID/attendance/:year/:month
// GET /api/permanencia/:EmpleadoID/combined-stats  
// GET /api/permanencia/:EmpleadoID/notifications


