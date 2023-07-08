import { CreateProductDto,GetProductDto } from "../Daos/Dto/productsDto.js";

export class ProductsRepository{
constructor(dao){
    this.dao = dao;
}
async getProducts(){
    const products = await this.dao.getProducts()
    return products
}
async createProducts(product){
    const productDto = new CreateProductDto(product)
    const productCreated = await this.dao.addProduct(productDto)
    return productCreated
}
async  getByid(id){
    const products = await this.dao.getByid(id)
    return products
}
async  deleteById(id){
    const products = await this.dao.deleteById(id)
    return products
}
async  deleteAll(){
    const products = await this.dao.deleteAll() 
    return products
}
}