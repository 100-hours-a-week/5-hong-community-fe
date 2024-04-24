const postsOwnerDetailContainer = document.querySelector('.posts-detail');
const postsBodyContainer = document.querySelector('.posts-body');
const commentsListContainer = document.querySelector('.comments-list-container');
const commentsContent = document.getElementById('comments');
const commentsButton = document.getElementById('comments-button');
const closeModalButton = document.getElementById('modal-close');
const okModalButton = document.getElementById('modal-ok');

window.addEventListener('load', insertHTML);
commentsContent.addEventListener('input', checkEnableButton);
commentsButton.addEventListener('click', commentsButtonClickEvent);
closeModalButton.addEventListener('click', closeModalButtonClickEvent);
okModalButton.addEventListener('click', okModalButtonClickEvent);

// 댓글 목록 무한 스크롤
let nowRequestPage = 1;

let isAlreadyFetch = false;
let isEndPage = false;

// Vanilla JS 에서 상태 저장은 어떻게?
let nowSelectCommentsId;

function getPostId() {
  const pathname = window.location.pathname;
  const StringTypePostId = pathname.split('/')[2];
  return parseInt(StringTypePostId, 10);
}

async function insertHTML() {
  // const posts = await fetchDummyPosts();
  // const findPost = posts.find((post) => post.post_id === getPostId());
  const nowPostsId = getPostId();

  const findPosts = await getFetch(`/api/v1/posts/${nowPostsId}`)
    .catch((e) => {
      console.log(e);
    });
  postsOwnerDetailContainer.innerHTML = generatedPostsOwnerDetail(findPosts);
  postsBodyContainer.innerHTML = generatedPostsBody(findPosts);


  const findComments = await getFetch(`/api/v1/comments?page=${nowRequestPage}&postsId=${nowPostsId}`)
    .then((jsonData) => {
      if (!jsonData.hasNext) {
        isEndPage = true;
      }
      nowRequestPage = jsonData.nextPage;
      return jsonData.data;
    }).catch((e) => {
      console.log(e);
    });
  console.log(findComments);
  insertCommentList(findComments);

  setPostsEvent();
  setCommentsEvent();
}

function generatedPostsOwnerDetail(posts) {
  const postsId = posts.postsId;
  const title = posts.title;
  const ownerProfileImage = posts.thumbnail;
  const ownerNickname = posts.owner.nickname;
  const postsDate = posts.createdAt;

  return `
    <div class="posts-detail-title"><h1>${title}</h1></div>
    <div class="posts-owner-detail-container">
      <div class="posts-info">
        <div class="posts-owner-info">
          <img src="${ownerProfileImage}" class="circle-image">
          <p><span class="highlight">${ownerNickname}</span></p>
        </div>
        <div class="posts-date-time"><p>${postsDate}</p></div>
      </div>
      <div class="edit-button-container">
        <button class="edit-button" id="posts-edit-button" data-posts-id="${postsId}">수정</button>
        <button class="delete-button" id="posts-delete-button" data-posts-id="${postsId}">삭제</button>
      </div>
    </div>
  `;
}

function generatedPostsBody(posts) {
  const thumbnail = posts.thumbnail;
  const contents = posts.contents;
  const hitsCount = numberFormater(posts.hitsCount);
  const commentsCount = numberFormater(posts.commentsCount);

  return `
    <div class="posts-thumbnail">
      <div class="rectangle">
        <img src="${thumbnail}" alt="posts thumbnail">
      </div>
    </div>
    <div class="posts-content">${contents}</div>
    <div class="metadata-box-container">
      <div class="metadata-box">
        <span class="metadata-value">${hitsCount}</span>
        <span class="metadata-label">조회수</span>
      </div>
      <div class="metadata-box">
        <span class="metadata-value" id="comments-count">${commentsCount}</span>
        <span class="metadata-label">댓글</span>
      </div>
    </div>
  `;
}

function insertCommentList(comments) {
  comments.forEach(comment => {
    const element = document.createElement('div');
    element.classList.add('comments-info');

    element.innerHTML = generatedComment(comment);
    commentsListContainer.append(element);
  });
}

function generatedComment(comment) {
  const commentId = comment.commentsId;
  const contents = comment.contents;
  const commentsDate = comment.createdAt;
  const ownerNickname = comment.owner.nickname;
  const ownerProfile = comment.owner.profileImage;

  return `
    <div class="comments-owner-info">
      <img src="${ownerProfile}" class="circle-image">
      <p><span class="highlight">${ownerNickname}</span></p>
      <p><span class="date-time">${commentsDate}</span></p>
      <div class="comments-button-container">
        <button class="edit-button comments" data-comment-id="${commentId}">수정</button>
        <button class="delete-button comments" data-comment-id="${commentId}">삭제</button>
      </div>
    </div>
    <div class="comments-contents">${contents}</div>
  `;
}

// 댓글 작성
function checkEnableButton() {
  const contents = commentsContent.value;

  // 공백만 있거나 작성을 안한 경우
  if (contents.trim().length === 0) {
    commentsButton.disabled = true;
    commentsButton.style.backgroundColor = '#ACA0EB';
    return false;
  }
  commentsButton.disabled = false;
  commentsButton.style.backgroundColor = '#7F6AEE';
  return true;
}

