<template>
    <div class="pagina-form">
        <div class="container">
            <router-link to="/" class="enlace-volver">&larr; Volver al catálogo</router-link>

            <div class="contenedor-form">
                <h2 class="titulo-form">
                    {{ esEdicion ? 'Editar producto' : 'Nuevo producto' }}
                </h2>

                <div v-if="cargandoProducto" class="estado-carga">
                    <div class="spinner"></div>
                    <p>Cargando producto...</p>
                </div>

                <form v-else @submit.prevent="manejarEnvio" class="formulario">
                    <div class="campo">
                        <label class="etiqueta-campo" for="name">Nombre <span class="obligatorio">*</span></label>
                        <input
                            id="name"
                            v-model="datosForm.name"
                            type="text"
                            class="input-form"
                            :class="{ 'input-error': errores.name }"
                            placeholder="Ej: Laptop HP Pavilion 15"
                            @blur="validarCampo('name')"
                        />
                        <span v-if="errores.name" class="texto-error">{{ errores.name }}</span>
                    </div>

                    <div class="campo">
                        <label class="etiqueta-campo" for="price">Precio <span class="obligatorio">*</span></label>
                        <input
                            id="price"
                            v-model.number="datosForm.price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            class="input-form"
                            :class="{ 'input-error': errores.price }"
                            placeholder="0.00"
                            @blur="validarCampo('price')"
                        />
                        <span v-if="errores.price" class="texto-error">{{ errores.price }}</span>
                    </div>

                    <div class="campo">
                        <label class="etiqueta-campo" for="description">Descripción <span class="obligatorio">*</span></label>
                        <textarea
                            id="description"
                            v-model="datosForm.description"
                            class="textarea-form"
                            :class="{ 'input-error': errores.description }"
                            rows="4"
                            placeholder="Mínimo 10 caracteres"
                            @blur="validarCampo('description')"
                        ></textarea>
                        <span v-if="errores.description" class="texto-error">{{ errores.description }}</span>
                    </div>

                    <div class="campo">
                        <label class="etiqueta-campo" for="categoryId">Categoría <span class="obligatorio">*</span></label>
                        <select
                            id="categoryId"
                            v-model.number="datosForm.categoryId"
                            class="select-form"
                            :class="{ 'input-error': errores.categoryId }"
                            @blur="validarCampo('categoryId')"
                        >
                            <option :value="0">Selecciona una categoría</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ cat.name }}
                            </option>
                        </select>
                        <span v-if="errores.categoryId" class="texto-error">{{ errores.categoryId }}</span>
                    </div>

                    <div class="campo">
                        <label class="etiqueta-campo" for="stock">Stock disponible <span class="obligatorio">*</span></label>
                        <input
                            id="stock"
                            v-model.number="datosForm.stock"
                            type="number"
                            min="0"
                            class="input-form"
                            :class="{ 'input-error': errores.stock }"
                            placeholder="0"
                            @blur="validarCampo('stock')"
                        />
                        <span v-if="errores.stock" class="texto-error">{{ errores.stock }}</span>
                    </div>

                    <div class="campo">
                        <label class="etiqueta-campo" for="imageUrl">URL de imagen</label>
                        <input
                            id="imageUrl"
                            v-model="datosForm.imageUrl"
                            type="text"
                            class="input-form"
                            :class="{ 'input-error': errores.imageUrl }"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            @blur="validarCampo('imageUrl')"
                        />
                        <span v-if="errores.imageUrl" class="texto-error">{{ errores.imageUrl }}</span>
                        <span class="texto-ayuda">Indica una URL válida (http/https) o sube un archivo de imagen.</span>
                    </div>

                    <div class="campo">
                        <label class="etiqueta-campo" for="imagen">Archivo de imagen</label>
                        <input
                            id="imagen"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            class="input-form"
                            @change="manejarArchivo"
                        />
                        <span class="texto-ayuda">Opcional. JPG, PNG o GIF (máx. 5 MB).</span>
                        <span v-if="errores.imagen" class="texto-error">{{ errores.imagen }}</span>
                    </div>

                    <div v-if="errorGeneral" class="mensaje-error">{{ errorGeneral }}</div>

                    <div class="acciones-form">
                        <button type="submit" class="btn btn-primario btn-grande" :disabled="enviando">
                            <span v-if="enviando">Guardando...</span>
                            <span v-else>{{ esEdicion ? 'Actualizar' : 'Crear producto' }}</span>
                        </button>
                        <router-link to="/" class="btn btn-secundario btn-grande">Cancelar</router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'

