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
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", { pageTitle, errorMessage: "You have no account." });
  }
  if (!(user.socialOnly)) {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).render("login", { pageTitle, errorMessage: "Unmatched Password. Try again" });
    }
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};
export const startGithubLogin  = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id : process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email"
  }
  const params = new URLSearchParams(config).toString();
  const authUrl = `${baseUrl}?${params}`;

  return res.redirect(authUrl);
}
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id : process.env.GH_CLIENT,
    client_secret : process.env.GH_SECRET,
    code: req.query.code,
  }
  const params = new URLSearchParams(config).toString();
  const accessUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(accessUrl, {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
    })
  ).json();
  if("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com/";
    const userData = await (
      await fetch(`${apiUrl}user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(email => email.primary === true && email.verified === true);
    if(!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({email: emailObj.email});
    if (!user) {
      user = await User.create({ 
        email: emailObj.email, 
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        username: userData.login, 
        password: "", 
        fullname: userData.name ? userData.name : userData.login,
        location: userData.location
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
}
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const editUser = (req, res) => res.send("User Edit");
export const seeUser = (req, res) => res.send("User Details");
