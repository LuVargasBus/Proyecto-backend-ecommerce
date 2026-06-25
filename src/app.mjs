import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './modulos/productos/rutas.productos.mjs';
import userRoutes from './modulos/usuarios/rutas.usuarios.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// El storefront, el panel /admin y la API se sirven desde el mismo origen,
// por lo que no se requiere CORS. Se deja configurado por variable de entorno
// para una eventual separación de despliegue (frontend en otro dominio).
const origenesPermitidos = (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean);
app.use(cors({
    origin: origenesPermitidos,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API (CRUD de administración + lectura pública sobre los mismos endpoints)
app.use('/api/productos', productRoutes);
app.use('/api/usuarios', userRoutes);

// Ruta raíz → sirve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

// Panel de administración (Front-End del CRUD)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'admin.html'));
});

// Login del panel de administración
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

export default app;