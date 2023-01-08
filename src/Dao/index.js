
import { config } from "../Configuracion/config.js";
import { servicioMongoDB } from "../Servicios/index.js";
import { MensajesMongoBD, MensajesFilesystem, MensajesFirebase, MensajesMemoria, MensajesChat } from "./Mensajes/index.js";
import { CarritosMongoBD, CarritosFilesystem, CarritosFirebase, CarritosMemoria } from "./Carritos/index.js";
import { ProductosMongoBD, ProductosFileSystem, ProductosFirebase, ProductosMemoria } from "./Productos/index.js";
import { UsuariosMongoBD, UsuariosFileSystem, UsuariosFirebase, UsuariosMemoria } from "./Usuarios/index.js";


const obtenerDaoSeleccionados = () => {
  switch (config.SERVER.SELECCION_BASEdDATOS) {
    case "mongo": {
      servicioMongoDB.init();
      return {
        DaoProducto: new ProductosMongoBD(),
        DaoCarrito: new CarritosMongoBD(),
        DaoUsuario: new UsuariosMongoBD(),
        DaoMensaje: new MensajesMongoBD(),
        DaoChat: new MensajesChat(),
      };
    }
    case "filesystem": {
      return {
        DaoProducto: new ProductosFileSystem(),
        DaoCarrito: new CarritosFilesystem(),
        DaoUsuario: new UsuariosFileSystem(),
        DaoMensaje: new MensajesFilesystem(),
        DaoChat: new MensajesChat(),
      };
    }
    case "memory": {
      return {
        DaoProducto: new ProductosMemoria(),
        DaoCarrito: new CarritosMemoria(),
        DaoUsuario: new UsuariosMemoria(),
        DaoMensaje: new MensajesMemoria(),
        DaoChat: new MensajesChat(),
      };
    }
    case "firebase": {
      conectar()
      return {
        DaoProducto: new ProductosFirebase(),
        DaoCarrito: new CarritosFirebase(),
        DaoUsuario: new UsuariosFirebase(),
        DaoMensaje: new MensajesFirebase(),
        DaoChat: new MensajesChat(),
      };
    }
  }
};

const { DaoProducto, DaoCarrito, DaoMensaje, DaoChat, DaoUsuario } = obtenerDaoSeleccionados();

export { DaoProducto, DaoCarrito, DaoMensaje, DaoChat, DaoUsuario };



