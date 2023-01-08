import { Router } from "express";
import passport from "passport";
import { UserDao } from "../../Dao/index.js";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;
    if (!name || !lastname || !email || !password)
      return res.send({ success: false });
    // verificar si existe o no (CLAVE PARA PASSPORT CON RRSS)

    const existUser = await UserDao.getOne({ email });

    if (existUser && existUser.password) {
      return res.send({ success: false, error: "el usuario ya existe" });
    }

    if (existUser && !existUser.password) {
      const updateUser = await UserDao.updateById(existUser._id, {
        ...existUser,
        password,
      });
      return res.send({ success: true });
    }

    // PASSWORD! podriamos usar bcrypt!
    // POR AHORA SIN CARRITO
    await UserDao.save({ name, lastname, email, password });

    res.send({ success: true });
  } catch (error) {
    console.log(error);

    res.send({ success: false });
  }
});

router.post("/", passport.authenticate("login"), async (req, res) => {
  res.send({ success: true, message: "Logueado!", user: req.user });
});

router.get("/github-login", passport.authenticate("github"), (req, res) => {
  res.send("hoola");
});

router.get("/github", passport.authenticate("github"), (req, res) => {
  res.send(req.user);
});

export { router as AuthRouter };


