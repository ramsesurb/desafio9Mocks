import { Router } from "express";
import { productsService } from "../Repository/index.js";
import { CustomError } from "../services/customError.service.js";
import { Errors } from "../enums/Errors.js";
import { generateProductErrorInfo } from "../services/ErrorInfo.js";
import { generateProductErrorParam } from "../services/ErrorParam.js";
import { generateProductNfErrorParam } from "../services/ErrorParam.js";

const adminAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "admin") {
    next();
  } else {
    res.json("no esta autorizado para acceder a esta URL"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }
};

const userAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "user") {
    next();
  } else {
    res.redirect("/"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }
};

const routerProd = Router();

//getAll productos
routerProd.get("/", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const prodsRaw = await productsService.getProducts(limit);
  const prods = prodsRaw.map((item) => item.toObject());
  res.send(prods);
});
//get by id
routerProd.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const pid = parseInt(id);

  try {
    const prodById = await productsService.getByid(pid);
    console.log(id);

    if (Number.isNaN(pid)) {
      res.json({
        status: "error",
        message: `User id no es valido, debe ser un numero entero, pero se recibio: ${id}`,
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateProductErrorParam(id),
        message: "Error obteniendo el producto por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    if (!prodById) {
      res.json({
        status: "error",
        message: `no se encontro un producto con el id : ${id}`,
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateProductNfErrorParam(id),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    res.send(prodById);
  } catch (error) {}
});

//save new product
routerProd.post("/",adminAccess, async (req, res, next) => {
  const prod = req.body;
  try {
    const saveProd = await productsService.addProduct(prod);
    if (!prod) {
      CustomError.createError({
        name: "product create error",
        cause: generateProductErrorInfo(),
        message: "Error creando el producto",
        errorCode: Errors.INVALID_JSON,
      });
    }
    res.send(saveProd);
  } catch (error) {
    res.json({
      status: "error",
      message: `Faltan datos para agregar producto`,
    });
  }
});
//delete by id
routerProd.delete("/:id",adminAccess, async (req, res) => {
  const { id } = req.params;
  const pid = parseInt(id);

  try {
    const prodById = await productsService.getByid(id);
    const deleteProd = await productsService.deleteById(pid);
    if (Number.isNaN(pid)) {
      res.json({
        status: "error",
        message: `User id no es valido, debe ser un numero entero, pero se recibio: ${id}`,
      });
      CustomError.createError({
        name: "product delete by id error",
        cause: generateProductErrorParam(id),
        message: "Error obteniendo el producto por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }

    if (!prodById) {
      res.json({
        status: "error",
        message: `no se encontro un producto con el valor: ${id}`,
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateProductNfErrorParam(id),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    res.send(deleteProd);
  } catch (error) {}
});

export default routerProd;
