import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import {Faker, en, es } from "@faker-js/faker";


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);



export const customFaker = new Faker({

    locale: [en],
})

const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;

export const generateProduct = () => {

    return {
        _id: database.mongodbObjectId(),
        titulo: commerce.productName(),
        descripcion: commerce.productDescription(),
        precio: parseFloat(commerce.price()),
        code: string.alphanumeric(10),
        thumbnail: image.url(),
        stock: parseInt(string.numeric(2)),
  
       
        
    }
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;