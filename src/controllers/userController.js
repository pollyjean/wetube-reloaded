import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join Wetube" });
export const postJoin = async (req, res) => {
  const { email, username, password, fullname, location } = req.body;
  await User.create({ email, username, password, fullname, location });
  res.redirect("/login");
};
export const login = (req, res) => res.send("Log In");
export const logout = (req, res) => res.send("Log Out");
export const editUser = (req, res) => res.send("User Edit");
export const deleteUser = (req, res) => res.send("User Delete");
export const seeUser = (req, res) => res.send("User Delete");
