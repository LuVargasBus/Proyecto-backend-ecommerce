import pool from '../../conexion.bd.mjs'

export const getProductos = async () => {
    const { rows } = await pool.query('SELECT * FROM productos ORDER BY id')
    return rows
}

export const getProductoPorId = async (id) => {
    const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [id])
    return rows[0] || null
}

export const crearProducto = async ({ name, price, category, size, stock, image }) => {
    const { rows } = await pool.query(
        `INSERT INTO productos (name, price, category, size, stock, image)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, price, category, size, stock, image]
    )
    return rows[0]
}

export const actualizarProducto = async (id, { name, price, category, size, stock, image }) => {
    const { rows } = await pool.query(
        `UPDATE productos
         SET name = $1, price = $2, category = $3, size = $4, stock = $5, image = $6
         WHERE id = $7
         RETURNING *`,
        [name, price, category, size, stock, image, id]
    )
    return rows[0] || null
}

export const eliminarProducto = async (id) => {
    const { rows } = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id])
    return rows[0] || null
}
