import { getFetch } from '../common/utils.js';

const postsListContainer = document.querySelector('.posts-list-container');
const createPostsButton = document.getElementById('create-posts-button');

window.addEventListener('load', insertHTML);
window.addEventListener('scroll', infiniteScrollEvent);
createPostsButton.addEventListener('click', createPostsButtonClickEvent);

// 게시글 목록 무한 스크롤
let nowRequestPage = 1;  // 요청을 보낼 페이지 번호 (1부터)

let isAlreadyFetch = false;
let isEndPage = false;

// 무한 스크롤
function infiniteScrollEvent() {
  console.log('스크롤 이벤트 발생');

  if (isAlreadyFetch) {
    console.log('이미 fetch request 전송함');
    return;
  }

  if (isEndPage) {
    console.log('더이상 받을 데이터 없음. => 무한 스크롤 이벤트 제거');
    window.removeEventListener('scroll', infiniteScrollEvent);
    return;
  }

  const scrollTop = document.documentElement.scrollTop;
  const innerHeight = window.innerHeight;
  const scrollHeight = document.body.scrollHeight;

  if (scrollTop + innerHeight >= scrollHeight) {
    showLoadingAnimation();

    isAlreadyFetch = true;
    setTimeout(() => {
      insertHTML()
        .then(() => {
          dropLoadingAnimation();
        });
    }, 500);
  }
}

function showLoadingAnimation() {
  console.log('로딩중 표시');
  const target = document.querySelector('.loading-wrap');
  target.style.display = 'flex';
}

function dropLoadingAnimation() {
  console.log('로딩중 삭제');
  const target = document.querySelector('.loading-wrap');
  target.style.display = 'none';
}

async function insertHTML() {
  const posts = await getFetch(`/api/v1/posts?page=${nowRequestPage}`)
    .then((jsonData) => {
      if (!jsonData.hasNext) {
        isEndPage = true;
      }
      nowRequestPage = jsonData.nextPage;
      return jsonData.data;
    }).catch((e) => {
      console.log(e);
    });
  console.log(posts);

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('posts-box');
    postElement.innerHTML = generated(post);
    postsListContainer.appendChild(postElement);
  });

  isAlreadyFetch = false;
}

function generated(post) {
  const postsId = post.postsId;
  const title = titleFormater(post.title);
  const likeCount = numberFormater(post.likesCount);
  const commentCount = numberFormater(post.commentsCount);
  const hitsCount = numberFormater(post.hitsCount);
  const createdDate = post.createdAt;
  const postOwnerProfileImage = post.owner.profileImage;
  const postOwnerNickname = post.owner.nickname;

  return `
    <a href="/posts/${postsId}">
      <div class="posts-container">
        <div class="posts-title">
          <h2>${title}</h2>
        </div>
        <div class="posts-details-container">
          <div class="posts-metadata">
            좋아요 <span class="posts-likes">${likeCount}</span>
            댓글 <span class="posts-comments">${commentCount}</span>
            조회수 <span class="posts-hits">${hitsCount}</span>
          </div>
          <div class="posts-datetime">${createdDate}</div>
        </div>
      </div>
      <hr class="horizontal-line">
      <div class="owner-container">
          <img src="${postOwnerProfileImage}" width="36">
          <h3><span class="owner-name">${postOwnerNickname}</span></h3>
      </div>
    </a>
   `;
}

function createPostsButtonClickEvent(event) {
  event.preventDefault();
  console.log('hello');

  location.href = '/posts-make';
}

// TODO: 중복될 코드 같다.
function titleFormater(text) {
  if (text.length > 26) {
    return text.substring(0, 26);
  }
  return text;
}

function numberFormater(num) {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1) + 'm';

  if (num >= 1_000)
    return (num / 1_000).toFixed(0) + 'k';

  return num.toString();
}
