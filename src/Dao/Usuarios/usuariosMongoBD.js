
import { ContenedorMongoBD } from "../../Contenedores/index.js";
import { modeloUsuario } from "../../Modelos/index.js";

export class UsuariosMongo extends ContenedorMongoBD {
    constructor() {
        super({
            nombre: modeloUsuario.ColeccionUsuarios,
            schema: modeloUsuario.UsuarioEsquema,
        });
    }
}

