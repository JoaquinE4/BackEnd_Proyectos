export const auth = (req, res, next) => {
  if (!req.session.user) {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).redirect("/login");
  }

  next();
};

export const authADM = (req, res, next) => {

  if (req.session.user.rol !== "admin") {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).redirect("/")
  }

  next();
};

export const authUSER = (req, res, next) => {
  console.log(req.session.user.rol);
  
  if (req.session.user.rol !== "user") {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).redirect("/")
  }

  next();
};
