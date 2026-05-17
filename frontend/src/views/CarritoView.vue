<template>
    <div class="pagina-carrito">
        <div class="container">
            <router-link to="/" class="enlace-volver">&larr; Volver al catálogo</router-link>

            <div v-if="itemsCarrito.length === 0" class="carrito-vacio">
                <h2>Tu carrito está vacío</h2>
                <p>Agrega productos desde el catálogo para comenzar.</p>
                <router-link to="/" class="btn btn-primario btn-grande">Ir al catálogo</router-link>
            </div>

            <div v-else class="contenido-carrito">
                <div class="lista-items">
                    <h2>Productos ({{ itemsCarrito.length }})</h2>
                    <CartItem
                        v-for="item in itemsCarrito"
                        :key="item.id"
                        :item="item"
                        @increment="aumentar"
                        @decrement="disminuir"
                        @remove="quitar"
                    />
                </div>

                <div class="resumen-carrito">
                    <h3>Resumen del pedido</h3>

                    <div class="fila-resumen">
                        <span>Subtotal:</span>
                        <span>${{ formatearPrecio(total) }}</span>
                    </div>

                    <div class="fila-resumen">
                        <span>Envío:</span>
                        <span>Gratis</span>
                    </div>

                    <hr class="separador" />

                    <div class="fila-resumen total-fila">
                        <span>Total:</span>
                        <span>${{ formatearPrecio(total) }}</span>
                    </div>

                    <button @click="finalizarCompra" class="btn btn-primario btn-grande btn-bloque">
                        Finalizar compra
                    </button>

                    <button @click="clearCart" class="btn btn-peligro btn-bloque">
                        Vaciar carrito
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import CartItem from '@/components/CartItem.vue'
import { useCart } from '@/composables/useCart'

const router = useRouter()

// Extrae estado reactivo con storeToRefs y funciones directamente del store
const store = useCart()
const { itemsCarrito, total } = storeToRefs(store)
const { updateQuantity, removeFromCart, clearCart, vaciarSinConfirmar } = store

// Aumenta en uno la cantidad del item indicado
function aumentar(idProducto) {
    const item = itemsCarrito.value.find((i) => i.id === idProducto)
    if (item) {
        updateQuantity(idProducto, item.cantidad + 1)
    }
}

// Disminuye en uno la cantidad; si llega a 0 el composable elimina el item
function disminuir(idProducto) {
    const item = itemsCarrito.value.find((i) => i.id === idProducto)
    if (item) {
        updateQuantity(idProducto, item.cantidad - 1)
    }
}

// Pide confirmación antes de eliminar el producto del carrito
function quitar(idProducto) {
    if (confirm('¿Eliminar este producto del carrito?')) {
        removeFromCart(idProducto)
    }
}

// Procesa la compra llamando al API para descontar stock y vacía el carrito
async function finalizarCompra() {
    if (itemsCarrito.value.length === 0) {
        alert('El carrito está vacío')
        return
    }
    const confirmado = confirm('¿Confirmar la compra por $' + Number(total.value).toFixed(2) + '?')
    if (!confirmado) return

    try {
        // Arma la lista de items con id y cantidad para enviar al backend
        const listaItems = []
        for (let i = 0; i < itemsCarrito.value.length; i++) {
            listaItems.push({
                id: itemsCarrito.value[i].id,
                cantidad: itemsCarrito.value[i].cantidad
            })
        }

        const respuesta = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: listaItems })
        })

        if (!respuesta.ok) {
            alert('Error al procesar la compra')
            return
        }

        alert('Compra registrada correctamente')
        vaciarSinConfirmar()
        router.push('/')
    } catch (err) {
        alert('No se pudo conectar con el servidor')
    }
}

// Formatea el precio a dos decimales para mostrar en pantalla
function formatearPrecio(precio) {
    const num = Number(precio)
    if (isNaN(num)) return '0.00'
    return num.toFixed(2)
}
</script>

<style scoped>
.pagina-carrito { padding: 2rem 0; }

.enlace-volver {
    display: inline-block;
    margin-bottom: 1.5rem;
    color: var(--color-gris);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: var(--transicion);
}
.enlace-volver:hover { color: var(--color-primario); }

.carrito-vacio {
    background-color: var(--color-tarjeta);
    padding: 4rem 2rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
    text-align: center;
}
.carrito-vacio h2 { color: var(--color-oscuro); margin-bottom: 0.5rem; font-family: var(--fuente-titulo); }
.carrito-vacio p { color: var(--color-gris); margin-bottom: 1.5rem; }

.contenido-carrito {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 1.5rem;
    align-items: start;
}

.lista-items {
    background-color: var(--color-tarjeta);
    padding: 1.25rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
}
.lista-items h2 {
    margin-bottom: 1rem;
    color: var(--color-oscuro);
    font-size: 1.1rem;
    font-weight: 600;
}

.resumen-carrito {
    background-color: var(--color-tarjeta);
    padding: 1.25rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
    position: sticky;
    top: 80px;
}
.resumen-carrito h3 {
    margin-bottom: 1rem;
    color: var(--color-oscuro);
    font-size: 1rem;
    font-weight: 600;
}

.fila-resumen {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    color: var(--color-gris);
    font-size: 0.9rem;
}

.separador { border: none; border-top: 1px solid var(--color-claro); margin: 0.75rem 0; }

.total-fila { font-size: 1.15rem; font-weight: 700; color: var(--color-oscuro); }

.btn-grande { padding: 0.8rem; font-size: 0.9rem; font-weight: 600; }
.btn-bloque { width: 100%; margin-top: 0.6rem; }

@media (max-width: 968px) {
    .contenido-carrito { grid-template-columns: 1fr; }
    .resumen-carrito { position: static; }
}
</style>
