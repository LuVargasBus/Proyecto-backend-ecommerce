import { Router } from 'express'
import {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion,
    obtenerPerfil
} from './controlador.usuarios.mjs'
import { verificarAcceso } from './middleware/verificarAcceso.mjs'

const router = Router()

router.post('/registro', registrarUsuario)
router.post('/login', iniciarSesion)
router.post('/logout', cerrarSesion)
router.get('/perfil', verificarAcceso, obtenerPerfil)

export default router
