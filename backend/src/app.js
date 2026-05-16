// Carga las variables de entorno desde el archivo .env si existe
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const rutasProductos = require('./routes/productos')
const rutasCategorias = require('./routes/categorias')
const manejadorErrores = require('./middleware/errores')

const app = express()
const PUERTO = process.env.PORT || 3000

// Parsea el cuerpo de las peticiones como JSON
app.use(express.json())

// Habilita CORS para que el frontend Vue pueda consumir la API
app.use(cors())

// Registra las rutas de productos y categorias
app.use('/api/products', rutasProductos)
app.use('/api/categories', rutasCategorias)

// Middleware para rutas no encontradas. Genera un error 404 con respuesta JSON.
app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada')
    error.status = 404
    next(error)
})

// Registra el manejador global de errores al final de la cadena
app.use(manejadorErrores)

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
