
const estaAutenticado = (solicitud, respuesta, next) => {
    if (solicitud.isAuthenticated())
        return respuesta.render("home", { email: solicitud.usuario.email });
    next()
}

export default estaAutenticado;

