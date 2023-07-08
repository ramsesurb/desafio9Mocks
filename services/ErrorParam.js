export const generateProductErrorParam = (id) => {
    return `
    el id no es valido
    `
}
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
