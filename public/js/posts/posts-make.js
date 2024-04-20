const titleField = document.getElementById('title');
const contentsField = document.getElementById('contents');
const helperText = document.getElementById('posts-helper');
const postsMakeButton = document.getElementById('posts-make-button');

window.addEventListener('load', inputFieldEvent);
titleField.addEventListener('input', inputFieldEvent);
contentsField.addEventListener('input', inputFieldEvent);
postsMakeButton.addEventListener('click', createPostsButtonEvent);

function inputFieldEvent() {
  const titleValue = titleField.value;
  const contentsValue = contentsField.value;

  let helperMessage = '';

  if (titleValue.length === 0 && contentsValue.length === 0) {
    helperMessage = '*제목과 내용을 모두 입력해주세요.';
  } else if (titleValue.length === 0) {
    helperMessage = '*제목을 입력해주세요.';
  } else if (contentsValue.length === 0) {
    helperMessage = '*내용을 입력해주세요.';
  }
  helperText.textContent = helperMessage;

  if (helperMessage === '') {
    postsMakeButton.style.background = '#7F6AEE';
    postsMakeButton.disabled = false;
  } else {
    postsMakeButton.style.background = '#ACA0EB';
    postsMakeButton.disabled = true;
  }
}

// TODO: 백엔드 구현후 완료
function createPostsButtonEvent(event) {
  event.preventDefault();

  console.log('백엔드 구현 후 완료');
  alert('백엔드 구현 후 완료');
}
