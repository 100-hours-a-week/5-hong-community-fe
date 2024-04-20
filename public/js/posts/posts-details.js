import { fetchDummyPosts } from '../common/utils.js';

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

function getPostId() {
  const pathname = window.location.pathname;
  const StringTypePostId = pathname.split('/')[2];
  return parseInt(StringTypePostId, 10);
}

async function insertHTML() {
  const posts = await fetchDummyPosts();
  const findPost = posts.find((post) => post.post_id === getPostId());

  postsOwnerDetailContainer.innerHTML = generatedPostsOwnerDetail(findPost);
  postsBodyContainer.innerHTML = generatedPostsBody(findPost);
  insertCommentList(findPost.comments);
  setPostsEvent();
  setCommentsEvent();
}

function generatedPostsOwnerDetail(posts) {
  const postsId = posts.post_id;
  const title = posts.title;
  const ownerProfileImage = posts.post_image;
  const ownerNickname = posts.owner.nickname;
  const postsDate = posts.created_at;

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
  const thumbnail = posts.post_image;
  const contents = posts.contents;
  const hitsCount = numberFormater(posts.hits_count);
  const commentsCount = numberFormater(posts.comments_count);

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
        <span class="metadata-value">${commentsCount}</span>
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
  const commentId = comment.comments_id;
  const contents = comment.content;
  const commentsDate = comment.created_at;
  const ownerNickname = comment.owner.nickname;
  const ownerProfile = comment.owner.profile_image;

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

// TODO: 백엔드 구현시 변경해야함.
// 댓글 등록 or 수정 버튼
function commentsButtonClickEvent(event) {
  event.preventDefault();

  if (!checkEnableButton()) {
    console.log('댓글 미작성');
    return;
  }

  const contents = commentsContent.value;
  console.log(`백엔드 구현시 변경해야함.\n내용 : ${contents}`);
}

// 댓글 수정 버튼 눌렀을 때
function editComment(element) {
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
