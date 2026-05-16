import { ref } from 'vue'

// Composable genérico para realizar peticiones HTTP con reintento simple
export function useFetch() {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Realiza la petición; si falla intenta una vez más antes de propagar el error
    async function fetchData(url, opciones = {}, reintentos = 1) {
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

    // Marcador para poder detener la operación desde el componente
    function cancelar() {
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
