const videos = [
  {
    title: "First Video",
    views: 54,
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    id: 1,
  },
  {
    title: "Fun Video",
    views: 35,
    rating: 4,
    comments: 2,
    createAt: "1 minutes ago",
    id: 2,
  },
  {
    title: "Cool Video",
    views: 1,
    rating: 4,
    comments: 2,
    createAt: "1 minutes ago",
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Video Upload", videos });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    views: 0,
    rating: 0,
    comments: 0,
    createAt: "just now",
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
