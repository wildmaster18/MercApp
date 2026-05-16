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
            </div>
            <div class="info-producto">
                <h3 class="nombre-producto">{{ product.name }}</h3>
                <p class="descripcion-producto">{{ acortarTexto(product.description, 60) }}</p>
                <div class="precio-producto">${{ formatearPrecio(product.price) }}</div>
                <div class="stock-producto">
                    <span v-if="product.stock > 0" class="stock-disponible">
                        {{ product.stock }} disponibles
                    </span>
                    <span v-else class="stock-agotado">Sin stock</span>
                </div>
            </div>
        </router-link>

        <div class="acciones-producto">
            <button
                @click.stop="manejarAgregar"
                class="btn btn-primario btn-agregar"
                :disabled="sinStock"
            >
                <span v-if="sinStock">Sin stock</span>
                <span v-else>Agregar</span>
            </button>
            <router-link :to="`/product/${product.id}/edit`" class="btn-icono">
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
    background-color: white;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
    overflow: hidden;
    transition: var(--transicion);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.tarjeta-producto:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    height: 220px;
    overflow: hidden;
    background-color: var(--color-claro);
}

.imagen-producto {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transicion);
}

.tarjeta-producto:hover .imagen-producto {
    transform: scale(1.05);
}

.info-producto {
    padding: 1.25rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.nombre-producto {
    font-size: 1.1rem;
    color: var(--color-oscuro);
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.descripcion-producto {
    color: var(--color-gris);
    font-size: 0.9rem;
    margin-bottom: 1rem;
    flex: 1;
}

.precio-producto {
    font-size: 1.4rem;
    color: var(--color-secundario);
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.stock-producto {
    font-size: 0.85rem;
}

.stock-disponible {
    color: var(--color-secundario);
    font-weight: 500;
}

.stock-agotado {
    color: var(--color-peligro);
    font-weight: 500;
}

.acciones-producto {
    padding: 0 1.25rem 1.25rem;
    display: flex;
    gap: 0.5rem;
}

.btn-agregar {
    flex: 1;
    padding: 0.6rem;
    font-weight: 600;
    font-size: 0.95rem;
}

.btn-icono {
    background-color: var(--color-aviso);
    color: white;
    padding: 0.6rem 1rem;
    border-radius: var(--radio-borde);
    text-decoration: none;
    font-size: 0.9rem;
    transition: var(--transicion);
}

.btn-icono:hover {
    background-color: #d68910;
}
</style>
