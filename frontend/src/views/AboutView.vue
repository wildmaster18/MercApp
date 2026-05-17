<template>
  <div class="pagina-about">
    <div class="container">
      <div class="contenido-about">
        <h1>Acerca de MercApp</h1>

        <section class="seccion-about">
          <h2>Que es MercApp?</h2>
          <p>
            MercApp es una aplicacion web de catalogo de productos desarrollada
            como proyecto de la materia Aplicaciones Web de la Universidad
            Politecnica Salesiana. Combina un backend Express con MongoDB y un
            frontend SPA hecho en Vue 3 con la Composition API.
          </p>
        </section>

        <section class="seccion-about">
          <h2>Tecnologias utilizadas</h2>
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
                <li>Multer (carga de imagenes)</li>
                <li>Socket.io (chat)</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="seccion-about">
          <h2>Caracteristicas principales</h2>
          <ul class="lista-caracteristicas">
            <li>Catalogo completo de productos</li>
            <li>Busqueda en tiempo real</li>
            <li>Filtrado por categorias</li>
            <li>Vista detallada de cada producto</li>
            <li>Formulario de creacion y edicion con validacion</li>
            <li>Lazy loading de rutas y Suspense</li>
            <li>Composables reutilizables</li>
          </ul>
        </section>

        <section class="seccion-about">
          <h2>Informacion academica</h2>
          <p>
            <strong>Estudiante:</strong> Mateo Carranza<br />
            <strong>Materia:</strong> Aplicaciones Web<br />
            <strong>Unidad:</strong> 3 - Programacion del lado del cliente<br />
            <strong>Universidad:</strong> Universidad Politecnica Salesiana
          </p>
        </section>

        <div class="cta">
          <router-link to="/" class="btn btn-primario btn-grande"
            >Explorar productos</router-link
          >
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
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--color-tarjeta);
  padding: 2.5rem;
  border-radius: var(--radio-borde);
  box-shadow: var(--sombra-base);
}

.contenido-about h1 {
  font-family: var(--fuente-titulo);
  color: var(--color-oscuro);
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
}

.seccion-about {
  margin-bottom: 2rem;
}

.seccion-about h2 {
  color: var(--color-primario);
  font-size: 1.15rem;
  margin-bottom: 0.6rem;
  font-weight: 600;
}

.seccion-about p {
  color: #475569;
  line-height: 1.7;
}

.grid-tec {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 0.75rem;
}

.tarjeta-tec {
  background-color: var(--color-fondo);
  padding: 1.25rem;
  border-radius: var(--radio-pequeno);
}
.tarjeta-tec h3 {
  color: var(--color-oscuro);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
.tarjeta-tec ul {
  list-style: none;
}
.tarjeta-tec li {
  padding: 0.3rem 0;
  color: #475569;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--color-claro);
}
.tarjeta-tec li:last-child {
  border-bottom: none;
}

.lista-caracteristicas {
  list-style: none;
  padding: 0;
}
.lista-caracteristicas li {
  padding: 0.4rem 0 0.4rem 1.2rem;
  color: #475569;
  font-size: 0.9rem;
  position: relative;
}
.lista-caracteristicas li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-primario);
}

.cta {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-claro);
}
.btn-grande {
  padding: 0.8rem 2rem;
  font-size: 0.95rem;
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
