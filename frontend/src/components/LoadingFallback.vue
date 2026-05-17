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
    background-color: var(--color-fondo);
}

.spinner-grande {
    border: 4px solid var(--color-claro);
    border-top: 4px solid var(--color-primario);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: girar 0.8s linear infinite;
    margin-bottom: 16px;
}

.contenedor-carga p {
    color: var(--color-gris);
    font-size: 1rem;
}
</style>
