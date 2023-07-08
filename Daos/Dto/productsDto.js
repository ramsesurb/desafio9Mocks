export class CreateProductDto {
 constructor (producto){
    this.id = producto.id;
    this.titulo = producto.titulo;
    this.descripcion = producto.descripcion;
    this.precio = producto.precio;
    this.code= producto.code;
    this.thumbnail = producto.thumbnail;
    this.stock= producto.stock;
    this.status= producto.status;

 }

}
export class GetProductDto {
    constructor (productoDB){
        this.id = productoDB.id;
        this.titulo = productoDB.titulo;
        this.descripcion = productoDB.descripcion;
        this.precio = productoDB.precio;
        this.code= productoDB.code;
        this.thumbnail = productoDB.thumbnail;
        this.stock= productoDB.stock;
        this.status= productoDB.status;
    }
 }