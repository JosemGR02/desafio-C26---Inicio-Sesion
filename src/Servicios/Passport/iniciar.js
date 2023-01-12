
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
            if (!email || !contraseña) return respuesta.send({ success: false })

            DaoUsuario.obtenerUno({ email }, (error, usuario) => {
                if (error) return done(null, false)

                if (!usuario) {
                    console.log({ error: ERRORES_UTILS.MESSAGES.ERROR_USUARIO_O_CONTRA });
                    return done(null, false)
                }
                if (!BCRYPT_VALIDADOR.validarContraseña(usuario, contraseña)) {
                    console.log({ error: ERRORES_UTILS.MESSAGES.ERROR_USUARIO_O_CONTRA });
                    return done(null, false)
                }

                const respuestaUsuario = {
                    id: usuario._id,
                    email: usuario.email
                }
                return done(null, respuestaUsuario)
            })
        } catch (error) {
            console.log(`${error}, Error en Passport - inicio Sesion`);
        }
    }))

    // Estrategia Registrarse
    passport.use("signup", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'contraseña',
        passReqToCallback: true,
    }, async (solicitud, email, contraseña, done) => {
        try {
            if (!email || !contraseña) return respuesta.send({ success: false })
            console.log(email, contraseña);

            const usuarioYaExiste = await DaoUsuario.obtenerUno({ email })

            if (usuarioYaExiste && usuarioYaExiste.contraseña) {
                return respuesta.send({ success: false, error: 'Error, el usuario ya esta registrado' })
            }
            if (usuarioYaExiste && !usuarioYaExiste.contraseña) {
                const usuarioActualizado = await DaoUsuario.actualizar(usuarioYaExiste._id, { ...usuarioYaExiste, contraseña })
                console.log(`Usuario ${usuarioActualizado} ha sido actualizado correctamente`);
                return respuesta.send({ success: true, usuarioActualizado })
            }

            const nuevoUsuario = {
                id: usuario._id,
                email: solicitud.body.email,
                contraseña: BCRYPT_VALIDADOR.crearContraHash(contraseña)
            }
            console.log(nuevoUsuario);
            DaoUsuario.guardar(nuevoUsuario, (error, nuevoUsuario) => {
                if (error) {
                    console.log(`${error}, Error al guardar el usuario`);
                    return done(null, false)
                }

                console.log(`Usuario ${nuevoUsuario} registrado correctamente`);
                return done(null, true)
            })
        } catch (error) {
            console.log(`${error}, Error en Passport - Registro`);
        }
    }))
}

export const PassportAutenticacion = {
    iniciar,
}

