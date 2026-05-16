<template>
    <div class="pagina-home">
        <section class="hero">
            <div class="container">
                <h2>Encuentra los mejores productos</h2>
                <p>Catálogo completo con búsqueda y filtros</p>
            </div>
        </section>

        <section class="filtros">
            <div class="container">
                <div class="cabecera-filtros">
                    <h3>Buscar y filtrar</h3>
                </div>

                <div class="barra-busqueda">
                    <input
                        v-model="textoBusqueda"
                        type="text"
                        placeholder="Buscar por nombre o descripción..."
                        class="input-busqueda"
                    />
                </div>

                <div class="filtros-categoria">
                    <button
                        v-for="cat in categoriasParaMostrar"
                        :key="cat.id"
                        @click="categoriaSeleccionada = cat.id"
                        :class="['btn-categoria', { activa: categoriaSeleccionada === cat.id }]"
                    >
                        {{ cat.name }}
                    </button>
                </div>
            </div>
        </section>

        <section class="seccion-productos">
            <div class="container">
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
                    <p>No se encontraron productos con esos filtros</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'

const { products, categories, loading, error, fetchProducts, fetchCategories } = useProducts()

const textoBusqueda = ref('')
// 0 representa el botón "Todas" que no filtra por categoría
const categoriaSeleccionada = ref(0)

// Antepone una opción "Todas" a las categorías reales recibidas del API
const categoriasParaMostrar = computed(() => {
    const lista = [{ id: 0, name: 'Todas' }]
    for (let i = 0; i < categories.value.length; i++) {
        lista.push(categories.value[i])
    }
    return lista
})

// Aplica filtro por categoría y búsqueda de texto en el listado de productos
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

// El carrito real se conecta en el Commit 4
function manejarAgregar(producto) {
    alert(producto.name + ' agregado (el carrito se activa en la siguiente entrega)')
}

onMounted(() => {
    cargarDatos()
})
</script>

<style scoped>
.pagina-home {
    min-height: 100vh;
}

.hero {
    background: linear-gradient(135deg, #3498db, #2ecc71);
    color: white;
    padding: 3rem 0;
    text-align: center;
}

.hero h2 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
}

.hero p {
    font-size: 1.1rem;
}

.filtros {
    background-color: white;
    padding: 2rem 0;
    box-shadow: var(--sombra-base);
}

.cabecera-filtros {
    margin-bottom: 1rem;
}

.cabecera-filtros h3 {
    color: var(--color-oscuro);
}

.barra-busqueda {
    margin-bottom: 1.5rem;
}

.input-busqueda {
    width: 100%;
    padding: 0.9rem;
    font-size: 1rem;
    border: 2px solid var(--color-claro);
    border-radius: var(--radio-borde);
    transition: var(--transicion);
}

.input-busqueda:focus {
    outline: none;
    border-color: var(--color-primario);
}

.filtros-categoria {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.btn-categoria {
    padding: 0.6rem 1.2rem;
    border: 2px solid var(--color-claro);
    background-color: white;
    border-radius: var(--radio-borde);
    cursor: pointer;
    font-weight: 500;
    font-family: inherit;
    transition: var(--transicion);
}

.btn-categoria:hover {
    border-color: var(--color-primario);
    color: var(--color-primario);
}

.btn-categoria.activa {
    background-color: var(--color-primario);
    color: white;
    border-color: var(--color-primario);
}

.seccion-productos {
    padding: 2.5rem 0;
}

.grid-productos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
}

.estado-carga,
.sin-resultados {
    text-align: center;
    padding: 3rem 0;
    color: var(--color-gris);
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .hero h2 {
        font-size: 1.6rem;
    }
    .grid-productos {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
    }
}
</style>
