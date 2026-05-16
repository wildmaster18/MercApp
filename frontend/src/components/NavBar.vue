<template>
    <nav class="barra-nav">
        <div class="container">
            <div class="contenido-nav">
                <router-link to="/" class="logo">
                    <h1>MercApp</h1>
                </router-link>
                <div class="enlaces-nav">
                    <router-link to="/" class="enlace-nav">Inicio</router-link>
                    <router-link to="/product/new" class="enlace-nav">Nuevo Producto</router-link>
                    <router-link to="/about" class="enlace-nav">Acerca de</router-link>
                    <router-link to="/cart" class="enlace-carrito">
                        Carrito
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
// La barra superior se mantiene fija en todas las vistas
</script>

<style scoped>
.barra-nav {
    background-color: white;
    box-shadow: var(--sombra-base);
    position: sticky;
    top: 0;
    z-index: 100;
}

.contenido-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}

.logo {
    text-decoration: none;
    color: var(--color-primario);
}

.logo h1 {
    font-size: 1.8rem;
    font-weight: bold;
}

.enlaces-nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.enlace-nav {
    text-decoration: none;
    color: var(--color-oscuro);
    font-weight: 500;
    transition: var(--transicion);
    padding: 0.5rem 0;
}

.enlace-nav:hover {
    color: var(--color-primario);
}

.enlace-carrito {
    background-color: var(--color-primario);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--radio-borde);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transicion);
}

.enlace-carrito:hover {
    background-color: #2980b9;
}

@media (max-width: 768px) {
    .contenido-nav {
        flex-direction: column;
        gap: 1rem;
    }
    .enlaces-nav {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }
}
</style>
