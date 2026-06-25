import './inyectar.env.mjs';
import app from './src/app.mjs';

const PUERTO = process.env.PUERTO || 3000;

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
