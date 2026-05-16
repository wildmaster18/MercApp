// Script de semilla. Crea 4 categorías y 10 productos de ejemplo.
require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const Categoria = require('./models/Categoria');

const categoriasIniciales = [
    { idCat: 1, nombre: 'Electrónica' },
    { idCat: 2, nombre: 'Hogar' },
    { idCat: 3, nombre: 'Deportes' },
    { idCat: 4, nombre: 'Ropa' }
];

const productosIniciales = [
    {
        nombre: 'Laptop HP Pavilion 15',
        precio: 899.99,
        descripcion: 'Laptop con procesador Intel Core i5, 8 GB de RAM y disco SSD de 512 GB. Ideal para estudiantes y trabajo de oficina.',
        imagen: '',
        stock: 12,
        categoryId: 1
    },
    {
        nombre: 'Smartphone Samsung Galaxy A54',
        precio: 449.0,
        descripcion: 'Teléfono inteligente con pantalla AMOLED de 6.4 pulgadas, cámara triple de 50 MP y batería de 5000 mAh.',
        imagen: '',
        stock: 25,
        categoryId: 1
    },
    {
        nombre: 'Audífonos Sony WH-CH520',
        precio: 59.99,
        descripcion: 'Audífonos inalámbricos Bluetooth con cancelación de ruido pasiva y hasta 50 horas de batería.',
        imagen: '',
        stock: 40,
        categoryId: 1
    },
    {
        nombre: 'Cafetera Oster 12 tazas',
        precio: 75.5,
        descripcion: 'Cafetera programable de 12 tazas con jarra de vidrio y filtro permanente lavable.',
        imagen: '',
        stock: 18,
        categoryId: 2
    },
    {
        nombre: 'Juego de sábanas king size',
        precio: 39.9,
        descripcion: 'Juego de sábanas de microfibra para cama king size, incluye 2 fundas de almohada y sábana ajustable.',
        imagen: '',
        stock: 30,
        categoryId: 2
    },
    {
        nombre: 'Balón de fútbol Adidas',
        precio: 29.99,
        descripcion: 'Balón profesional Adidas tamaño 5, cosido a mano, ideal para partidos en cancha sintética o de césped natural.',
        imagen: '',
        stock: 50,
        categoryId: 3
    },
    {
        nombre: 'Bicicleta MTB Aro 27.5',
        precio: 379.0,
        descripcion: 'Bicicleta de montaña con marco de aluminio, 21 cambios Shimano y suspensión delantera.',
        imagen: '',
        stock: 8,
        categoryId: 3
    },
    {
        nombre: 'Chompa deportiva Nike',
        precio: 65.0,
        descripcion: 'Chompa deportiva con capucha, fabricada en algodón con poliéster reciclado, disponible en varias tallas.',
        imagen: '',
        stock: 22,
        categoryId: 4
    },
    {
        nombre: 'Zapatos Adidas Runfalcon 3',
        precio: 85.0,
        descripcion: 'Zapatos para correr con suela ligera EVA y diseño transpirable, perfectos para entrenamientos diarios.',
        imagen: '',
        stock: 35,
        categoryId: 4
    },
    {
        nombre: 'Pantalón jeans clásico',
        precio: 42.5,
        descripcion: 'Pantalón jeans de corte recto, fabricado en mezclilla resistente, disponible en talla 28 a 38.',
        imagen: '',
        stock: 27,
        categoryId: 4
    }
];

async function ejecutarSemilla() {
    try {
        const urlBD = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mercapp';
        await mongoose.connect(urlBD);
        console.log('Conexión a MongoDB establecida');

        // Limpia las colecciones para evitar duplicados al volver a ejecutar
        await Categoria.deleteMany({});
        await Producto.deleteMany({});
        console.log('Colecciones limpias');

        await Categoria.insertMany(categoriasIniciales);
        console.log('Se insertaron ' + categoriasIniciales.length + ' categorías');

        await Producto.insertMany(productosIniciales);
        console.log('Se insertaron ' + productosIniciales.length + ' productos');

        await mongoose.disconnect();
        console.log('Semilla completada con éxito');
        process.exit(0);
    } catch (error) {
        console.error('Error al ejecutar la semilla:', error.message);
        process.exit(1);
    }
}

ejecutarSemilla();
