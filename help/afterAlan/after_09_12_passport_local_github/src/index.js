import express from "express";
import { config } from "./config/index.js";
import { ProductRouter, CartRouter, AuthRouter } from "./routers/index.js";
import cors from "cors";

import { PassportAuth } from "./middlewares/index.js";
import session from "express-session";
import passport from "passport";

const app = express();

PassportAuth.init();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// esto es para poder habilitar cors para un cliente externo, ejemplo cuando levantamos la app de react
// bien podriamos convertirlo a un middleware en su archivo correspondiente y tener las propiedades que deseemos
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);

const server = app.listen(config.SERVER.PORT, () =>
  console.log(`Server running on port ${server.address().port}`)
);
