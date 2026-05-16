const express = require('express')
const { leerDB } = require('../utils/db')

const router = express.Router()

// GET /api/categories - Devuelve todas las categorias
router.get('/', (req, res, next) => {
    try {
        const db = leerDB()
        res.json(db.categorias)
    } catch (err) {
        next(err)
    }
})

module.exports = router
