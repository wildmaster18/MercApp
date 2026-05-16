import { ref } from 'vue'
import { useFetch } from './useFetch'

const URL_API = '/api'

// Composable específico para manejar productos y categorías del API
export function useProducts() {
    const products = ref([])
    const product = ref(null)
    const categories = ref([])
    const loading = ref(false)
    const error = ref(null)

    const { fetchData } = useFetch()

    // Obtiene la lista completa de productos
    async function fetchProducts() {
        loading.value = true
        error.value = null
        try {
            const resultado = await fetchData(URL_API + '/products', {}, 1)
            products.value = resultado
        } catch (err) {
            error.value = err.message || 'Error al cargar los productos'
            products.value = []
        } finally {
            loading.value = false
        }
    }

    // Obtiene un producto específico por su id
    async function fetchProductById(id) {
        loading.value = true
        error.value = null
        product.value = null
        try {
            const resultado = await fetchData(URL_API + '/products/' + id, {}, 1)
            product.value = resultado
            return resultado
        } catch (err) {
            error.value = err.message || 'Error al cargar el producto'
            product.value = null
            throw err
        } finally {
            loading.value = false
        }
    }

    // Obtiene la lista completa de categorías
    async function fetchCategories() {
        try {
            const resultado = await fetchData(URL_API + '/categories', {}, 1)
            categories.value = resultado
        } catch (err) {
            categories.value = []
        }
    }

    // Crea un producto nuevo enviando FormData con la imagen
    async function createProduct(formData) {
        loading.value = true
        error.value = null
        try {
            const respuesta = await fetch(URL_API + '/products', {
                method: 'POST',
                body: formData
            })
            if (!respuesta.ok) {
                const datosError = await respuesta.json()
                throw new Error(datosError.error || 'Error al crear el producto')
            }
            const resultado = await respuesta.json()
            products.value.unshift(resultado)
            return resultado
        } catch (err) {
            error.value = err.message || 'Error al crear el producto'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Actualiza un producto existente
    async function updateProduct(id, formData) {
        loading.value = true
        error.value = null
        try {
            const respuesta = await fetch(URL_API + '/products/' + id, {
                method: 'PUT',
                body: formData
            })
            if (!respuesta.ok) {
                const datosError = await respuesta.json()
                throw new Error(datosError.error || 'Error al actualizar el producto')
            }
            const resultado = await respuesta.json()
            const indice = products.value.findIndex((p) => p.id === id)
            if (indice !== -1) {
                products.value[indice] = resultado
            }
            return resultado
        } catch (err) {
            error.value = err.message || 'Error al actualizar el producto'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Elimina un producto por su id
    async function deleteProduct(id) {
        loading.value = true
        error.value = null
        try {
            const respuesta = await fetch(URL_API + '/products/' + id, {
                method: 'DELETE'
            })
            if (!respuesta.ok) {
                const datosError = await respuesta.json()
                throw new Error(datosError.error || 'Error al eliminar el producto')
            }
            products.value = products.value.filter((p) => p.id !== id)
        } catch (err) {
            error.value = err.message || 'Error al eliminar el producto'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        products,
        product,
        categories,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        fetchCategories,
        createProduct,
        updateProduct,
        deleteProduct
    }
}
