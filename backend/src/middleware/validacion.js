// Campos permitidos del modelo Producto. Cualquier otro campo se rechaza.
const CAMPOS_PERMITIDOS = ['name', 'description', 'price', 'imageUrl', 'categoryId', 'stock']

// Verifica que el valor sea una cadena no vacia despues de trim
function esCadenaValida(valor) {
    return typeof valor === 'string' && valor.trim() !== ''
}

// Verifica que el valor sea una URL valida con protocolo http o https
function esUrlValida(valor) {
    if (typeof valor !== 'string') return false
    try {
        const url = new URL(valor)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

// Verifica que el valor sea un numero finito mayor que 0
function esPrecioValido(valor) {
    const num = Number(valor)
    return Number.isFinite(num) && num > 0
}

// Verifica que el valor sea un numero entero mayor o igual a 0
function esStockValido(valor) {
    const num = Number(valor)
    return Number.isFinite(num) && num >= 0 && Number.isInteger(num)
}

// Valida que el cuerpo tenga todos los campos requeridos con tipos correctos
function validarProducto(req, res, next) {
    const datos = req.body ?? {}
    const errores = []

    if (!esCadenaValida(datos.name)) {
        errores.push('El campo "name" es obligatorio y debe ser texto no vacio')
    }

    if (!esCadenaValida(datos.description)) {
        errores.push('El campo "description" es obligatorio y debe ser texto no vacio')
    }

    if (datos.price === undefined || datos.price === '') {
        errores.push('El campo "price" es obligatorio')
    } else if (!esPrecioValido(datos.price)) {
        errores.push('El precio debe ser un numero mayor a 0')
    }

    if (!esCadenaValida(datos.imageUrl)) {
        errores.push('El campo "imageUrl" es obligatorio')
    } else if (!esUrlValida(datos.imageUrl)) {
        errores.push('La URL de imagen debe ser valida y usar protocolo http o https')
    }

    if (!esCadenaValida(datos.categoryId)) {
        errores.push('El campo "categoryId" es obligatorio y debe ser texto no vacio')
    }

    if (datos.stock === undefined || datos.stock === '') {
        errores.push('El campo "stock" es obligatorio')
    } else if (!esStockValido(datos.stock)) {
        errores.push('El stock debe ser un numero entero mayor o igual a 0')
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores })
    }

    next()
}

// Valida solo los campos enviados en una peticion parcial PATCH
function validarParcial(req, res, next) {
    const datos = req.body ?? {}
    const errores = []

    // Rechaza body vacio en PATCH
    const clavesRecibidas = Object.keys(datos)
    if (clavesRecibidas.length === 0) {
        return res.status(400).json({ errores: ['El cuerpo de la peticion no puede estar vacio'] })
    }

    // Rechaza campos no permitidos en PATCH
    for (const clave of clavesRecibidas) {
        if (!CAMPOS_PERMITIDOS.includes(clave)) {
            errores.push(`El campo "${clave}" no esta permitido`)
        }
    }

    if (datos.name !== undefined && !esCadenaValida(datos.name)) {
        errores.push('El nombre debe ser texto no vacio')
    }

    if (datos.description !== undefined && !esCadenaValida(datos.description)) {
        errores.push('La descripcion debe ser texto no vacio')
    }

    if (datos.price !== undefined && !esPrecioValido(datos.price)) {
        errores.push('El precio debe ser un numero mayor a 0')
    }

    if (datos.imageUrl !== undefined) {
        if (!esCadenaValida(datos.imageUrl)) {
            errores.push('La URL de imagen no puede estar vacia')
        } else if (!esUrlValida(datos.imageUrl)) {
            errores.push('La URL de imagen debe ser valida y usar protocolo http o https')
        }
    }

    if (datos.categoryId !== undefined && !esCadenaValida(datos.categoryId)) {
        errores.push('La categoria debe ser texto no vacio')
    }

    if (datos.stock !== undefined && !esStockValido(datos.stock)) {
        errores.push('El stock debe ser un numero entero mayor o igual a 0')
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores })
    }

    next()
}

module.exports = { validarProducto, validarParcial, CAMPOS_PERMITIDOS }
