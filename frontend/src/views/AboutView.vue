<template>
    <div class="pagina-about">
        <div class="container">
            <div class="contenido-about">
                <h1>Acerca de MercApp</h1>

                <section class="seccion-about">
                    <h2>¿Qué es MercApp?</h2>
                    <p>
                        MercApp es una aplicación web de catálogo de productos desarrollada como proyecto de la
                        materia Aplicaciones Web de la Universidad Politécnica Salesiana. Combina un backend Express
                        con MongoDB y un frontend SPA hecho en Vue 3 con la Composition API.
                    </p>
                </section>

                <section class="seccion-about">
                    <h2>Tecnologías utilizadas</h2>
                    <div class="grid-tec">
                        <div class="tarjeta-tec">
                            <h3>Frontend</h3>
                            <ul>
                                <li>Vue 3 (Composition API)</li>
                                <li>Vue Router</li>
                                <li>Vite</li>
                                <li>JavaScript ES6</li>
                            </ul>
                        </div>
                        <div class="tarjeta-tec">
                            <h3>Backend</h3>
                            <ul>
                                <li>Node.js + Express</li>
                                <li>MongoDB + Mongoose</li>
                                <li>Multer (carga de imágenes)</li>
                                <li>Socket.io (chat)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section class="seccion-about">
                    <h2>Características principales</h2>
                    <ul class="lista-caracteristicas">
                        <li>Catálogo completo de productos</li>
                        <li>Búsqueda en tiempo real</li>
                        <li>Filtrado por categorías</li>
                        <li>Vista detallada de cada producto</li>
                        <li>Formulario de creación y edición con validación</li>
                        <li>Lazy loading de rutas y Suspense</li>
                        <li>Composables reutilizables</li>
                    </ul>
                </section>

                <section class="seccion-about">
                    <h2>Información académica</h2>
                    <p>
                        <strong>Estudiante:</strong> Mateo Carrera<br />
                        <strong>Materia:</strong> Aplicaciones Web<br />
                        <strong>Unidad:</strong> 3 - Programación del lado del cliente<br />
                        <strong>Universidad:</strong> Universidad Politécnica Salesiana
                    </p>
                </section>

                <div class="cta">
                    <router-link to="/" class="btn btn-primario btn-grande">Explorar productos</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Vista informativa estática
</script>

<style scoped>
.pagina-about {
    padding: 2rem 0;
}

.contenido-about {
    max-width: 900px;
    margin: 0 auto;
    background-color: white;
    padding: 2.5rem;
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra-base);
}

.contenido-about h1 {
    color: var(--color-oscuro);
    margin-bottom: 1.5rem;
    text-align: center;
}

.seccion-about {
    margin-bottom: 2rem;
}

.seccion-about h2 {
    color: var(--color-primario);
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
}

.seccion-about p {
    color: #555;
    line-height: 1.7;
    margin-bottom: 0.75rem;
}

.grid-tec {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 1rem;
}

.tarjeta-tec {
    background-color: var(--color-claro);
    padding: 1.25rem;
    border-radius: var(--radio-borde);
}

.tarjeta-tec h3 {
    color: var(--color-oscuro);
    margin-bottom: 0.5rem;
}

.tarjeta-tec ul {
    list-style: none;
}

.tarjeta-tec li {
    padding: 0.35rem 0;
    color: #555;
    border-bottom: 1px solid #ddd;
}

.tarjeta-tec li:last-child {
    border-bottom: none;
}

.lista-caracteristicas {
    list-style: disc;
    padding-left: 1.5rem;
    color: #555;
}

.lista-caracteristicas li {
    padding: 0.25rem 0;
}

.cta {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 2px solid var(--color-claro);
}

.btn-grande {
    padding: 0.9rem 2rem;
    font-size: 1rem;
    font-weight: 600;
}

@media (max-width: 768px) {
    .contenido-about {
        padding: 1.5rem;
    }
    .grid-tec {
        grid-template-columns: 1fr;
    }
}
</style>
