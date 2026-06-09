import {
    getProductos,
    getProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from './servicio.productos.mjs'

const parsearTalles = (valor) => {
    if (Array.isArray(valor)) return valor
    if (!valor) return []
    return String(valor).split(',').map(talle => talle.trim()).filter(talle => talle.length > 0)
}

export const listarProductos = async (req, res) => {
    try {
        const productos = await getProductos()
        res.json(productos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener los productos' })
    }
}

export const obtenerProducto = async (req, res) => {
    try {
        const producto = await getProductoPorId(req.params.id)
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(producto)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
}

export const crearProductoController = async (req, res) => {
    try {
        const { name, price, category, size, stock } = req.body
        if (!name || price == null || !category) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (name, price, category)' })
        }

        // Si se subió un archivo con multer, usamos el nombre que le generó; si no, lo que haya llegado en el body
        const image = req.file ? req.file.filename : (req.body.image ?? null)

        const producto = await crearProducto({
            name,
            price,
            category,
            size: parsearTalles(size),
            stock: stock || 0,
            image
        })
        res.status(201).json(producto)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al crear el producto' })
    }
}

export const actualizarProductoController = async (req, res) => {
    try {
        const { name, price, category, size, stock } = req.body
        if (!name || price == null || !category) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (name, price, category)' })
        }

        // Si subieron una imagen nueva la usamos; si la mandaron explícita en el body la respetamos;
        // si no llegó nada, conservamos la que ya tenía el producto (edición sin cambiar la imagen)
        let image
        if (req.file) {
            image = req.file.filename
        } else if (req.body.image !== undefined) {
            image = req.body.image
        } else {
            const productoActual = await getProductoPorId(req.params.id)
            if (!productoActual) {
                return res.status(404).json({ error: 'Producto no encontrado' })
            }
            image = productoActual.image
        }

        const producto = await actualizarProducto(req.params.id, {
            name,
            price,
            category,
            size: parsearTalles(size),
            stock: stock || 0,
            image
        })
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(producto)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al actualizar el producto' })
    }
}

export const eliminarProductoController = async (req, res) => {
    try {
        const producto = await eliminarProducto(req.params.id)
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json({ mensaje: 'Producto eliminado correctamente', producto })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar el producto' })
    }
}
