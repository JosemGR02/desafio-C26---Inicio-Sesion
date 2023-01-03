
import passport from "passport";
import { Router } from "express";
import { estaAutenticado } from "../../Middlewares/index.js";

const ruta = Router();


// Inicio/Home
ruta.get("/", estaAutenticado, (solicitud, respuesta) => {
    respuesta.render("login");
});

// Inicio Sesion
ruta.get("/login", estaAutenticado, (solicitud, respuesta) => {
    respuesta.render("login");
});

ruta.post("/login", passport.authenticate("inicioSesion", { failureRedirect: "/errorlogin" }),
    (solicitud, respuesta) => {
        respuesta.render("/");
    }
);

// Registrarse
ruta.get("/register", (solicitud, respuesta) => {
    respuesta.render("register");
});

ruta.post("/register", passport.authenticate("registrarse", { failureRedirect: "/erroregister" }),
    (solicitud, respuesta) => {
        respuesta.render("/");
    }
);

// Cerrar Sesion
ruta.post("/logout", (solicitud, respuesta) => {
    const { email } = solicitud.usuario;
    solicitud.logout();
    respuesta.render("logout", { email });
});

// Rutas Errores
ruta.get("/errorlogin", (solicitud, respuesta) => {
    respuesta.render("error-login", {});
});

ruta.get("/erroregister", (solicitud, respuesta) => {
    respuesta.render("error-register", {});
});


export { ruta as RutAutenticacion };

