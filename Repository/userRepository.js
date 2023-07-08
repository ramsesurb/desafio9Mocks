import {CreateUserDto,GetUserDto} from  "../Daos/Dto/usersDto.js";
import userService from '../Daos/Models/User.js';

export class UsersRepository{
constructor(dao){
    this.dao = dao;
}
async getUser(){
    const users = await this.dao.get()
    return users
}
async createUser(user){
    const usersDto = new CreateProductDto(user)
    const userCreated = await this.dao.post(userDto)
    return userCreated
}

}