
import bCrypt from "bcrypt";
import { modeloUsuario } from "../Modelos/index.js";


const validarContraseña = (usuario, contraseña) => {
    return bCrypt.compareSync(contraseña, usuario.contraseña);
};
const crearHash = function (contraseña) {
    return bCrypt.hashSync(contraseña, bCrypt.genSaltSync(10), null);
};

const inicioSesion = (solicitud, email, contraseña, done) => {
    modeloUsuario.obtenerUno({ email: email }, (error, usuario) => {
        if (error) return done(error);
        if (!usuario) {
            console.log("No se encontro el usuario con el email " + email);
            return done(null, false);
        }
        if (!validarContraseña(usuario, contraseña)) {
            console.log("contraseña invalida");
            return done(null, false);
        }
        return done(null, usuario);
    });
}

const registrarse = (solicitud, email, contraseña, done) => {
    // const findOrCreateUser = function () {
    modeloUsuario.obtenerUno({ email: email }, function (error, usuario) {
        if (error) {
            console.log("Error al intentar Registrarse: " + error);
            return done(error);
        }
        if (usuario) {
            console.log("El usuario ya existe");
            return done(null, false);
        } else {
            const nuevoUsuario = new User();
            nuevoUsuario.email = email;
            nuevoUsuario.contraseña = crearHash(contraseña);
            nuevoUsuario.save().then(datos => done(null, datos)).catch(null, false)
        }
    });
    // };
    // process.nextTick(findOrCreateUser);
}

export { inicioSesion, registrarse };



/*######################################################################################################################*/

// Estrategias
passport.use("inicioSesion", new LocalStrategy({ passReqToCallback: true }, strategy.inicioSesion));

passport.use("registrarse", new LocalStrategy({ passReqToCallback: true }, strategy.registrarse));

/*######################################################################################################################*/