import express from 'express';
const app = express();
const port = 3000;
import cors from 'cors';

// ROUTES
import zoomRoutes from './routes/zoom.js';

// ACTIVER CORS POUR LE PROJET FRONTEND
app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(express.json());
app.use('/api/zoom', zoomRoutes);

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
