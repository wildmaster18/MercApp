// Manejador global de errores. No expone mensajes internos cuando es un 500.
function manejadorErrores(err, req, res, next) {
    // Si el error trae status definido es un error controlado. Se expone el mensaje.
    if (err.status) {
        return res.status(err.status).json({ error: err.message })
    }

    // Para errores internos no controlados se registra en consola pero no se expone al cliente
    console.error('[ERROR INTERNO]', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
}

module.exports = manejadorErrores
