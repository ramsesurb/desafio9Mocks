import userService from '../Models/User.js';

class UserManager {
  
  async getUser() {
    try {
      
      const getUser = {user: req.session.user}
      console.log("usuario", getUser);
      return getUser;
    } catch (error) {
      console.log(error);
    }
  }
  }


export default UserManager
const rute = new UserManager();
