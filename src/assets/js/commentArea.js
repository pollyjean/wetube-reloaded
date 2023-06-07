const videoContainer = document.getElementById("video__container");
const commentForm = document.getElementById("commentForm");
const textarea = document.getElementById("commentArea");
const commentBtn = commentForm.querySelector("button");

const handleCommentSubmit = (event) => {
  event.preventDefault();
  const videoId = videoContainer.dataset.id;
  const text = textarea.value;
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: { text }
  });
};

commentForm.addEventListener("submit", handleCommentSubmit);