import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// Clave usada en localStorage para persistir el carrito entre sesiones
const CLAVE_CARRITO = 'mercapp_carrito'

// Store global de Pinia para el estado del carrito de compras
export const useCart = defineStore('cart', () => {
    // Lista reactiva de items en el carrito
    const itemsCarrito = ref([])

    // Recupera el carrito guardado en localStorage al crear el store
    function inicializarCarrito() {
        try {
            const guardado = localStorage.getItem(CLAVE_CARRITO)
            if (guardado) {
                itemsCarrito.value = JSON.parse(guardado)
            }
        } catch (err) {
            // JSON inválido o localStorage inaccesible; se parte con carrito vacío
            itemsCarrito.value = []
        }
    }

    // Persiste el contenido actual del carrito en localStorage
    function guardarCarrito() {
        try {
            localStorage.setItem(CLAVE_CARRITO, JSON.stringify(itemsCarrito.value))
        } catch (err) {
            // En modo privado puede fallar el acceso a localStorage; se ignora
        }
    }

    // Carga los datos guardados al inicializar el store
    inicializarCarrito()

    // Vigila los cambios del carrito y actualiza el almacenamiento
    watch(
        itemsCarrito,
        () => {
            guardarCarrito()
        },
        { deep: true }
    )

    // Agrega un producto al carrito respetando el stock disponible
    function addToCart(producto, cantidad = 1) {
        const stockMax = producto.stock !== undefined ? producto.stock : 999

        const existente = itemsCarrito.value.find((item) => item.id === producto.id)

        if (existente) {
            const nuevaCantidad = existente.cantidad + cantidad
            if (nuevaCantidad > stockMax) {
                existente.cantidad = stockMax
                return false
            }
            existente.cantidad = nuevaCantidad
            return true
        }

        const cantidadInicial = cantidad > stockMax ? stockMax : cantidad
        if (cantidadInicial <= 0) {
            return false
        }

        itemsCarrito.value.push({
            id: producto.id,
            name: producto.name,
            description: producto.description,
            price: producto.price,
            imageUrl: producto.imageUrl,
            stock: stockMax,
            cantidad: cantidadInicial
        })
        return true
    }

    // Elimina por completo un producto del carrito
    function removeFromCart(idProducto) {
        itemsCarrito.value = itemsCarrito.value.filter((item) => item.id !== idProducto)
    }

    // Actualiza la cantidad de un producto del carrito
    function updateQuantity(idProducto, nuevaCantidad) {
        const item = itemsCarrito.value.find((i) => i.id === idProducto)
        if (!item) return

        if (nuevaCantidad <= 0) {
            removeFromCart(idProducto)
            return
        }

        const stockMax = item.stock !== undefined ? item.stock : 999
        if (nuevaCantidad > stockMax) {
            item.cantidad = stockMax
        } else {
            item.cantidad = nuevaCantidad
        }
    }

    // Vacía el carrito completo previa confirmación
    function clearCart() {
        if (confirm('¿Seguro que deseas vaciar el carrito?')) {
            itemsCarrito.value = []
        }
    }

    // Vacía el carrito sin pedir confirmación, usado al finalizar la compra
    function vaciarSinConfirmar() {
        itemsCarrito.value = []
    }

    // Cantidad total de unidades en el carrito (para el contador del NavBar)
    const cantidadItems = computed(() => {
        let total = 0
        for (let i = 0; i < itemsCarrito.value.length; i++) {
            total += itemsCarrito.value[i].cantidad
        }
        return total
    })

    // Total monetario del carrito
    const total = computed(() => {
        let suma = 0
        for (let i = 0; i < itemsCarrito.value.length; i++) {
            const item = itemsCarrito.value[i]
            suma += Number(item.price) * item.cantidad
        }
        return suma
    })

    // Indica si un producto ya está en el carrito
    function isInCart(idProducto) {
        return itemsCarrito.value.some((item) => item.id === idProducto)
    }

    // Obtiene la cantidad actual de un producto en el carrito
    function getCantidadProducto(idProducto) {
        const item = itemsCarrito.value.find((i) => i.id === idProducto)
        return item ? item.cantidad : 0
    }

    return {
        itemsCarrito,
        total,
        cantidadItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        vaciarSinConfirmar,
        isInCart,
        getCantidadProducto
    }
})
