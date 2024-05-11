export const auth = (req, res, next) => {
  if (!req.session.user) {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).redirect(`/login`);
  }

  next();
};
