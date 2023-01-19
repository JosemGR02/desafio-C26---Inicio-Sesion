
const estaAutenticado = (solicitud, respuesta, next) => {
    if (solicitud.isAuthenticated())
        return respuesta.render('view/home', { email: solicitud.respuestaUsuario });
    next();
}

export { estaAutenticado };






// solicitud.usuario.email
// lo unico que cambia es user