<template>
    <div class="pagina-login">
        <div class="container">
            <div class="caja-auth">
                <h2 class="titulo-auth">Iniciar sesion</h2>
                <p class="subtitulo-auth">Ingresa tus credenciales para acceder</p>

                <div v-if="errorMsg" class="mensaje-error">{{ errorMsg }}</div>

                <form @submit.prevent="manejarLogin" class="formulario-auth">
                    <div class="campo">
                        <label class="etiqueta-campo" for="nomUsu">Usuario</label>
                        <input
                            id="nomUsu"
                            v-model="nomUsu"
                            type="text"
                            class="input-form"
                            placeholder="Tu nombre de usuario"
                            required
                        />
                    </div>

                    <div class="campo">
                        <label class="etiqueta-campo" for="passUsu">Contrasena</label>
                        <input
                            id="passUsu"
                            v-model="passUsu"
                            type="password"
                            class="input-form"
                            placeholder="Tu contrasena"
                            required
                        />
                    </div>

                    <button type="submit" class="btn btn-primario btn-bloque" :disabled="enviando">
                        {{ enviando ? 'Ingresando...' : 'Ingresar' }}
                    </button>
                </form>

                <p class="enlace-alterno">
                    No tienes cuenta?
                    <router-link to="/register">Registrate aqui</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Campos del formulario de inicio de sesion
const nomUsu = ref('')
const passUsu = ref('')
const enviando = ref(false)
const errorMsg = ref('')

// Envía las credenciales al API y redirige al catalogo si son correctas
async function manejarLogin() {
    errorMsg.value = ''
    enviando.value = true

    try {
        const respuesta = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nomUsu: nomUsu.value.trim(),
                passUsu: passUsu.value
            })
        })

        const datos = await respuesta.json()

        if (!respuesta.ok) {
            errorMsg.value = datos.error || 'Error al iniciar sesion'
            return
        }

        // Guarda el nombre del usuario en localStorage para el chat
        localStorage.setItem('mercapp_usuario', datos.user.nomUsu)
        router.push('/')
    } catch (err) {
        errorMsg.value = 'No se pudo conectar con el servidor'
    } finally {
        enviando.value = false
    }
}
</script>

<style scoped>
.pagina-login {
    padding: 3rem 0;
    min-height: 80vh;
    display: flex;
    align-items: center;
}

.caja-auth {
    max-width: 420px;
    margin: 0 auto;
    background-color: var(--color-tarjeta);
    padding: 2.5rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-media);
}

.titulo-auth {
    font-family: var(--fuente-titulo);
    color: var(--color-oscuro);
    font-size: 1.6rem;
    margin-bottom: 0.25rem;
}

.subtitulo-auth {
    color: var(--color-gris);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

.formulario-auth {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.campo { display: flex; flex-direction: column; gap: 0.35rem; }

.etiqueta-campo { font-weight: 600; color: var(--color-oscuro); font-size: 0.88rem; }

.input-form {
    padding: 0.65rem 0.8rem;
    border: 1.5px solid var(--color-claro);
    border-radius: var(--radio-pequeno);
    font-size: 0.95rem;
    font-family: var(--fuente-cuerpo);
    transition: var(--transicion);
    background-color: var(--color-fondo);
}

.input-form:focus {
    outline: none;
    border-color: var(--color-primario);
    background-color: white;
}

.btn-bloque { width: 100%; padding: 0.75rem; font-size: 0.95rem; margin-top: 0.5rem; }

.enlace-alterno {
    text-align: center;
    margin-top: 1.25rem;
    color: var(--color-gris);
    font-size: 0.9rem;
}

.enlace-alterno a {
    color: var(--color-primario);
    text-decoration: none;
    font-weight: 600;
}

.enlace-alterno a:hover { text-decoration: underline; }
</style>
