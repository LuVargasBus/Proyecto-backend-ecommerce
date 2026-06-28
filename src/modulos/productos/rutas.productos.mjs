import { Router } from 'express'
import { gestionImagen } from './subida.imagenes.mjs'
import {
    listarProductos,
    obtenerProducto,
    crearProductoController,
    actualizarProductoController,
    eliminarProductoController
} from './controlador.productos.mjs'
import { verificarAcceso } from '../usuarios/middleware/verificarAcceso.mjs'
import { verificarRol } from '../usuarios/middleware/verificarRol.mjs'

const router = Router()

const subirImagenProducto = (req, res, next) => {
    gestionImagen(req, res, (error) => {
        if (error) return res.status(500).json({ error: 'Error al subir la imagen' })
        next()
    })
}

const soloAdministrador = [verificarAcceso, verificarRol('administrador')]

// Lecturas (públicas, consumidas también por el storefront)
router.get('/', listarProductos)
router.get('/:id', obtenerProducto)

// Alta
router.post('/', soloAdministrador, subirImagenProducto, crearProductoController)

// Modificación
router.put('/:id', soloAdministrador, subirImagenProducto, actualizarProductoController)

// Baja
router.delete('/:id', soloAdministrador, eliminarProductoController)

export default router
