<template>
    <div class="pagina-home">
        <section class="panel-superior">
            <div class="container">
                <div class="contenido-hero">
                    <div class="bienvenida">
                        <h2 class="titulo-catalogo">Bienvenido a MercApp</h2>
                        <p class="subtitulo-catalogo">Tu catalogo de productos en linea. Explora, filtra y gestiona tu inventario.</p>
                    </div>
                    <div class="tarjetas-resumen">
                        <div class="tarjeta-info">
                            <span class="info-numero">{{ products.length }}</span>
                            <span class="info-etiqueta">Productos</span>
                        </div>
                        <div class="tarjeta-info">
                            <span class="info-numero">{{ categories.length }}</span>
                            <span class="info-etiqueta">Categorias</span>
                        </div>
                        <div class="tarjeta-info">
                            <span class="info-numero">{{ productosFiltrados.length }}</span>
                            <span class="info-etiqueta">Visibles</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="seccion-contenido">
            <div class="container">
                <div class="layout-catalogo">
                    <aside class="panel-filtros">
                        <div class="caja-busqueda">
                            <svg class="icono-busqueda" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input
                                v-model="textoBusqueda"
                                type="text"
                                placeholder="Buscar productos..."
                                class="input-busqueda"
                            />
                        </div>

                        <div class="grupo-categorias">
                            <h4 class="titulo-filtro">Categorias</h4>
                            <button
                                v-for="cat in categoriasParaMostrar"
                                :key="cat.id"
                                @click="categoriaSeleccionada = cat.id"
                                :class="['chip-categoria', { activa: categoriaSeleccionada === cat.id }]"
                            >
                                {{ cat.name }}
                            </button>
                        </div>

                        <div class="grupo-nueva-cat">
                            <h4 class="titulo-filtro">Nueva categoria</h4>
                            <div class="fila-nueva-cat">
                                <input
                                    v-model="nombreNuevaCat"
                                    type="text"
                                    class="input-busqueda input-cat"
                                    placeholder="Nombre..."
                                    @keyup.enter="crearCategoria"
                                />
                                <button @click="crearCategoria" class="btn btn-primario btn-cat" :disabled="!nombreNuevaCat.trim()">+</button>
                            </div>
                        </div>

                        <router-link to="/product/new" class="btn btn-primario btn-crear-lateral">
                            + Nuevo producto
                        </router-link>
                    </aside>

                    <main class="zona-productos">
                        <div v-if="loading" class="estado-carga">
                            <div class="spinner"></div>
                            <p>Cargando productos...</p>
                        </div>

                        <div v-else-if="error" class="mensaje-error">
                            <p>{{ error }}</p>
                            <button @click="cargarDatos" class="btn btn-primario">Reintentar</button>
                        </div>

                        <div v-else-if="productosFiltrados.length > 0" class="grid-productos">
                            <ProductCard
                                v-for="prod in productosFiltrados"
                                :key="prod.id"
                                :product="prod"
                                @added-to-cart="manejarAgregar"
                            />
                        </div>

                        <div v-else class="sin-resultados">
                            <p>No se encontraron productos con esos filtros.</p>
                            <button @click="categoriaSeleccionada = 0; textoBusqueda = ''" class="btn btn-primario">Limpiar filtros</button>
                        </div>
                    </main>
                </div>
            </div>
        </section>

        <transition name="aviso">
            <div v-if="mensajeAviso" class="aviso-flotante">{{ mensajeAviso }}</div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'

const { products, categories, loading, error, fetchProducts, fetchCategories } = useProducts()
const { addToCart } = useCart()

const textoBusqueda = ref('')
// 0 representa el botón "Todas" que no aplica filtro de categoría
const categoriaSeleccionada = ref(0)
const mensajeAviso = ref('')
const nombreNuevaCat = ref('')

// Antepone una opción "Todas" a las categorías reales recibidas del API
const categoriasParaMostrar = computed(() => {
    const lista = [{ id: 0, name: 'Todas' }]
    for (let i = 0; i < categories.value.length; i++) {
        lista.push(categories.value[i])
    }
    return lista
})

// Aplica filtro por categoría y búsqueda de texto al listado de productos
const productosFiltrados = computed(() => {
    let lista = products.value

    if (categoriaSeleccionada.value !== 0) {
        lista = lista.filter((p) => p.categoryId === categoriaSeleccionada.value)
    }

    const texto = textoBusqueda.value.trim().toLowerCase()
    if (texto !== '') {
        lista = lista.filter((p) => {
            const nombre = (p.name || '').toLowerCase()
            const descripcion = (p.description || '').toLowerCase()
            return nombre.includes(texto) || descripcion.includes(texto)
        })
    }

    return lista
})

// Carga la lista de productos y categorías desde el API
async function cargarDatos() {
    await fetchProducts()
    await fetchCategories()
}

// Agrega el producto recibido al carrito y muestra un aviso temporal
function manejarAgregar(producto) {
    const exito = addToCart(producto, 1)
    if (exito) {
        mostrarAviso(producto.name + ' agregado al carrito')
    } else {
        mostrarAviso('Stock insuficiente')
    }
}

