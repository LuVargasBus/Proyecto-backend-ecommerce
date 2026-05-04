import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoute.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/products', productRoutes);

// Ruta raíz → sirve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;