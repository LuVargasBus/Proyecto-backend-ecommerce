import multer from 'multer'
import { nanoid } from 'nanoid'
import mime from 'mime-types'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const carpetaImagenes = path.join(__dirname, '..', '..', 'public', 'image', 'uploads')

// Multer -> https://www.npmjs.com/package/multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, carpetaImagenes)
    },
    filename: function (req, file, cb) {
        const nuevoNombre = nanoid() + '.' + mime.extension(file.mimetype)
        cb(null, nuevoNombre)
    }
})

const subirImagen = multer({
    storage: storage
})

export const gestionImagen = subirImagen.single('imagen') // <--- nos devuelve una función
