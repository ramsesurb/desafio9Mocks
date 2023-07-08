import { ProductsRepository } from "./productsRepository.js";
import { UsersRepository } from "./userRepository.js";

import UserManager from "../Daos/Controllers/UserManager.js";
import ProductManagerMongo from "../Daos/Controllers/ProductManagerMongo.js";

let userDao = new UserManager
let productDao = new ProductManagerMongo("./Data/Productos.json");

export const userService = new UsersRepository(userDao)
export const productsService = new ProductsRepository(productDao)