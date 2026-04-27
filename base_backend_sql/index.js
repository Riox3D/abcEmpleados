import express from 'express';
import userRoutes from './routes/userRoutes.js';
import dbPermanenciaRoutes from './routes/dbPermanenciaRoutes.js';



const app = express();
const port = 3300;

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas
app.use('/api', userRoutes);
app.use('/api/permanencia', dbPermanenciaRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
