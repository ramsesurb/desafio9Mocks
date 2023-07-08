import { Router } from "express";
import CartManagerMongo from "./Daos/Controllers/CartManagerMongo.js"
import ProductManagerMongo from "./Daos/Controllers/ProductManagerMongo.js";
import cartModel from "./Daos/Models/cart.js";
import userModel from "./Daos/Models/User.js";
import productoModel from "./Daos/Models/mongo.js";
import TicketManagerMongo from "./Daos/Controllers/TicketManagerMongo.js";
import ticketModel from "./Daos/Models/tickets.js";

const ticketManager = new TicketManagerMongo();


const productos = new CartManagerMongo();
const prods = new ProductManagerMongo();

const routerCart = Router();

// POST ticket
routerCart.post("/:cid/purchase", async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartModel.findById(cartId).populate("productos.producto");
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
      const code = Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
      const date = async () =>{
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const dateInfo = `Fecha: ${date} - Hora: ${time}`;
        return dateInfo;
      };
      const ticketData = {
      code: code,
      purchase_dateTime: date(),
      amount: totalAmount,
      purchaser: purchaserEmail
    };
    console.log(ticketData)
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
  const newProducts  = req.body;

  try {
    const updatedCart = await productos.addProduct(cartId, newProducts, productId);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});
//create cart
routerCart.post("/", async (req, res) => {
  try {
    await productos.createCart();
    res.send("Carrito creado exitosamente");
  } catch (error) {
    res.status(500).send({ error: "Error al crear el carrito" });
  }
});



//save new product
routerCart.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newProducts = req.body;
    const cart = await productos.addProduct(cid, newProducts,pid);
    res.send(cart);
    
  } catch (error) {
    // Manejar el error adecuadamente
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

//delete productos del array by id
routerCart.delete("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  
  const cart = await productos.deleteProductById(cid, pid);
  res.send(cart);
});
//vaciar carito
routerCart.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await productos.emptyCart(cid);
  res.send(cart);
});

//actualizar carrito
routerCart.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const products = req.body.productos;

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
  try {
    const response = await productos.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    if (response === null)
      return res.status(404).send({ error: "Producto no encontrado" });
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, errorType: "Error en el servidor" });
  }})

routerCart.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartModel.findOne({ _id: cid }).populate("productos.producto");
    res.send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});


export default routerCart;
