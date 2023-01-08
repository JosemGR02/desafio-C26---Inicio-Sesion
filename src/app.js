
import express from 'express';
import mongoose from "mongoose";
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import __dirname from "./dirname.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { config } from './Configuracion/config.js';
import { RutaCarrito, RutaProductosTest, RutaProducto } from "./Rutas/index.js";
import { RutaMensajes, RutAutenticacion } from "./Rutas/index.js";
import { DaoMensaje, DaoProducto } from "./Dao/index.js";
import { Server as ServidorHttp } from "http";
import { Server as ServidorIO } from "socket.io";
import { errorMiddleware } from './Middlewares/index.js';
import { PassportAutenticacion } from './Middlewares/index.js';



const app = express();

// Passport
PassportAutenticacion.iniciar()
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());


const mongOptiones = { useNewUrlParser: true, useUnifiedTopology: true }

// Sesion Mongo
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.BASEDATOS_MONGO_URL,
            dbName: process.env.BASEDATOS_MONGO_NOMBRE,
            mongOptiones,
            ttl: 600,
            collectionName: 'sesionesMC',
            autoRemove: 'native'
        }),
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        rolling: false,
        cookie: {
            maxAge: 600000,
        },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('/public'))


// Middleware del error
app.use(errorMiddleware);

// Motor de plantilla
app.engine("hbs", handlebars.engine({ extname: ".hbs", defaultLayout: "main.hbs" }));

app.set('view engine', 'hbs')
app.set('views', __dirname + "/view");


// dayjs
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat)


// Rutas
app.use('/api/autenticacion', RutAutenticacion);
app.use('/api/mensajes', RutaMensajes);
app.use('/api/productos', RutaProducto);
app.use('/api/carrito', RutaCarrito);
app.use('/api/productos-test', RutaProductosTest);


// IO
const servidorHttp = new ServidorHttp(app);
const io = new ServidorIO(servidorHttp);


// Servidor
servidorHttp.listen(config.SERVER.PORT, async () => {
    console.log(`Servidor escuchando en el puerto: ${config.SERVER.PORT}`);// servidorHttp.address().port 
    try {
        await mongoose.connect(process.env.BASEDATOS_MONGO_URL, mongOptiones);
        console.log("Conectado a Base de Datos Mongo");
    } catch (error) {
        console.log(`Error en conexión de Base de datos: ${error}`);
    }
})
servidorHttp.on("error", (error) => console.log(`Error en servidor ${error}`));


// EVENTOS

// Conexion socket 

io.on('connection', socket => {
    console.log(`usuario conectado ${socket.id}`);
    enviarTodosProds()
    enviarPorcentajeCompresion()
    enviarTodosMsjs()

    socket.on('nuevo producto', nuevoProd => {
        nuevoProducto(socket, io, nuevoProd)
    })

    socket.on('nuevo mensaje', nuevoMsg => {
        nuevoMensaje(socket, io, nuevoMsg)
    })
})


// enviar todos (msj y prods)

const enviarTodosProds = async (socket) => {
    const todosProds = await DaoProducto.obtenerTodos()
    io.sockets.emit('todos los productos', todosProds)
}

const enviarTodosMsjs = async (socket) => {
    const todosMsjs = await DaoMensaje.obtenerTodos()
    io.sockets.emit('todos los mensajes', todosMsjs)
}


// nuevo mensaje

const nuevoMensaje = async (socket, io, nuevoMsj) => {
    const fecha = new Date()
    const fechaFormateada = dayjs(fecha).format('DD/MM/YYYY hh:mm:ss')
    console.log("fecha formateada", fechaFormateada)
    await DaoMensaje.guardar({ msj: nuevoMsj, createDate: `${fechaFormateada} hs` })

    const todosMsjs = await DaoMensaje.obtenerTodos()
    io.sockets.emit('todos los mensajes', todosMsjs)
}

// nuevo producto

const nuevoProducto = async (socket, io, nuevoProd) => {
    await DaoProducto.guardar(nuevoProd)
    const todosProds = await DaoProducto.obtenerTodos()
    io.sockets.emit('todos los productos', todosProds)
}








