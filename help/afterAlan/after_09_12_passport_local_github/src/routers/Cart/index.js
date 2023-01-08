import { Router } from "express";
import { DATE_UTILS, ERRORS_UTILS } from "../../utils/index.js";
import { CartDao, ProductDao } from "../../Dao/index.js";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const cart = await CartDao.getById(id);

  res.send({ success: true, cart });
});

router.post("/", async (req, res) => {
  const baseCart = { timestamp: DATE_UTILS.getTimestamp(), products: [] };

  const cart = await CartDao.save(baseCart);

  res.send({ success: true, cartId: cart.id });
});

// POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto

router.post("/:cartId/products", async (req, res) => {
  const { productId } = req.body;
  const { cartId } = req.params;

  const cart = await CartDao.getById(cartId);

  if (!cart)
    return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_CART });

  const product = await ProductDao.getById(productId);

  if (!product)
    return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_PRODUCT });

  // TODO
  cart.products.push(product);

  const updatedCart = await CartDao.updateById(cartId, cart);

  res.send({ success: true, cart: updatedCart });
});

export { router as CartRouter };
