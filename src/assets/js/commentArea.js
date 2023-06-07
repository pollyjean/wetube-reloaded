const videoContainer = document.getElementById("video__container");
const commentForm = document.getElementById("commentForm");
const textarea = document.getElementById("commentArea");
const commentBtn = commentForm.querySelector("button");

const addCommentLine = (text, id) => {
  const commentsList = document.querySelector(".watch__commentsList ul");
  const newCommentItem = document.createElement("li");
  const newCommentText = document.createElement("p");
  newCommentText.classList.add("watch__commentText");
  newCommentText.innerText = text;
  newCommentItem.appendChild(newCommentText);
  newCommentItem.dataset.id = id;
  commentsList.prepend(newCommentItem);
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
  })
  textarea.value = "";
  if (response.status === 201) {
    const { newCommentId } = await response.json()
    addCommentLine(text, newCommentId);
  }
}

commentForm.addEventListener("submit", handleCommentSubmit);

/** TODO: 댓글 삭제 */