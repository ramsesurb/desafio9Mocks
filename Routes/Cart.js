import { Router } from "express";
import CartManagerMongo from "../Daos/Controllers/CartManagerMongo.js";
import ProductManagerMongo from "../Daos/Controllers/ProductManagerMongo.js";
import cartModel from "../Daos/Models/cart.js";
import userModel from "../Daos/Models/User.js";
import TicketManagerMongo from "../Daos/Controllers/TicketManagerMongo.js";
import ticketModel from "../Daos/Models/tickets.js";
import { Errors } from "../enums/Errors.js";
import { generateCartErrorInfo } from "../services/ErrorInfo.js";
import { generateCartErrorParam } from "../services/ErrorParam.js";
import { generateCartNfErrorParam } from "../services/ErrorParam.js";
import { generateProductNfErrorParam } from "../services/ErrorParam.js";
import { generateProductErrorParam } from "../services/ErrorParam.js";
import { CustomError } from "../services/customError.service.js";

const ticketManager = new TicketManagerMongo();

const productos = new CartManagerMongo();
const prods = new ProductManagerMongo();

const routerCart = Router();

// POST ticket
routerCart.post("/:cid/purchase", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel
      .findById(cartId)
      .populate("productos.producto");
    const user = await userModel.findOne({ cart: cartId });
    const purchaserEmail = user.email;
    let totalAmount = 0;
    const productsWithStock = [];
    for (const productInCart of cart.productos) {
      const product = productInCart.producto;
      if (productInCart.quantity <= product.stock) {
        product.stock -= productInCart.quantity;
        await product.save();
        totalAmount += product.precio * productInCart.quantity;
      } else {
        totalAmount += product.precio * product.stock;
        productsWithStock.push(productInCart);
        product.stock -= product.stock;
        await product.save();
      }
    }
    const code = Math.floor(Math.random() * 1000000000000000)
      .toString()
      .padStart(15, "0");
    const date = async () => {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      const dateInfo = `Fecha: ${date} - Hora: ${time}`;
      return dateInfo;
    };
    const ticketData = {
      code: code,
      purchase_dateTime: date(),
      amount: totalAmount,
      purchaser: purchaserEmail,
    };
    console.log(ticketData);
    const ticket = await ticketModel.create(ticketData);
    cart.productos = productsWithStock;
    await cart.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

//get productos cart
routerCart.get("/", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const prods = await productos.getProducts(limit);
  res.send(prods);
});

//post in cart
routerCart.post("/api/cart/:cartId/product/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  const newProducts = req.body;
  if (!cartId || cartId.length !== 24) {
    res.json({ status: "error", message: "el id del carrito no es valido" });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }
  if (!productId || productId.length !== 24) {
    res.json({ status: "error", message: "el id del carrito no es valido" });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }
  try {
    const updatedCart = await productos.addProduct(
      cartId,
      newProducts,
      productId
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

//save new product
routerCart.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newProducts = req.body;
    const cart = await productos.addProduct(cid, newProducts, pid);
    if (!cid || cid.length !== 24) {
      res.json({ status: "error", message: "el id del carrito no es valido" });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    if (!pid || pid.length !== 24) {
      res.json({ status: "error", message: "el id del producto no es valido" });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    
    if (!newProducts) {
      res.json({ status: "error", message: "producto invalido, faltan datos" });

      CustomError.createError({
        name: "product create error",
        cause: generateCartErrorInfo(),
        message: "Error creando el producto",
        errorCode: Errors.INVALID_JSON,
      });
    }

    res.send(cart);
  } catch (error) {
    console.error(error);
  }
});

//delete productos del array by id
routerCart.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const findCart = await productos.getByid(cid)
    const pid = req.params.pid;
    //const findprod = await prods.getByid(pid)
    if (!cid || cid.length !== 24) {
      res.json({ status: "error", message: "el id del carrito  no es valido" });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    if (!findCart) {
      res.json({
        status: "error",
        message: "no se encontro un carrito con este valor",
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartNfErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    if (!pid || pid.length !== 24) {
      res.json({ status: "error", message: "el id del producto no es valido" });
      CustomError.createError({
        name: "product get by id error",
        cause: generateProductErrorParam(),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    //! funciona, pero hace falta configurar para que los metodos de producto funcionen con id Mongo
    //if (!findprod) {
    //  res.json({
    //    status: "error",
    //    message: "no se encontro un producto con este valor",
    //  });
    //  CustomError.createError({
    //    name: "product get by id error",
    //    cause: generateProductNfErrorParam(cid),
    //    message: "El producto no fue encontrado",
    //    errorCode: Errors.INVALID_PARAM,
    //  });
    //}
    const cart = await productos.deleteProductById(cid, pid);

    res.send(cart);
  } catch (error) {}
  
});

//vaciar carito
routerCart.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const findCart = await productos.getByid(cid)
    
    console.log(cid);
    if (!cid || cid.length !== 24) {
      res.json({ status: "error", message: "el id no es valido" });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    const cart = await productos.emptyCart(cid);
    if (!findCart) {
      res.json({
        status: "error",
        message: "no se encontro un carrito con este valor",
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartNfErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    res.send(cart);
  } catch (error) {}
  
});

//actualizar carrito
routerCart.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const products = req.body.productos;
  if (!cid || cid.length !== 24) {
    res.json({ status: "error", message: "el id del carrito no es valido" });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }

  try {
    const cart = await productos.updateCart(cid, products);

    res.send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al actualizar el carrito");
  }
});
//actualizar cantidad

routerCart.put("/:cid/product/:pid", async (req, res) => {
  const { pid, cid } = req.params;
  const { quantity } = req.body;
  console.log(pid, cid, quantity);
  if (!cid || cid.length !== 24) {
    res.json({ status: "error", message: `el id: ${cid} no es valido` });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(cid),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }
  
  if (!pid || pid.length !== 24) {
    res.json({ status: "error", message: `el id: ${cid} no es valido` });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(cid),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }

  try {
    const response = await productos.updateProductQuantity(cid, pid, quantity);

    if (response === null)
      return res.status(404).send({ error: "Producto no encontrado" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500);
  }
});

routerCart.get("/:cid", async (req, res, next) => {
  const { cid } = req.params;
  try {
    if (!cid || cid.length !== 24) {
      res.json({ status: "error", message: `el id: ${cid} no es valido` });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    const cart = await cartModel
      .findOne({ _id: cid })
      .populate("productos.producto");
    if (!cart) {
      res.json({
        status: "error",
        message: `no se encontro ningun carrito con el id: ${cid}`,
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartNfErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    res.send(cart);
  } catch (error) {}
});

export default routerCart;
