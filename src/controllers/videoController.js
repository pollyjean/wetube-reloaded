import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Video Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, desc, hashtags },
    session: { user: { _id } },
    files: { videoUpload, thumbUpload }
  } = req;
  try {
    const newVideo = await Video.create({
      videoUpload: res.locals.isHosting ? videoUpload[0].location : videoUpload[0].path,
      thumbUpload: res.locals.isHosting ? thumbUpload[0].location : thumbUpload[0].path,
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
/** ffmpeg 에러 관련 : 
 * Uncaught (in promise) ReferenceError: SharedArrayBuffer is not defined 해결하기 header에 설정
 * res.header("Cross-Origin-Embedder-Policy", "require-corp"); <-- 외부 이거는 다 막아버리는 거 같음
 * 혹시 몰라 남겨둠, 이거 하면 외부 이미지 안나올수도 있음
 */
export const getRecord = (req, res) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  return res.render("recorder", { pageTitle: "Video Recorder" });
}

/** 날짜 표시 적당히 줄여주기 */
export const watch = async (req, res) => {
  const { params: { id }
  } = req;
  const video = await Video.findById(id).populate("owner").populate("comments").populate({
    path: "comments",
    populate: {
      path: "owner",
      populate: {
        path: "username"
      }
    }
  });
  const videoDate = new Date(video.createdAt).toISOString().replace(/[A-Z]/ig, " ").split(".")[0];
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video, videoDate });
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
    req.flash("error", "Not authorized.");
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
  req.flash("success", "Changes saved");
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
  if (keyword.length > 40) {
    return res.status(400).render("search-video", { pageTitle: `Search : ${keyword.substrong(0, 10)}...`, videos, errorMessage: "Search Keyword Too Long" });
  }
  if (keyword) {
    videos = await Video.find({
      $or: [
        { title: { $regex: new RegExp(keyword, "i") } },
        { desc: { $regex: new RegExp(keyword, "i") } },
        { hashtags: { $regex: new RegExp(keyword, "i") } },
      ]
    }).sort({ createdAt: "desc" }).populate("owner");
  }
  if (videos > 0) {
    return res.render("search-video", { pageTitle: `Search : ${keyword}`, videos });
  } else {
    return res.status(400).render("search-video", { pageTitle: `Search : ${keyword}`, videos })
  }

};
export const registerView = async (req, res) => {
  const { params: { id } } = req;
  const video = await Video.findById(id);
  if (!video) {
    req.flash("error", "Cannot found video")
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
}
export const createComment = async (req, res) => {
  const {
    body: { text },
    params: { id },
    session: { user }
  } = req
  const video = await Video.findById(id);
  if (!video) {
    req.flash("error", "Video not found");
    return res.sendStatus(404)
  }
  const userObj = await User.findById(user._id);
  if (!userObj) {
    req.flash("error", "User not found");
    return res.sendStatus(404)
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id
  });
  video.comments.push(comment._id);
  video.save();
  userObj.comments.push(comment._id);
  userObj.save();
  return res.status(201).json({ newCommentId: comment._id, userId: userObj.username });
}

export const removeComment = async (req, res) => {
  const { params: { id } } = req;
  const comment = await Comment.findById(id);
  const commentUser = await User.findById(comment.owner._id);
  const relatedVideo = await Video.findById(comment.video._id);
  if (!comment) {
    req.flash("error", "Comment not found.")
    return res.sendStatus(400);
  }
  if (!commentUser) {
    req.flash("error", "User not found.")
    return res.sendStatus(400);
  }
  if (!relatedVideo) {
    req.flash("error", "Video not found.")
    return res.sendStatus(400);
  }
  try {
    relatedVideo.comments = relatedVideo.comments.filter(item => String(comment._id) !== String(item));
    commentUser.comments = commentUser.comments.filter(item => String(comment._id) !== String(item));
    await Comment.findByIdAndDelete(id);
    await relatedVideo.save();
    await commentUser.save();
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
export const searchTagVideo = async (req, res) => {
  const { query: { hashtags } } = req;
  const pageTitle = `Tag Search : ${hashtags}`;
  try {
    const videos = await Video.find({ hashtags }).sort({ createdAt: "desc" }).populate("owner");
    return res.render("search-video", { pageTitle, videos })
  } catch (error) {
    return res.status(400).render("search-video", { pageTitle, errorMessage: error })
  }
}

/** TODO: 사용자 프로필에 댓글 단거 추가하기, 댓글에 사용자 이름, 날짜 추가, 좋아요 추가
 */