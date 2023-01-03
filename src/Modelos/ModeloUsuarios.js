
import { Schema } from "mongoose";

const ColeccionUsuarios = "usuarios";

const esquemaUsuario = new Schema({
    email: String,
    contraseña: String,
});

esquemaUsuario.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta.__v;
        delete respuesta._id;
        return respuesta;
    },
});

export const modeloUsuario = { esquemaUsuario, ColeccionUsuarios };


/*######################################################################################################################*/



// import mongoose from "mongoose";


// const esquemaUsuario = mongoose.Schema({
//     email: String,
//     contraseña: String,
// });


// export const modeloUsuario = mongoose.model("modeloUsuario", esquemaUsuario);
