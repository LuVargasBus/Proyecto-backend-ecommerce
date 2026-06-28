import bcrypt from 'bcryptjs'

const RONDAS_SALT = 10

export const hashearClave = async (claveTextoPlano) => {
    return await bcrypt.hash(claveTextoPlano, RONDAS_SALT)
}

export const compararClave = async (claveTextoPlano, hashAlmacenado) => {
    return await bcrypt.compare(claveTextoPlano, hashAlmacenado)
}
