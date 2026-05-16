<template>
    <div class="pagina-carrito">
        <div class="container">
            <router-link to="/" class="enlace-volver">&larr; Volver al catálogo</router-link>

            <div class="aviso-carrito">
                <h2>Carrito de compras</h2>
                <p>El carrito completo con persistencia y control de stock se entrega en la siguiente versión del proyecto.</p>
                <router-link to="/" class="btn btn-primario btn-grande">Ir al catálogo</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
// Placeholder de la vista de carrito; la funcionalidad real llega en el Commit 4
</script>

<style scoped>
.pagina-carrito {
    padding: 2rem 0;
}

.enlace-volver {
    display: inline-block;
    margin-bottom: 1.5rem;
    color: var(--color-oscuro);
    text-decoration: none;
    font-weight: 500;
}

.aviso-carrito {
    background-color: white;
    padding: 3rem 2rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
    text-align: center;
}

.aviso-carrito h2 {
    color: var(--color-oscuro);
    margin-bottom: 1rem;
}

.aviso-carrito p {
    color: var(--color-gris);
    margin-bottom: 2rem;
    font-size: 1.05rem;
}

.btn-grande {
    padding: 0.9rem 2rem;
    font-size: 1rem;
    font-weight: 600;
}
</style>
