<template>
    <div class="pagina-registro">
        <div class="container">
            <div class="caja-auth">
                <h2 class="titulo-auth">Crear cuenta</h2>
                <p class="subtitulo-auth">Registrate para acceder al catalogo</p>

                <div v-if="errorMsg" class="mensaje-error">{{ errorMsg }}</div>
                <div v-if="exitoMsg" class="mensaje-exito">{{ exitoMsg }}</div>

                <form @submit.prevent="manejarRegistro" class="formulario-auth">
                    <div class="campo">
                        <label class="etiqueta-campo" for="nomUsu">Usuario <span class="obligatorio">*</span></label>
                        <input
                            id="nomUsu"
                            v-model="nomUsu"
                            type="text"
                            class="input-form"
                            placeholder="Minimo 3 caracteres"
                            required
                        />
                    </div>

                    <div class="campo">
                        <label class="etiqueta-campo" for="passUsu">Contrasena <span class="obligatorio">*</span></label>
                        <input
                            id="passUsu"
                            v-model="passUsu"
                            type="password"
                            class="input-form"
                            placeholder="Minimo 6 caracteres"
                            required
                        />
                    </div>

                    <button type="submit" class="btn btn-primario btn-bloque" :disabled="enviando">
                        {{ enviando ? 'Registrando...' : 'Registrarse' }}
                    </button>
                </form>

                <p class="enlace-alterno">
                    Ya tienes cuenta?
                    <router-link to="/login">Inicia sesion</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Campos del formulario de registro
const nomUsu = ref('')
const passUsu = ref('')
const enviando = ref(false)
const errorMsg = ref('')
const exitoMsg = ref('')

// Envía los datos de registro al API y redirige al catalogo si es exitoso
async function manejarRegistro() {
    errorMsg.value = ''
    exitoMsg.value = ''
    enviando.value = true

    try {
        const respuesta = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nomUsu: nomUsu.value.trim(),
                passUsu: passUsu.value
            })
        })

        const datos = await respuesta.json()

        if (!respuesta.ok) {
            // Muestra errores de validacion o del servidor
            if (datos.errors) {
                errorMsg.value = datos.errors.map((e) => e.msg).join('. ')
            } else {
                errorMsg.value = datos.error || 'Error al registrarse'
            }
            return
        }

        // Guarda el nombre del usuario y redirige al catalogo
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
.pagina-registro { padding: 3rem 0; min-height: 80vh; display: flex; align-items: center; }

.caja-auth {
    max-width: 420px;
    margin: 0 auto;
    background-color: var(--color-tarjeta);
    padding: 2.5rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-media);
}

.titulo-auth { font-family: var(--fuente-titulo); color: var(--color-oscuro); font-size: 1.6rem; margin-bottom: 0.25rem; }
.subtitulo-auth { color: var(--color-gris); font-size: 0.9rem; margin-bottom: 1.5rem; }

.formulario-auth { display: flex; flex-direction: column; gap: 1rem; }
.campo { display: flex; flex-direction: column; gap: 0.35rem; }
.etiqueta-campo { font-weight: 600; color: var(--color-oscuro); font-size: 0.88rem; }
.obligatorio { color: var(--color-peligro); }

.input-form {
    padding: 0.65rem 0.8rem;
    border: 1.5px solid var(--color-claro);
    border-radius: var(--radio-pequeno);
    font-size: 0.95rem;
    font-family: var(--fuente-cuerpo);
    transition: var(--transicion);
    background-color: var(--color-fondo);
}
.input-form:focus { outline: none; border-color: var(--color-primario); background-color: white; }

.btn-bloque { width: 100%; padding: 0.75rem; font-size: 0.95rem; margin-top: 0.5rem; }

.mensaje-exito {
    background-color: #ecfdf5;
    color: var(--color-secundario);
    padding: 12px 16px;
    border-radius: var(--radio-pequeno);
    margin-bottom: 1rem;
    border-left: 3px solid var(--color-secundario);
    font-size: 0.9rem;
}

.enlace-alterno { text-align: center; margin-top: 1.25rem; color: var(--color-gris); font-size: 0.9rem; }
.enlace-alterno a { color: var(--color-primario); text-decoration: none; font-weight: 600; }
.enlace-alterno a:hover { text-decoration: underline; }
</style>
