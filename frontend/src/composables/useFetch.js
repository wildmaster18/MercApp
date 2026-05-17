import { ref } from 'vue'

// Composable genérico para realizar peticiones HTTP con reintento y cancelación real
export function useFetch() {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Controlador que permite abortar la petición en curso
    let controladorActual = null

    // Realiza la petición; si falla intenta una vez más antes de propagar el error
    async function fetchData(url, opciones = {}, reintentos = 1) {
        // Cancela cualquier petición anterior que siga en curso
        if (controladorActual) {
            controladorActual.abort()
        }
        controladorActual = new AbortController()

        loading.value = true
        error.value = null
        data.value = null

        let ultimoError = null

        for (let i = 0; i <= reintentos; i++) {
            try {
                const respuesta = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...opciones.headers
                    },
                    signal: controladorActual.signal,
                    ...opciones
                })

                if (!respuesta.ok) {
                    throw new Error('HTTP ' + respuesta.status + ': ' + respuesta.statusText)
                }

                const resultado = await respuesta.json()
                data.value = resultado
                loading.value = false
                return resultado
            } catch (err) {
                // Si la petición fue cancelada por el usuario, no se reintenta
                if (err.name === 'AbortError') {
                    loading.value = false
                    return null
                }
                ultimoError = err
                if (i < reintentos) {
                    // Espera medio segundo antes de reintentar
                    await new Promise((resolver) => setTimeout(resolver, 500))
                }
            }
        }

        error.value = ultimoError ? ultimoError.message : 'Error al realizar la petición'
        loading.value = false
        throw ultimoError
    }

    // Aborta la petición HTTP en curso mediante AbortController
    function cancelar() {
        if (controladorActual) {
            controladorActual.abort()
            controladorActual = null
        }
        loading.value = false
    }

    return {
        data,
        loading,
        error,
        fetchData,
        cancelar
    }
}
