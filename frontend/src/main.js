// Punto de entrada de la SPA: crea la instancia de Vue y monta la aplicación
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
// Registra Pinia para el estado global del carrito
app.use(createPinia())
// Registra el router para habilitar la navegación SPA
app.use(router)
app.mount('#app')
