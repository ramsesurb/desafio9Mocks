export const generateProductErrorParam = (id) => {
     return `
     Mensaje de error generado: el idd producto: ${id} no es valido
    `
  };
  export const generateProductNfErrorParam = (id) => {
    return `
    Mensaje de error generado: No se encontro ningun producto con el id: ${id}
   `
 };
export const generateUserErrorParam = (id) => {
    return `
    Mensaje de error generado: El id no es válido. Debe ser un número entero, pero se recibió ${id}
   `
}
export const generateCartErrorParam = (cid) => {
    return `Mensaje de error generado: el id de carrito: ${cid} no es valido`
}

export const generateCartNfErrorParam = (cid) => {
    return `
    Mensaje de error generado:No se encontro ningun carito con el id: ${cid}
   `
 };