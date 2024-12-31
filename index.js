import express from 'express';
const app = express();
const port = 3000;
// ROUTES
import zoomRoutes from './routes/zoom.js';

app.use(express.json());
app.use('/api/zoom', zoomRoutes);

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
