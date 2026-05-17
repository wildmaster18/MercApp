<template>
    <div class="tarjeta-producto">
        <router-link :to="`/product/${product.id}`" class="enlace-producto">
            <div class="imagen-wrapper">
                <img
                    :src="product.imageUrl"
                    :alt="product.name"
                    class="imagen-producto"
                    @error="manejarErrorImagen"
                />
                <span class="badge-stock" :class="sinStock ? 'agotado' : 'disponible'">
                    {{ sinStock ? 'Agotado' : product.stock + ' uds' }}
                </span>
            </div>
            <div class="info-producto">
                <p class="nombre-producto">{{ product.name }}</p>
                <p class="descripcion-producto">{{ acortarTexto(product.description, 50) }}</p>
                <div class="pie-producto">
                    <span class="precio-producto">${{ formatearPrecio(product.price) }}</span>
                </div>
            </div>
        </router-link>

        <div class="acciones-producto">
            <button
                @click.stop="manejarAgregar"
                class="btn-card btn-agregar-card"
                :disabled="sinStock"
            >
                {{ sinStock ? 'Sin stock' : 'Agregar' }}
            </button>
            <router-link :to="`/product/${product.id}/edit`" class="btn-card btn-editar-card">
                Editar
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

// Props del componente
const props = defineProps({
    product: {
        type: Object,
        required: true,
        validator: (valor) => {
            return valor.id && valor.name && valor.price !== undefined
        }
    }
})

// Evento emitido al agregar el producto al carrito
const emit = defineEmits(['added-to-cart'])

const sinStock = computed(() => {
    return props.product.stock !== undefined && props.product.stock === 0
})

// Notifica al padre cuando el usuario pulsa el botón Agregar
function manejarAgregar() {
    if (!sinStock.value) {
        emit('added-to-cart', props.product)
    }
}

// Recorta el texto de la descripción para mostrar una versión corta
function acortarTexto(texto, maxLong) {
    if (!texto) return ''
    if (texto.length <= maxLong) return texto
    return texto.substring(0, maxLong) + '...'
}

// Formatea el precio a dos decimales
function formatearPrecio(precio) {
    const num = Number(precio)
    if (isNaN(num)) return '0.00'
    return num.toFixed(2)
}

// Sustituye la imagen cuando el navegador no puede cargarla
function manejarErrorImagen(evento) {
    evento.target.src = 'https://via.placeholder.com/300x300?text=Sin+imagen'
}
</script>

<style scoped>
.tarjeta-producto {
    background-color: var(--color-tarjeta);
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
    overflow: hidden;
    transition: var(--transicion);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.tarjeta-producto:hover {
    box-shadow: var(--sombra-media);
    transform: translateY(-3px);
}

.enlace-producto {
    text-decoration: none;
    color: inherit;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.imagen-wrapper {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background-color: var(--color-fondo);
    position: relative;
}

.imagen-producto {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.tarjeta-producto:hover .imagen-producto {
    transform: scale(1.06);
}

.badge-stock {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.badge-stock.disponible {
    background-color: rgba(5, 150, 105, 0.9);
    color: white;
}

.badge-stock.agotado {
    background-color: rgba(220, 38, 38, 0.9);
    color: white;
}

.info-producto {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.nombre-producto {
    font-size: 0.95rem;
    color: var(--color-oscuro);
    font-weight: 600;
    margin-bottom: 0.3rem;
    line-height: 1.3;
}

.descripcion-producto {
    color: var(--color-gris);
    font-size: 0.82rem;
    margin-bottom: 0.75rem;
    flex: 1;
    line-height: 1.4;
}

.pie-producto {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.precio-producto {
    font-size: 1.2rem;
    color: var(--color-primario);
    font-weight: 700;
}

.acciones-producto {
    padding: 0 1rem 1rem;
    display: flex;
    gap: 0.4rem;
}

.btn-card {
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: var(--radio-pequeno);
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    transition: var(--transicion);
    text-decoration: none;
    text-align: center;
    font-family: var(--fuente-cuerpo);
}

.btn-agregar-card {
    flex: 1;
    background-color: var(--color-primario);
    color: white;
}

.btn-agregar-card:hover:not(:disabled) {
    background-color: var(--color-primario-hover);
}

.btn-agregar-card:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn-editar-card {
    background-color: var(--color-fondo);
    color: var(--color-oscuro);
}

.btn-editar-card:hover {
    background-color: var(--color-claro);
}
</style>