// TODO: 댓글 수정 과 생성은 어떻게 구분할지 생각
// 댓글 등록 or 수정 버튼
async function commentsButtonClickEvent(event) {
  event.preventDefault();

  if (!checkEnableButton()) {
    console.log('댓글 미작성');
    return;
  }

  // TODO: 리팩토링 (로직 분리)
  const contents = commentsContent.value;

  if (commentsButton.textContent === '댓글 수정') {  // 이렇게 텍스트로 하는게 맞나..?
    // 댓글 수정
    console.log('댓글 수정하기 버튼 누름');

    await putFetch(`/api/v1/comments/${nowSelectCommentsId}`, { contents })
      .then(() => {
        updateComment(contents);
      }).catch((e) => {
        console.log(e);
      });
  } else {
    // 댓글 생성
    console.log('새로운 댓글 생성하기 버튼 누름');
    const postsId = getPostId();

    await postFetch('/api/v1/comments', { contents, postsId })
      .then((jsonData) => {
        createNewComments(jsonData);  // 댓글 목록의 최상단에 새 댓글을 밀어 넣음
      }).catch((e) => {
        console.log(e);
      });
  }

  // 완료 후 작성한 댓글(현재 입력한 text) 삭제 & "댓글 등록" 으로 변경 (수정할 경우 때문에 : 리팩토링)
  const commentsInputBox = document.querySelector('.comments-input-box');
  commentsInputBox.value = '';
  commentsButton.textContent = '댓글 등록';
  commentsButton.disabled = true;
  commentsButton.style.backgroundColor = '#ACA0EB';
}

// 댓글 목록에서 변경될 경우 (수정 버튼을 통해 변경될 경우)
function updateComment(contents) {
  // 현재 보여지는 댓글 목록에서 수정
  const element = document.querySelector(`[data-comment-id="${nowSelectCommentsId}"]`);
  const parentElement = element.parentNode.parentNode.parentNode;
  const beforeContents = parentElement.querySelector('.comments-contents');
  beforeContents.textContent = contents;
}

// 댓글 목록의 최상단에 새 댓글을 밀어 넣음
function createNewComments(data) {
  const element = document.createElement('div');
  element.classList.add('comments-info');

  element.innerHTML = generatedComment(data);
  commentsListContainer.prepend(element);

  // 게시글의 댓글 수 + 1
  const commentsCount = document.getElementById('comments-count');
  const nowPostsHasCommentsNum = parseInt(commentsCount.textContent);
  commentsCount.textContent = String(nowPostsHasCommentsNum + 1);

  // TODO: 이벤트 등록 리팩토링
  // 수정 이벤트 등록
  const editButton = document.getElementsByClassName('edit-button comments')[0];
  editButton.addEventListener('click', (event) => {
    editComment(event.target);
  });

  // 삭제 이벤트 등록
  const deleteButton = document.getElementsByClassName('delete-button comments')[0];
  deleteButton.addEventListener('click', (event) => {
    showModal('댓글을 삭제하시겠습니까?', '삭제한 내용은 복구할 수 없습니다.');
  });
}

// 댓글 수정 버튼 눌렀을 때
function editComment(element) {
  // 수정하기 버튼 선택시 댓글 id 정보를 저장
  nowSelectCommentsId = element.getAttribute('data-comment-id');
  console.log(`현재 선택한 댓글 id => ${nowSelectCommentsId}`);

  const parentElement = element.parentNode.parentNode.parentNode;
  const contentElement = parentElement.querySelector('.comments-contents');
  const content = contentElement.textContent;

  const commentsInputBox = document.querySelector('.comments-input-box');
  commentsInputBox.value = content;

  commentsButton.textContent = '댓글 수정';
}

// 게시글 이벤트 등록
function setPostsEvent() {
  const editButton = document.getElementById('posts-edit-button');
  const deleteButton = document.getElementById('posts-delete-button');

  editButton.addEventListener('click', (event) => {
    const element = event.target;
    const postsId = element.getAttribute('data-posts-id');
    location.href = `/posts/${postsId}/edit`;
  });

  deleteButton.addEventListener('click', () => {
    showModal('게시글을 삭제하시겠습니까?', '삭제한 내용은 복구할 수 없습니다.');
  });
}

// 댓글 이벤트 등록
function setCommentsEvent() {
  const editButtons = document.getElementsByClassName('edit-button comments');
  const deleteButtons = document.getElementsByClassName('delete-button comments');

  // 댓글 수정 이벤트
  for (const editButton of editButtons) {
    editButton.addEventListener('click', (event) => {
      editComment(event.target);
    });
  }

  // 댓글 삭제 이벤트
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener('click', () => {
      showModal('댓글을 삭제하시겠습니까?', '삭제한 내용은 복구할 수 없습니다.');
    });
  }
}

// 삭제 버튼 클릭 시 모달 열기
function showModal(title, warnMessage) {
  const modal = document.querySelector('.modal');
  const modalTitle = modal.querySelector('.modal-content-title');
  const modalMessage = modal.querySelector('.modal-content-warn');

  modalTitle.textContent = title;
  modalMessage.textContent = warnMessage;
  modal.style.display = 'block';
}

// 모달 닫기 버튼
function closeModalButtonClickEvent() {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
}

// 모달 확인 버튼
function okModalButtonClickEvent() {
  console.log('모달에서 확인 버튼 누름 이것도 변경해야함.');
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (event) => {
  const modal = document.querySelector('.modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// TODO: 중복될 코드 같다.
function numberFormater(num) {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1) + 'm';

  if (num >= 1_000)
    return (num / 1_000).toFixed(0) + 'k';

  return num.toString();
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

async function postFetch(url, data) {
  const baseUrl = 'http://localhost:8000';
  const requestUrl = baseUrl + url;

  return fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error();
  });
}
