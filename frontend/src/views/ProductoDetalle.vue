<template>
    <div class="pagina-detalle">
        <div class="container">
            <router-link to="/" class="enlace-volver">&larr; Volver al catalogo</router-link>

            <div v-if="loading" class="estado-carga">
                <div class="spinner"></div>
                <p>Cargando producto...</p>
            </div>

            <div v-else-if="error" class="mensaje-error">
                <h3>Error al cargar el producto</h3>
                <p>{{ error }}</p>
                <router-link to="/" class="btn btn-primario">Volver al inicio</router-link>
            </div>

            <div v-else-if="product" class="ficha-producto">
                <div class="columna-imagen">
                    <img :src="product.imageUrl" :alt="product.name" class="imagen-detalle" @error="manejarErrorImagen"/>
                </div>

                <div class="columna-datos">
                    <div class="cabecera-datos">
                        <h1 class="titulo-producto">{{ product.name }}</h1>
                        <span class="precio-grande">${{ formatearPrecio(product.price) }}</span>
                    </div>

                    <div class="bloque-meta">
                        <span class="etiqueta-meta" :class="product.stock > 0 ? 'meta-ok' : 'meta-mal'">
                            {{ product.stock > 0 ? product.stock + ' en stock' : 'Sin stock' }}
                        </span>
                        <span v-if="enCarrito" class="etiqueta-meta meta-info">
                            {{ cantidadEnCarrito }} en carrito
                        </span>
                    </div>

                    <div class="bloque-descripcion">
                        <h4>Descripcion</h4>
                        <p>{{ product.description }}</p>
                    </div>

                    <div class="bloque-acciones">
                        <button
                            @click="manejarAgregar"
                            class="btn btn-primario btn-accion"
                            :disabled="!product.stock || product.stock === 0 || cantidadEnCarrito >= product.stock"
                        >
                            <span v-if="cantidadEnCarrito >= product.stock && product.stock > 0">
                                Stock completo en el carrito
                            </span>
                            <span v-else>Agregar al carrito</span>
                        </button>
                        <div class="acciones-secundarias">
                            <router-link :to="`/product/${product.id}/edit`" class="btn btn-secundario btn-accion-sec">
                                Editar
                            </router-link>
                            <button @click="manejarEliminar" class="btn btn-peligro btn-accion-sec">
                                Eliminar
                            </button>
                        </div>
                    </div>

                    <transition name="aviso">
                        <p v-if="mensaje" class="mensaje-confirma">{{ mensaje }}</p>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'

const route = useRoute()
const router = useRouter()

const { product, loading, error, fetchProductById, deleteProduct } = useProducts()
const { addToCart, isInCart, getCantidadProducto } = useCart()

const mensaje = ref('')

// Indica si el producto actual ya está en el carrito del usuario
const enCarrito = computed(() => {
    if (!product.value) return false
    return isInCart(product.value.id)
})

// Devuelve la cantidad de unidades del producto actual presente en el carrito
const cantidadEnCarrito = computed(() => {
    if (!product.value) return 0
    return getCantidadProducto(product.value.id)
})

// Agrega el producto actual al carrito y muestra confirmación temporal
function manejarAgregar() {
    if (!product.value) return
    const exito = addToCart(product.value, 1)
    if (exito) {
        mostrarMensaje('Agregado al carrito correctamente')
    } else {
        mostrarMensaje('No hay mas stock disponible')
    }
}

// Pide confirmación y elimina el producto del API; redirige al catálogo
async function manejarEliminar() {
    if (!product.value) return
    const confirmar = confirm('¿Seguro que deseas eliminar "' + product.value.name + '"?')
    if (!confirmar) return

    try {
        await deleteProduct(product.value.id)
        alert('Producto eliminado correctamente')
        router.push('/')
    } catch (err) {
        mostrarMensaje('Error al eliminar el producto')
    }
}

// Muestra un mensaje de confirmación que desaparece después de 2 segundos
function mostrarMensaje(texto) {
    mensaje.value = texto
    setTimeout(() => {
        mensaje.value = ''
    }, 2000)
}

// Formatea el precio a dos decimales para mostrarlo en pantalla
function formatearPrecio(precio) {
    const num = Number(precio)
    if (isNaN(num)) return '0.00'
    return num.toFixed(2)
}

// Sustituye la imagen rota por un placeholder de 500x500
function manejarErrorImagen(evento) {
    evento.target.src = 'https://via.placeholder.com/500x500?text=Sin+imagen'
}

onMounted(async () => {
    const idProducto = route.params.id
    try {
        await fetchProductById(idProducto)
    } catch (err) {
        router.replace({ name: 'not-found' })
    }
})
</script>

<style scoped>
.pagina-detalle { padding: 2rem 0; }

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

.estado-carga { text-align: center; padding: 4rem 0; }

.ficha-producto {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    background-color: var(--color-tarjeta);
    padding: 2rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
}

.columna-imagen { display: flex; align-items: flex-start; justify-content: center; }

.imagen-detalle {
    width: 100%;
    max-width: 420px;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-media);
}

.columna-datos { display: flex; flex-direction: column; gap: 1.25rem; }

.cabecera-datos { display: flex; flex-direction: column; gap: 0.5rem; }

.titulo-producto {
    font-family: var(--fuente-titulo);
    font-size: 1.8rem;
    color: var(--color-oscuro);
    line-height: 1.2;
}

.precio-grande {
    font-size: 2rem;
    color: var(--color-primario);
    font-weight: 700;
}

.bloque-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.etiqueta-meta {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}
.meta-ok { background-color: #ecfdf5; color: #059669; }
.meta-mal { background-color: #fef2f2; color: #dc2626; }
.meta-info { background-color: #f5f3ff; color: #6d28d9; }

.bloque-descripcion h4 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-gris);
    margin-bottom: 0.4rem;
}
.bloque-descripcion p { color: #475569; line-height: 1.7; }

.bloque-acciones { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem; }

.btn-accion { padding: 0.85rem; font-size: 0.95rem; width: 100%; }

.acciones-secundarias { display: flex; gap: 0.5rem; }
.btn-accion-sec { flex: 1; padding: 0.65rem; font-size: 0.85rem; }

.mensaje-confirma {
    background-color: var(--color-oscuro);
    color: white;
    padding: 0.65rem 1rem;
    border-radius: var(--radio-pequeno);
    text-align: center;
    font-weight: 500;
    font-size: 0.9rem;
}

.aviso-enter-active, .aviso-leave-active { transition: opacity 0.3s ease; }
.aviso-enter-from, .aviso-leave-to { opacity: 0; }

@media (max-width: 768px) {
    .ficha-producto { grid-template-columns: 1fr; padding: 1.25rem; gap: 1.5rem; }
    .titulo-producto { font-size: 1.4rem; }
    .precio-grande { font-size: 1.5rem; }
}
</style>
