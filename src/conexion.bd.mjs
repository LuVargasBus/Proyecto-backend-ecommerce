import { Pool } from 'pg'

const pool = new Pool({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    port: process.env.BD_PORT,
    database: process.env.BD_BD
})

export default pool
