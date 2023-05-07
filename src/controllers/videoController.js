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
    await Video.create({ title, desc, hashtags: Video.formatHashtags(hashtags) });
  } catch (error) {
    return res.render("upload", { pageTitle: "Video Upload", errorMessage: error._message });
  }
  return res.redirect("/");
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit : ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, desc, hashtags } = req.body;
  const isVideo = await Video.exists({ _id: id });
  if (!isVideo) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, { title, desc, hashtags: Video.formatHashtags(hashtags) });

  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const isVideo = await Video.exists({ _id: id });
  if (!isVideo) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
