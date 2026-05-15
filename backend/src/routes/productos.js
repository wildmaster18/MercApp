const express = require('express')
const { randomUUID } = require('crypto')
const { leerDB, escribirDB } = require('../utils/db')
const { validarProducto, validarParcial, CAMPOS_PERMITIDOS } = require('../middleware/validacion')

const router = express.Router()

// Verifica que el categoryId enviado exista realmente en la base de datos
function categoriaExiste(db, categoryId) {
    return db.categorias.some(c => c.id === categoryId)
}

// GET /api/products - Devuelve todos los productos
router.get('/', (req, res, next) => {
    try {
        const db = leerDB()
        res.json(db.productos)
    } catch (err) {
        next(err)
    }
})

// GET /api/products/:id - Devuelve un producto por su ID
router.get('/:id', (req, res, next) => {
    try {
        const db = leerDB()
        const producto = db.productos.find(p => p.id === req.params.id)
        if (!producto) {
            const error = new Error('Producto no encontrado')
            error.status = 404
            return next(error)
        }
        res.json(producto)
    } catch (err) {
        next(err)
    }
})

// POST /api/products - Crea un nuevo producto con ID generado automaticamente
router.post('/', validarProducto, (req, res, next) => {
    try {
        const db = leerDB()

        // Verifica que la categoria exista antes de crear el producto
        if (!categoriaExiste(db, req.body.categoryId)) {
            const error = new Error('La categoria especificada no existe')
            error.status = 400
            return next(error)
        }

        const nuevoProducto = {
            id: randomUUID(),
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            price: Number(req.body.price),
            imageUrl: req.body.imageUrl.trim(),
            categoryId: req.body.categoryId,
            stock: Number(req.body.stock)
        }
        db.productos.push(nuevoProducto)
        escribirDB(db)
        res.status(201).json(nuevoProducto)
    } catch (err) {
        next(err)
    }
})

// PUT /api/products/:id - Reemplaza un producto completo por su ID
router.put('/:id', validarProducto, (req, res, next) => {
    try {
        const db = leerDB()
        const indice = db.productos.findIndex(p => p.id === req.params.id)
        if (indice === -1) {
            const error = new Error('Producto no encontrado')
            error.status = 404
            return next(error)
        }

        if (!categoriaExiste(db, req.body.categoryId)) {
            const error = new Error('La categoria especificada no existe')
            error.status = 400
            return next(error)
        }

        db.productos[indice] = {
            id: req.params.id,
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            price: Number(req.body.price),
            imageUrl: req.body.imageUrl.trim(),
            categoryId: req.body.categoryId,
            stock: Number(req.body.stock)
        }
        escribirDB(db)
        res.json(db.productos[indice])
    } catch (err) {
        next(err)
    }
})

// PATCH /api/products/:id - Actualiza solo los campos enviados, ignorando otros
router.patch('/:id', validarParcial, (req, res, next) => {
    try {
        const db = leerDB()
        const indice = db.productos.findIndex(p => p.id === req.params.id)
        if (indice === -1) {
            const error = new Error('Producto no encontrado')
            error.status = 404
            return next(error)
        }

        // Si quiere cambiar categoryId, validar que la nueva categoria exista
        if (req.body.categoryId !== undefined && !categoriaExiste(db, req.body.categoryId)) {
            const error = new Error('La categoria especificada no existe')
            error.status = 400
            return next(error)
        }

        // Construye un objeto solo con campos permitidos del modelo
        const datosActualizados = {}
        for (const campo of CAMPOS_PERMITIDOS) {
            if (req.body[campo] !== undefined) {
                if (campo === 'price' || campo === 'stock') {
                    datosActualizados[campo] = Number(req.body[campo])
                } else if (typeof req.body[campo] === 'string') {
                    datosActualizados[campo] = req.body[campo].trim()
                } else {
                    datosActualizados[campo] = req.body[campo]
                }
            }
        }

        // Combina los datos preservando el ID original. El id no se puede modificar.
        db.productos[indice] = {
            ...db.productos[indice],
            ...datosActualizados,
            id: db.productos[indice].id
        }
        escribirDB(db)
        res.json(db.productos[indice])
    } catch (err) {
        next(err)
    }
})

// DELETE /api/products/:id - Elimina un producto del array por su ID
router.delete('/:id', (req, res, next) => {
    try {
        const db = leerDB()
        const indice = db.productos.findIndex(p => p.id === req.params.id)
        if (indice === -1) {
            const error = new Error('Producto no encontrado')
            error.status = 404
            return next(error)
        }
        db.productos.splice(indice, 1)
        escribirDB(db)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router
