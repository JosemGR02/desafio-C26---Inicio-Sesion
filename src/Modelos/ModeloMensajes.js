
import { Schema } from "mongoose";

const ColeccionMensajes = "mensajes";

const EsquemaMensajes = new Schema(
    {
        id: { type: Schema.Types.ObjectId, required: true },
        texto: { type: String, required: true, max: 200 },
    }
);

EsquemaMensajes.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta.__v;
        delete respuesta._id;
        return respuesta;
    },
});


export const modeloMensajes = { EsquemaMensajes, ColeccionMensajes }
