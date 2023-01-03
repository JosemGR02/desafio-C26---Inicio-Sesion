
import { ContenedorFirebase } from "../../Contenedores/index.js";
import { config } from "../../Configuracion/config.js";


export class UsuariosFirebase extends ContenedorFirebase {
    constructor() {
        super(config.DATABASES.firebase);
    }
}