import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Video Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, desc, hashtags },
    session: { user: { _id } },
    file
  } = req
  try {
    const newVideo = await Video.create({
      videoUpload: file.path,
      title,
      desc,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", { pageTitle: "Video Upload", errorMessage: error });
  }
};
export const watch = async (req, res) => {
  const { params: { id }
  } = req;
  const video = await Video.findById(id).populate("owner");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner._id) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit : ${video.title}`, video });
}
export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, desc, hashtags }
  } = req;
  const isVideo = await Video.exists({ _id: id });
  if (!isVideo) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, { title, desc, hashtags: Video.formatHashtags(hashtags) });

  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner._id) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
export const searchVideo = async (req, res) => {
  const { query: { keyword } } = req;
  let videos = [];
  if (keyword) {
    videos = await Video.find({ title: { $regex: new RegExp(keyword, "i") } }).sort({ createdAt: "desc" });
  }
  return res.render("search-video", { pageTitle: `Search : ${keyword}`, videos });
};
