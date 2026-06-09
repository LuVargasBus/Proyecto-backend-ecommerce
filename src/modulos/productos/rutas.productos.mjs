import { Router } from 'express'
import { gestionImagen } from './subida.imagenes.mjs'
import {
    listarProductos,
    obtenerProducto,
    crearProductoController,
    actualizarProductoController,
    eliminarProductoController
} from './controlador.productos.mjs'

const router = Router()

const subirImagenProducto = (req, res, next) => {
    gestionImagen(req, res, (error) => {
        if (error) return res.status(500).json({ error: 'Error al subir la imagen' })
        next()
    })
}

// Lecturas
router.get('/', listarProductos)
router.get('/:id', obtenerProducto)

// Alta
router.post('/', subirImagenProducto, crearProductoController)

// Modificación
router.put('/:id', subirImagenProducto, actualizarProductoController)

// Baja
router.delete('/:id', eliminarProductoController)

export default router
