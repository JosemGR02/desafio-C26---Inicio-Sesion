import { Router } from "express";
import passport from "passport";
import { UserDao } from "../../Dao/index.js";
import { JWT_UTILS } from "../../utils/index.js";

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
  const { user } = req;

  const token = JWT_UTILS.createToken(user, "secret");

  res.cookie("tokenCookie", token, { maxAge: 1000 * 60 * 60 });

  // res.send({ success: true, message: "Logueado!", user: req.user, token });

  // para react

  res.send({ success: true });

  // esto es para plantillas momentaneamete
  // res.redirect("/");
});

router.get("/github-login", passport.authenticate("github"));

router.get("/github", passport.authenticate("github"), (req, res) => {
  const { user } = req;

  const token = JWT_UTILS.createToken(user, "secret");

  res.cookie("tokenCookie", token, { maxAge: 1000 * 60 * 60 });

  // res.send({ user, token });
  res.redirect("/");
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("tokenCookie");
  res.send({ success: true });
});

export { router as AuthRouter };
