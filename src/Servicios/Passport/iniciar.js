
import passport from "passport";
import mongoose from "mongoose";
import { Strategy as LocalStrategy } from "passport-local";
import { BCRYPT_VALIDADOR, ERRORES_UTILS } from '../../Utilidades/index.js';
import { DaoUsuario } from "../../Dao/index.js";


const iniciar = () => {

    // Serializar 
    passport.serializeUser((respuestaUsuario, done) => {
        done(null, respuestaUsuario.id);
    });

    // Deserializar
    passport.deserializeUser(async (id, done) => {
        const respuestaUsuario = await DaoUsuario.obtenerXid(id);
        done(null, respuestaUsuario);
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
            console.log(`usuario: ${email}, contraseña: ${contraseña}`)

            const usuarioYaExiste = await DaoUsuario.obtenerUno({ 'email': email }, (error, usuario) => {
                if (error) return console.log("Error al buscar el usuario");

                if (!usuario) {
                    console.log({ error: ERRORES_UTILS.MESSAGES.ERROR_USUARIO_O_CONTRA });
                    return done(null, false, { mensaje: 'Usuario no encontrado' })
                }

                if (!BCRYPT_VALIDADOR.validarContraseña(usuario, contraseña)) {
                    console.log({ error: ERRORES_UTILS.MESSAGES.ERROR_USUARIO_O_CONTRA });
                    return done(null, false)
                }

                if (usuario) return console.log(`Usuario encontrado: ${usuario}`);
            })

            if (usuarioYaExiste) {
                const respuestaUsuario = {
                    id: usuarioYaExiste._id,
                    email: usuarioYaExiste.email
                }
                return done(null, respuestaUsuario)
            }
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
            console.log(`usuario: ${email}, contraseña: ${contraseña}`)

            const usuarioYaExiste = await DaoUsuario.obtenerUno({ email: 'email' }, (error, usuario) => {
                if (!usuario) return console.log("usuario disponible para registrar");
                if (usuario) return console.log(`El usuario ya existe: ${usuario}`);
                if (error) return console.log("Error al buscar un usuario");
            })

            if (usuarioYaExiste && usuarioYaExiste.contraseña) {
                return respuesta.send({ success: false, error: 'Error, el usuario ya esta registrado' })
            }
            if (usuarioYaExiste && !usuarioYaExiste.contraseña) {
                const usuarioActualizado = await DaoUsuario.actualizar(usuarioYaExiste._id, { ...usuarioYaExiste, contraseña })
                console.log(`Usuario ${usuarioActualizado} ha sido actualizado correctamente`);
                return respuesta.send({ success: true, usuarioActualizado })
            }

            let idUsuario = mongoose.Types.ObjectId();
            console.log(idUsuario)

            const nuevoUsuario = {
                id: idUsuario,
                email: solicitud.body.email,
                contraseña: BCRYPT_VALIDADOR.crearContraHash(contraseña)
            }
            console.log(nuevoUsuario)

            const crearUsuario = await DaoUsuario.guardar(nuevoUsuario, (error, nuevoUsuario) => {
                if (error) {
                    console.log(` ${error}, Error al guardar el usuario`);
                    return done(null, false)
                }

                const UsuarioCreado = {
                    id: crearUsuario._id,
                    email: crearUsuario.email,
                }

                console.log(`Usuario ${UsuarioCreado.email} registrado correctamente`);
                return done(null, UsuarioCreado)
            })
        } catch (error) {
            console.log(`${error}, Error en Passport - Registro`);
        }
    }))
}

export const PassportAutenticacion = {
    iniciar,
}




