<template>
    <div class="pagina-404">
        <div class="caja-404">
            <div class="codigo-error">404</div>
            <h1>Pagina no encontrada</h1>
            <p>La pagina que buscas no existe o fue movida.</p>
            <div class="acciones-404">
                <router-link to="/" class="btn btn-primario btn-grande">Volver al inicio</router-link>
                <button @click="volverAtras" class="btn btn-secundario btn-grande">Volver atras</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Regresa a la página anterior en el historial del navegador
function volverAtras() {
    router.back()
}
</script>

<style scoped>
.pagina-404 {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-fondo);
    padding: 2rem;
}

.caja-404 {
    text-align: center;
    background-color: var(--color-tarjeta);
    padding: 3rem 2.5rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-media);
    max-width: 480px;
}

.codigo-error {
    font-family: var(--fuente-titulo);
    font-size: 5rem;
    font-weight: 700;
    color: var(--color-primario);
    line-height: 1;
    margin-bottom: 0.75rem;
    opacity: 0.8;
}

.caja-404 h1 { color: var(--color-oscuro); font-size: 1.4rem; margin-bottom: 0.5rem; }
.caja-404 p { color: var(--color-gris); margin-bottom: 1.5rem; font-size: 0.95rem; }

.acciones-404 { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
.btn-grande { padding: 0.75rem 1.5rem; font-size: 0.9rem; }

@media (max-width: 768px) {
    .codigo-error { font-size: 3.5rem; }
    .acciones-404 { flex-direction: column; }
    .btn-grande { width: 100%; }
}
</style>
