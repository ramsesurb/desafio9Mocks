import { Router } from "express";
import { productsService } from "../Repository/index.js";
import  {CustomError}  from "../services/customError.service.js";
import { Errors } from "../enums/Errors.js";
import  {generateProductErrorInfo}  from "../services/ErrorInfo.js";
import  {generateProductErrorParam } from "../services/ErrorParam.js";





const adminAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "admin") {
    next();
  } else {
    res.redirect("/"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }
};

const userAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "user") {
    next();
  } else {
    res.redirect("/"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }}

const routerProd = Router();

//getAll productos
routerProd.get("/", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const prodsRaw = await productsService.getProducts(limit);
  const prods = prodsRaw.map(item=>item.toObject())
  res.send(prods);
});
//get by id
routerProd.get("/:id", async (req, res, next) => {
  throw new CustomError({
    name: "product get by id error",
    cause: generateProductErrorParam(req.params.id),
    message: "Error obteniendo el producto por el id",
    errorCode: Errors.INVALID_PARAM,
  });
});


//save new product
routerProd.post("/",adminAccess, async (req, res) => {
  try{
  const prod = req.body;
  const saveProd = await productsService.addProduct(prod);
  if(!prod){
    CustomError.createError({
        name: "product create error",
        cause: generateProductErrorInfo(req.body),
        message: "Error creando el Usuario",
        errorCode: Errors.INVALID_JSON
    });
};
  res.status(201).json(saveProd);
  res.send(saveProd);
} catch (error) {
  next(error);
}
});
//delete by id
routerProd.delete("/:id",adminAccess, async (req, res) => {
  try{
  const id = parseInt(req.params.id);
  const deleteProd = await productsService.deleteById(id);
  if(Number.isNaN(id)){
    CustomError.createError({
        name: "product delete by id error",
        cause:generateProductErrorParam(id),
        message:"Error obteniendo el producto por el id",
        errorCode: Errors.INVALID_PARAM
    })
   }
  res.send(deleteProd)} catch (error) {
    next(error);
  }}
);


export default routerProd;
