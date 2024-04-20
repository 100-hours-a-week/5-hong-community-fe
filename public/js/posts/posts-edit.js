import { fetchDummyPosts } from '../common/utils.js';

const titleField = document.getElementById('title');
const contentsField = document.getElementById('contents');
const helperText = document.getElementById('posts-helper');
const postsEditButton = document.getElementById('posts-edit-button');

window.addEventListener('load', insertHTML);
titleField.addEventListener('input', inputFieldEvent);
contentsField.addEventListener('input', inputFieldEvent);
postsEditButton.addEventListener('click', postsEditButtonEvent);

function getPostId() {
  const pathname = window.location.pathname;
  const StringTypePostId = pathname.split('/')[2];
  return parseInt(StringTypePostId, 10);
}

async function insertHTML() {
  const posts = await fetchDummyPosts();
  const findPost = posts.find((post) =>
    post.post_id === getPostId(),
  );
  generatedPostsDetail(findPost);
}

function generatedPostsDetail(posts) {
  titleField.value = posts.title;
  contentsField.textContent = posts.contents;
}

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
    postsEditButton.style.background = '#7F6AEE';
    postsEditButton.disabled = false;
  } else {
    postsEditButton.style.background = '#ACA0EB';
    postsEditButton.disabled = true;
  }
}

// TODO: 백엔드 구현후 완료
function postsEditButtonEvent(event) {
  event.preventDefault();

  console.log('백엔드 구현 후 완료');
  alert('백엔드 구현 후 완료');
}
