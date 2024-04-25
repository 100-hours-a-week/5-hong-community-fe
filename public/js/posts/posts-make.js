import { postFetch } from '../common/utils.js';

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

// TODO: 이미지 업로드 구현
async function createPostsButtonEvent(event) {
  event.preventDefault();

  const title = titleField.value;
  const contents = contentsField.value;
  // 이미지는 임시
  const thumbnail = 'https://avatars.githubusercontent.com/u/144337839?v=4';

  await postFetch('/api/v1/posts', { title, contents, thumbnail })
    .then(() => {
      window.alert('게시글 작성 완료');
      location.href = '/main';
    }).catch((e) => {
      console.log(e);  // 서버 오류
    });
}
