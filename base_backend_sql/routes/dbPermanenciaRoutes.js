import express from 'express';
const router = express.Router();
import {
    getEmployeeAttendance,
    getEmployeeCombinedStats,
    getEmployeeNotifications,

} from '../controllers/dbPermanenciaController.js';

router.get('/get-attendance/:year/:month/:EmpleadoID', getEmployeeAttendance);
router.get('/get-combined-stats/:EmpleadoID', getEmployeeCombinedStats);
router.get('/get-notifications/:EmpleadoID', getEmployeeNotifications);


export default router;








