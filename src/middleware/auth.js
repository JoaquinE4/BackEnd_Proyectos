export const auth = (req, res, next) => {
  if (!req.session.user) {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).redirect("/login");
  }

  next();
};

export const authADM = (req, res, next) => {
  if (!req.session.user.rol === "admin") {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `Permisos No validos` });
  }

  next();
};

export const authUSER = (req, res, next) => {
  if (!req.session.user.rol === "user") {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `Permisos No validos` });
  }

  next();
};
