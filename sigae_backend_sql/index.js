import express from 'express';
import dotenv from 'dotenv'; 
import userRoutes from './routes/userRoutes.js';
import solicitudesRoutes from './routes/solicitudesRoutes.js'; 
import empleadosRoutes from './routes/empleadosRoutes.js';
import catalogosRoutes from './routes/catalogosRoutes.js'


dotenv.config();

const app = express();

const port = process.env.PORT || 3002;

app.use(express.json());


app.use('/login', userRoutes);

app.use('/solicitudes', solicitudesRoutes);

app.use('/api/catalogos', catalogosRoutes);

app.use('/api/empleados', empleadosRoutes);


app.listen(port, () => {
  console.log(`🚀 SQL Backend corriendo en: http://localhost:${port}`);
});