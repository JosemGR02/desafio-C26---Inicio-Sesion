
import passport from "passport";
import { Router } from "express";
import { estaAutenticado } from "../../Middlewares/index.js";

const ruta = Router();


// Inicio/Home
ruta.get("/", estaAutenticado, (solicitud, respuesta) => {
    respuesta.render("view/login");
});

// Inicio Sesion
ruta.get("/login", estaAutenticado, (solicitud, respuesta) => {
    respuesta.render("view/login");
});

ruta.post("/login", passport.authenticate("login", { failureRedirect: "/api/autenticacion/error-login" }),
    (solicitud, respuesta) => {
        respuesta.redirect("/");
    }
);

// Registrarse
ruta.get("/signup", (solicitud, respuesta) => {
    respuesta.render("view/home", { email: solicitud.respuestaUsuario });
});

ruta.post("/signup", passport.authenticate("signup", { failureRedirect: "/api/autenticacion/error-signup" }),
    (solicitud, respuesta) => {
        respuesta.redirect("/");
    }
);

// Cerrar Sesion
ruta.get("/logout", (solicitud, respuesta) => {
    solicitud.logout();
    respuesta.render("view/logout", { email: solicitud.respuestaUsuario });
});

// Deserializar
// const usuario = await DaoUsuario.obtenerXid(id);

// Rutas Errores
ruta.get("/error-login", (solicitud, respuesta) => {
    console.log("Error en login")
    respuesta.render("view/error-login", {});
});

ruta.get("/error-signup", (solicitud, respuesta) => {
    console.log("Error en signup")
    respuesta.render("view/error-signup", {});
});


export { ruta as RutAutenticacion };

