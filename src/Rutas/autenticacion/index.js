
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
        res.redirect("/");
    }
);

// Registrarse
ruta.get("/signup", (solicitud, respuesta) => {
    respuesta.render("register");
});

ruta.post("/signup", passport.authenticate("registrarse", { failureRedirect: "/erroregister" }),
    (solicitud, respuesta) => {
        res.redirect("/");
    }
);

// Cerrar Sesion
ruta.get("/logout", (solicitud, respuesta) => {
    const { email } = solicitud.usuario;
    solicitud.logout();
    respuesta.render("logout", { email });
});

// Rutas Errores
ruta.get("/error-login", (solicitud, respuesta) => {
    console.log("Error en login")
    respuesta.render("error-login", {});
});

ruta.get("/error-signup", (solicitud, respuesta) => {
    console.log("Error en signup")
    respuesta.render("error-signup", {});
});


export { ruta as RutAutenticacion };

