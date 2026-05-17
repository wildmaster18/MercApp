<template>
    <div id="contenedor-app">
        <NavBar />
        <Suspense>
            <template #default>
                <router-view />
            </template>
            <template #fallback>
                <LoadingFallback />
            </template>
        </Suspense>
    </div>
</template>

<script setup>
// Componente raíz: monta la barra de navegación y envuelve las vistas con Suspense
import NavBar from '@/components/NavBar.vue'
import LoadingFallback from '@/components/LoadingFallback.vue'
</script>

<style scoped>
#contenedor-app {
    min-height: 100vh;
}
</style>
