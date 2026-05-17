<template>
    <div class="pagina-chat">
        <div class="container">
            <div class="layout-chat">
                <div class="panel-chat">
                    <div class="cabecera-chat">
                        <h2>Chat en tiempo real</h2>
                        <span class="estado-conexion" :class="conectado ? 'en-linea' : 'desconectado'">
                            {{ conectado ? 'Conectado' : 'Desconectado' }}
                        </span>
                    </div>

                    <!-- Solicita un nombre antes de entrar al chat -->
                    <div v-if="!nombreConfirmado" class="ingreso-nombre">
                        <p>Ingresa tu nombre para entrar al chat:</p>
                        <div class="fila-nombre">
                            <input
                                v-model="nombreUsuario"
                                type="text"
                                class="input-form"
                                placeholder="Tu nombre..."
                                @keyup.enter="confirmarNombre"
                            />
                            <button @click="confirmarNombre" class="btn btn-primario" :disabled="!nombreUsuario.trim()">
                                Entrar
                            </button>
                        </div>
                    </div>

                    <!-- Zona de mensajes y entrada de texto -->
                    <template v-else>
                        <div class="zona-mensajes" ref="refMensajes">
                            <div
                                v-for="(msg, idx) in mensajes"
                                :key="idx"
                                :class="['burbuja', msg.tipo]"
                            >
                                <template v-if="msg.tipo === 'sistema'">
                                    <span class="texto-sistema">{{ msg.texto }}</span>
                                </template>
                                <template v-else>
                                    <span class="autor-msg">{{ msg.nomUsu }}</span>
                                    <span class="texto-msg">{{ msg.mensaje }}</span>
                                    <span class="hora-msg">{{ msg.hora }}</span>
                                </template>
                            </div>

                            <div v-if="mensajes.length === 0" class="chat-vacio">
                                Aun no hay mensajes. Escribe el primero.
                            </div>
                        </div>

                        <div class="barra-envio">
                            <input
                                v-model="textoMensaje"
                                type="text"
                                class="input-form input-mensaje"
                                placeholder="Escribe un mensaje..."
                                @keyup.enter="enviarMensaje"
                            />
                            <button @click="enviarMensaje" class="btn btn-primario" :disabled="!textoMensaje.trim()">
                                Enviar
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

// Estado de la conexión y datos del chat
const conectado = ref(false)
const nombreUsuario = ref('')
const nombreConfirmado = ref(false)
const textoMensaje = ref('')
const mensajes = ref([])
const refMensajes = ref(null)

// Recupera el nombre guardado si el usuario ya inició sesión
const usuarioGuardado = localStorage.getItem('mercapp_usuario')
if (usuarioGuardado) {
    nombreUsuario.value = usuarioGuardado
}

// Crea la conexión con el servidor Socket.io del backend
let socket = null

// Inicializa el socket al montar el componente
onMounted(() => {
    socket = io('http://localhost:3000')

    // Actualiza el estado de conexión cuando el socket conecta o desconecta
    socket.on('connect', () => {
        conectado.value = true
    })

    socket.on('disconnect', () => {
        conectado.value = false
    })

    // Recibe mensajes del chat y los agrega a la lista
    socket.on('chatMensaje', (datos) => {
        mensajes.value.push({
            tipo: 'mensaje',
            nomUsu: datos.nomUsu,
            mensaje: datos.mensaje,
            hora: datos.hora
        })
        desplazarAbajo()
    })

    // Recibe mensajes del sistema como conexiones y desconexiones
    socket.on('mensajeSistema', (texto) => {
        mensajes.value.push({ tipo: 'sistema', texto: texto })
        desplazarAbajo()
    })
})

// Desconecta el socket al desmontar el componente
onUnmounted(() => {
    if (socket) {
        socket.disconnect()
    }
})

// Confirma el nombre del usuario y lo registra en el servidor
function confirmarNombre() {
    const nombre = nombreUsuario.value.trim()
    if (!nombre) return
    nombreConfirmado.value = true
    localStorage.setItem('mercapp_usuario', nombre)
    if (socket) {
        socket.emit('usuarioConectado', nombre)
    }
}

// Envía el mensaje al servidor y limpia el campo de texto
function enviarMensaje() {
    const texto = textoMensaje.value.trim()
    if (!texto || !socket) return
    socket.emit('chatMensaje', texto)
    textoMensaje.value = ''
}

// Desplaza la zona de mensajes al final para ver el último mensaje
async function desplazarAbajo() {
    await nextTick()
    if (refMensajes.value) {
        refMensajes.value.scrollTop = refMensajes.value.scrollHeight
    }
}
</script>

<style scoped>
.pagina-chat { padding: 2rem 0; }

.layout-chat { max-width: 700px; margin: 0 auto; }

.panel-chat {
    background-color: var(--color-tarjeta);
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.cabecera-chat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background-color: var(--color-oscuro);
    color: white;
}

.cabecera-chat h2 { font-size: 1.1rem; font-weight: 600; }

.estado-conexion {
    font-size: 0.78rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
}
.en-linea { background-color: rgba(5, 150, 105, 0.2); color: #34d399; }
.desconectado { background-color: rgba(220, 38, 38, 0.2); color: #fca5a5; }

.ingreso-nombre {
    padding: 2.5rem 1.25rem;
    text-align: center;
}
.ingreso-nombre p { color: var(--color-gris); margin-bottom: 1rem; }
.fila-nombre { display: flex; gap: 0.5rem; max-width: 360px; margin: 0 auto; }
.fila-nombre .input-form { flex: 1; }

.zona-mensajes {
    flex: 1;
    min-height: 350px;
    max-height: 450px;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    background-color: var(--color-fondo);
}

.burbuja { max-width: 85%; }

.burbuja.mensaje {
    background-color: var(--color-tarjeta);
    padding: 0.6rem 0.9rem;
    border-radius: 12px;
    box-shadow: var(--sombra-base);
}

.burbuja.sistema {
    align-self: center;
    max-width: 100%;
}

.texto-sistema {
    font-size: 0.78rem;
    color: var(--color-gris);
    font-style: italic;
}

.autor-msg {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-primario);
    margin-bottom: 2px;
}

.texto-msg { font-size: 0.9rem; color: var(--color-oscuro); }

.hora-msg {
    display: block;
    text-align: right;
    font-size: 0.7rem;
    color: var(--color-gris);
    margin-top: 2px;
}

.chat-vacio {
    text-align: center;
    color: var(--color-gris);
    padding: 3rem 0;
    font-size: 0.9rem;
}

.barra-envio {
    display: flex;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--color-claro);
}

.input-mensaje { flex: 1; }

@media (max-width: 768px) {
    .zona-mensajes { min-height: 250px; max-height: 350px; }
}
</style>
