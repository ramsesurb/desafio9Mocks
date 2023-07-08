import ticketModel from "../Models/tickets.js"

class TicketManager {
    async getTicket(limit) {
      try {
        
          const content = await ticketModel.find()
        
        
        if (limit) {
          return content.slice(0, limit);
        }
        return content;
      } catch (error) {
        console.log(error);
        return [];
      }
    }
    async addTicket(cid) {
      try {
        const saveCont = await this.getTicket();
        const Code = (Math.floor(Math.random() * 1000000000000000)).toString().padStart(15, '0');
        const date = new Date();
        const timestamp = date.getTime();
        const newTicket = {
          code: "Code",
          purchase_time: "date",
          amount: 8000,
          purchaser: "pepito@gmail.com"
        };
        const result = await ticketModel.create(newTicket)
        
      } catch (error) {
        console.log(error);
      }
    }
  
   async getByid(id) {
    try {
      
      const getByid =await ticketModel.findOne({id:id})
      console.log("chat buscado", getByid);
      return getByid;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteById(id) {
    try {
      const deleteByid = await ticketModel.findOneAndDelete({id:id})
      return deleteByid;
    } catch (error) {
      console.log(error);
    }
  }
    async deleteAll() {
      try {
        let chatucts = await rute.getChat();
        chatucts.splice(0, chatucts.length);
  
       
      } catch (error) {
        console.log(error);
      }
    }
  }
  export default TicketManager;
  const rute = new TicketManager("./Data/Chat.json");
 
