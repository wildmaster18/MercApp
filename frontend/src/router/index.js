import { createRouter, createWebHistory } from 'vue-router'

// Home se carga de forma normal porque es la vista principal
import Home from '@/views/Home.vue'
import ProductoDetalle from '@/views/ProductoDetalle.vue'
import ProductoForm from '@/views/ProductoForm.vue'

// Vistas con lazy loading para reducir el tamaño inicial del bundle
const CarritoView = () => import('@/views/CarritoView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const rutas = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: { titulo: 'Inicio - MercApp' }
    },
    {
        path: '/product/new',
        name: 'product-new',
        component: ProductoForm,
        meta: { titulo: 'Nuevo producto - MercApp' }
    },
    {
        path: '/product/:id/edit',
        name: 'product-edit',
        component: ProductoForm,
        meta: { titulo: 'Editar producto - MercApp' }
    },
    {
        path: '/product/:id',
        name: 'product-detail',
        component: ProductoDetalle,
        meta: { titulo: 'Detalle del producto - MercApp' }
    },
    {
        path: '/cart',
        name: 'cart',
        component: CarritoView,
        meta: { titulo: 'Carrito - MercApp' }
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView,
        meta: { titulo: 'Acerca de - MercApp' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView,
        meta: { titulo: '404 - MercApp' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: rutas,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0 }
    }
})

// Actualiza el título de la página al cambiar de ruta
router.beforeEach((to, from, next) => {
    document.title = to.meta.titulo || 'MercApp'
    next()
})

export default router
