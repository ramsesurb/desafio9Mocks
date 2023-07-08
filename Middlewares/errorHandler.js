import {Errors}  from "../enums/Errors.js";
export const errorHandler = (error, req, res, next) => {
    console.log("Objeto error:", error);
    console.log("Código de error:", error.code);
    switch (error.code) {
      case Errors.INVALID_JSON:
        res.json({ status: "error", error: error.cause, message: error.message });
        break;
      case Errors.DATABASE_ERROR:
        res.json({ status: "error", message: error.message });
        break;
      case Errors.INVALID_PARAM:
        res.json({ status: "error", error: error.cause, message: error.message });
        break;
      default:
        res.json({ status: "error", message: "Hubo un error, contacte al equipo de soporte." });
        break;
    }
    next();
  };