// Servidor principal de MercApp
require('dotenv').config();
const express = require('express');
const http = require('http');
const { engine } = require('express-handlebars');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');

const conectarBD = require('./config/database');

// Importa los archivos de rutas del proyecto
const rutasAuth = require('./routes/authRoutes');
const rutasProductos = require('./routes/prodRoutes');
const rutasChat = require('./routes/chatRoutes');
const rutasApi = require('./routes/api');

// Crea la aplicación de Express y el servidor HTTP
const app = express();
const servidor = http.createServer(app);
const io = socketIo(servidor, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }
});

const puerto = process.env.PORT || 3000;

// Conexión a MongoDB
conectarBD();

// Habilita CORS para que el frontend Vue pueda consumir el API
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Configura el motor de plantillas Handlebars
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views/layouts'),
        partialsDir: path.join(__dirname, 'views/partials'),
        helpers: {
            // Compara dos valores y renderiza el bloque cuando son iguales
            siIgual: function (a, b, options) {
                return a == b ? options.fn(this) : options.inverse(this);
            }
        },
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Permite leer datos enviados desde formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sirve los archivos estáticos del backend
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Manejo de sesiones de usuario
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'claveSecretaMercApp2026',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    })
);

// Registra las rutas del proyecto
app.use('/auth', rutasAuth);
app.use('/productos', rutasProductos);
app.use('/chat', rutasChat);
app.use('/api', rutasApi);

// Ruta raíz: redirige según el estado de la sesión
app.get('/', (req, res) => {
    if (req.session && req.session.usuario) {
        res.redirect('/productos');
    } else {
        res.redirect('/auth/login');
    }
});

// Manejador para rutas API inexistentes
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Ruta de API no encontrada' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err.message);
    if (req.originalUrl.startsWith('/api')) {
        return res.status(500).json({ error: 'Error interno del servidor', message: err.message });
    }
    res.status(500).send('Error interno del servidor: ' + err.message);
});

// Configuración del chat con Socket.io
io.on('connection', (socket) => {
    console.log('Nueva conexión al chat:', socket.id);

    // Almacena el nombre del usuario en el socket al conectarse
    socket.on('usuarioConectado', (nomUsu) => {
        socket.nomUsu = nomUsu;
        io.emit('mensajeSistema', nomUsu + ' se ha unido al chat');
        console.log(nomUsu + ' entró al chat');
    });

    // Retransmite el mensaje a todos los usuarios conectados
    socket.on('chatMensaje', (mensaje) => {
        const datosMensaje = {
            nomUsu: socket.nomUsu || 'Anónimo',
            mensaje: mensaje,
            hora: new Date().toLocaleTimeString('es-EC', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        io.emit('chatMensaje', datosMensaje);
    });

    socket.on('disconnect', () => {
        if (socket.nomUsu) {
            io.emit('mensajeSistema', socket.nomUsu + ' ha salido del chat');
            console.log(socket.nomUsu + ' salió del chat');
        }
    });
});

servidor.listen(puerto, () => {
    console.log('Servidor corriendo en http://localhost:' + puerto);
    console.log('API REST disponible en http://localhost:' + puerto + '/api');
});
