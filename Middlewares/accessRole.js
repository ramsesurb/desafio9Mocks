export const privateAccess = (req,res,next)=>{
    if(!req.session.user) return res.redirect('/prods');
    next();
  }
  export const adminAccess = (req, res, next) => {
    if (req.session.user && req.session.user.rol === "admin") {
      next();
    } else {
      res.redirect("/register"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
    }
  };
  
  export  const userAccess = (req, res, next) => {
    if (req.session.user && req.session.user.rol === "user") {
      next();
    } else {
      res.redirect("/denegado"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
    }}