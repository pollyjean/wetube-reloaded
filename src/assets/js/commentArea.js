const videoContainer = document.getElementById("video__container");
const commentForm = document.getElementById("commentForm");
const textarea = document.getElementById("commentArea");
const commentBtn = commentForm.querySelector("button");
const commentsList = document.querySelector(".watch__commentsList ul");

const addCommentLine = (text, id) => {
  const newCommentItem = document.createElement("li");
  const newCommentText = document.createElement("span");
  const newCommentClose = document.createElement("i");
  newCommentText.classList.add("watch__commentText");
  newCommentText.innerText = text;
  newCommentItem.appendChild(newCommentText);
  newCommentItem.dataset.id = id;
  newCommentClose.className = "fas fa-times watch__commentClose";
  newCommentClose.addEventListener("click", handleCommentRemove);
  newCommentItem.appendChild(newCommentClose);
  commentsList.prepend(newCommentItem);
  console.log(newCommentItem);
}
const handleCommentRemove = async (event) => {
  const closeButton = event.target;
  const comment = closeButton.closest("[data-id]");
  const commentId = comment.dataset.id;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE"
  });
  if (response.status === 201) {
    comment.remove();
  }
}
const handleCommentSubmit = async (event) => {
  event.preventDefault();
  const videoId = videoContainer.dataset.id;
  const text = textarea.value;
  /** 스페이스 빈칸도 찾아서 날림 */
  if (text.trim() === "") {
    textarea.value = "";
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addCommentLine(textarea.value, newCommentId);
    textarea.value = "";
  }
}

commentForm.addEventListener("submit", handleCommentSubmit);

const initCommentArea = () => {
  const closeButtons = commentsList.querySelectorAll(".watch__commentClose");
  closeButtons.forEach(item => {
    item.addEventListener("click", handleCommentRemove);
  })
}
initCommentArea();