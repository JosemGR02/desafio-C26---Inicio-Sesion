import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { BCRYPT_VALIDADOR, ERRORES_UTILS } from '../../Utilidades/index.js';
import { DaoUsuario } from "../../Dao/index.js";


const iniciar = () => {

    // Serializar 
    passport.serializeUser((usuario, done) => {
        done(null, usuario._id);
    });

    // Deserializar
    passport.deserializeUser(async (id, done) => {
        const usuario = await DaoUsuario.obtenerXid(id);
        done(null, usuario);
    });

    // Estrategias Locales

    // Estrategia Inicio sesion
    passport.use("login", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'contraseña',
        passReqToCallback: true,
    }, async (solicitud, email, contraseña, done) => {
        try {
            const usuario = await DaoUsuario.obtenerUno({ 'email': email });
            if (!usuario) {
                console.log(`El usuario ingresado no existe, su email es: ${email}`);
                return done(null, false, { mensaje: 'Usuario no encontrado' });
            }
            if (!BCRYPT_VALIDADOR.validarContraseña(usuario, contraseña)) {
                console.log({ error: ERRORES_UTILS.MESSAGES.ERROR_USUARIO_O_CONTRA });
                return done(null, false)
            }

            return done(null, usuario);
        } catch (error) {
            console.log(`${error}, Error en Passport - inicio Sesion`);
        }
    }))

    // Estrategia Registrarse
    passport.use("signup", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'contraseña',
        passReqToCallback: true,
    }, async (solicitud, usuario, contraseña, done) => {
        try {
            const usuarioYaExiste = await DaoUsuario.obtenerUno({ 'email': usuario });
            if (usuarioYaExiste) {
                console.log('User already exists with username: ' + usuario);
                return done(null, false);
            } else {
                const nuevoUsuario = {
                    email: usuario,
                    contraseña: BCRYPT_VALIDADOR.crearContraHash(contraseña)
                }
                const crearUsuario = await DaoUsuario.guardar(nuevoUsuario)
                console.log(`Usuario ${crearUsuario} registrado correctamente`);
                return done(null, crearUsuario);
            }
        } catch (error) {
            console.log(`${error}, Error en Passport - Registro`);
        }
    }))
}

export const PassportAutenticacion = {
    iniciar,
}