// Muestra un mensaje en pantalla que desaparece después de 2 segundos
function mostrarAviso(texto) {
    mensajeAviso.value = texto
    setTimeout(() => {
        mensajeAviso.value = ''
    }, 2000)
}

// Crea una categoría nueva llamando al API y recarga la lista
async function crearCategoria() {
    const nombre = nombreNuevaCat.value.trim()
    if (!nombre) return

    try {
        const respuesta = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nombre })
        })

        if (!respuesta.ok) {
            const datos = await respuesta.json()
            mostrarAviso(datos.error || 'Error al crear categoría')
            return
        }

        nombreNuevaCat.value = ''
        await fetchCategories()
        mostrarAviso('Categoría "' + nombre + '" creada')
    } catch (err) {
        mostrarAviso('Error de conexión al crear categoría')
    }
}

onMounted(() => {
    cargarDatos()
})
</script>

<style scoped>
.pagina-home {
    min-height: 100vh;
}

.panel-superior {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
    padding: 2.5rem 0;
    color: white;
}

.contenido-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.titulo-catalogo {
    font-family: var(--fuente-titulo);
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
}

.subtitulo-catalogo {
    color: #a5b4fc;
    font-size: 0.95rem;
    max-width: 400px;
    line-height: 1.5;
}

.tarjetas-resumen {
    display: flex;
    gap: 1rem;
}

.tarjeta-info {
    background-color: rgba(255, 255, 255, 0.07);
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    min-width: 100px;
}

.info-numero {
    font-size: 1.6rem;
    font-weight: 700;
    color: #a78bfa;
}

.info-etiqueta {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.seccion-contenido {
    padding: 2rem 0;
}

.layout-catalogo {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 2rem;
    align-items: start;
}

.panel-filtros {
    background-color: var(--color-tarjeta);
    padding: 1.25rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
    position: sticky;
    top: 80px;
}

.caja-busqueda {
    position: relative;
    margin-bottom: 1.25rem;
}

.icono-busqueda {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-gris);
}

.input-busqueda {
    width: 100%;
    padding: 0.65rem 0.65rem 0.65rem 2.2rem;
    font-size: 0.9rem;
    border: 1.5px solid var(--color-claro);
    border-radius: var(--radio-pequeno);
    transition: var(--transicion);
    font-family: var(--fuente-cuerpo);
    background-color: var(--color-fondo);
}

.input-busqueda:focus {
    outline: none;
    border-color: var(--color-primario);
    background-color: white;
}

.titulo-filtro {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-gris);
    margin-bottom: 0.75rem;
    font-weight: 600;
}

.grupo-categorias {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1.25rem;
}

.chip-categoria {
    padding: 0.5rem 0.75rem;
    border: none;
    background-color: transparent;
    border-radius: var(--radio-pequeno);
    cursor: pointer;
    font-weight: 500;
    font-family: var(--fuente-cuerpo);
    font-size: 0.88rem;
    transition: var(--transicion);
    text-align: left;
    color: var(--color-oscuro);
}

.chip-categoria:hover {
    background-color: var(--color-fondo);
}

.chip-categoria.activa {
    background-color: var(--color-primario);
    color: white;
}

.btn-crear-lateral {
    width: 100%;
    padding: 0.7rem;
    font-size: 0.9rem;
}

.grupo-nueva-cat {
    margin-bottom: 1.25rem;
}

.fila-nueva-cat {
    display: flex;
    gap: 0.35rem;
}

.input-cat {
    flex: 1;
    padding-left: 0.6rem;
    font-size: 0.85rem;
}

.btn-cat {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    min-width: 36px;
}

.zona-productos {
    min-height: 400px;
}

.grid-productos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.25rem;
}

.estado-carga,
.sin-resultados {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-gris);
}

.sin-resultados .btn {
    margin-top: 1rem;
}

.aviso-flotante {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background-color: var(--color-oscuro);
    color: white;
    padding: 0.8rem 1.4rem;
    border-radius: 10px;
    box-shadow: var(--sombra-fuerte);
    font-weight: 500;
    font-size: 0.9rem;
    z-index: 200;
}

.aviso-enter-active,
.aviso-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.aviso-enter-from,
.aviso-leave-to {
    opacity: 0;
    transform: translateY(12px);
}

@media (max-width: 768px) {
    .contenido-hero {
        flex-direction: column;
        align-items: flex-start;
    }
    .tarjetas-resumen {
        flex-wrap: wrap;
    }
    .tarjeta-info {
        flex: 1;
        min-width: 80px;
        padding: 0.6rem 1rem;
    }
    .layout-catalogo {
        grid-template-columns: 1fr;
    }
    .panel-filtros {
        position: static;
    }
    .grupo-categorias {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.4rem;
    }
    .chip-categoria {
        padding: 0.4rem 0.8rem;
        font-size: 0.82rem;
    }
    .btn-crear-lateral {
        display: none;
    }
    .grid-productos {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 0.75rem;
    }
}
</style>
