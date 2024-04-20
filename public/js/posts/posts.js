import { fetchDummyPosts } from '../common/utils.js';

const postsListContainer = document.querySelector('.posts-list-container');
const createPostsButton = document.getElementById('create-posts-button');

window.addEventListener('scroll', infiniteScrollEvent);
window.addEventListener('load', insertHTML);
createPostsButton.addEventListener('click', createPostsButtonClickEvent);

let isAlreadyFetch = false;
let isEnd = false;
let scrollCount = 1;
let maxPerPosts = 5;

// 무한 스크롤
function infiniteScrollEvent() {
  console.log('스크롤 이벤트 발생');

  if (isAlreadyFetch) {
    console.log('이미 fetch request 전송함');
    return;
  }

  if (isEnd) {
    console.log('더이상 받을 데이터 없음. => 무한 스크롤 이벤트 제거');
    window.removeEventListener('scroll', infiniteScrollEvent);
    return;
  }

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight + 10) {
    setTimeout(() => {
      insertHTML();
    }, 500);
  }
}

async function insertHTML() {
  isAlreadyFetch = true;

  const response = await fetchDummyPosts();
  const posts = response.slice(maxPerPosts * (scrollCount - 1), maxPerPosts * scrollCount);

  isAlreadyFetch = false;

  if (posts.length === 0) {
    isEnd = true;
    return;
  }

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('posts-box');
    postElement.innerHTML = generated(post);
    postsListContainer.appendChild(postElement);
  });

  scrollCount++;
}

function generated(post) {
  const postsId = post.post_id;
  const title = titleFormater(post.title);
  const likeCount = numberFormater(post.like_count);
  const commentCount = numberFormater(post.comments_count);
  const hitsCount = numberFormater(post.hits_count);
  const createdDate = post.created_at;
  const postOwnerProfileImage = post.owner.profile_image;
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
