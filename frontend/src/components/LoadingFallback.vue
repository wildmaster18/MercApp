<template>
    <div class="contenedor-carga">
        <div class="spinner-grande"></div>
        <p>Cargando...</p>
    </div>
</template>

<script setup>
// Fallback que se muestra mientras Suspense carga la vista
</script>

<style scoped>
.contenedor-carga {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
}

.spinner-grande {
    border: 6px solid var(--color-claro);
    border-top: 6px solid var(--color-primario);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: girar 1s linear infinite;
    margin-bottom: 20px;
}

.contenedor-carga p {
    color: var(--color-gris);
    font-size: 1.2rem;
}
</style>
