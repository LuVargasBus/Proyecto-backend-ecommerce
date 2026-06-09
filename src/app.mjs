import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './modulos/productos/rutas.productos.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API (CRUD de administración + lectura pública sobre los mismos endpoints)
app.use('/api/productos', productRoutes);

// Ruta raíz → sirve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

// Panel de administración (Front-End del CRUD)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'admin.html'));
});

export default app;