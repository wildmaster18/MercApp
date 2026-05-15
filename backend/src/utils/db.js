const fs = require('fs')
const path = require('path')

const RUTA_DB = path.join(__dirname, '../data/db.json')

// Estructura por defecto si el archivo no existe o esta corrupto
const ESTRUCTURA_BASE = { productos: [], categorias: [] }

// Lee el archivo JSON y devuelve el objeto de base de datos.
// Si el archivo no existe o esta corrupto devuelve la estructura base.
function leerDB() {
    try {
        if (!fs.existsSync(RUTA_DB)) {
            return { ...ESTRUCTURA_BASE }
        }
        const contenido = fs.readFileSync(RUTA_DB, 'utf8')
        const datos = JSON.parse(contenido)
        // Validacion minima de estructura
        if (!datos || !Array.isArray(datos.productos) || !Array.isArray(datos.categorias)) {
            return { ...ESTRUCTURA_BASE }
        }
        return datos
    } catch (err) {
        console.error('[ERROR LECTURA DB]', err.message)
        return { ...ESTRUCTURA_BASE }
    }
}

// Escribe el objeto actualizado de vuelta en el archivo JSON
function escribirDB(datos) {
    try {
        fs.writeFileSync(RUTA_DB, JSON.stringify(datos, null, 2), 'utf8')
    } catch (err) {
        console.error('[ERROR ESCRITURA DB]', err.message)
        const error = new Error('No se pudo guardar la informacion')
        error.status = 500
        throw error
    }
}

module.exports = { leerDB, escribirDB }