const route = useRoute()
const router = useRouter()

const { categories, fetchCategories, fetchProductById, createProduct, updateProduct } = useProducts()

// Datos del formulario, los nombres se mantienen en inglés porque corresponden al contrato del API
const datosForm = reactive({
    name: '',
    price: 0,
    description: '',
    categoryId: 0,
    stock: 0,
    imageUrl: '',
    archivo: null
})

const errores = reactive({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    stock: '',
    imageUrl: '',
    imagen: ''
})

const enviando = ref(false)
const cargandoProducto = ref(false)
const errorGeneral = ref(null)

const esEdicion = computed(() => route.name === 'product-edit')

// Valida un campo concreto del formulario aplicando las reglas de la rúbrica
function validarCampo(campo) {
    errores[campo] = ''

    if (campo === 'name') {
        if (!datosForm.name || datosForm.name.trim() === '') {
            errores.name = 'El nombre es obligatorio'
        } else if (datosForm.name.trim().length < 3) {
            errores.name = 'El nombre debe tener al menos 3 caracteres'
        }
    } else if (campo === 'price') {
        if (datosForm.price === '' || datosForm.price === null || datosForm.price === undefined) {
            errores.price = 'El precio es obligatorio'
        } else if (isNaN(datosForm.price) || Number(datosForm.price) <= 0) {
            errores.price = 'El precio debe ser un número mayor a 0'
        }
    } else if (campo === 'description') {
        if (!datosForm.description || datosForm.description.trim() === '') {
            errores.description = 'La descripción es obligatoria'
        } else if (datosForm.description.trim().length < 10) {
            errores.description = 'La descripción debe tener al menos 10 caracteres'
        }
    } else if (campo === 'categoryId') {
        if (!datosForm.categoryId || Number(datosForm.categoryId) === 0) {
            errores.categoryId = 'Debes seleccionar una categoría'
        }
    } else if (campo === 'stock') {
        if (datosForm.stock === '' || datosForm.stock === null || datosForm.stock === undefined) {
            errores.stock = 'El stock es obligatorio'
        } else if (isNaN(datosForm.stock) || Number(datosForm.stock) < 0) {
            errores.stock = 'El stock no puede ser negativo'
        }
    } else if (campo === 'imageUrl') {
        // En creación se requiere URL o archivo; en edición ambos son opcionales
        const valor = (datosForm.imageUrl || '').trim()
        if (!esEdicion.value && valor === '' && !datosForm.archivo) {
            errores.imageUrl = 'Debes indicar una URL o subir un archivo de imagen'
        } else if (valor !== '') {
            try {
                const url = new URL(valor)
                if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                    errores.imageUrl = 'La URL debe iniciar con http o https'
                }
            } catch (e) {
                errores.imageUrl = 'Ingresa una URL válida'
            }
        }
    }
}

// Valida todos los campos antes de enviar el formulario
function validarTodo() {
    validarCampo('name')
    validarCampo('price')
    validarCampo('description')
    validarCampo('categoryId')
    validarCampo('stock')
    validarCampo('imageUrl')

    const campos = ['name', 'price', 'description', 'categoryId', 'stock', 'imageUrl', 'imagen']
    for (let i = 0; i < campos.length; i++) {
        if (errores[campos[i]] !== '') {
            return false
        }
    }
    return true
}

// Procesa la imagen elegida por el usuario verificando tipo y tamaño
function manejarArchivo(evento) {
    const archivo = evento.target.files[0]
    errores.imagen = ''
    if (!archivo) {
        datosForm.archivo = null
        return
    }

    if (archivo.size > 5 * 1024 * 1024) {
        errores.imagen = 'La imagen supera los 5 MB permitidos'
        evento.target.value = ''
        return
    }

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!tiposPermitidos.includes(archivo.type)) {
        errores.imagen = 'Solo se permiten imágenes JPG, PNG o GIF'
        evento.target.value = ''
        return
    }

    datosForm.archivo = archivo
    // Al subir archivo válido, ya no se necesita la URL
    errores.imageUrl = ''
}

