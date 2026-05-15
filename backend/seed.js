const { randomUUID } = require('crypto')
const fs = require('fs')
const path = require('path')

const RUTA_DB = path.join(__dirname, 'src/data/db.json')

// Define las 4 categorias con ID generado automaticamente
const categorias = [
    { id: randomUUID(), name: 'Electronica' },
    { id: randomUUID(), name: 'Ropa y Accesorios' },
    { id: randomUUID(), name: 'Hogar y Cocina' },
    { id: randomUUID(), name: 'Deportes' }
]

// Define 10 productos con referencias a las categorias creadas arriba
const productos = [
    {
        id: randomUUID(),
        name: 'Audifonos Bluetooth Pro',
        description: 'Audifonos inalambricos con cancelacion de ruido activa y 30 horas de bateria.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        categoryId: categorias[0].id,
        stock: 25
    },
    {
        id: randomUUID(),
        name: 'Smartwatch Serie X',
        description: 'Reloj inteligente con monitor de frecuencia cardiaca, GPS y pantalla AMOLED.',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        categoryId: categorias[0].id,
        stock: 15
    },
    {
        id: randomUUID(),
        name: 'Teclado Mecanico RGB',
        description: 'Teclado mecanico con switches Red, retroiluminacion RGB y construccion en aluminio.',
        price: 75.50,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
        categoryId: categorias[0].id,
        stock: 20
    },
    {
        id: randomUUID(),
        name: 'Camiseta Deportiva Dry-Fit',
        description: 'Camiseta de alto rendimiento con tecnologia de absorcion de humedad.',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        categoryId: categorias[1].id,
        stock: 50
    },
    {
        id: randomUUID(),
        name: 'Mochila Urbana 25L',
        description: 'Mochila con compartimento para laptop de 15 pulgadas, puerto USB y tela impermeable.',
        price: 45.00,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        categoryId: categorias[1].id,
        stock: 30
    },
    {
        id: randomUUID(),
        name: 'Zapatillas Running Air',
        description: 'Zapatillas ultralivianas para correr con amortiguacion de gel y suela antideslizante.',
        price: 95.00,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        categoryId: categorias[1].id,
        stock: 18
    },
    {
        id: randomUUID(),
        name: 'Licuadora de Alta Potencia',
        description: 'Licuadora de 1200W con 6 velocidades, vaso de vidrio de 2 litros y funcion pulso.',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400',
        categoryId: categorias[2].id,
        stock: 12
    },
    {
        id: randomUUID(),
        name: 'Set de Ollas Antiadherentes',
        description: 'Juego de 5 piezas con recubrimiento antiadherente libre de PFOA.',
        price: 89.00,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        categoryId: categorias[2].id,
        stock: 8
    },
    {
        id: randomUUID(),
        name: 'Pelota de Futbol Pro',
        description: 'Balon oficial talla 5 en cuero sintetico de alta durabilidad.',
        price: 35.00,
        imageUrl: 'https://images.unsplash.com/photo-1552056776-9b5657aca328?w=400',
        categoryId: categorias[3].id,
        stock: 40
    },
    {
        id: randomUUID(),
        name: 'Set de Mancuernas Ajustables',
        description: 'Par de mancuernas de 2 a 24 kg con sistema de ajuste rapido e incluye rack.',
        price: 120.00,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        categoryId: categorias[3].id,
        stock: 10
    }
]

// Verifica que la carpeta data exista antes de escribir
const carpetaData = path.dirname(RUTA_DB)
if (!fs.existsSync(carpetaData)) {
    fs.mkdirSync(carpetaData, { recursive: true })
}

// Guarda las categorias y productos en el archivo de base de datos
const db = { productos, categorias }
fs.writeFileSync(RUTA_DB, JSON.stringify(db, null, 2), 'utf8')
console.log(`Semilla completada: ${categorias.length} categorias y ${productos.length} productos insertados.`)
