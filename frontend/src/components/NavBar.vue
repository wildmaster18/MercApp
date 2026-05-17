<template>
    <nav class="barra-nav">
        <div class="container">
            <div class="contenido-nav">
                <router-link to="/" class="logo">
                    <span class="logo-icono">M</span>
                    <span class="logo-texto">MercApp</span>
                </router-link>
                <div class="enlaces-nav">
                    <router-link to="/" class="enlace-nav" active-class="enlace-activo">Catalogo</router-link>
                    <router-link to="/product/new" class="enlace-nav" active-class="enlace-activo">Crear</router-link>
                    <router-link to="/chat" class="enlace-nav" active-class="enlace-activo">Chat</router-link>
                    <router-link to="/about" class="enlace-nav" active-class="enlace-activo">Info</router-link>
                    <span v-if="usuarioActual" class="usuario-info">{{ usuarioActual }}</span>
                    <button v-if="usuarioActual" @click="cerrarSesion" class="enlace-nav btn-logout">Salir</button>
                    <router-link v-else to="/login" class="enlace-nav" active-class="enlace-activo">Login</router-link>
                    <router-link to="/cart" class="enlace-carrito">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        <span v-if="cantidadItems > 0" class="contador-carrito">{{ cantidadItems }}</span>
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const route = useRoute()

// Extrae el estado reactivo del carrito con storeToRefs
const { cantidadItems } = storeToRefs(useCart())

// Nombre del usuario autenticado leído de localStorage
const usuarioActual = ref(localStorage.getItem('mercapp_usuario') || '')

// Revisa si hay usuario cada vez que cambia la ruta
watch(() => route.fullPath, () => {
    usuarioActual.value = localStorage.getItem('mercapp_usuario') || ''
})

// Cierra la sesión eliminando el usuario de localStorage y redirige al login
function cerrarSesion() {
    localStorage.removeItem('mercapp_usuario')
    usuarioActual.value = ''
    fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
}
</script>

<style scoped>
.barra-nav {
    background-color: var(--color-oscuro);
    position: sticky;
    top: 0;
    z-index: 100;
}

.contenido-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
}

.logo {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-icono {
    width: 36px;
    height: 36px;
    background-color: var(--color-primario);
    color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--fuente-titulo);
    font-weight: 700;
    font-size: 1.2rem;
}

.logo-texto {
    font-family: var(--fuente-titulo);
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
}

.enlaces-nav {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}

.enlace-nav {
    text-decoration: none;
    color: #94a3b8;
    font-weight: 500;
    font-size: 0.9rem;
    transition: var(--transicion);
    padding: 0.5rem 1rem;
    border-radius: 8px;
}

.enlace-nav:hover,
.enlace-activo {
    color: white;
    background-color: rgba(255, 255, 255, 0.08);
}

.usuario-info {
    color: #a78bfa;
    font-weight: 600;
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
}

.btn-logout {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--fuente-cuerpo);
}

.enlace-carrito {
    color: white;
    padding: 0.5rem 0.9rem;
    border-radius: 10px;
    text-decoration: none;
    transition: var(--transicion);
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
    background-color: rgba(255, 255, 255, 0.08);
}

.enlace-carrito:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.contador-carrito {
    position: absolute;
    top: -6px;
    right: -6px;
    background-color: var(--color-primario);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    border: 2px solid var(--color-oscuro);
}

@media (max-width: 768px) {
    .contenido-nav {
        flex-direction: column;
        gap: 0.75rem;
    }
    .enlaces-nav {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem;
    }
}
</style>
