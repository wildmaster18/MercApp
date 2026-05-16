// Rutas REST del API. Sirven datos en formato JSON al frontend Vue.
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const subirImagen = require('../config/multer');

// Convierte un documento de Producto al contrato del API
function mapearProducto(doc, req) {
    return {
        id: doc._id,
        name: doc.nombre,
        description: doc.descripcion,
        price: doc.precio,
        imageUrl: doc.imagen
            ? req.protocol + '://' + req.get('host') + '/uploads/' + doc.imagen
            : req.protocol + '://' + req.get('host') + '/images/default.jpg',
        categoryId: doc.categoryId || 1,
        stock: doc.stock || 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    };
}

// Reglas de validación reutilizadas en POST y PUT
const validarProducto = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
    body('description')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
    body('categoryId')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isInt({ min: 1 }).withMessage('La categoría debe ser un número entero válido'),
    body('stock')
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage('El stock no puede ser negativo')
];

// Captura el error de Multer y lo guarda en req para el handler
function procesarImagen(req, res, next) {
    subirImagen.single('imagen')(req, res, (err) => {
        if (err) {
            req.errorImagen = err.message;
        }
        next();
    });
}

// Devuelve la lista completa de productos
router.get('/products', async (req, res) => {
    try {
        const productos = await Producto.find().sort({ createdAt: -1 });
        const lista = productos.map((p) => mapearProducto(p, req));
        res.json(lista);
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ error: 'Error al obtener productos', message: error.message });
    }
});

// Devuelve un producto específico por su id
router.get('/products/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(mapearProducto(producto, req));
    } catch (error) {
        console.error('Error al obtener producto:', error.message);
        if (error.name === 'CastError') {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(500).json({ error: 'Error al obtener el producto', message: error.message });
    }
});

// Crea un nuevo producto a partir de un FormData
router.post('/products', procesarImagen, validarProducto, async (req, res) => {
    try {
        if (req.errorImagen) {
            return res.status(400).json({
                error: 'Validación fallida',
                errors: [{ msg: 'Imagen no válida: ' + req.errorImagen }]
            });
        }

        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                error: 'Validación fallida',
                errors: errores.array()
            });
        }

        const { name, description, price, categoryId, stock } = req.body;
        const nuevoProducto = await Producto.create({
            nombre: name,
            descripcion: description,
            precio: parseFloat(price),
            imagen: req.file ? req.file.filename : '',
            categoryId: parseInt(categoryId),
            stock: stock ? parseInt(stock) : 0
        });

        res.status(201).json(mapearProducto(nuevoProducto, req));
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        res.status(500).json({ error: 'Error al crear producto', message: error.message });
    }
});

// Actualiza un producto completo
router.put('/products/:id', procesarImagen, validarProducto, async (req, res) => {
    try {
        if (req.errorImagen) {
            return res.status(400).json({
                error: 'Validación fallida',
                errors: [{ msg: 'Imagen no válida: ' + req.errorImagen }]
            });
        }

        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                error: 'Validación fallida',
                errors: errores.array()
            });
        }

        const { name, description, price, categoryId, stock } = req.body;
        const datosActualizados = {
            nombre: name,
            descripcion: description,
            precio: parseFloat(price),
            categoryId: parseInt(categoryId),
            stock: stock !== undefined && stock !== '' ? parseInt(stock) : 0
        };

        if (req.file) {
            datosActualizados.imagen = req.file.filename;
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            datosActualizados,
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(mapearProducto(productoActualizado, req));
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        if (error.name === 'CastError') {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(500).json({ error: 'Error al actualizar producto', message: error.message });
    }
});

// Actualiza parcialmente un producto
router.patch('/products/:id', procesarImagen, async (req, res) => {
    try {
        const datosActualizados = {};
        if (req.body.name) datosActualizados.nombre = req.body.name;
        if (req.body.description) datosActualizados.descripcion = req.body.description;
        if (req.body.price) datosActualizados.precio = parseFloat(req.body.price);
        if (req.body.categoryId) datosActualizados.categoryId = parseInt(req.body.categoryId);
        if (req.body.stock !== undefined && req.body.stock !== '') {
            datosActualizados.stock = parseInt(req.body.stock);
        }
        if (req.file) datosActualizados.imagen = req.file.filename;

        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            datosActualizados,
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(mapearProducto(productoActualizado, req));
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        if (error.name === 'CastError') {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(500).json({ error: 'Error al actualizar producto', message: error.message });
    }
});

// Elimina un producto por su id
router.delete('/products/:id', async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({
            message: 'Producto eliminado correctamente',
            product: { id: productoEliminado._id, name: productoEliminado.nombre }
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        if (error.name === 'CastError') {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(500).json({ error: 'Error al eliminar producto', message: error.message });
    }
});

// Devuelve todas las categorías
router.get('/categories', async (req, res) => {
    try {
        const categorias = await Categoria.find().sort({ idCat: 1 });
        const lista = categorias.map((c) => ({ id: c.idCat, name: c.nombre }));
        res.json(lista);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        res.status(500).json({ error: 'Error al obtener categorías', message: error.message });
    }
});

module.exports = router;
