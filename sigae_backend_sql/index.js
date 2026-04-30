import express from 'express';
import dotenv from 'dotenv'; 
import userRoutes from './routes/userRoutes.js';
import solicitudesRoutes from './routes/solicitudesRoutes.js'; 

dotenv.config();

const app = express();

const port = process.env.PORT || 3002;

app.use(express.json());


app.use('/users', userRoutes);

app.use('/solicitudes', solicitudesRoutes);


app.listen(port, () => {
  console.log(`🚀 SQL Backend corriendo en: http://localhost:${port}`);
});