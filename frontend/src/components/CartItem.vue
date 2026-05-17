<template>
    <div class="item-carrito">
        <img
            :src="item.imageUrl"
            :alt="item.name"
            class="imagen-item"
            @error="manejarErrorImagen"
        />

        <div class="info-item">
            <h4 class="nombre-item">{{ item.name }}</h4>
            <p class="descripcion-item">{{ acortarTexto(item.description, 70) }}</p>
            <span class="precio-unitario">${{ formatearPrecio(item.price) }} c/u</span>
        </div>

        <div class="cantidad-item">
            <button @click="disminuir" class="btn-cantidad" :disabled="item.cantidad <= 1">-</button>
            <span class="valor-cantidad">{{ item.cantidad }}</span>
            <button @click="aumentar" class="btn-cantidad" :disabled="item.cantidad >= item.stock">+</button>
        </div>

        <div class="total-item">
            <span class="precio-total">${{ formatearPrecio(item.price * item.cantidad) }}</span>
            <button @click="quitar" class="btn-quitar">Eliminar</button>
        </div>
    </div>
</template>

<script setup>
// Componente reutilizable para representar una fila del carrito
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

// Eventos emitidos hacia la vista padre
const emit = defineEmits(['increment', 'decrement', 'remove'])

// Emite incremento solo si hay stock disponible
function aumentar() {
    if (props.item.cantidad < props.item.stock) {
        emit('increment', props.item.id)
    }
}

// Emite decremento solo si la cantidad es mayor a uno
function disminuir() {
    if (props.item.cantidad > 1) {
        emit('decrement', props.item.id)
    }
}

// Emite la señal para eliminar este item del carrito
function quitar() {
    emit('remove', props.item.id)
}

// Recorta el texto al largo indicado y añade puntos suspensivos
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

// Sustituye la imagen rota por un placeholder
function manejarErrorImagen(evento) {
    evento.target.src = 'https://via.placeholder.com/100x100?text=Sin+imagen'
}
</script>

<style scoped>
.item-carrito {
    display: grid;
    grid-template-columns: 80px 1fr auto auto;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--color-claro);
    border-radius: var(--radio-pequeno);
    margin-bottom: 0.75rem;
    align-items: center;
    background-color: var(--color-tarjeta);
    transition: var(--transicion);
}
.item-carrito:hover { border-color: #cbd5e1; }

.imagen-item {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--radio-pequeno);
}

.nombre-item { color: var(--color-oscuro); margin-bottom: 0.25rem; font-size: 0.95rem; }
.descripcion-item { color: var(--color-gris); font-size: 0.8rem; margin-bottom: 0.25rem; }
.precio-unitario { color: var(--color-primario); font-weight: 600; font-size: 0.85rem; }

.cantidad-item { display: flex; align-items: center; gap: 0.5rem; }

.btn-cantidad {
    width: 28px;
    height: 28px;
    border: 1.5px solid var(--color-claro);
    background-color: var(--color-fondo);
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-family: var(--fuente-cuerpo);
    transition: var(--transicion);
    display: flex;
    align-items: center;
    justify-content: center;
}
.btn-cantidad:hover:not(:disabled) {
    background-color: var(--color-primario);
    color: white;
    border-color: var(--color-primario);
}
.btn-cantidad:disabled { opacity: 0.3; cursor: not-allowed; }

.valor-cantidad { font-weight: 600; min-width: 24px; text-align: center; font-size: 0.9rem; }

.total-item { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; }
.precio-total { font-size: 1.05rem; font-weight: 700; color: var(--color-oscuro); }

.btn-quitar {
    background: none;
    border: none;
    color: var(--color-peligro);
    cursor: pointer;
    font-size: 0.78rem;
    font-family: var(--fuente-cuerpo);
    transition: var(--transicion);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
}
.btn-quitar:hover { background-color: #fef2f2; }

@media (max-width: 768px) {
    .item-carrito { grid-template-columns: 60px 1fr; gap: 0.5rem; padding: 0.75rem; }
    .imagen-item { width: 60px; height: 60px; }
    .cantidad-item, .total-item { grid-column: 1 / -1; justify-content: space-between; }
    .total-item { flex-direction: row; align-items: center; }
}
</style>
