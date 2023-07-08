import { Router } from "express";
import ProductManagerMongo from "../Daos/Controllers/ProductManagerMongo.js"
const productos = new ProductManagerMongo("../Controllers/ProductManagerMongo.js");

const realTime = Router();

const adminAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "admin") {
    next();
  } else {
    res.redirect("/register"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }
};

const userAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "user") {
    next();
  } else {
    res.redirect("/"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }}
//vista realtime
realTime.get("/",adminAccess, async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const prodsRaw = await productos.getProducts(limit);
  const prods = prodsRaw.map(item=>item.toObject())
  res.render("realTimeProducts", { productos: prods });
});

export default realTime;
