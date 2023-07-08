import { Router } from "express";
import ChatManager from "../Daos/Controllers/ChatManager.js";
const chat = new ChatManager();

const realTimeChat = Router();
const adminAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "admin") {
    next();
  } else {
    res.redirect("/denegado"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }
};

const userAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "user") {
    next();
  } else {
    res.redirect("/"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }}

//vista home productos
realTimeChat.get("/",userAccess, async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const chatRaw = await chat.getChat(limit);
  const chats = chatRaw.map(item=>item.toObject())
  res.render("chat", { chat: chats });
});
export default realTimeChat;
