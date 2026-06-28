import jwt from 'jsonwebtoken'
import { hashearClave, compararClave } from './hashing.usuarios.mjs'
import {
    getUsuarioPorEmail,
    getUsuarioPorId,
    crearUsuario
} from './servicio.usuarios.mjs'

const emitirCookieToken = (res, usuario) => {
    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hora
    })
}

export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (nombre, email, password)' })
        }

        const existente = await getUsuarioPorEmail(email)
        if (existente) {
            return res.status(400).json({ error: 'Ya existe un usuario registrado con ese email' })
        }

        const passwordHash = await hashearClave(password)
        const usuario = await crearUsuario({ nombre, email, passwordHash })
        res.status(201).json(usuario)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al registrar el usuario' })
    }
}

export const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (email, password)' })
        }

        const usuario = await getUsuarioPorEmail(email)
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const claveValida = await compararClave(password, usuario.password_hash)
        if (!claveValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        emitirCookieToken(res, usuario)
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al iniciar sesión' })
    }
}

export const cerrarSesion = (req, res) => {
    res.clearCookie('token')
    res.json({ mensaje: 'Sesión cerrada correctamente' })
}

export const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await getUsuarioPorId(req.usuario.id)
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json(usuario)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el perfil' })
    }
}
