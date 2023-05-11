import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join Wetube" });
export const postJoin = async (req, res) => {
  const { email, username, password, confirmPassword, fullname, location } = req.body;
  const pageTitle = "Join";

  if (password !== confirmPassword) {
    return res.status(400).render("join", { pageTitle, errorMessage: "Password confirmation does not match." });
  }
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(400).render("join", { pageTitle, errorMessage: "This email is already taken." });
  }
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(400).render("join", { pageTitle, errorMessage: "This username is already taken." });
  }
  try {
    await User.create({ email, username, password, fullname, location });
    res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", { pageTitle: "Join", errorMessage: error._message });
  }
};
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", { pageTitle, errorMessage: "You have no account." });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", { pageTitle, errorMessage: "Unmatched Password. Try again" });
  }
  console.log("Logged User in ", username);
  return res.redirect("/");
};
export const logout = (req, res) => res.send("Log Out");
export const editUser = (req, res) => res.send("User Edit");
export const deleteUser = (req, res) => res.send("User Delete");
export const seeUser = (req, res) => res.send("User Delete");
