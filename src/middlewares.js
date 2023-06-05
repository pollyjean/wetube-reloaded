import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "weTube";
  res.locals.user = req.session.user || {};
  res.locals.execRefresh = false;
  next();
};
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized.")
    return res.redirect("/login");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized.")
    return res.redirect("/");
  }
}
export const refreshMiddleware = (req, res, next) => {
  res.locals.execRefresh = true;
  next();
}

export const uploadAvatarMiddleware = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 30000,
  }
});
export const uploadVideoMiddleware = multer({
  dest: "uploads/video",
  limits: {
    fileSize: 30000000,
  }
});