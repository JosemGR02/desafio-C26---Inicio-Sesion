
import { Schema } from "mongoose";

const ColeccionUsuarios = "usuarios";

const esquemaUsuario = new Schema({
    id: { type: Schema.Types.ObjectId, required: true },
    email: { type: String, required: true, max: 30 },
    contraseña: { type: String, required: true, max: 30 },
});

// const usuario.id = new mongoose.Types.ObjectId();

// id: { type: String, required: true, max: 10 },

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
