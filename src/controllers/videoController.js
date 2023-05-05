import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Video Upload" });
};
export const postUpload = async (req, res) => {
  const { title, desc, hashtags } = req.body;
  try {
    await Video.create({
      title,
      desc,
      hashtags: hashtags.split(",").map((word) => (word.trim().substr(0, 1) === "#" ? word : `#${word}`)),
    });
  } catch (error) {
    return res.render("upload", { pageTitle: "Video Upload", errorMessage: error._message });
  }
  return res.redirect("/");
};
export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching: ${video.title}` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing: ${video.title}` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};
