import pool from '../../conexion.bd.mjs'

export const getUsuarioPorEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
    return rows[0] || null
}

export const getUsuarioPorId = async (id) => {
    const { rows } = await pool.query(
        'SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = $1',
        [id]
    )
    return rows[0] || null
}

export const crearUsuario = async ({ nombre, email, passwordHash }) => {
    const { rows } = await pool.query(
        `INSERT INTO usuarios (nombre, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, nombre, email, rol, creado_en`,
        [nombre, email, passwordHash]
    )
    return rows[0]
}
