import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videoUpload: { type: String, required: true },
  thumbUpload: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxLength: 80 },
  desc: { type: String, required: true, trim: true, maxLength: 255, minLength: 10 },
  createdAt: { type: Date, default: Date.now, required: true },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

videoSchema.static("formatHashtags", (hashtags) => {
  if (hashtags.length === 0) {
    return "";
  } else {
    return hashtags.split(",").map((word) => (word.slice(0, 1) === "#" ? word : `#${word}`));
  }
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
