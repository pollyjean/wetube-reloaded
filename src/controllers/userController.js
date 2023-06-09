import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Join Wetube" });
export const postJoin = async (req, res) => {
  const { email, username, password, confirmPassword, fullname, location } =
    req.body;
  const pageTitle = "Join";

  if (password !== confirmPassword) {
    return res.status(400).render("join", { pageTitle, errorMessage: "Password confirmation does not match." });
  }
  try {
    await User.create({ email, username, password, fullname, location });
    return res.redirect("/login");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).render("join", { pageTitle: "Join", errorMessage: "This username/email is already taken." });
    }
    return res.status(400).render("join", { pageTitle: "Join", errorMessage: error });
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
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "You have no account." });
  }
  if (!user.socialOnly) {
    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .render("login", {
          pageTitle,
          errorMessage: "Unmatched Password. Try again",
        });
    }
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const authUrl = `${baseUrl}?${params}`;

  return res.redirect(authUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const accessUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(accessUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
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
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true,
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let foundUser = await User.findOne({ email: emailObj.email });
    if (!foundUser) {
      foundUser = await User.create({
        email: emailObj.email,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        username: userData.login,
        password: "",
        fullname: userData.name ? userData.name : userData.login,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = foundUser;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.flash("info", "Bye Bye");
  req.session.destroy();
  return res.redirect("/");
};
export const getEditUser = (req, res) => {
  return res.render("users/edit-user", { pageTitle: "Edit Profile" });
};
export const postEditUser = async (req, res) => {
  const pageTitle = "Edit Profile";
  const PROFILE_PUG = "users/edit-user";
  const {
    session: {
      user: { _id, avatarUrl }
    },
    body: { username, email, fullname, location, },
    file
  } = req;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id },
      { username, email, fullname, location, avatarUrl: file ? file.location : avatarUrl },
      { new: true },
    );
    req.session.user = updatedUser;
    return res.redirect(`/users/${_id}`);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).render(PROFILE_PUG, { pageTitle, errorMessage: "This username/email is already taken." });
    }
    return res.status(400).render(PROFILE_PUG, { pageTitle, errorMessage: error });
  }
};
export const postEditPassword = async (req, res) => {
  const pageTitle = "Edit Profile";
  const PROFILE_PUG = "users/edit-user";
  const {
    session: {
      user: { _id },
    },
    body: { password, password2, password3 }
  } = req;

  const ok = await bcrypt.compare(password, req.session.user.password);
  if (!ok) {
    return res.status(400).render(PROFILE_PUG, { pageTitle, errorMessage2: "Current password does not match." })
  }
  if (!password2 || !password3) {
    return res.status(400).render(PROFILE_PUG, { pageTitle, errorMessage2: "Type a new password" })
  }
  if (password2 !== password3) {
    return res.status(400).render(PROFILE_PUG, { pageTitle, errorMessage2: "New password does not match." })
  }
  const savedData = await User.findById({ _id })
  savedData.password = password2;
  await savedData.save();
  req.session.user.password = savedData.password;
  req.flash("info", "Password Updated.")
  return res.redirect("/users/logout");
}
export const viewProfile = async (req, res) => {
  const { id } = req.params;
  const userInfo = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User"
    }
  });
  if (!userInfo) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("users/profile", { pageTitle: `${userInfo.username}'s Profile`, userInfo });
};

/** TODO: file size 제한 위반시 오류 문제 해결 */