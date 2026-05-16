<template>
    <div class="pagina-detalle">
        <div class="container">
            <router-link to="/" class="enlace-volver">&larr; Volver al catálogo</router-link>

            <div v-if="loading" class="estado-carga">
                <div class="spinner"></div>
                <p>Cargando producto...</p>
            </div>

            <div v-else-if="error" class="mensaje-error">
                <h3>Error al cargar el producto</h3>
                <p>{{ error }}</p>
                <router-link to="/" class="btn btn-primario">Volver al inicio</router-link>
            </div>

            <div v-else-if="product" class="detalle-producto">
                <div class="seccion-imagen">
                    <img :src="product.imageUrl" :alt="product.name" class="imagen-detalle" @error="manejarErrorImagen"/>
                </div>

                <div class="seccion-info">
                    <h1 class="titulo-producto">{{ product.name }}</h1>

                    <div class="precio-detalle">
                        <span class="valor-precio">${{ formatearPrecio(product.price) }}</span>
                    </div>

                    <div class="descripcion-detalle">
                        <h3>Descripción</h3>
                        <p>{{ product.description }}</p>
                    </div>

                    <div class="stock-detalle">
                        <span v-if="product.stock > 0" class="stock-disponible">
                            Disponible: {{ product.stock }} unidades
                        </span>
                        <span v-else class="stock-agotado">Sin stock</span>
                    </div>

                    <div class="acciones-detalle">
                        <button
                            @click="manejarAgregar"
                            class="btn btn-primario btn-grande"
                            :disabled="!product.stock || product.stock === 0"
                        >
                            Agregar al carrito
                        </button>
                        <router-link :to="`/product/${product.id}/edit`" class="btn btn-secundario btn-grande">
                            Editar producto
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'

const route = useRoute()
const router = useRouter()

const { product, loading, error, fetchProductById } = useProducts()

// El carrito se conecta realmente en el Commit 4
function manejarAgregar() {
    if (product.value) {
        alert(product.value.name + ' agregado (el carrito se activa en la siguiente entrega)')
    }
}

// Formatea el precio a dos decimales
function formatearPrecio(precio) {
    const num = Number(precio)
    if (isNaN(num)) return '0.00'
    return num.toFixed(2)
}

function manejarErrorImagen(evento) {
    evento.target.src = 'https://via.placeholder.com/500x500?text=Sin+imagen'
}

onMounted(async () => {
    const idProducto = route.params.id
    try {
        await fetchProductById(idProducto)
    } catch (err) {
        // Si el producto no existe redirige a la página 404
        router.replace({ name: 'not-found' })
    }
})
</script>

<style scoped>
.pagina-detalle {
    padding: 2rem 0;
}

.enlace-volver {
    display: inline-block;
    margin-bottom: 1.5rem;
    color: var(--color-oscuro);
    text-decoration: none;
    font-weight: 500;
}

.enlace-volver:hover {
    color: var(--color-primario);
}

.estado-carga {
    text-align: center;
    padding: 4rem 0;
}

.detalle-producto {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    background-color: white;
    padding: 2.5rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
}

.seccion-imagen {
    display: flex;
    align-items: center;
    justify-content: center;
}

.imagen-detalle {
    width: 100%;
    max-width: 450px;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
}

.seccion-info {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.titulo-producto {
    font-size: 2rem;
    color: var(--color-oscuro);
}

.valor-precio {
    font-size: 2rem;
    color: var(--color-secundario);
    font-weight: bold;
}

.descripcion-detalle h3 {
    color: var(--color-oscuro);
    margin-bottom: 0.5rem;
}

.descripcion-detalle p {
    color: #555;
    font-size: 1rem;
    line-height: 1.7;
}

.stock-detalle {
    padding: 0.8rem;
    border-radius: var(--radio-borde);
    background-color: var(--color-claro);
}

.stock-disponible {
    color: var(--color-secundario);
    font-weight: 600;
}

.stock-agotado {
    color: var(--color-peligro);
    font-weight: 600;
}

.acciones-detalle {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
}

.btn-grande {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
}

@media (max-width: 768px) {
    .detalle-producto {
        grid-template-columns: 1fr;
        padding: 1.5rem;
    }
    .titulo-producto {
        font-size: 1.5rem;
    }
}
</style>
