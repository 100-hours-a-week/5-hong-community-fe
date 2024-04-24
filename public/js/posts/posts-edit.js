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
  // const posts = await fetchDummyPosts();
  // const findPost = posts.find((post) =>
  //   post.post_id === getPostId(),
  // );
  const nowPostsId = getPostId();
  const findPosts = await getFetch(`/api/v1/posts/${nowPostsId}`)
    .catch((e) => {
      console.log(e);
    });
  generatedPostsDetail(findPosts);
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

async function postsEditButtonEvent(event) {
  event.preventDefault();

  const title = titleField.value;
  const contents = contentsField.value;

  const nowPostsId = getPostId();
  await putFetch(`/api/v1/posts/${nowPostsId}`, { title, contents })
    .then(() => {
      alert('게시글 수정 완료');
      window.history.back();
    }).catch((e) => {
      console.log(e);  // 서버 오류남
    });
}

async function getFetch(url) {
  const baseUrl = 'http://localhost:8000';
  const requestUrl = baseUrl + url;

  return fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error();
  });
}

async function putFetch(url, data) {
  const baseUrl = 'http://localhost:8000';
  const requestUrl = baseUrl + url;

  return fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(data),
  }).then(response => {
    if (response.ok) {
      return;  // TODO: response json 없음 BE 에서 수정해야함
    }
    throw new Error();
  });
}
