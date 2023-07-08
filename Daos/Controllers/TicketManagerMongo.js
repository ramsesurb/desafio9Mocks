import cartModel from "../Models/cart.js";
import ticketModel from "../Models/tickets.js";
import userModel from "../Models/User.js";

export default class TicketManagerMongo {
  async purchaseCart(cid) {
    try {
      const cart = await cartModel.findById(cid).populate("productos.producto");
      let totalAmount = 0;
      const productsWithStock = [];

      for (const productInCart of cart.productos) {
        const product = productInCart.producto;
        if (productInCart.quantity <= product.stock) {
          product.stock -= productInCart.quantity;
          await product.save();
          totalAmount += product.price * productInCart.quantity;
        } else {
          totalAmount += product.price * product.stock;
          productsWithStock.push(productInCart);
          product.stock -= product.stock;
          await product.save();
        }
      }

      const code = Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
      const date = new Date();
      const timestamp = date.getTime();
      const user = await userModel.findOne({ cart: cid });
      const purchaserEmail = user.email;

      const ticketData = {
        code: code,
        purchase_dateTime: timestamp,
        amount: totalAmount,
        purchaser: purchaserEmail
      };

      const ticket = await ticketModel.create(ticketData);
      cart.productos = productsWithStock;
      await cart.save();

      return ticket;
    } catch (error) {
      throw new Error(`Error al procesar la compra del carrito: ${error.message}`);
    }
  }
}
