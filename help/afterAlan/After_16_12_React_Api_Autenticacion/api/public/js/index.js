import { API_ROUTES } from "./routes.js";
import { utils } from "./utils.js";

// para usar import de modules acá en los static, tenemos que en el html, ponerle type="module" al script index.js

const renderProducts = async () => {
  const productsContainer = document.getElementById("productsContainer");

  const products = await API_ROUTES.getProducts();

  productsContainer.innerHTML = await utils.makeProductTable(products);
};

const getProductBtn = document.getElementById("getProductsBtn");

getProductBtn.addEventListener("click", renderProducts);

// por supuesto podriamos cargar los productos cuando entremos a la página, usando el objeto window y con un event listener de tipo "load"
window.addEventListener("load", renderProducts);
