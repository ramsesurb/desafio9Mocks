export const generateProductErrorParam = (id) => {
    const errorMessage = `El id no es válido. Debe ser un número entero, pero se recibió: ${id}`;
    //console.log("Mensaje de error generado:", errorMessage);
    return errorMessage;
  };
export const generateUserErrorParam = (id) => {
    return `
    User id no es valido, debe ser un numero entero, pero se recibio: ${id}
    `
}
export const generateCartErrorParam = (id) => {
    return `
    User id no es valido se recibio: ${id}
    `
}
