<template>
    <div class="pagina-404">
        <div class="caja-404">
            <div class="codigo-error">404</div>
            <h1>Página no encontrada</h1>
            <p>La página que buscas no existe o fue movida.</p>
            <div class="acciones-404">
                <router-link to="/" class="btn btn-primario btn-grande">Volver al inicio</router-link>
                <button @click="volverAtras" class="btn btn-secundario btn-grande">Volver atrás</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

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
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    padding: 2rem;
}

.caja-404 {
    text-align: center;
    background-color: white;
    padding: 3rem 2.5rem;
    border-radius: var(--radio-borde);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-width: 550px;
}

.codigo-error {
    font-size: 6rem;
    font-weight: bold;
    color: var(--color-primario);
    line-height: 1;
    margin-bottom: 1rem;
}

.caja-404 h1 {
    color: var(--color-oscuro);
    font-size: 1.7rem;
    margin-bottom: 0.75rem;
}

.caja-404 p {
    color: var(--color-gris);
    margin-bottom: 1.5rem;
}

.acciones-404 {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-grande {
    padding: 0.85rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
}

@media (max-width: 768px) {
    .codigo-error {
        font-size: 4rem;
    }
    .acciones-404 {
        flex-direction: column;
    }
    .btn-grande {
        width: 100%;
    }
}
</style>
