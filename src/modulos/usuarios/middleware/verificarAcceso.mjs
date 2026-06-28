import jwt from 'jsonwebtoken'

export const verificarAcceso = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'No autenticado' })

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' })
    }
}
