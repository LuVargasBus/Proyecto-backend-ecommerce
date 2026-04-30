import express from 'express';
import productRoutes from './routes/productRoute.mjs';

const app = express();

app.use(express.json());

// rutas
app.use('/api/products', productRoutes);

export default app;