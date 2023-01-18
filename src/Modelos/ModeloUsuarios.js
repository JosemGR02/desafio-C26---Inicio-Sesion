
import { Schema } from "mongoose";
// import mongoose from "mongoose";

const ColeccionUsuarios = "UsuariosM";

const esquemaUsuario = new Schema({
    // id: { type: String, required: true, max: 20 },
    email: { type: String, required: true, unique: true, max: 30 },
    contraseña: { type: String, required: true, max: 30 },
});

// esquemaUsuario._id = new mongoose.Types.ObjectId();

// const usuario.id = new mongoose.Types.ObjectId();



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