// Carga los datos del producto existente cuando estamos en modo edición
async function cargarProductoExistente(id) {
    cargandoProducto.value = true
    try {
        const existente = await fetchProductById(id)
        datosForm.name = existente.name
        datosForm.price = existente.price
        datosForm.description = existente.description
        datosForm.categoryId = existente.categoryId || 0
        datosForm.stock = existente.stock || 0
        // Solo pre-llena imageUrl si es una URL externa que el usuario escribió;
        // las URLs generadas por el servidor no se copian al campo
        const urlExistente = existente.imageUrl || ''
        if (urlExistente.includes('/uploads/') || urlExistente.includes('/images/default')) {
            datosForm.imageUrl = ''
        } else {
            datosForm.imageUrl = urlExistente
        }
    } catch (err) {
        errorGeneral.value = 'No se pudo cargar el producto'
    } finally {
        cargandoProducto.value = false
    }
}

// Envía el formulario al API según sea creación o edición
async function manejarEnvio() {
    errorGeneral.value = null
    if (!validarTodo()) {
        errorGeneral.value = 'Corrige los errores antes de continuar'
        return
    }

    enviando.value = true
    try {
        const formData = new FormData()
        formData.append('name', datosForm.name.trim())
        formData.append('price', Number(datosForm.price))
        formData.append('description', datosForm.description.trim())
        formData.append('categoryId', Number(datosForm.categoryId))
        formData.append('stock', Number(datosForm.stock))
        // Envía la URL externa solo cuando el usuario la completó
        if (datosForm.imageUrl.trim()) {
            formData.append('imageUrl', datosForm.imageUrl.trim())
        }
        if (datosForm.archivo) {
            formData.append('imagen', datosForm.archivo)
        }

        if (esEdicion.value) {
            await updateProduct(route.params.id, formData)
            alert('Producto actualizado correctamente')
        } else {
            await createProduct(formData)
            alert('Producto creado correctamente')
        }
        router.push('/')
    } catch (err) {
        errorGeneral.value = err.message || 'Error al guardar el producto'
    } finally {
        enviando.value = false
    }
}

onMounted(async () => {
    await fetchCategories()
    if (esEdicion.value && route.params.id) {
        await cargarProductoExistente(route.params.id)
    }
})
</script>

<style scoped>
.pagina-form { padding: 2rem 0; }

.enlace-volver {
    display: inline-block;
    margin-bottom: 1.5rem;
    color: var(--color-gris);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: var(--transicion);
}
.enlace-volver:hover { color: var(--color-primario); }

.contenedor-form {
    max-width: 640px;
    margin: 0 auto;
    background-color: var(--color-tarjeta);
    padding: 2rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
}

.titulo-form {
    font-family: var(--fuente-titulo);
    color: var(--color-oscuro);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}

.formulario { display: flex; flex-direction: column; gap: 1.1rem; }

.campo { display: flex; flex-direction: column; gap: 0.35rem; }

.etiqueta-campo {
    font-weight: 600;
    color: var(--color-oscuro);
    font-size: 0.88rem;
}

.obligatorio { color: var(--color-peligro); }

.input-form,
.textarea-form,
.select-form {
    padding: 0.65rem 0.8rem;
    border: 1.5px solid var(--color-claro);
    border-radius: var(--radio-pequeno);
    font-size: 0.95rem;
    font-family: var(--fuente-cuerpo);
    transition: var(--transicion);
    background-color: var(--color-fondo);
}

.input-form:focus,
.textarea-form:focus,
.select-form:focus {
    outline: none;
    border-color: var(--color-primario);
    background-color: white;
    box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.08);
}

.input-error { border-color: var(--color-peligro); }

.texto-error { color: var(--color-peligro); font-size: 0.8rem; }

.texto-ayuda { color: var(--color-gris); font-size: 0.8rem; }

.estado-carga { text-align: center; padding: 2rem 0; }

.acciones-form { display: flex; gap: 0.75rem; margin-top: 1rem; }

.btn-grande { padding: 0.8rem 1.5rem; font-size: 0.95rem; flex: 1; }

@media (max-width: 768px) {
    .contenedor-form { padding: 1.25rem; }
    .acciones-form { flex-direction: column; }
}
</style>
