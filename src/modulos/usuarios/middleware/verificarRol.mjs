export const verificarRol = (rolRequerido) => (req, res, next) => {
    if (req.usuario?.rol !== rolRequerido) {
        return res.status(403).json({ error: 'No tiene permisos para esta acción' })
    }
    next()
}
